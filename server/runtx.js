#!/usr/bin/env node

const fs = require('fs')
const { exec, execSync } = require('child_process')

const { NODE } = require('./config')

const _wallet = {
  "address": "22322a562195d1aca36ac4b590adb746cf34e80539a6df0ba0b5e5d93536f611",
  "privateKey": "a389a556b02673e60471fd5fc86161a6e01c543659194d258b6c1f12645736f722322a562195d1aca36ac4b590adb746cf34e80539a6df0ba0b5e5d93536f611"
}

const wallet_file = "tempwallet.json"

const run = (method = 'getBalance', wallet, payload) => {
  fs.writeFileSync(wallet_file, JSON.stringify(wallet || _wallet))

  if (payload) {
    const len = payload.length
    const asm = fs.readFileSync(`../methods/${method}.asm`).toString()
    const lines = asm.split('\n')
    const args = payload.map(param => `push ${param}`)

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
    -l 10000 -i ../build/bin/${method}.pravda`

  const reply = execSync(command)
  console.log(command + ":\n")
  console.log(reply.toString())

  fs.unlink(wallet_file, (err) => (err) ? console.error(`Couldnt delete ${err}`) : null)

  return reply.toString()
}

// run()

module.exports = run
