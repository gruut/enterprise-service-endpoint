const _ = require('../plugins/partial')
const {
  Transaction
} = require('../models')

class TransactionFetcher {
  static async fetch (query) {
    const transactions = await Transaction.findAll({
      where: { blockId: query.blockId },
      limit: query.limit,
      offset: query.offset
    })

    return transactions
  }

  static async count (query) {
    let txCount = null

    if (query.blockId) {
      txCount = await Transaction.count({
        where: {blockId: query.blockId}
      })
    } else {
      txCount = await Transaction.count()
    }

    return txCount
  }
}

module.exports = TransactionFetcher
