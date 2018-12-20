const {Router} = require('express')
const {Block, Signer, Transaction} = require('../../models')
const bodyParser = require('body-parser')
const debug = require('debug')('app:demo')
const router = Router()
const _ = require('../../plugins/partial')

const HEADER_LENGTH = 32

/* GET Blocks listing. */
router.get('/blocks', async (req, res) => {
  try {
    const blocks = await Block.findAll({
      order: [
        ['time', 'DESC']
      ]
    })

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
    const block = await Block.findOne({where: {id}})
    if (block) res.json(block)

    res.sendStatus(404)
  } catch (err) {
    res.sendStatus(500)
    throw err
  }
})

/* POST handle MSG_HEADER */
router.post('/blocks', bodyParser.urlencoded({ extended: false }), (req, res) => {
  try {
    _.go(req.body['message'],
      (message) => {
        // TODO: header 검증
        const body = message.substr(HEADER_LENGTH)
        return JSON.parse(body)
      },
      async (jsonObj) => {
        const blockRawJson = jsonObj.blockraw
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

        _.each(blockRawJson.SSig, async (signer) => {
          const s = Signer.build({
            signerId: signer.sID,
            signerSignature: signer.sig,
            blockId: block.id
          })

          await s.save()
        })

        _.each(blockRawJson.txids, async (txId) => {
          const t = Transaction.build({
            transactionId: txId,
            blockId: block.id
          })

          await t.save()
        })
      }
    )
    res.sendStatus(200)
  } catch (err) {
    res.sendStatus(500)
    throw err
  }
})

module.exports = router
