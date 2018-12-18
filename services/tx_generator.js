const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')
const crypto = require('crypto')
const utils = require('../plugins/my_utils')
const _ = require('../plugins/partial')
const Path = require('path')

const MSG_TX = 0xB1
const TRANSACTION_ID_SIZE = 32
const REQUESTER_ID_SIZE = 8

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

function sign (transaction) {
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

  const privateKey = process.env.PRIVATE_KEY
  const signer = crypto.createSign('sha256')
  signer.update(sigBuffer)
  return signer.sign(privateKey, 'base64')
}

class TxGenerator {
  constructor () {
    const packageDefinition = protoLoader.loadSync(TX_PROTO_PATH, LOAD_ARGS)
    const ProtoTransaction = grpc.loadPackageDefinition(packageDefinition).grpc_se

    const remoteServerAddr = `${process.env.MERGER_ADDRESS}:${process.env.MERGER_PORT}`
    this.client = new ProtoTransaction.GruutSeService(remoteServerAddr, grpc.credentials.createInsecure())
  }

  sendTransaction (content) {
    try {
      const result = _.go(content,
        this.generateTransaction,
        (tx) => {
          return utils.pack(MSG_TX, tx, tx.rID)
        },
        (packedTx) => {
          return utils.protobuf_msg_serializer(TX_PROTO_PATH, 'grpc_se.GrpcMsgTX', packedTx)
        },
        (msg) => {
          // TODO: Proto에서 nothing 리턴. 요청에 대한 결과를 리턴해야 함
          this.client.transaction(msg, res => {
            // TODO: logger
            console.log(`I got this msg: ${res}`)
          })
          return true
        }
      )

      return result
    } catch (e) {
      // TODO: logger
      console.log(e)
      return false
    }
  }

  generateTransaction (content) {
    let transaction = {}

    transaction.txid = hash(crypto.randomBytes(TRANSACTION_ID_SIZE), 'base64')
    transaction.time = utils.getTimestamp()
    transaction.rID = hash(content['rID'], 'base64', REQUESTER_ID_SIZE)
    transaction.type = 'digests'
    transaction.content = Object.values(content)

    transaction.rSig = sign(transaction)

    return transaction
  }
}

module.exports = TxGenerator
