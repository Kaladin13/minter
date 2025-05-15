import { FC, useEffect, useState } from 'react'
import './ResultModal.css'

interface ResultModalProps {
  isOpen: boolean
  type: 'success' | 'error'
  minterAddress?: string
  error?: string
  onClose: () => void
}

export const ResultModal: FC<ResultModalProps> = ({
  isOpen,
  type,
  minterAddress,
  error,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Delay visibility for animation
      const timer = setTimeout(() => setIsVisible(true), 50)
      return () => clearTimeout(timer)
    }
    setIsVisible(false)
  }, [isOpen])

  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className={`result-modal-overlay ${isVisible ? 'visible' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className={`result-modal-content ${isVisible ? 'visible' : ''}`}>
        <button
          className='close-button'
          onClick={onClose}
        >
          <svg
            viewBox='0 0 24 24'
            fill='none'
            className='close-icon'
          >
            <path
              d='M18 6L6 18M6 6L18 18'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>

        <div className='result-icon'>
          {type === 'success' ? (
            <svg
              viewBox='0 0 24 24'
              fill='none'
              className='success-icon'
            >
              <path
                d='M20 6L9 17L4 12'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          ) : (
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
          )}
        </div>

        <h3>{type === 'success' ? 'Deployment Successful' : 'Deployment Failed'}</h3>

        {type === 'success' && minterAddress && (
          <div className='address-container'>
            <p className='label'>Minter Address:</p>
            <div className='address'>
              <code>{minterAddress}</code>
              <a
                href={`https://testnet.tonviewer.com/${minterAddress}`}
                target='_blank'
                rel='noopener noreferrer'
                className='view-link'
              >
                View in Explorer
                <svg
                  viewBox='0 0 24 24'
                  fill='none'
                  className='external-link-icon'
                >
                  <path
                    d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </a>
            </div>
          </div>
        )}

        {type === 'error' && error && (
          <div className='error-container'>
            <p className='label'>Error:</p>
            <code className='error-message'>{error}</code>
          </div>
        )}
      </div>
    </div>
  )
}
