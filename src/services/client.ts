import { getHttpEndpoint } from '@orbs-network/ton-access'
import { TonClient } from '@ton/ton'

export const getTonClient = async () => {
  const network = 'testnet' // add change network functionality

  const endpoint = await getHttpEndpoint({
    network,
  })

  return new TonClient({
    endpoint,
  })
}
