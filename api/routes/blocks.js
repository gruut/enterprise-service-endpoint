const {Router} = require('express')
const {Block, Signer, Transaction} = require('../../models')
const bodyParser = require('body-parser')
const debug = require('debug')('app:demo')
const router = Router()
const _ = require('../../plugins/partial')

/* GET Blocks listing. */
router.get('/blocks', async (req, res) => {
  try {
    let blocks = null
    if (_.isEmpty(req.query)) {
      blocks = await Block.findAll({
        order: [
          ['time', 'DESC']
        ]
      })
    } else {
      const { height } = req.query
      const block = await Block.findOne({
        height
      })

      if (block) {
        blocks = [block]
      }
    }

    res.json(blocks)
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
      const signers = await Signer.findAll({where: {blockId: block.id}})

      res.json({
        block,
        transactions,
        signers
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
router.post('/blocks', bodyParser.urlencoded({extended: false}), (req, res) => {
  try {
    _.go(req.body['message'],
      (message) => {
        // TODO: header 검증
        // return JSON.parse(message)
        return req.body
      },
      async (jsonObj) => {
        const blockRawJson = jsonObj
        // const blockRawJson = jsonObj.blockraw

        // TODO: mergerSig는 temp값(루이지 테스트)
        const block = Block.build({
          version: blockRawJson.ver,
          blockId: blockRawJson.bID,
          time: new Date(parseInt(`${blockRawJson.time}000`)),
          height: blockRawJson.hgt,
          txRoot: blockRawJson.txrt,
          mergerId: blockRawJson.mID,
          mergerSignature: '1'
        })
        await block.save()

        let signers = []
        _.each(blockRawJson.SSig, async (signer) => {
          signers.push({
            signerId: signer.sID,
            signerSignature: signer.sig,
            blockId: block.id
          })
        })
        await Signer.bulkCreate(signers, {individualHooks: true})

        let transactions = []
        _.each(blockRawJson.txids, async (txId) => {
          transactions.push({
            transactionId: txId,
            blockId: block.id
          })
        })
        await Transaction.bulkCreate(transactions, {individualHooks: true})
      }
    )
    res.sendStatus(200)
  } catch (err) {
    res.sendStatus(500)
    throw err
  }
})

module.exports = router
