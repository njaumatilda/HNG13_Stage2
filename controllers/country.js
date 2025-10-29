import countryModel from "../models/Country.js"

const readAllCountries = async (req, res) => {
  try {
    const { region, currency, sort } = req.query

    // Build filter(the condition mysql must satisfy)
    const filter = {}
    if (region) {
      filter["region"] = region
    }

    if (currency) {
      filter["currency_code"] = currency
    }

    // sort descending -> latest to oldest/highest to lowest
    // sort ascending-> oldest to latest/lowest to highest
    let sortArray = []
    if (sort === "gdp_desc") {
      sortArray.push(["estimated_gdp", "DESC"])
    } else if (sort === "gdp_asc") {
      sortArray.push(["estimated_gdp", "ASC"])
    }

    const findCountries = await countryModel.findAll({
      where: filter,
      order: sortArray,
    })

    res.status(200).json(findCountries)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: " Internal Server Error",
    })
  }
}

const readCountryImage = async (req, res) => {
  try {
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: " Internal Server Error",
    })
  }
}

const readCountryByName = async (req, res) => {
  try {
    const { name } = req.params

    if (!name || name.trim() === "") {
      return res.status(400).json({
        error: "Validation failed",
      })
    }

    const findCountry = await countryModel.findOne({ where: { name } })
    if (!findCountry) {
      return res.status(404).json({
        error: "Country not found",
      })
    }

    res.status(200).json(findCountry)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: " Internal Server Error",
    })
  }
}

const readCountryStatusAndRefreshTimestamp = async (req, res) => {
  try {
    const totalCountries = await countryModel.count()
    const sort = await countryModel.findOne({
      order: [["last_refreshed_at", "DESC"]],
      attributes: ["last_refreshed_at"], // specify which column(s) I want selected
    })

    res.status(200).json({
      total_countries: totalCountries,
      last_refreshed_at: sort.last_refreshed_at,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: " Internal Server Error",
    })
  }
}

const cacheCountryAndCurrencyData = async (req, res) => {
  try {
    const countryResObject = await fetch(
      "https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies"
    )
    console.log(countryResObject)

    if (!countryResObject.ok) {
      return res.status(503).json({
        error: "External data source unavailable",
        details: "Could not fetch data from country data API",
      })
    }

    const countryData = await countryResObject.json()

    const exRateResObject = await fetch("https://open.er-api.com/v6/latest/USD")
    console.log(exRateResObject)

    if (!exRateResObject.ok) {
      return res.status(503).json({
        error: "External data source unavailable",
        details: "Could not fetch data from exchange rate API",
      })
    }

    const exRateData = await exRateResObject.json()

    const countryDetails = countryData.map((country) => {
      const name = country.name
      const capital = country.capital || null
      const region = country.region || null
      const population = country.population || 0
      const flag_url = country.flag || null
      let currency_code
      let exchange_rate
      let estimated_gdp = null

      // Handle currencies carefully in countries API
      const currencies = country.currencies || []
      if (currencies.length > 0) {
        currency_code = currencies[0].code
        exchange_rate = exRateData.rates[currency_code] ?? null
      } else {
        currency_code = null
        exchange_rate = null
        estimated_gdp = 0
      }

      // If no currency_code, in exchange rate API
      if (exchange_rate === null || isNaN(exchange_rate)) {
        exchange_rate = null
        estimated_gdp = null
      } else {
        const random = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000
        estimated_gdp = (population * random) / exchange_rate
      }

      return {
        name,
        capital,
        region,
        population,
        currency_code,
        exchange_rate,
        estimated_gdp,
        flag_url,
        last_refreshed_at: new Date().toISOString().split(".")[0] + "Z",
      }
    })

    await countryModel.bulkCreate(countryDetails, {
      updateOnDuplicate: [
        "capital",
        "region",
        "population",
        "currency_code",
        "exchange_rate",
        "estimated_gdp",
        "flag_url",
        "last_refreshed_at",
      ],
    })

    res.status(201).json({
      message: "Countries cached successfully",
      count: countryDetails.length,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: " Internal Server Error",
    })
  }
}

const deleteCountryByName = async (req, res) => {
  try {
    const { name } = req.params

    if (!name || name.trim() === "") {
      return res.status(400).json({
        error: "Validation failed",
      })
    }

    const findCountry = await countryModel.destroy({ where: { name } })
    if (findCountry === 0) {
      return res.status(404).json({
        error: "Country not found",
      })
    }

    res.status(200).json({
      message: `${name} deleted successfully`,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: " Internal Server Error",
    })
  }
}

export {
  readAllCountries,
  readCountryImage,
  readCountryByName,
  readCountryStatusAndRefreshTimestamp,
  cacheCountryAndCurrencyData,
  deleteCountryByName,
}
