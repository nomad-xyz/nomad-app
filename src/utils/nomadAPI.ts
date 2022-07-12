import { request, gql } from 'graphql-request'
import { nomadAPI } from '@/config'

export type IndexerTx = {
  origin: number
  destination: number
  leafIndex: string
  sender: string
  state: number
  dispatchedAt: number
  updatedAt: number
  relayedAt: number
  processedAt: number
  receivedAt: number
  dispatchTx: string
  amount: string
  decimals: number
  tokenDomain: number
  tokenId: string
  confirmAt: number
}

export async function getUserHistory(
  domains: number[],
  address: string,
  page: number,
  size: number
): Promise<Array<IndexerTx>> {
  const skip = size * (page - 1)
  const variables = JSON.stringify({
    where: {
      destination: {
        in: domains,
      },
      origin: {
        in: domains,
      },
      tokenDomain: {
        in: domains,
      },
      OR: [
        {
          recipient: {
            equals: address,
          },
        },
        {
          sender: {
            equals: address,
          },
        },
      ],
    },
  })
  const query = gql`
    query Query($where: MessagesWhereInput) {
      findManyMessages(where: $where, take: ${size}, skip: ${skip}) {
        id
        messageHash
        origin
        destination
        nonce
        internalSender
        internalRecipient
        msgType
        root
        state
        dispatchBlock
        dispatchedAt
        updatedAt
        relayedAt
        receivedAt
        processedAt
        confirmAt
        sender
        recipient
        amount
        allowFast
        detailsHash
        tokenDomain
        tokenId
        body
        leafIndex
        dispatchTx
        gasAtDispatch
        gasAtUpdate
        gasAtRelay
        gasAtReceive
        gasAtProcess
        sent
        updated
        relayed
        received
        processed
        createdAt
      }
    }`
  return await request(`${nomadAPI}graphql`, query, variables).then(
    (res) => res.findManyMessages
  )
}

export async function getTx(txID: string): Promise<IndexerTx> {
  const variables = JSON.stringify({
    where: {
      dispatchTx: {
        equals: txID,
      },
    },
  })
  const query = gql`
    query Query($where: MessagesWhereInput) {
      findFirstMessages(where: $where) {
        id
        messageHash
        origin
        destination
        nonce
        internalSender
        internalRecipient
        msgType
        root
        state
        dispatchBlock
        dispatchedAt
        updatedAt
        relayedAt
        receivedAt
        processedAt
        confirmAt
        sender
        recipient
        amount
        allowFast
        detailsHash
        tokenDomain
        tokenId
        body
        leafIndex
        dispatchTx
        gasAtDispatch
        gasAtUpdate
        gasAtRelay
        gasAtReceive
        gasAtProcess
        sent
        updated
        relayed
        received
        processed
        createdAt
      }
    }
  `
  return await request(`${nomadAPI}graphql`, query, variables).then(
    async (res) => {
      // const tx = (await res.data)
      console.log(`result: ${JSON.stringify(res)}`)
      return res.findFirstMessages
    }
  )
}
