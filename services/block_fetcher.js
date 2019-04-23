const _ = require('../plugins/partial')
const {
  Block,
  Transaction
} = require('../models')

const getCondition = async (query) => {
  const condition = {}

  if (query.page && query.rows) {
    const page = parseInt(query.page)
    const rows = parseInt(query.rows)
    const offset = (page - 1) * rows

    Object.assign(condition, {
      order: [
        ['time', 'DESC']
      ],
      limit: rows,
      offset
    })
  }

  if (query.blockId) {
    const escapedBlockId = query.blockId
    const rawBlockId = escapedBlockId.replace(/\s/, '+')

    Object.assign(condition, {blockId: rawBlockId})
  }

  return condition
}

class BlockFetcher {
  static async fetch (query) {
    let blocks = null

    if (_.isEmpty(query)) {
      blocks = await Block.findAll()
    } else {
      const condition = await getCondition(query)
      if (_.isEmpty(condition)) {
        return []
      }

      blocks = await Block.findAll(condition)
    }

    return blocks
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
