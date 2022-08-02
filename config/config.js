require('dotenv').config()

exports.config = {
  url: process.env.URL_COINBASE,
  db: process.env.DB_URL
}