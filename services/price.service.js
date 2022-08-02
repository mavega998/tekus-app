const axios = require('axios')
const { config } = require('../config/config')

class Prices {
  constructor() {
    this.instance = axios.create({
      baseURL: config.url,
      timeout: 1000,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  /**
   * Method for load spot currency pair price for a date.
   * @param {string} currencyPair example BTC-USD, BTC-COP, another
   * @param {string} date format YYYY-MM-DD
   * @return spot prices according date and currency pair
   */
  getSpotPrices(currencyPair, date) {
    const path = `/prices/${currencyPair}/spot?date=${date}`
    return this.instance.get(path)
  }

  /**
   * Method for load get currency pair price for a date.
   * @param {string} currencyPair example BTC-USD, BTC-COP, another
   * @return buy prices according currency pair
   */
  getBuyPrices(currencyPair) {
    const path = `/prices/${currencyPair}/buy`
    return this.instance.get(path)
  }

  /**
   * Method for load currency pair price for a date.
   * @param {string} currencyPair example BTC-USD, BTC-COP, another
   * @return sell prices according currency pair
   */
  getSellPrices(currencyPair) {
    const path = `/prices/${currencyPair}/sell`
    return this.instance.get(path)
  }
}

exports.Prices = new Prices()
