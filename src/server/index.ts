const express = require('express')
var bodyParser = require('body-parser')
const { db } = require('./api')
const app = express()
const { PORT } = process.env

type AgreeTerms = {
  body: {
    walletAddress: string
  }
}

app.post('/agree', async (req: AgreeTerms, res: any) => {
  const { walletAddress } = req.body
  await db.agreeTerms(walletAddress)
  res.sendStatus(200)
})

app.get('/agreement/:address', async (req: any, res: any) => {
  const { address } = req.params
  if (!address || address.length !== 42) {
    throw new Error('Invalid address')
  }
  const agreement = await db.getWalletAgreement(req.params.address)

  return agreement ? res.json(agreement.timestamp) : res.status(404)
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
