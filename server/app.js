#!/usr/bin/env node

const express = require('express')
const request = require('request-promise-native')
const app = express()

const { NODE } = require('./config')

const { run, genWallet } = require('./runtx')

const extractWallet = (req) => {
  const { address, privateKey } = req.query
  return { address, privateKey }
}

const safe = (handler) => async (req, res) => {
  try {
    const wallet = extractWallet(req)
    const reply = await handler(wallet, req.query)
    res.json(reply)
  } catch ({ name, message, stack, ...err }) {
    res.status(500).json({ name, message, stack, ...err })
  }
}

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
})

app.get('/echo', safe((wallet) => wallet))

app.get('/balance', safe(async ({ address }) => {
  if (!address) throw new Error(`No wallet={address}`)
  console.log(`${NODE}`)
  const balance = await request(`${NODE}/balance?address=${address}`)
  return {
    address,
    balance,
  }
}))

app.get('/generate', safe(() => {
  return JsonOrThrow(genWallet())
}))

app.get('/token', safe(async () => {
  return [
    'getBalance',
    'mintTokens'
  ]
}))

const filterJSON = (raw) => raw
        .split('\n')
        .filter( line => !/akka\.actor/.test(line) )
        .join('')

const JsonOrThrow = (json) => {
  if (reply = JSON.parse(json))
    return reply
  else
    throw new Error(`Wrong format: ${reply}`)
}


app.get('/token/getBalance', safe(async (wallet, { holderAddress }) => {
  if (!wallet) throw new Error(`No wallet={address,privateKey}`)

  const payload = holderAddress ? [ 'x'+holderAddress ] : []

  let reply = runtx('getBalance', wallet, payload)

  reply = filterJSON(reply)

  return JsonOrThrow(reply)
}))

app.get('/token/mintTokens', safe(async (wallet, { amount }) => {
  if (!wallet) throw new Error(`No wallet={address,privateKey}`)

  const payload = [ amount ]

  let reply = runtx('mintTokens', wallet, payload)

  reply = filterJSON(reply)

  return JsonOrThrow(reply)

}))

app.listen(process.env.PORT || 3000, () => console.log('[APP] listening on port 3000'))
