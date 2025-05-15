import { Address, beginCell, storeStateInit, toNano } from '@ton/core'
import { JettonFormData } from '../types/minter'
import { SendTransactionRequest, TonConnectUI } from '@tonconnect/ui-react'
import { getTonClient } from './client'
import { buildOnchainMetadata } from './jetton-helpers'
import { JettonMinter, storeMint } from './wrappers/Jetton_JettonMinter'
import { waitForContractDeploy } from './utils'

type UpdateStepStatus = (stepId: string, status: 'pending' | 'loading' | 'success' | 'error') => void
type SetCurrentStep = (stepId: string | null) => void

export const deployJettonMinter = async (
  data: JettonFormData,
  provider: TonConnectUI,
  updateStepStatus: UpdateStepStatus,
  setCurrentStep: SetCurrentStep
): Promise<string> => {
  // eslint-disable-next-line no-useless-catch
  try {
    // External step - Preparation
    setCurrentStep('external')
    updateStepStatus('external', 'loading')

    const client = await getTonClient()
    const deployerAddress = Address.parse(provider.account!.address)
    const balance = await client.getBalance(deployerAddress)
    const deployTonAmount = toNano('0.1') // 0.1 TON

    if (balance < deployTonAmount) {
      throw new Error('Insufficient balance')
    }

    const onchainContentCell = buildOnchainMetadata(data)
    const minter = await JettonMinter.fromInit(0n, deployerAddress, onchainContentCell, true)

    if (await client.isContractDeployed(minter.address)) {
      throw new Error('Contract already deployed')
    }

    updateStepStatus('external', 'success')

    // Deploy step
    setCurrentStep('deploy')
    updateStepStatus('deploy', 'loading')

    const stateInitCell = beginCell().store(storeStateInit(minter.init!)).endCell()
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
          amount: deployTonAmount.toString(),
          stateInit: stateInitCell.toBoc().toString('base64'),
          payload: mintMessageCell.toBoc().toString('base64'),
        },
      ],
    }

    await provider.sendTransaction(deployTx)
    await waitForContractDeploy(minter.address, client)
    
    updateStepStatus('deploy', 'success')

    // Mint step
    setCurrentStep('mint')
    updateStepStatus('mint', 'loading')

    const deployerJettonWalletAddress = await minter.getGetWalletAddress(
      client.provider(minter.address),
      deployerAddress,
    )

    await waitForContractDeploy(deployerJettonWalletAddress, client)
    
    updateStepStatus('mint', 'success')

    return minter.address.toString()
  } catch (error) {
    // The current step will be marked as error by the component
    throw error
  }
}
