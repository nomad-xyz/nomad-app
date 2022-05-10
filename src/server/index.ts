const express = require('express')
var bodyParser = require('body-parser')
const { DB } = require('./api')
const app = express()
const { PORT } = process.env

type AgreeTerms = {
  body: {
    walletAddress: string
    timestamp: number
  }
}

app.post('/agree', (req: AgreeTerms, res: any) => {
  const response = req.body
  res.end(JSON.stringify(response));
})

app.get('/agreement/:address', async (req: any, res: any) => {
  const { address } = req.params
  if (!address || address.length !== 42) {
    throw new Error('Invalid address')
  }
  const agreement = await DB.getWalletAgreement(req.params.address)

  return agreement ? res.json(agreement.timestamp) : res.status(404)
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
