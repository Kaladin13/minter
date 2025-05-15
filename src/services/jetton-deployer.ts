import { JettonFormData } from '@/types/minter'
import { SendTransactionRequest, TonConnectUI } from '@tonconnect/ui-react'
import { getTonClient } from './client'
import { Address, beginCell, storeStateInit, toNano } from '@ton/ton'
import { JettonMinter, storeMint } from './wrappers/Jetton_JettonMinter'
import { waitForContractDeploy } from './utils'
import { buildOnchainMetadata } from './jetton-helpers'

const deployTonAmount = toNano('0.1') // 0.1 TON

export const deployJettonMinter = async (data: JettonFormData, provider: TonConnectUI) => {
  const client = await getTonClient()

  const deployerAddress = Address.parse(provider.account!.address)

  const balance = await client.getBalance(deployerAddress)

  // TODO: check if the balance is enough to deploy the jetton minter (by version)
  if (balance < deployTonAmount) {
    throw new Error('Insufficient balance')
  }

  // TODO: create onchain content cell from the form data
  const onchainContentCell = buildOnchainMetadata(data)

  const minter = await JettonMinter.fromInit(0n, deployerAddress, onchainContentCell, true)

  if (await client.isContractDeployed(minter.address)) {
    // Show modal that the contract is already deployed
    throw new Error('Contract already deployed')
  }

  const stateInitCell = beginCell().store(storeStateInit(minter.init!)).endCell()

  // TODO: get mint amount from the form data
  const initialMintAmount = 1337n * BigInt(10 ** data.decimals)

  const mintMessageCell = beginCell()
    .store(
      storeMint({
        $$type: 'Mint',
        queryId: 0n,
        receiver: deployerAddress,
        tonAmount: 0n,
        mintMessage: {
          $$type: 'JettonTransferInternal',
          queryId: 0n,
          amount: initialMintAmount,
          forwardTonAmount: 0n,
          forwardPayload: beginCell().storeBit(false).endCell().asSlice(),
          responseDestination: deployerAddress,
          sender: minter.address,
        },
      }),
    )
    .endCell()

  const deployTx: SendTransactionRequest = {
    validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes
    messages: [
      {
        address: minter.address.toString(),
        amount: deployTonAmount.toString(), // 0.1 TON
        stateInit: stateInitCell.toBoc().toString('base64'),
        payload: mintMessageCell.toBoc().toString('base64'),
      },
    ],
  }

  // TODO: check ton connect send options
  await provider.sendTransaction(deployTx)
  console.log(`sended tx`)

  // TODO: check seqno to show steps

  // TODO: show loading spinner while at this
  await waitForContractDeploy(minter.address, client)
  console.log(`deployed minter`)

  const deployerJettonWalletAddress = await minter.getGetWalletAddress(
    client.provider(minter.address),
    deployerAddress,
  )

  // and await last step, mint tx from minter to jetton wallet
  await waitForContractDeploy(deployerJettonWalletAddress, client)
  console.log(`deployed wallet`)

  return minter.address
}
