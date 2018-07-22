#!/usr/bin/env node
const request = require('superagent')
const nacl = require('tweetnacl')
const ed25519 = require('ed25519')
const ed2curve = require('ed2curve')

var EdDSA = require('elliptic').eddsa;

// Create and initialize EdDSA context
// (better do it once and reuse it)
var ec = new EdDSA('ed25519');


//
// console.log('nacl', nacl)
// console.log('ed25519', ed25519)
// console.log('ed2curve', ed2curve)

const NODE='https://publicnode.expload.com/api/public'
const LOCAL='http://localhost:8080/api/public'

const URL=`${NODE}/broadcast`

const fromHexString = hexString =>
new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))

const toHexString = bytes =>
bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '')

// Get BSON parser class
const BSON = require('bson')
const bson = new BSON()
const Long = BSON.Long
const Int32 = BSON.Int32

const program = "EQ5gIjIqViGV0ayjasS1kK23Rs806AU5pt8LoLXl2TU29hERC0liYWxhbmNlT2YRDmCwPdwn0t0HjlQauBOzjG261jqB96UzChRR+ychspm0RBEFAgY="
const secretKey = "a389a556b02673e60471fd5fc86161a6e01c543659194d258b6c1f12645736f722322a562195d1aca36ac4b590adb746cf34e80539a6df0ba0b5e5d93536f611"
const address = "22322a562195d1aca36ac4b590adb746cf34e80539a6df0ba0b5e5d93536f611"

// const pair = nacl.sign.keyPair.fromSecretKey(fromHexString(secretKey))
// const ed2pair = ed2curve.convertKeyPair(pair)

// Create key pair from secret
var eckey = ec.keyFromSecret(secretKey); // hex string, array or Buffer
console.log('eckey', eckey.secretKey)
// const sign = "dc6d21bd15667688f30f48f37f134aa165ae5c913eab8249888732661f0ef33d294199f35ec2448f8f6d806089aec7320043705c1717fc50759079b1c368850d"
// console.log(nacl.sign.open(fromHexString(sign), pair.publicKey))
console.log('address', toHexString(eckey.getPublic()))

const forSignature = {
  from: Buffer.from(address, 'hex'),
  program: Buffer.from(program, 'base64'), //.toString('base64'),
  wattLimit: Long.fromNumber(10000),
  wattPrice: Long.fromNumber(1),
  nonce: Int32(-950547101)
}

console.log('forSignature', forSignature)

var _message = bson.serialize(forSignature, false, true, false)
console.log("data %o", _message)
console.log("data %o", toHexString(_message))


// Sign the message's hash (input must be an array, or a hex-string)
var msgHash = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
var signature = eckey.sign(toHexString(_message)).toHex().toLowerCase();

// Verify signature
console.log(eckey.verify(_message, 'b62dbdff510e3abc9432c6b1196a47dec43703b010f3b615bfd86326f074d7a386ec2f4d0ade32a3720457fd9c0548bba7e8dab2fc2b35e2a2b229ec21e5d105'));

// CHECK WITH NO PRIVATE KEY


// const signature = toHexString(nacl.box.sign(_message, pair.secretKey))
// const signature = '0d624b5d85bdf7657410ccfa751e368b617b323db05041357037465b1450b36dfca6f8a6cbee12bf0a7e9ddfdd6892d33d13a343ef5c4f252e04c679d9effa0e'

console.log('signature', 'b62dbdff510e3abc9432c6b1196a47dec43703b010f3b615bfd86326f074d7a386ec2f4d0ade32a3720457fd9c0548bba7e8dab2fc2b35e2a2b229ec21e5d105')
// console.log('signature', eckey.verify(_message, signature))

const formData = "\
from="+address+"\
&signature="+signature+"\
&nonce=-950547101\
&wattLimit=10000\
&wattPrice=1"

// const base64encoded = Buffer.from(program, 'hex').toString('base64')

// console.log('base64', base64encoded)
console.log('url', `${URL}?${formData}`)
request.post(`${URL}?${formData}`)
  .send(program)
  .set('Content-Type', 'application/base64')
  // .send(Buffer.from(program, 'hex'))
  // .set('Content-Type', 'application/octet-stream')
  // .type('base64')
  .then(resp => {
    console.log(resp.text)
  });
