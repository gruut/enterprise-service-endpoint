const {
  Block
} = require('../models')

class Seed {
  static sampleBlock () {
    return Block.create({
      version: 1,
      blockId: 'xo2a8TIhzOYE1aUZMta7lGJSlCdgHoG9eyrldLbq6Nw=',
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
}

module.exports = Seed
