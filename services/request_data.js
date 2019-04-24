const _ = require('../plugins/partial')
const {
  RequestData
} = require('../models')

class RequestDataFetcher {
  static async fetch (query) {
    const data = await RequestData.findAll({
      where: {
        transactionId: _.pluck(query.transactions, 'transactionId')
      }
    })

    return data
  }
}

module.exports = RequestDataFetcher
