const {Router} = require('express')
const crypto = require('crypto')
const bodyParser = require('body-parser')
const {RequestData} = require('../../models')
const TxGenerator = require('../../services/tx_generator')
const router = Router()
const debug = require('debug')('app:demo')

/* POST create a transaction */
router.post('/transactions', bodyParser.urlencoded({extended: false}), async (req, res) => {
  try {
    console.log(req)
    const content = req.body.message
    let requestData = RequestData.build({
      requester_id: process.env.MY_ID,
      data: content,
      signed: false
    })
    // TODO: 요청이 성공했을때만 저장하도록 수정
    await requestData.save()

    const dataObj = {
      'rID': requestData.requester_id.toString(),
      'data_id': requestData.id.toString(),
      'digest': crypto.createHash('sha256').update(content).digest('base64')
    }

    const txGenerator = new TxGenerator()
    if (txGenerator.sendTransaction(dataObj)) {
      res.sendStatus(200)
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
