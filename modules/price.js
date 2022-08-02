const fs = require('fs')
const { config } = require('../config/config')
const { Prices } = require('../services/price.service')

class CoinBase {
  /**
   * Method for load spot prices between a range dates
   * @param {string} currencyPair example BTC-USD, BTC-COP, another
   * @param {string} startDate format YYYY-MM-DD
   * @param {string} endDate format YYYY-MM-DD
   * @returns spot prices between a range dates
   */
  async getPricesBetween(currencyPair, days) {
    try {
      const priceByDate = []
      for (let i = 0; i < days; i++) {
        const today = new Date()
        const date = new Date(today.getTime())
        date.setDate(today.getDate() - i)
        const formatDate = date.toISOString().split('T')[0]
        const result = await Prices.getSpotPrices(currencyPair, formatDate)
        const item = {
          ...result.data.data,
          date: formatDate
        }
        priceByDate.push(item)
      }
      return priceByDate
    } catch (error) {
      return error.message
    }
  }

  validCurrentDate() {
    let flag = false
    if (fs.existsSync(config.db)) {
      flag = true
    } else {
      this.saveData()
      flag = false
    }
    setInterval(() => {
      const data = fs.readFileSync(config.db, { encoding: 'utf-8' })
      this.updateFirstCurrency(JSON.parse(data))
    }, 59000)
    return flag
  }

  async saveData() {
    const spotPrices = await this.getPricesBetween('BTC-USD', 15)
    if (typeof spotPrices !== 'string') {
      fs.writeFileSync(config.db, JSON.stringify(spotPrices))
    }
  }

  async updateFirstCurrency(data) {
    let firstData = data[0]
    const currencyPair = `${firstData.base}-${firstData.currency}`
    const today = new Date()
    const formatDate = today.toISOString().split('T')[0]
    const result = await Prices.getSpotPrices(currencyPair, formatDate)
    firstData = {
      ...result.data.data,
      date: formatDate
    }
  }
}

exports.coinBase = new CoinBase()
