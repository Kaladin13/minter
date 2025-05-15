import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react'
import { FC, useState } from 'react'

export interface FormField {
  name: string
  label: string
  type: string
  required: boolean
  description: string
  default?: string
}

export const onchainFormSpec: FormField[] = [
  { name: 'name', label: 'Name', type: 'text', required: true, description: 'Token name' },
  { name: 'symbol', label: 'Symbol', type: 'text', required: true, description: 'Token symbol' },
  {
    name: 'decimals',
    label: 'Decimals',
    type: 'number',
    required: true,
    description: 'Token decimals',
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    required: false,
    description: 'Token description',
  },
  {
    name: 'tokenImage',
    label: 'Token Image',
    type: 'url',
    required: false,
    description: 'Token logo URL',
  },
]

const MinterForm: FC = () => {
  const [formData, setFormData] = useState(
    onchainFormSpec.reduce((acc, field) => {
      acc[field.name] = field.default || ''
      return acc
    }, {} as Record<string, any>),
  )

  const walletAddress = useTonAddress()
  const [tonConnectUI] = useTonConnectUI()

  async function deployContract() {
    if (!walletAddress || !tonConnectUI) {
      throw new Error('Wallet not connected')
    }

    const data = formData

    let decimals = data.decimals

    const params = {
      owner: walletAddress,
      onchainMetaData: {
        name: data.name,
        symbol: data.symbol,
        image: data.tokenImage,
        description: data.description,
        decimals: parseInt(decimals).toFixed(0),
      },
      offchainUri: data.offchainUri,
      amountToMint: 10000,
    }

    const deployParams = createDeployParams(params, data.offchainUri)
    const contractAddress = new ContractDeployer().addressForContract(deployParams)

    try {
      await tonConnectUI.sendTransaction({
        validUntil: Date.now() + 5 * 60 * 1000,
        messages: [],
      })

      const result = await jettonDeployController.createJetton(params, tonConnectUI, walletAddress)
      analytics.sendEvent(
        AnalyticsCategory.DEPLOYER_PAGE,
        AnalyticsAction.DEPLOY,
        contractAddress.toFriendly(),
      )

      navigate(`${ROUTES.jetton}/${Address.normalize(result)}`)
    } catch (err) {
      if (err instanceof Error) {
        showNotification(<>{err.message}</>, 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDeploy = () => {
    console.log('Deploying with data:', formData)
  }

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        className='preview'
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          border: '2px solid #ccc',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor: '#f9f9f9',
        }}
      >
        <MinterPreview formData={formData} />
      </div>
      <div
        className='fields-preview'
        style={{
          position: 'absolute',
          top: '1rem',
          right: '180px',
          maxWidth: '200px',
          backgroundColor: '#333', // Darker background
          color: '#fff', // Contrasting text color
          border: '1px solid #444',
          borderRadius: '8px',
          padding: '1rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
        }}
      >
        <h4 style={{ marginBottom: '0.5rem', color: '#fff' }}>Fields Preview</h4>
        {Object.entries(formData).map(([key, value]) => (
          <p
            key={key}
            style={{ fontSize: '0.9rem', margin: '0.2rem 0', color: '#ddd' }}
          >
            <strong>{key}:</strong> {value}
          </p>
        ))}
      </div>
      <form
        style={{
          marginTop: 'auto',
          marginBottom: 'auto',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center',
        }}
      >
        {onchainFormSpec.map((field) => (
          <div
            key={field.name}
            style={{ marginBottom: '1rem' }}
          >
            <label>
              {field.label}
              <input
                type={field.type}
                value={formData[field.name]}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                required={field.required}
                placeholder={field.description}
                style={{
                  display: 'block',
                  marginTop: '0.5rem',
                  marginBottom: '0.5rem',
                  width: '100%',
                }}
              />
            </label>
            <p style={{ marginTop: '0.5rem' }}>{field.description}</p>
          </div>
        ))}
        <button
          type='button'
          onClick={handleDeploy}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Deploy
        </button>
      </form>
    </div>
  )
}

const MinterPreview: FC<{ formData: Record<string, any> }> = ({ formData }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      {formData.tokenImage ? (
        <img
          src={formData.tokenImage}
          alt='Token Logo'
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <p style={{ fontSize: '0.8rem', color: '#666' }}>No Image</p>
      )}
    </div>
  )
}

export { MinterForm }
