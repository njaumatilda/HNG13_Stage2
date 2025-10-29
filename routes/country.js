import { Router } from "express"
import {
  readAllCountries,
  readCountryImage,
  readCountryByName,
  readCountryStatusAndRefreshTimestamp,
  cacheCountryAndCurrencyData,
  deleteCountryByName,
} from "../controllers/country.js"

const router = Router()

router.get("/countries", readAllCountries)

router.get("/countries/image", readCountryImage)

router.get("/countries/:name", readCountryByName)

router.get("/status", readCountryStatusAndRefreshTimestamp)

router.post("/countries/refresh", cacheCountryAndCurrencyData)

router.delete("/countries/:name", deleteCountryByName)

export default router
