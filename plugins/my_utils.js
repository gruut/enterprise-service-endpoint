/**
 * Common functions
 */
// Buffer encoding, Hash
// https://nodejs.org/docs/latest/api/buffer.html#buffer_class_method_buffer_from_string_encoding
const protobuf = require("protobufjs");
const lz4 = require('lz4')
const crypto = require('crypto')

const HEADER_LENGTH = 32;

const pack = function (MSG_TYPE, data, sender_id) {
  let zip_data = this.zipIt(data);
  let header = buildHeader(MSG_TYPE, zip_data, sender_id);
  let mac = buildHMAC(zip_data.body);
  return Buffer.concat([header, zip_data.body, mac]);
};

const zipIt = function (data){
  let str_data = JSON.stringify(data);
  let input = new Buffer.from(str_data);
  let output = new Buffer.allocUnsafe( lz4.encodeBound(str_data.length) );
  let compressedSize = lz4.encodeBlock(input, output);
  output = output.slice(0, compressedSize);
  var zip_data = {
    body : output,
    length : compressedSize
  };

  return zip_data;
};

// build front 6 bytes of the header
const headerFront = function (type_byte){
  return new Buffer.from([0x47 // 'G'
    ,0x11 // major minor
    ,type_byte
    ,0x01 // MAC -> ECDSA
    ,0x04 // zip -> lz4
    ,0x00 // not used
  ]);
};

const headerLength = function (length){
  let buf = Buffer.allocUnsafe(4);
  buf.writeInt32BE( (length + HEADER_LENGTH), 0);
  return buf;
};

const headerChainId = function (id){
  let buf = Buffer.allocUnsafe(8).fill(0);
  buf.writeInt32BE(1, 4);
  return buf;
};

const headerSender = function (sender_id){
  if (sender_id.length > 16) return null;

  return new Buffer.from(sender_id, 'hex');
};

const headerReserved = function (){
  return Buffer.allocUnsafe(6).fill(0);
};

const buildHeader = function (type_byte, zip_data, sender_id){
  var head = {
    front : headerFront(type_byte),
    total_length : headerLength(zip_data.length),
    chainid : headerChainId(1),
    sender : headerSender(sender_id),
    reserved : headerReserved()
  };

  return Buffer.concat([head.front, head.total_length, head.chainid, head.sender, head.reserved], HEADER_LENGTH);
};

var getHMAC = function(data){
  const secret = '0x0000000000000000000000000000000000000000000000000000000000000000';
  return crypto.createHmac('sha256', Buffer.from(secret, 'hex'))
    .update(data)
    .digest('hex');
}

const buildHMAC = function (zip_data){
  return new Buffer.from(getHMAC(zip_data), 'hex');
};

const protobuf_msg_serializer = function(PROTO_PATH, msg_type_name, packed_msg){
  const root = protobuf.loadSync(PROTO_PATH);

  // Obtain a message type
  var msg_type = root.lookupType(msg_type_name);
  var payload = {message: packed_msg};
  var errMsg = msg_type.verify(payload);
  if(errMsg)
    logger.error("failed to verify payload: " + errMsg);

  var serialized_msg = msg_type.create(payload);	// byte packed msg => base64 msg
  return serialized_msg;
};

const getTimestamp = function(){
  return (Math.floor(Date.now() / 1000)).toString();
};

const self = module.exports = {
  pack : pack,
  zipIt: zipIt,
  protobuf_msg_serializer : protobuf_msg_serializer,
  getTimestamp : getTimestamp
};
