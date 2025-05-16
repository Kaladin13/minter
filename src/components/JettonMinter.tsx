import { FC, useState } from 'react'
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react'
import { jettonFormSpec } from '../constants/formSpec'
import { JettonFormData } from '../types/minter'
import { DeploymentProgress, DeploymentStep } from './DeploymentProgress'
import { ResultModal } from './ResultModal'
import JettonPreview from './JettonPreview'
import { deployJettonMinter } from '../services/jetton-deployer'
import { DEPLOYMENT_STEPS, StepId } from '@/constants/steps'
import { useNetwork } from '../contexts/NetworkContext'

export const JettonMinter: FC = () => {
  const [formData, setFormData] = useState<JettonFormData>(() => {
    return jettonFormSpec.reduce((acc, field) => {
      if (field.type === 'number') {
        acc[field.name] = field.default ? Number(field.default) : 0
      } else {
        acc[field.name] = field.default || ''
      }
      return acc
    }, {} as JettonFormData)
  })

  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentSteps, setDeploymentSteps] = useState<DeploymentStep[]>([...DEPLOYMENT_STEPS])
  const [currentStepId, setCurrentStepId] = useState<StepId | null>(null)
  const [deploymentResult, setDeploymentResult] = useState<{
    type: 'success' | 'error'
    minterAddress?: string
    error?: string
  } | null>(null)

  const walletAddress = useTonAddress()
  const [tonConnectUI] = useTonConnectUI()
  const { network } = useNetwork()

  const handleInputChange = (name: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const updateStepStatus = (stepId: StepId, status: DeploymentStep['status']) => {
    setDeploymentSteps((steps) =>
      steps.map((step) => (step.id === stepId ? { ...step, status } : step)),
    )
  }

  const handleDeploy = async () => {
    if (!walletAddress || !tonConnectUI) {
      console.error('Wallet not connected')
      return
    }

    setIsDeploying(true)
    setDeploymentSteps([...DEPLOYMENT_STEPS]) // Reset steps
    setDeploymentResult(null)

    try {
      const address = await deployJettonMinter(
        formData,
        tonConnectUI,
        updateStepStatus,
        setCurrentStepId,
        network
      )

      // Wait a bit before showing success to allow seeing the final step
      setTimeout(() => {
        setDeploymentResult({
          type: 'success',
          minterAddress: address,
        })
        setIsDeploying(false)
      }, 1000)
    } catch (error) {
      console.error('Deployment failed:', error)
      setTimeout(() => {
        setDeploymentResult({
          type: 'error',
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        })
        setIsDeploying(false)
      }, 1000)
    }
  }

  const handleCloseResult = () => {
    setDeploymentResult(null)
  }

  return (
    <div className='jetton-minter'>
      <div className='minter-container'>
        <div className='form-section'>
          <h2>Deploy New Jetton</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            {jettonFormSpec.map((field) => (
              <div
                key={field.name}
                className='form-field'
              >
                <label htmlFor={field.name}>
                  {field.label}
                  {field.required && <span className='required'>*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.name}
                    value={formData[field.name] as string}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    required={field.required}
                    placeholder={field.description}
                  />
                ) : (
                  <input
                    type={field.type}
                    id={field.name}
                    value={formData[field.name] as string}
                    onChange={(e) =>
                      handleInputChange(
                        field.name,
                        field.type === 'number' ? Number(e.target.value) : e.target.value,
                      )
                    }
                    required={field.required}
                    placeholder={field.description}
                  />
                )}
                <small className='field-description'>{field.description}</small>
              </div>
            ))}
            <button
              type='button'
              onClick={handleDeploy}
              className='deploy-button'
              disabled={!walletAddress || isDeploying}
            >
              {!walletAddress
                ? 'Connect Wallet to Deploy'
                : isDeploying
                ? 'Deploying...'
                : 'Deploy Jetton'}
            </button>
          </form>
        </div>
        <div className='preview-section'>
          <h3>Preview</h3>
          <JettonPreview formData={formData} />
        </div>
      </div>

      <DeploymentProgress
        isOpen={isDeploying}
        steps={deploymentSteps}
        currentStepId={currentStepId}
      />

      <ResultModal
        isOpen={!!deploymentResult}
        type={deploymentResult?.type || 'error'}
        minterAddress={deploymentResult?.minterAddress}
        error={deploymentResult?.error}
        onClose={handleCloseResult}
      />
    </div>
  )
}

export default JettonMinter
