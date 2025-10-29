import { Sequelize } from "sequelize"

const DB_URL = process.env.DB_URL

const sequelize = new Sequelize(DB_URL)

const dbConnect = async () => {
  try {
    await sequelize.authenticate()
    // await sequelize.sync()
    console.log(`[database]: Connection established successfully`)
  } catch (error) {
    console.log(`[db-error]: ${error}`)
  }
}

export { dbConnect, sequelize }
