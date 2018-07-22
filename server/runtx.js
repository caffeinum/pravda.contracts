#!/usr/bin/env node

const fs = require('fs')
const { exec, execSync } = require('child_process')
//
// const method = 'mintTokens'

const wallet = {
  "address": "22322a562195d1aca36ac4b590adb746cf34e80539a6df0ba0b5e5d93536f611",
  "privateKey": "a389a556b02673e60471fd5fc86161a6e01c543659194d258b6c1f12645736f722322a562195d1aca36ac4b590adb746cf34e80539a6df0ba0b5e5d93536f611"
}

const wallet_file = "tempwallet.json"
const NODE = "https://publicnode.expload.com/api/public"

const run = async (method = 'getBalance') => {
  fs.writeFileSync(wallet_file, JSON.stringify(wallet))

  const command =
  `pravda broadcast run \
    -e ${NODE}/broadcast -w ${wallet_file} \
    -l 10000 -i ../build/bin/${method}.pravda`

  const reply = execSync(command)
  console.log(command + ":\n")
  console.log(reply.toString())
}

run('mintTokens')

module.exports = run
