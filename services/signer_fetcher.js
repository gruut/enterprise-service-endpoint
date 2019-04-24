const {
  Signer
} = require('../models')

class SignerFetcher {
  static async fetch (query) {
    const signers = await Signer.findAll({
      where: { blockId: query.blockId }
    })

    return signers
  }
}

module.exports = SignerFetcher
