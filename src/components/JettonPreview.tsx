import { FC } from 'react'
import { JettonFormData } from '../types/minter'

interface PreviewProps {
  formData: JettonFormData
}

export const JettonPreview: FC<PreviewProps> = ({ formData }) => {
  const imageUrl = formData.image ? `${formData.image}&t=${Date.now()}` : null

  return (
    <div className='jetton-preview'>
      <div className='preview-image'>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${formData.name} logo`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%',
            }}
          />
        ) : (
          <div className='no-image'>
            <span>{formData.symbol?.[0] || '?'}</span>
          </div>
        )}
      </div>
      <div className='preview-info'>
        <h4>{formData.name || 'Token Name'}</h4>
        <p>{formData.symbol || 'SYMBOL'}</p>
        <small>Decimals: {formData.decimals || '9'}</small>
      </div>
    </div>
  )
}

export default JettonPreview
