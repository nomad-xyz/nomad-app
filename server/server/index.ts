const express = require('express')
var bodyParser = require('body-parser')
const cors = require('cors');
const { db } = require('./api')
const { SERVER_PORT, NODE_ENV } = process.env
const app = express()
app.use(cors())
app.disable('x-powered-by');

var whitelist = ['https://app.nomad.xyz', 'https://production-preview.app.nomad.xyz/']
var corsOptions = {
  origin: function (origin: string, callback: any) {
    if (NODE_ENV !== 'production') {
      callback(null, true)
    } else if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.get('/healthcheck', async (req: any, res: any) => {
  res.send('OK!');
});

app.post('/api/agree/:address', cors(corsOptions), async (req: any, res: any) => {
  const { address } = req.params
  if (!address || address.length !== 42) {
    return res.sendStatus(400)
  }
  await db.agreeTerms(address)
  res.sendStatus(200)
})

app.get('/api/agreement/:address', async (req: any, res: any) => {
  const { address } = req.params
  if (!address || address.length !== 42) {
    return res.sendStatus(400)
  }
  const agreement = await db.getWalletAgreement(req.params.address)
  console.log(agreement)

  return agreement ? res.status(200).send(agreement) : res.sendStatus(404)
})

app.listen(SERVER_PORT, () => {
  console.log(`App listening on port ${SERVER_PORT}`)
})
