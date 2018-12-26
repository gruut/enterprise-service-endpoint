/**
 * Common functions
 */
// Buffer encoding, Hash
// https://nodejs.org/docs/latest/api/buffer.html#buffer_class_method_buffer_from_string_encoding
const protobuf = require("protobufjs");

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

const base64ToHex = function(base64Str) {
  return Buffer.from(base64Str, 'base64').toString('hex')
}

const self = module.exports = {
  protobuf_msg_serializer : protobuf_msg_serializer,
  getTimestamp : getTimestamp,
  base64ToHex: base64ToHex
};
