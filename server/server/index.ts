const express = require('express')
var bodyParser = require('body-parser')
const cors = require('cors');
const { db } = require('./api')
const app = express()
app.use(cors())

const { SERVER_PORT } = process.env

app.get('/healthcheck', async (req: any, res: any) => {
  res.send('OK!');
});

app.post('/api/agree/:address', async (req: any, res: any) => {
  const { address } = req.params
  console.log('agree: address', address)
  await db.agreeTerms(address)
  res.sendStatus(200)
})

app.get('/api/agreement/:address', async (req: any, res: any) => {
  const { address } = req.params
  console.log('address', address)
  if (!address || address.length !== 42) {
    throw new Error('Invalid address')
  }
  const agreement = await db.getWalletAgreement(req.params.address)
  console.log(agreement)

  return agreement ? res.status(200).send(agreement) : res.sendStatus(404)
})

app.listen(SERVER_PORT, () => {
  console.log(`App listening on port ${SERVER_PORT}`)
})
