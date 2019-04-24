const {Router} = require('express')
const crypto = require('crypto')
const bodyParser = require('body-parser')
const Url = require('url')
const {
  Block,
  RequestData,
  Signer
} = require('../../models')
const TxGenerator = require('../../services/tx_generator')
const router = Router()
const _ = require('partial-js')
const TransactionFetcher = require('../../services/transaction_fetcher')

const parseUrl = (req, res, next) => {
  req.url = Url.parse(req.url, true)
  next()
}

router.get('/transactions', parseUrl, async (req, res) => {
  try {
    let transactions = null

    if (_.isEmpty(req.query)) {
      transactions = await TransactionFetcher.fetch()
    } else {
      transactions = await TransactionFetcher.fetch(req.query)
    }

    if (_.isEmpty(transactions)) {
      res.sendStatus(404)
      return
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
    const transaction = await TransactionFetcher.fetchById(req.params.id)

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

// TODO: API
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
      throw new Error('TxGenerator failed to generate a transaction')
    }
  } catch (err) {
    res.sendStatus(500)
    throw err
  }
})

module.exports = router
