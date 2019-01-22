const {
  Router
} = require('express')
const bodyParser = require('body-parser')
const router = Router()

/* POST MSG_PING. */
router.post('/ping', bodyParser.urlencoded({
  extended: false
}), (req, res) => {
  try {
    // Do something
    console.log('req :', req)
    res.sendStatus(200)
  } catch (error) {
    res.sendStatus(500)
    throw error
  }
})

module.exports = router
