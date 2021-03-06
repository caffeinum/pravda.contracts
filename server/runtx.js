#!/usr/bin/env node

const fs = require('fs')
const { exec, execSync } = require('child_process')

const { NODE } = require('./config')

const _wallet = {
  "address": "22322a562195d1aca36ac4b590adb746cf34e80539a6df0ba0b5e5d93536f611",
  "privateKey": "a389a556b02673e60471fd5fc86161a6e01c543659194d258b6c1f12645736f722322a562195d1aca36ac4b590adb746cf34e80539a6df0ba0b5e5d93536f611"
}

const getWalletFile = () => `wallet-${Math.random().toString().slice(5)}.json`

const run = (method = 'getBalance', wallet, payload) => {
  const wallet_file = getWalletFile()

  fs.writeFileSync(wallet_file, JSON.stringify(wallet || _wallet))

  if (payload) {
    const len = payload.length
    const asm = fs.readFileSync(`../methods/${method}.asm`).toString()
    const lines = asm.split('\n')
    const args = payload.reverse().map(param => `push ${param}`)

    const script = [
      ...args,
      ...lines.slice(len)
    ].join("\n")

    const command = `pravda compile asm \
  		--output ../build/bin/${method}.pravda`

    console.log('stdin:\n' + script)

    const reply = execSync(command, { input: script })

    console.log(command + ":\n")
    console.log(reply.toString())
  }

  const command = `pravda broadcast run \
    -e ${NODE}/broadcast -w ${wallet_file} \
    -l 3000 -i ../build/bin/${method}.pravda`

  const reply = execSync(command)
  console.log(command + ":\n")
  // console.log(reply.toString())

  fs.unlinkSync(wallet_file)

  return reply.toString()
}

const genWallet = () => {
  const command = `pravda gen address`
  return execSync(command).toString()
}

const pay = (address, amount = 10000) => {
  const command = `pravda broadcast transfer \
    -e ${NODE}/broadcast -w ../wallet.json \
    -l 5000 -t ${address} -a ${amount}`

  return execSync(command).toString()
}

module.exports = { run, genWallet, pay }
