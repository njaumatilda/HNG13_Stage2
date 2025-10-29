import { DataTypes } from "sequelize"
import { sequelize } from "../db.js"

const countrySchema = sequelize.define(
  "country",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false, //field is required
      unique: true,
    },
    capital: DataTypes.STRING,

    region: DataTypes.STRING,
    population: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currency_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    exchange_rate: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    estimated_gdp: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    flag_url: DataTypes.STRING,
    last_refreshed_at: DataTypes.STRING,
  },
  { timestamps: false }
)

await countrySchema.sync()
export default countrySchema
