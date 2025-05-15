import { FC, useState } from 'react'
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react'
import { jettonFormSpec } from '../constants/formSpec'
import { JettonFormData } from '../types/minter'
import JettonPreview from './JettonPreview'

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

  const walletAddress = useTonAddress()
  const [tonConnectUI] = useTonConnectUI()

  const handleInputChange = (name: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDeploy = async () => {
    if (!walletAddress || !tonConnectUI) {
      console.error('Wallet not connected')
      return
    }

    // For now, just log the data
    console.log('Deploying Jetton with data:', {
      formData,
      walletAddress,
    })
  }

  return (
    <div className="jetton-minter">
      <div className="minter-container">
        <div className="form-section">
          <h2>Deploy New Jetton</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            {jettonFormSpec.map((field) => (
              <div key={field.name} className="form-field">
                <label htmlFor={field.name}>
                  {field.label}
                  {field.required && <span className="required">*</span>}
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
                        field.type === 'number' ? Number(e.target.value) : e.target.value
                      )
                    }
                    required={field.required}
                    placeholder={field.description}
                  />
                )}
                <small className="field-description">{field.description}</small>
              </div>
            ))}
            <button
              type="button"
              onClick={handleDeploy}
              className="deploy-button"
              disabled={!walletAddress}
            >
              {walletAddress ? 'Deploy Jetton' : 'Connect Wallet to Deploy'}
            </button>
          </form>
        </div>
        <div className="preview-section">
          <h3>Preview</h3>
          <JettonPreview formData={formData} />
        </div>
      </div>
    </div>
  )
}

export default JettonMinter 