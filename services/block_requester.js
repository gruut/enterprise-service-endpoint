const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')
const crypto = require('crypto')
const utils = require('../plugins/my_utils')
const _ = require('../plugins/partial')
const Path = require('path')
const {
  Block,
  Key
} = require('../models')

const PROTO_PATH = Path.join(__dirname, '../protos/request_message.proto')
const LOAD_ARGS = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
}
const MSG_REQ_HEADER = 0xE0
// TODO: duplicate constant value
const REQUESTER_ID_SIZE = 12

class BlockRequester {
  constructor () {
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, LOAD_ARGS)
    const ProtoTransaction = grpc.loadPackageDefinition(packageDefinition).grpc_se

    const remoteServerAddrs = [process.env.MERGER_ADDRESS1, process.env.MERGER_ADDRESS2, process.env.MERGER_ADDRESS3]

    this.clients = _.map(remoteServerAddrs, (addr) => new ProtoTransaction.GruutSeService(addr, grpc.credentials.createInsecure()))
  }

  async request () {
    const heights = await this.getMissingBlockHeights()

    _.go(heights,
      _.map(async (height) => {
        const reqMessage = await this.generateReqMsg(height)
        const packedMsg = utils.pack(MSG_REQ_HEADER, reqMessage, process.env.MY_ID)
        return utils.protobuf_msg_serializer(PROTO_PATH, 'grpc_se.Request', packedMsg)
      }),
      (messages) => {
        _.each(this.clients, (client) => {
          _.each(messages, message => {
            client.seService(message, (err, res) => {
              if (err) {
                // TODO: logger
                console.log(err)
              } else {
                console.log(res)
              }
            })
          })
        })
      })
  }

  async getMissingBlockHeights () {
    const blocks = await Block.findAll({
      attributes: ['height'],
      order: [
        ['height']
      ]
    })

    return _.go(blocks,
      (blocks) => {
        return _.pluck(blocks, 'height')
      },
      (heights) => {
        return _.difference(_.range(_.min(heights), _.max(heights)), heights)
      }
    )
  }

  async generateReqMsg (height) {
    const requestMessage = {}

    requestMessage.rID = Buffer.from(process.env.MY_ID).toString('base64', 0, REQUESTER_ID_SIZE)
    requestMessage.time = utils.getTimestamp()

    requestMessage.rCert = (await Key.findOne({
      attributes: ['certificatePem']
    })).certificatePem

    requestMessage.hgt = String(height)
    requestMessage.rSig = await this.sign(requestMessage)

    return requestMessage
  }

  async sign (requestMessage) {
    let bufferList = []

    bufferList.push(Buffer.from(requestMessage.rID, 'base64'))

    const timeBuffer = Buffer.allocUnsafe(8)
    timeBuffer.writeInt32BE(0x0, 0)
    timeBuffer.writeInt32BE(parseInt(requestMessage.time, 10), 4)
    bufferList.push(timeBuffer)

    bufferList.push(Buffer.from(requestMessage.rCert))

    const sigBuffer = Buffer.concat(bufferList)
    const key = await Key.findOne({
      attributes: ['privateKeyPem']
    })

    const signer = crypto.createSign('sha256')
    signer.update(sigBuffer)
    return signer.sign(key.privateKeyPem, 'base64')
  }
}

module.exports = BlockRequester
