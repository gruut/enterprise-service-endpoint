const {Router} = require('express')
const {
  Block
} = require('../../models')
const bodyParser = require('body-parser')
const Url = require('url')
const router = Router()
const _ = require('../../plugins/partial')
const BlockFetcher = require('../../services/block_fetcher')
const TransactionFetcher = require('../../services/transaction_fetcher')
const RequestDataFetcher = require('../../services/request_data')
const SignerFetcher = require('../../services/signer_fetcher')
const BlockMsgHandler = require('../../services/block_msg_handler')

const parseUrl = (req, res, next) => {
  req.url = Url.parse(req.url, true)
  next()
}

const parseBlockMsg = (req, res, next) => {
  req.blockMsg = JSON.parse(req.body['message']).blockraw
  next()
}

const permittedQueries = ['blockId', 'keyword', 'page', 'rows']
const validateWrongQuery = (req, res, next) => {
  const filteredQuery = _.omit(req.query, permittedQueries)
  if (!_.isEmpty(filteredQuery)) {
    res.sendStatus(404)
  } else {
    next()
  }
}

/* GET Blocks listing. */
router.get('/blocks', validateWrongQuery, parseUrl, async (req, res) => {
  try {
    const totalBlocksCount = await Block.count()

    let blocks = await BlockFetcher.fetch(req.query)
    blocks = await BlockFetcher.addTxCountProperty(blocks)

    if (_.isEmpty(blocks)) {
      res.sendStatus(404)
      return
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

router.get('/blocks/search', async (req, res) => {
  try {
    const searchedBlocks = await BlockFetcher.fetch(req.query)

    if (searchedBlocks.length > 0) {
      res.json({
        blocks: searchedBlocks
      })
    } else {
      res.sendStatus(404)
    }
  } catch (error) {
    res.sendStatus(500)
    throw error
  }
})

/* GET Block by ID (Height). */
router.get('/blocks/:id', async (req, res) => {
  try {
    const height = parseInt(req.params.id)
    const block = await BlockFetcher.fetchById(height)

    if (block) {
      const transactions = await TransactionFetcher.fetch({blockId: block.id, page: req.query.tx_page, rows: req.query.tx_rows})

      const allTransactions = await TransactionFetcher.fetch({blockId: block.id})
      const transactionsCount = allTransactions.length

      const requestData = await RequestDataFetcher.fetch({transactions})

      const signers = await SignerFetcher.fetch({blockId: block.id})

      res.json({
        block,
        transactions,
        signers,
        requestData,
        transactionsCount
      })
    } else {
      res.sendStatus(404)
    }
  } catch (err) {
    res.sendStatus(500)
    throw err
  }
})

// TODO: API Server
/* POST handle MSG_HEADER */
router.post('/blocks', bodyParser.urlencoded({extended: false}), parseBlockMsg, async (req, res) => {
  try {
    const result = await BlockMsgHandler.handleMessage(req.blockMsg)

    if (result === true) { res.sendStatus(200) } else {
      res.sendStatus(400)
    }
  } catch (err) {
    res.sendStatus(500)
    throw err
  }
})

module.exports = router
