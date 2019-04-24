const _ = require('../plugins/partial')
const {
  Block,
  Signer,
  Transaction
} = require('../models')

class BlockMsgHandler {
  static async handleMessage (msg) {
    let result = false

    result = await _.go(msg, async (blockRaw) => {
      const [block, blockCreated] = await Block.findOrCreate({
        where: {blockId: blockRaw.bID},
        defaults: {
          version: blockRaw.ver,
          blockId: blockRaw.bID,
          time: new Date(parseInt(`${blockRaw.time}000`)),
          height: blockRaw.hgt,
          txRoot: blockRaw.txrt,
          mergerId: blockRaw.mID,
          chainId: blockRaw.cID,
          prevBlockHash: blockRaw.prevH,
          prevBlockId: blockRaw.prevbID
        }
      }
      )
      if (blockCreated) {
        await Signer.bulkCreate(_.map(blockRaw.SSig, (signer) => {
          return {
            signerId: signer.sID,
            signerSignature: signer.sig,
            blockId: block.id
          }
        }))

        await Transaction.bulkCreate(_.map(blockRaw.txids, (txId) => {
          return {
            transactionId: txId,
            blockId: block.id
          }
        }))
      }

      return true
    })

    return result
  }
}

module.exports = BlockMsgHandler
