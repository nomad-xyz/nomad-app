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
  tx: string
  amount: string
  tokenDomain: number
  tokenId: string
  confirmAt: number
}

export async function getUserHistory(address: string, page: number, size: number): Promise<Array<IndexerTx>> {
  const skip = size * (page - 1)
  const variables = JSON.stringify({
    where: {
      OR: [
        {
          recipient: {
            equals: address
          },
          sender: {
            equals: address
          }
        }
      ]
    }
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
        tx
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
  return await request({
    url: `${nomadAPI}graphql`,
    document: query,
    variables: variables,
  }).then((res) => res.findManyMessages)
}
