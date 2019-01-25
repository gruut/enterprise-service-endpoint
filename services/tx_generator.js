const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')
const crypto = require('crypto')
const utils = require('../plugins/my_utils')
const _ = require('../plugins/partial')
const Path = require('path')
const { Key } = require('../models')

const MSG_TX = 0xB1
const TRANSACTION_ID_SIZE = 32
const REQUESTER_ID_SIZE = 12

const TX_PROTO_PATH = Path.join(__dirname, '../protos/tx.proto')
const LOAD_ARGS = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
}

function hash (data, encoding = 'hex', len) {
  let value = crypto.createHash('sha256').update(data).digest(encoding)
  if (len > 0) {
    value = value.substr(0, len)
  }

  return value
}

async function sign (transaction) {
  let bufferList = []

  bufferList.push(Buffer.from(transaction.txid, 'base64'))

  const timeBuffer = Buffer.allocUnsafe(8)
  timeBuffer.writeInt32BE(0x0, 0)
  timeBuffer.writeInt32BE(parseInt(transaction.time, 10), 4)
  bufferList.push(timeBuffer)

  bufferList.push(Buffer.from(transaction.rID, 'base64'))
  bufferList.push(Buffer.from(transaction.type))

  _.each(transaction.content, (content) => {
    bufferList.push(Buffer.from(content))
  })
  const sigBuffer = Buffer.concat(bufferList)

  const key = await Key.findOne({
    attributes: ['privateKeyPem']
  })

  const signer = crypto.createSign('sha256')
  signer.update(sigBuffer)
  return signer.sign(key.privateKeyPem, 'base64')
}

class TxGenerator {
  constructor () {
    const packageDefinition = protoLoader.loadSync(TX_PROTO_PATH, LOAD_ARGS)
    const ProtoTransaction = grpc.loadPackageDefinition(packageDefinition).grpc_se

    const remoteServerAddrs = [process.env.MERGER_ADDRESS1, process.env.MERGER_ADDRESS2, process.env.MERGER_ADDRESS3]
    this.transactionId = ''

    this.clients = _.map(remoteServerAddrs, (addr) => new ProtoTransaction.GruutSeService(addr, grpc.credentials.createInsecure()))
  }

  async sendTransaction (content) {
    try {
      const transaction = await this.generateTransaction(content)
      this.transactionId = transaction.txid
      const result = _.go(transaction,
        (tx) => {
          return utils.pack(MSG_TX, tx, tx.rID)
        },
        (packedTx) => {
          return utils.protobuf_msg_serializer(TX_PROTO_PATH, 'grpc_se.GrpcMsgTX', packedTx)
        },
        (msg) => {
          _.each(this.clients, (client) => {
            client.transaction(msg, async function (err, res) {
              if (err) {
                return false
              }
            })
          })

          return true
        }
      )

      return result
    } catch (e) {
      throw e
    }
  }

  async generateTransaction (content) {
    let transaction = {}

    transaction.txid = hash(crypto.randomBytes(TRANSACTION_ID_SIZE), 'base64')
    transaction.time = utils.getTimestamp()
    transaction.rID = Buffer.from(process.env.MY_ID).toString('base64', 0, REQUESTER_ID_SIZE)
    transaction.type = 'DIGESTS'
    transaction.content = Object.values(content)

    transaction.rSig = await sign(transaction)

    return transaction
  }
}

module.exports = TxGenerator
