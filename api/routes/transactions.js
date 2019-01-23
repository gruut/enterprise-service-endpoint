const {Router} = require('express')
const crypto = require('crypto')
const bodyParser = require('body-parser')
const {Block, RequestData, Transaction, Signer} = require('../../models')
const TxGenerator = require('../../services/tx_generator')
const router = Router()
const debug = require('debug')('app:demo')
const _ = require('partial-js')

router.get('/transactions', async (req, res) => {
  try {
    let transactions = null
    if (_.isEmpty(req.query)) {
      transactions = await Transaction.findAll({
        order: [
          ['createdAt', 'DESC']
        ]
      })
    } else {
      const { transactionId } = req.query
      const transaction = await Transaction.findOne({
        where: {
          transactionId
        }
      })

      if (transaction) {
        transactions = [transaction]
      }
    }

    res.json(transactions)
  } catch (e) {
    res.sendStatus(500)
    throw e
  }
})

/* GET Transaction by ID. */
router.get('/transactions/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const transaction = await Transaction.findByPk(id)
    const requestData = await RequestData.findOne({where: {
      transactionId: transaction.transactionId
    }})
    const block = await Block.findByPk(transaction.blockId, {
      include: [Signer]
    })

    if (transaction) {
      res.json({
        transaction,
        requestData,
        block
      })
    } else {
      res.sendStatus(404)
    }
  } catch (e) {
    res.sendStatus(500)
    throw e
  }
})

/* POST create a transaction */
router.post('/transactions', bodyParser.urlencoded({extended: false}), async (req, res) => {
  try {
    const content = req.body.message
    let requestData = RequestData.build({
      requesterId: req.body.requesterId,
      data: content,
      signed: false
    })
    await requestData.save()

    const dataObj = {
      'rID': requestData.requesterId.toString(),
      'data_id': requestData.id.toString(),
      'digest': crypto.createHash('sha256').update(content).digest('base64')
    }

    const txGenerator = new TxGenerator()
    const sentResult = await txGenerator.sendTransaction(dataObj)
    if (sentResult) {
      requestData.transactionId = txGenerator.transactionId
      await requestData.save()

      res.json({
        transactionId: requestData.transactionId
      })
    } else {
      res.sendStatus(500)
    }
  } catch (err) {
    // TODO: log
    debug(err)
    res.sendStatus(500)
    throw err
  }
})

module.exports = router
