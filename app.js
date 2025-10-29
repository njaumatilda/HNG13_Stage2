import "dotenv/config"
import express from "express"
import cors from "cors"

import { dbConnect } from "./db.js"

import currencyRoutes from "./routes/country.js"

const app = express()
const PORT = process.env.PORT

app.use(cors())
app.use(express.json())

app.use("/", currencyRoutes)

app.listen(PORT, () => {
  console.log(`[server]: App listening on port: ${PORT}`)
  dbConnect()
})
