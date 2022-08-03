const fs = require('fs')
const { config } = require('../config/config')
const { Prices } = require('../services/price.service')

class CoinBase {
  /**
   * Method for load spot prices between a range dates
   * @param {string} currency example BTC
   * @param {string} startDate format YYYY-MM-DD
   * @param {string} endDate format YYYY-MM-DD
   * @returns spot prices between a range dates
   */
  async getPricesBetween(currency, days) {
    try {
      const priceByDate = []
      for (let i = 0; i < days; i++) {
        const today = new Date()
        const date = new Date(today.getTime())
        date.setDate(today.getDate() - i)
        const formatDate = date.toISOString().split('T')[0]
        const result = await Prices.getSpotPrices(`${currency}-USD`, formatDate)
        const item = {
          base: result.data.data.base,
          currency1: result.data.data,
          currency2: null,
          currency3: null,
          date: formatDate
        }
        priceByDate.push(item)
      }
      return priceByDate
    } catch (error) {
      console.log(error)
      return error.message
    }
  }

  async updateCurrencyEUR(date) {
    const data = JSON.parse(fs.readFileSync(config.db, { encoding: 'utf-8' }))
    const index = data.findIndex(el => el.date === date)
    // console.log('EUR data', data[index])
    try {
      const result = await Prices.getSpotPrices(`${data[index].base}-EUR`, data[index].date)
      data[index].currency2 = result.data.data
    } catch (error) {
      console.log('Error update EUR:', error)
    }
    // console.log('EUR', data[index])
    fs.writeFileSync(config.db, JSON.stringify(data))
    return data[index].currency2
  }

  async updateCurrencyCOP(date) {
    const data = JSON.parse(fs.readFileSync(config.db, { encoding: 'utf-8' }))
    const index = data.findIndex(el => el.date === date)
    // console.log('COP data', data[index])
    try {
      const result = await Prices.getSpotPrices(`${data[index].base}-COP`, data[index].date)
      data[index].currency3 = result.data.data
    } catch (error) {
      console.log('Error update EUR:', error)
    }
    // console.log('COP', data[index])
    fs.writeFileSync(config.db, JSON.stringify(data))
    return data[index].currency3
  }

  validCurrentDate() {
    let flag = false
    if (fs.existsSync(config.db)) {
      const data = JSON.parse(fs.readFileSync(config.db, { encoding: 'utf-8' }))
      const lastFileDate = new Date(data[0].date)
      const currentDate = new Date()
      const days = (currentDate.getTime() - lastFileDate.getTime()) / (1000 * 60 * 60 * 24)
      if (days > 0) {
        this.saveData()
      }
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
    const spotPrices = await this.getPricesBetween('BTC', 15)
    // this.updateCurrencyEUR()
    // this.updateCurrencyCOP()
    if (typeof spotPrices !== 'string') {
      fs.writeFileSync(config.db, JSON.stringify(spotPrices))
    }
  }

  async updateFirstCurrency(data) {
    try {
      let firstData = data[0]
      const currencyPair = `${firstData.currency1.base}-${firstData.currency1.currency}`
      const today = new Date()
      const formatDate = today.toISOString().split('T')[0]
      const result = await Prices.getSpotPrices(currencyPair, formatDate)
      firstData = {
        ...result.data.data,
        date: formatDate
      }
    } catch (error) {
      console.log('Error update:', error)
    }
  }
}

exports.coinBase = new CoinBase()
