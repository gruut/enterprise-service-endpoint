const _ = require('../plugins/partial')
const {
  Block,
  Transaction,
  Sequelize: {
    Op
  }
} = require('../models')

const queryLimit = (query) => {
  const qLimit = {}

  if (query.page && query.rows) {
    const page = parseInt(query.page)
    const rows = parseInt(query.rows)
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
    const escapedBlockId = query.blockId
    const rawBlockId = escapedBlockId.replace(/\s/gi, '+')

    Object.assign(condition, {blockId: rawBlockId})
  }

  if (query.keyword) {
    Object.assign(condition, {
      [Op.or]: [{
        height: query.keyword
      },
      {
        blockId: {
          [Op.like]: `${query.keyword}%`
        }
      }
      ]
    })
  }

  return condition
}

class BlockFetcher {
  static async fetch (query) {
    let blocks = null

    if (_.isEmpty(query)) {
      blocks = await Block.findAll()
    } else {
      const qLimit = queryLimit(query)

      const condition = getCondition(query)

      blocks = await Block.findAll({
        order: [
          ['time', 'DESC']
        ],
        ...qLimit,
        where: condition
      })
    }

    return blocks
  }

  static async fetchById (height) {
    const block = await Block.findOne(
      {
        where: {height},
        attributes: {exclude: ['createdAt', 'updatedAt']}
      })

    return block
  }

  static async addTxCountProperty (blocks) {
    return new Promise((resolve, reject) => {
      const blocksArr = _.map(blocks, async (block) => {
        const count = await Transaction.count({
          where: {
            'blockId': block.id
          }
        })

        return Object.assign({}, block.dataValues, { transactionCount: count })
      })

      resolve(blocksArr)
    })
  }
}

module.exports = BlockFetcher
