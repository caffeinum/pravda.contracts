const { run } = require('./runtx')

const tx = (method, wallet, payload) => {
  let reply = run(method, wallet, payload)

  reply = filterJSON(reply)

  return JsonOrThrow(reply)
}

const extractWallet = (req) => {
  const { address, privateKey } = req.query
  return { address, privateKey }
}

const safe = (handler) => async (req, res) => {
  try {
    const wallet = extractWallet(req)
    const reply = await handler(wallet, req.query)
    res.json(reply)
  } catch ({ code, name, message, stack, ...err }) {
    res.status(500).json({ code, name, message, stack, err })
  }
}

const filterJSON = (raw) => raw
        .split('\n')
        .filter( line => !/akka\.actor/g.test(line) )
        .filter( line => !/\[ERROR\]/g.test(line) )
        .join('')

const JsonOrThrow = (json) => {
  if (reply = JSON.parse(json))
    return reply
  else
    throw new Error(`Wrong format: ${reply}`)
}

const cors = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    res.setHeader('Access-Control-Allow-Credentials', true)
    next()
}


module.exports = { tx, safe, cors, JsonOrThrow, filterJSON }
