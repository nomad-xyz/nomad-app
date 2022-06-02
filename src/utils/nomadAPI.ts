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

export async function getUserHistory(page: number, size: number): Promise<Array<IndexerTx>> {
  const skip = size * (page - 1)
  const variables = JSON.stringify({
    where: {
      OR: [
        {
          recipient: {
            equals: "0x9791c9dF02D34F2e7d7322D655535d9849E8da5c"
          },
          sender: {
            equals: "0x9791c9dF02D34F2e7d7322D655535d9849E8da5c"
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

// async getHistory(page?: number) {
//   const pageNum = page || this.page
//   if (this.address) {
//     const variables = JSON.stringify({
//       where: {
//         OR: [
//           {
//             recipient: {
//               equals: "0x9791c9dF02D34F2e7d7322D655535d9849E8da5c"
//             },
//             sender: {
//               equals: "0x9791c9dF02D34F2e7d7322D655535d9849E8da5c"
//             }
//           }
//         ]
//       }
//     })
//     const query = gql`
//       query Query($where: MessagesWhereInput) {
//         findManyMessages(where: $where, take: ${this.size}, skip: ${this.size * (pageNum - 1)}) {
//           id
//           messageHash
//           origin
//           destination
//           nonce
//           internalSender
//           internalRecipient
//           msgType
//           root
//           state
//           dispatchBlock
//           dispatchedAt
//           updatedAt
//           relayedAt
//           receivedAt
//           processedAt
//           confirmAt
//           sender
//           recipient
//           amount
//           allowFast
//           detailsHash
//           tokenDomain
//           tokenId
//           body
//           leafIndex
//           tx
//           gasAtDispatch
//           gasAtUpdate
//           gasAtRelay
//           gasAtReceive
//           gasAtProcess
//           sent
//           updated
//           relayed
//           received
//           processed
//           createdAt
//         }
//       }`
//     request({
//       url: `${nomadAPI}graphql`,
//       document: query,
//       variables: variables,
//     }).then(async(res) => {
//       const data = res.findManyMessages
//       if (!data.length) {
//         this.pageCount = pageNum
//         return
//       }
//       this.history = data
//       this.page = pageNum
//     })
//   }
// },