const {Router} = require('express')
const {Block} = require('../../models')
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

module.exports = router
