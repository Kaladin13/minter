import { FC } from 'react'
import './DeploymentProgress.css'

export interface DeploymentStep {
  id: string
  label: string
  status: 'pending' | 'loading' | 'success' | 'error'
}

interface DeploymentProgressProps {
  isOpen: boolean
  steps: DeploymentStep[]
  currentStepId: string | null
}

export const DeploymentProgress: FC<DeploymentProgressProps> = ({
  isOpen,
  steps,
  currentStepId,
}) => {
  if (!isOpen) return null

  return (
    <div className='modal-overlay'>
      <div className='modal-content'>
        <div className='spinner-container'>
          {currentStepId && (
            <div className='spinner'>
              <div className='spinner-ring'></div>
            </div>
          )}
        </div>
        <div className='steps-container'>
          {steps.map((step) => (
            <div
              key={step.id}
              className={`step ${
                step.status === 'success'
                  ? 'success'
                  : step.status === 'loading'
                  ? 'loading'
                  : step.status === 'error'
                  ? 'error'
                  : ''
              }`}
            >
              <div className='step-status'>
                {step.status === 'success' ? (
                  <svg
                    viewBox='0 0 24 24'
                    fill='none'
                    className='check-icon'
                  >
                    <path
                      d='M20 6L9 17L4 12'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                ) : step.status === 'error' ? (
                  <svg
                    viewBox='0 0 24 24'
                    fill='none'
                    className='error-icon'
                  >
                    <path
                      d='M18 6L6 18M6 6L18 18'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                ) : step.status === 'loading' ? (
                  <div className='step-spinner'></div>
                ) : (
                  <div className='step-dot'></div>
                )}
              </div>
              <div className='step-label'>{step.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
