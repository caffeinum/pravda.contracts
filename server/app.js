#!/usr/bin/env node

const express = require('express')
const request = require('request-promise-native')
const app = express()
const fs = require('fs')

const _adminwallet = JSON.parse(fs.readFileSync('../wallet.json').toString())

const { NODE } = require('./config')

const { run, genWallet, pay } = require('./runtx')

const { tx, safe, cors, JsonOrThrow, filterJSON } = require('./helpers')

app.use(cors)

app.get('/echo', safe((wallet) => wallet))

app.get('/balance', safe(async ({ address }) => {
  if (!address) throw new Error(`No wallet={address}`)

  return {
    address,
    balance: await request(`${NODE}/balance?address=${address}`),
  }
}))

app.get('/generate', safe(() => {
  return JsonOrThrow(filterJSON(genWallet()))
}))

app.get('/faucet', safe((wallet) => {
  if (!wallet.address) throw new Error(`No wallet={address}`)

  const reply = pay(wallet)
  return JsonOrThrow(filterJSON(reply))
}))

app.get('/token/faucet', safe(({ address }) => {
  if (!address) throw new Error(`No wallet={address}`)

  const reply1 = run('mintGametoken', _adminwallet, [ 7000 ])
  const reply2 = run('transfer', _adminwallet, [ 'x' + address, 7000 ])

  return JsonOrThrow(filterJSON(reply2))
}))

app.get('/token', safe(async () => {
  return [
    'getBalance',
    'mintTokens'
  ]
}))

app.get('/token/getBalance', safe(async (wallet, { holderAddress }) => {
  if (!wallet) throw new Error(`No wallet={address,privateKey}`)

  const payload = holderAddress ? [ 'x'+holderAddress ] : []
  return tx('getBalance', wallet, payload)
}))

app.get('/token/mintTokens', safe(async (wallet, { amount }) => {
  if (!wallet) throw new Error(`No wallet={address,privateKey}`)

  const payload = [ amount ]
  return tx('mintGametoken', wallet, payload)
}))

app.get('/token/balanceOf', safe(async (wallet, { holderAddress }) => {
  if (!wallet) throw new Error(`No wallet={address,privateKey}`)

  const payload = holderAddress ? [ 'x'+holderAddress ] : []
  return tx('balanceOf', wallet, payload)
}))

app.get('/token/gameItemOf', safe(async (wallet, { holderAddress }) => {
  if (!wallet) throw new Error(`No wallet={address,privateKey}`)

  const payload = holderAddress ? [ 'x'+holderAddress ] : []
  return tx('gameItemOf', wallet, payload)
}))

app.get('/token/transfer', safe(async (wallet, { to, amount }) => {
  if (!wallet) throw new Error(`No wallet={address,privateKey}`)

  const payload = [ to, amount ]
  return tx('gameItemOf', wallet, payload)
}))

app.listen(process.env.PORT || 3000, () => console.log('[APP] listening on port 3000'))
