const {Router} = require('express')
const uuidv4 = require('uuid/v4')
const crypto = require('crypto')
const multer = require('multer')
// 25MB
const upload = multer({
  limits: { fieldSize: 25 * 1024 * 1024 }
})
const {RequestData} = require('../../models')
const TxGenerator = require('../../services/tx_generator')
const router = Router()
const debug = require('debug')('app:demo')

/* POST create a transaction */
router.post('/transactions', upload.any(), async (req, res) => {
  try {
    const content = req.body.file
    let requestData = RequestData.build({
      requester_id: uuidv4(),
      data: content,
      signed: false
    })
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
