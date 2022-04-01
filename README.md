# Nomad Bridge Application

The official GUI for the Nomad Token Bridge. It includes integrations with both Nomad and Connext. These are two distinct protocols that are complimentary to one another. We have partnered with Connext to provide an optimal experience for users!

Nomad is a novel interoperability protocol designed to lower costs and increase security of cross-chain messaging. By leveraging an optimistic mechanism, Nomad lets users send messages and bridge assets securely. The main trade-off Nomad makes is in introducing a latency window to settle fraud proofs. However, by partnering with Connext, we achieve the holy trinity – low cost, high security, and blazing fast bridging.

Connext is a network of liquidity pools on different chains. Users swap value between these pools, similar to AMM DEXes like Uniswap. Connext provides liquidity pools for Nomad assets, meaning users can receive funds on the destination chain much faster (less than 10 minutes) for an additional fee.

Further documentation available [here.](https://docs.nomad.xyz/bridge)

 - [Nomad SDK](https://www.npmjs.com/package/@nomad-xyz/sdk)
 - [Connext SDK](https://www.npmjs.com/package/@connext/nxtp-sdk)

## Project setup

Install Vue 3
```bash
npm install -g @vue/cli
```

Commands:
```bash
npm install

// compiles and hot-reloads for development
npm run serve

// compiles in production environment
npm run serve-prod

// compiles and minifies for production
npm run build

// lints and fixes files
npm run lint

// runs unit tests
npm run test:unit
```

## Testing Connext in development

1. Get TEST tokens

  Go to the [xPollinate Testnet site](https://testnet.xpollinate.io/)
  Connect wallet
  Click the "Faucets" dropdown
  Select "Kovan"
  Get 1,000 TEST tokens

2. Send using Connext

  Go to [development GUI](https://development.app.nomad.xyz)
  Connect wallet
  Select TEST token in dropdown
  Enter amount
  Select Kovan as origin network and Moonbasealpha as destination network
  App will check if Connext is available (should be for TEST tokens)
  Preview send, wait ~6-8 seconds for quote
  Send tokens
  Approve in Metamask

3. Claim tokens

  Wait a few minutes, your transaction should appear in a table below
  Wait for router
  (optional) Click "View" to open transaction in ConnextScan
  Once available, click "Claim".
  Approve in Metamask

Done!!!
