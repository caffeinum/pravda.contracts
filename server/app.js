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

app.get('/node', safe(async () => {
  return {
    address: _adminwallet.address,
    balance: await request(`${NODE}/balance?address=${_adminwallet.address}`),
  }
}))

app.get('/generate', safe(() => {
  return JsonOrThrow(filterJSON(genWallet()))
}))

// UNAUTHORIZED

app.get('/balance', safe(async ({ address }) => {
  if (!address) throw new Error(`No wallet={address}`)

  return {
    address,
    balance: await request(`${NODE}/balance?address=${address}`),
  }
}))

app.get('/balanceOf', safe(async ({ address }) => {
  if (!address) throw new Error(`No wallet={address}`)

  return {
    address,
    balance: await request(`${NODE}/balance?address=${address}`),
  }
}))

app.get('/faucet', safe(({ address }) => {
  if (!address) throw new Error(`No wallet={address}`)

  const reply = pay(address)
  return JsonOrThrow(filterJSON(reply))
}))

app.get('/token/faucet', safe(({ address }) => {
  if (!address) throw new Error(`No wallet={address}`)

  const reply1 = run('mintGametoken', _adminwallet, [ 7000 ])
  const reply2 = run('transfer', _adminwallet, [ 'x' + address, 7000 ])

  return JsonOrThrow(filterJSON(reply2))
}))

app.get('/token/mintGameItem', safe(async (wallet) => {
  if (!wallet.address || !wallet.privateKey)
    throw new Error(`No wallet={address,privateKey}`)

  return tx('mintGameItem', wallet)
}))

// AUTHORIZED

app.get('/token/mintGametoken', safe(async (wallet, { amount }) => {
  if (!wallet.address || !wallet.privateKey)
    throw new Error(`No wallet={address,privateKey}`)

  const payload = [ amount ]
  return tx('mintGametoken', wallet, payload)
}))

app.get('/token/balanceOf', safe(async (wallet, { holderAddress }) => {
  if (!wallet.address || !wallet.privateKey)
    throw new Error(`No wallet={address,privateKey}`)

  const payload = holderAddress ? [ 'x'+holderAddress ] : []
  return tx('balanceOf', wallet, payload)
}))

app.get('/token/gameItemOf', safe(async (wallet, { holderAddress }) => {
  if (!wallet.address || !wallet.privateKey)
    throw new Error(`No wallet={address,privateKey}`)

  const payload = holderAddress ? [ 'x'+holderAddress ] : []
  return tx('gameItemOf', wallet, payload)
}))

app.get('/token/transfer', safe(async (wallet, { to, amount }) => {
  if (!wallet.address || !wallet.privateKey)
    throw new Error(`No wallet={address,privateKey}`)

  const payload = [ to, amount ]
  return tx('transfer', wallet, payload)
}))

app.get('/token/transfer-ownership', safe(async (wallet, { tokenId, to }) => {
  if (!wallet.address || !wallet.privateKey)
    throw new Error(`No wallet={address,privateKey}`)

  const payload = [ tokenId, to ]
  return tx('transferOwnership', wallet, payload)
}))

app.get('/token/initiatePawnTransaction', safe(async (wallet, { tokenId }) => {
  if (!wallet.address || !wallet.privateKey)
    throw new Error(`No wallet={address,privateKey}`)

  const payload = [ tokenId ]
  return tx('initiatePawnTransaction', wallet, payload)
}))

app.get('/token/finishPawnTransaction', safe(async (wallet, { tokenId }) => {
  if (!wallet.address || !wallet.privateKey)
    throw new Error(`No wallet={address,privateKey}`)

  const payload = [ tokenId ]
  return tx('finishPawnTransaction', wallet, payload)
}))

// Getters

app.get('/token/getContractAdmin', safe(async () => {
  return tx('getContractAdmin', _adminwallet)
}))

app.get('/token/getGameItemUser', safe(async ({}, { tokenId }) => {
  return tx('getGameItemUser', _adminwallet, [ tokenId ])
}))

app.get('/token/getGameItemOwner', safe(async ({}, { tokenId }) => {
  return tx('getGameItemOwner', _adminwallet, [ tokenId ])
}))





app.listen(process.env.PORT || 3000, () => console.log('[APP] listening on port 3000'))
