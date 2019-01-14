const Cert = require('../utils/cert')
const express = require('express')
const bodyParser = require('body-parser')
// set global variable
try {
  Cert.generateKeyPair()
} catch (e) {
  process.exit(1)
}

// Create express instance
const app = express()
var jsonParser = bodyParser.json({limit: 1024 * 1024 * 10, type: 'application/json'})
var urlencodedParser = bodyParser.urlencoded({
  extended: true,
  limit: 1024 * 1024 * 10,
  type: 'application/x-www-form-urlencoded',
  parameterLimit: 10000
})

app.use(jsonParser)
app.use(urlencodedParser)

// Require API routes
const blocks = require('./routes/blocks')
const transactions = require('./routes/transactions')

// Import API Routes
app.use(blocks)
app.use(transactions)

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app
}
