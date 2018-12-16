const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')
const crypto = require('crypto')
const utils = require('../plugins/my_utils')
const _ = require('../plugins/underscore')
const Path = require('path')

const MSG_TX = 0xB1
const TX_PROTO_PATH = Path.join(__dirname, '../protos/tx.proto')
const LOAD_ARGS = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
}

class TxGenerator {
  constructor () {
    const packageDefinition = protoLoader.loadSync(TX_PROTO_PATH, LOAD_ARGS)
    const ProtoTransaction = grpc.loadPackageDefinition(packageDefinition).grpc_se

    // TODO: config 파일
    const remoteServerAddr = '192.168.0.6:50051'
    this.client = new ProtoTransaction.GruutSeService(remoteServerAddr, grpc.credentials.createInsecure())
  }

  sendTransaction (content) {
    const tx = this.generateTransaction(content)
    const packedTx = utils.pack(MSG_TX, tx, tx.rId)
    const msg = utils.protobuf_msg_serializer(TX_PROTO_PATH, 'grpc_se.GrpcMsgTX', packedTx)
    this.client.transaction(msg, res => {
      // TODO: logger
      console.log('I got this res: ' + JSON.stringify(res))
    })
  }

  generateTransaction (content) {
    let transaction = {}

    // TODO: txid?
    transaction.txid = TxGenerator.hash('1')
    transaction.time = Math.floor(new Date().getTime() / 1000).toString()
    transaction.rId = TxGenerator.hash(content['rId'], 'hex', 16)
    transaction.type = 'digests'
    transaction.content = content['digest']

    transaction.rSig = TxGenerator.sign(transaction)

    return transaction
  }

  static hash (data, encoding = 'hex', len) {
    let value = crypto.createHash('sha256').update(data).digest(encoding)
    if (len > 0) { value = value.substr(0, len) }

    return value
  }

  static sign (transaction) {
    let bufferList = []

    bufferList.push(Buffer.from(transaction.txid, 'base64'))

    const timeBuffer = Buffer.allocUnsafe(8)
    timeBuffer.writeInt32BE(0x0, 0)
    timeBuffer.writeInt32BE(parseInt(transaction.time, 10), 4)
    bufferList.push(timeBuffer)

    bufferList.push(Buffer.from(transaction.rId, 'base64'))
    bufferList.push(Buffer.from(transaction.type))

    _.forEach(transaction.content, (content) => {
      bufferList.push(Buffer.from(content))
    })
    const sigBuffer = Buffer.concat(bufferList)

    // TODO: config
    const privateKey = '-----BEGIN RSA PRIVATE KEY-----\n' +
      'MIICXQIBAAKBgQDCtTEic76GBqUetJ1XXrrWZcxd8vJr2raWRqBjbGpSzLqa3YLv\n' +
      'VxVeK49iSlI+5uLX/2WFJdhKAWoqO+03oH4TDSupolzZrwMFSylxGwR5jPmoNHDM\n' +
      'S3nnzUkBtdr3NCfq1C34fQV0iUGdlPtJaiiTBQPMt4KUcQ1TaazB8TzhqwIDAQAB\n' +
      'AoGAM8WeBP0lwdluelWoKJ0lrPBwgOKilw8W0aqB5y3ir5WEYL1ZnW5YXivS+l2s\n' +
      'tNELrEdapSbE9hieNBCvKMViABQXj4DRw5Dgpfz6Hc8XIzoEl68DtxL313EyouZD\n' +
      'jOiOGWW5UTBatLh05Fa5rh0FbZn8GsHrA6nhz4Fg2zGzpyECQQDi8rN6qhjEk5If\n' +
      '+fOBT+kjHZ/SLrH6OIeAJ+RYstjOfS0bWiM9Wvrhtr7DZkIUA5JNsmeANUGlCrQ2\n' +
      'cBJU2cJJAkEA26HyehCmnCkCjit7s8g3MdT0ys5WvrAFO6z3+kCbCAsGS+34EgnF\n' +
      'yz8dDdfUYP410R5+9Cs/RkYesqindsvEUwJBALCmQVXFeKnqQ99n60ZIMSwILxKn\n' +
      'Dhm6Tp5Obssryt5PSQD1VGC5pHZ0jGAEBIMXlJWtvCprScFxZ3zIFzy8kyECQQDB\n' +
      'lUhHVo3DblIWRTVPDNW5Ul5AswW6JSM3qgkXxgHfYPg3zJOuMnbn4cUWAnnq06VT\n' +
      'oHF9fPDUW9GK3yRbjNaJAkAB2Al6yY0KUhYLtWoEpQ40HlATbhNel2cn5WNs6Y5F\n' +
      '2hedvWdhS/zLzbtbSlOegp00d2/7IBghAfjAc3DE9DZw\n' +
      '-----END RSA PRIVATE KEY-----'

    const signer = crypto.createSign('sha256')
    signer.update(sigBuffer)
    return signer.sign(privateKey, 'base64')
  }
}

module.exports = TxGenerator
