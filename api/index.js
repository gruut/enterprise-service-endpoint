const express = require('express')

// Create express instance
const app = express()

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
