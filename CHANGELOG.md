# Changelog

This change log is manually updated at the moment.

## Unreleased

## v1.6.1 (June 23, 2022)

- add: link to tx search in nav

## v1.6.0 (June 22, 2022)

- upgrade: contracts/sdk
- remove: 1/5 processing gas fee language
- fix: don't show connext alert if Nomad is selected

## v1.5.2 (June 7th, 2022)

- feat: add AVAX, wAVAX
- chore: bump configuration to 0.1.0-rc.25

## v1.5.1 (May 31st, 2022)

- fix copy/paste in Firefox
- bump sdk-bridge to 1.0.0-rc.19
- support infinite token approval

## v1.5.0 (May 19th, 2022)

- Wallet Connect
- update button copy for using the sender wallet address when editing destination address
- better error handling
- select Connext by default
- tons of other small fixes and improvements

## v1.4.8 (May 6th, 2022)

- truncate decimals instead of rounding to 6 places

## v1.4.7 (May 5th, 2022)

- fixed gas limit for sendNative

## v1.4.6 (May the 4th, 2022)

- enable Connext for Evmos

## v1.4.5 (Apr 27th, 2022)

- bump sdk-bridge (increase gas limit more)

## v1.4.4 (Apr 27th, 2022)

- bump sdk-bridge (increase gas limit by 10%)

## v1.4.3 (Apr 27th, 2022)

- organize env variables
- fine tune status/confirmAt checks and time estimation logic
- bump sdk-bridge to v1.0.0-rc.10
- bump configuration to v0.1.0-rc.16

## v1.4.2 (Apr 26th, 2022)

- Fix indexer fallback (confirmAt check)
- fix bug in tx detail page where tx was not yet available from indexer
- bump SDK for new dev deploy
- add configuration package, add Evmos Testnet
- update copy for process gas disclaimer

## v1.4.1 (Apr 19th, 2022)

- Robust network validation

## v1.4.0 (Apr 18th, 2022)

- SDK upgrade
- Fix failedHomes banner display

## v1.3.1 (Apr 15th, 2022)

- Fix regression in `processTx` function
- Fix fall back on confirmationTime calculation if `confirmAt` value is not available

## v1.3.0 (Apr 15th, 2022)

- Use indexer API to get tx status

## v1.2.2 (Apr 11th, 2022)

- fix, display correct destination address
- "Complete Transfer" CTA animation, increase padding

## v1.2.1 (Apr 7th, 2022)

- add transfer review screen
- allow easy toggle between nomad/connext
- upgrade connext package
- fix connext instantiation in development
- fix hanging on "checking availability"
- fix bug sending native assets
- add transfer alerts
- add link to Bridge Guide
- remove ability to turn off Connext completely
- remove connextPools whitelist of assets (just check liquidity by doing quote)
- update Moonbeam explorer url

## v1.1.1 (Mar 15th, 2022)

- update connext package

## v1.1.0 (Mar 9th, 2022)

- support CQT token in token selection modal

## v1.0.9 (Mar 7th, 2022)

- silence metamask not installed sentry errors
- shows all networks during selection
- adds network connections to config
- updates Moonbase alpha rpc

## v1.0.8 (Feb 7th, 2022)

- add token to metamask from tx details
- network button for native token select
- bump sdk from v1.2.2 -> v1.3.7

## v1.0.7 (Feb 3rd, 2022) [HOTFIX]

- bump sdk from v1.2.5 -> v1.3.2

## v1.0.6 (Jan 28th, 2022)

- fix status poll
- bump sdk from v1.2.4 -> v1.2.5

## v1.0.5 (Jan 24th, 2022)

- add token to metamask from tx details
- support hub and spoke on network select UI
- support 3 testnets

## v1.0.4 (Jan 21st, 2022)

- tweak connext + metamask error handling
- fix twitter meta image

## v1.0.3 (Jan 18th, 2022)

- update copy w/logo, "Checking Connext availability"
- show user's addresses in origin/destination fields
- adds notifications about processing

## v1.0.2 (Jan 14th, 2022)

- process gas notification
- increase send gas limit by 10%
- fix docs link

## v1.0.1 (Jan 13th, 2022)

- adds basic changelog
- bunch of small tx details UI fixes
- adds Nomad section on Bridge UI, updates Connext copy
- adjusts time remaining logic
- style footer logos
- fix unwanted caching by removing service worker
- show more useful error when entering an amount without an asset selected
- split up `Couldn't setup connext` errors to better debug
- changes settings to dropdown, adds "Search transaction" link
- removes "Cancel" button for Connext transactions, expired txs can be handled in Connextscan
- add FRAX and WBTC

## v1.0.0 (Jan 11th, 2022)

- bridge live!
