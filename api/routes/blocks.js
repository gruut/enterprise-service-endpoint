const {Router} = require('express')
const {Block} = require('../../models')
const bodyParser = require('body-parser')
const debug = require('debug')('app:demo')
const router = Router()

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
router.post('/blocks', bodyParser.json(), (req, res) => {
  try {
    // TODO: save block
    debug(req.body)
    res.sendStatus(200)
  } catch (err) {
    res.sendStatus(500)
    throw err
  }
})

module.exports = router
