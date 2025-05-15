import { Address, TonClient } from '@ton/ton'

async function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

export async function waitForContractDeploy(address: Address, client: TonClient) {
  let isDeployed = false
  let maxTries = 25
  while (!isDeployed && maxTries > 0) {
    maxTries--
    isDeployed = await client.isContractDeployed(address)
    if (isDeployed) return
    await sleep(3000)
  }

  throw new Error('Timeout')
}
