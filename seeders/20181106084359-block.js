const crypto = require('crypto')
const clone = require('clone')

const hmac = crypto.createHmac('sha256', String(Math.random() * 100))
let hex = hmac.digest('hex')
const blockArr = []

let template = {
  version: 1,
  blockId: hex,
  time: new Date(),
  size: 256,
  height: 1,
  txRoot: hex,
  signerId: hex,
  signerSignature: hex,
  mergerId: hex,
  mergerSignature: hex,
  createdAt: new Date(),
  updatedAt: new Date()
}

for (let i = 0; i < 12; i++) {
  if (i === 0) {
    blockArr.push(template)
  } else {
    let tmp = crypto.createHmac('sha256', String(Math.random() * 100))
    hex = tmp.digest('hex')

    let t = clone(template)

    t.blockId = hex
    t.txRoot = hex
    t.signerId = hex
    t.height += i
    t.signerSignature = hex
    t.mergerId = hex
    t.mergerSignature = hex

    blockArr.push(t)
  }
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('blocks', blockArr)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('blocks', null, {})
  }
}
