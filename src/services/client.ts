import { getHttpEndpoint } from '@orbs-network/ton-access'
import { TonClient } from '@ton/ton'
import { Network } from '../components/NetworkSwitcher'

export const getTonClient = async (network: Network) => {
  const endpoint = await getHttpEndpoint({
    network,
  })

  return new TonClient({
    endpoint,
  })
}
