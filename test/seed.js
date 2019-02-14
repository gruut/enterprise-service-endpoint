const {
  Block,
  Transaction,
  RequestData
} = require('../models')

class Seed {
  static sampleBlock () {
    const randomBlockId = Buffer.from(Math.random().toString()).toString('base64')
    return Block.create({
      version: 1,
      blockId: randomBlockId,
      prevBlockHash: 'j29G/wJ0tBSfOuLx4DjMtJmPuVeNrgzqa+5ptxisj5Q=',
      prevBlockId: 'xGDovtfI32Xl84eQy529S9LT4odVrgHXnvNfjR7YBgc=',
      chainId: 'R0VOVEVTVDE=',
      time: new Date(),
      height: 1,
      txRoot: 'dCc8MsxGDMpc1QEKmt/7EK8l8IcOe9owKwSwCenFvw4=',
      mergerId: 'TUVSR0VSLTE='
    })
      .catch(e => console.log(e))
  }

  static async sampleRequestData () {
    const tx = await this.sampleTransaction()
    return RequestData.create({
      requesterId: 'test',
      data: 'test',
      transactionId: tx.transactionId
    })
  }

  static async sampleTransaction () {
    const block = await this.sampleBlock()
    return Transaction.create({
      transactionId: 'dSupNe0rqGpXKdvnQFB3pvtAHxvj3pUsJSGN3UbDWWc=',
      blockId: block.id
    })
      .catch(e => console.log(e))
  }
}

module.exports = Seed
