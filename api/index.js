const Cert = require('../utils/cert')
const express = require('express')
const bodyParser = require('body-parser')
const CronJob = require('../schedules/index')

// set global variable
try {
  if (process.env.NODE_ENV === 'production') {
    Cert.generateKeyPair()
  }
} catch (e) {
  process.exit(1)
}

// Create express instance
const app = express()
const maxResponseSize = 1024 * 1024 * 10
var jsonParser = bodyParser.json({
  limit: maxResponseSize,
  type: 'application/json'
})
var urlencodedParser = bodyParser.urlencoded({
  extended: true,
  limit: maxResponseSize,
  type: 'application/x-www-form-urlencoded',
  parameterLimit: 10000
})

app.use(jsonParser)
app.use(urlencodedParser)

// Require API routes
const blocks = require('./routes/blocks')
const transactions = require('./routes/transactions')
const action = require('./routes/action')

// Import API Routes
app.use(blocks)
app.use(transactions)
app.use(action)

// Crontab
CronJob.start()

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app
}
