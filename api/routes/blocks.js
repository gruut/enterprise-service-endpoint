const {Router} = require('express')
const {Block, Signer, Transaction, RequestData} = require('../../models')
const bodyParser = require('body-parser')
const router = Router()
const _ = require('../../plugins/partial')

function addTxCountProperty (blocks) {
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

/* GET Blocks listing. */
const DEFAULT_PAGE = 1
const DEFAULT_ROWS = 5
router.get('/blocks', async (req, res) => {
  try {
    let blocks = null
    let totalBlocksCount = 0
    if (_.isEmpty(req.query.height)) {
      const page = parseInt(req.query.page) || DEFAULT_PAGE
      const rows = parseInt(req.query.rows) || DEFAULT_ROWS
      const offset = (page - 1) * rows

      totalBlocksCount = await Block.count()
      blocks = await Block.findAll({
        order: [
          ['time', 'DESC']
        ],
        limit: rows,
        offset
      })
      blocks = await addTxCountProperty(blocks)
    } else {
      const { height } = req.query
      const block = await Block.findOne({
        where: {height},
        include: [Transaction]
      })

      if (block) {
        blocks = [block]
      }
    }
    res.json({
      blocks,
      totalBlocksCount
    })
  } catch (err) {
    res.sendStatus(500)
    throw err
  }
})

/* GET Block by ID. */
router.get('/blocks/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const block = await Block.findOne(
      {
        where: {id},
        attributes: {exclude: ['createdAt', 'updatedAt']}
      })

    if (block) {
      const transactions = await Transaction.findAll({where: {blockId: block.id}})
      let txIds = _.pluck(transactions, 'transactionId')
      if (req.params.tx_id) {
        txIds = _.filter(txIds, (txId) => txId === req.params.tx_id)
      }

      const requestData = await RequestData.findAll({where: {transactionId: txIds}})
      const signers = await Signer.findAll({where: {blockId: block.id}})

      res.json({
        block,
        transactions,
        signers,
        requestData
      })
    } else {
      res.sendStatus(400)
    }
  } catch (err) {
    res.sendStatus(500)
    throw err
  }
})

/* POST handle MSG_HEADER */
router.post('/blocks', bodyParser.urlencoded({extended: false}), async (req, res) => {
  try {
    let result = false
    result = await _.go(req.body['message'],
      (message) => {
        return JSON.parse(message).blockraw
      },
      async (jsonObj) => {
        const blockRawJson = jsonObj

        const block = Block.build({
          version: blockRawJson.ver,
          blockId: blockRawJson.bID,
          time: new Date(parseInt(`${blockRawJson.time}000`)),
          height: blockRawJson.hgt,
          txRoot: blockRawJson.txrt,
          mergerId: blockRawJson.mID,
          chainId: blockRawJson.cID,
          prevBlockHash: blockRawJson.prevH,
          prevBlockId: blockRawJson.prevbID
        })
        await block.save()

        let signers = []

        _.each(blockRawJson.SSig, (signer) => {
          signers.push({
            signerId: signer.sID,
            signerSignature: signer.sig,
            blockId: block.id
          })
        })
        await Signer.bulkCreate(signers)

        let transactions = []
        _.each(blockRawJson.txids, (txId) => {
          transactions.push({
            transactionId: txId,
            blockId: block.id
          })
        })
        await Transaction.bulkCreate(transactions)

        return true
      }
    )

    if (result === true) { res.sendStatus(200) } else {
      res.sendStatus(400)
    }
  } catch (err) {
    res.sendStatus(500)
    throw err
  }
})

module.exports = router
