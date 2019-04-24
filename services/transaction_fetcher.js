const {
  Transaction,
  Sequelize: {
    Op
  }
} = require('../models')

const DEFAULT_TRANSACTION_PAGE = 1
const DEFAULT_TRANSACTION_ROWS = 5
const queryLimit = (query) => {
  const qLimit = {}

  if (query.page && query.rows) {
    const page = parseInt(query.page) || DEFAULT_TRANSACTION_PAGE
    const rows = parseInt(query.rows) || DEFAULT_TRANSACTION_ROWS
    const offset = (page - 1) * rows

    Object.assign(qLimit, {
      limit: rows,
      offset
    })
  }

  return qLimit
}

const getCondition = (query) => {
  const condition = {}

  if (query.blockId) {
    Object.assign(condition, {blockId: query.blockId})
  }

  if (query.transactionId) {
    const escapedTransactionId = query.transactionId
    const rawTxId = escapedTransactionId.replace(/\s/gi, '+')

    Object.assign(condition, {transactionId: {
      [Op.like]: `${rawTxId}%`
    }})
  }

  return condition
}

class TransactionFetcher {
  static async fetch (query = {}) {
    const condition = getCondition(query)
    const qLimit = queryLimit(query)

    console.log(qLimit)
    const transactions = await Transaction.findAll({
      where: condition,
      order: [
        ['createdAt', 'DESC']
      ],
      ...qLimit
    })

    return transactions
  }

  static async fetchById (idStr) {
    const id = parseInt(idStr)
    const transaction = await Transaction.findByPk(id)

    return transaction
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
