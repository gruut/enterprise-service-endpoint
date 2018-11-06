const express = require('express')

// Create express instnace
const app = express()

// Require API routes
const blocks = require('./routes/blocks')

// Import API Routes
app.use(blocks)

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app
}
