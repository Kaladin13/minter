import { FC, useState } from 'react';

export interface JettonFeatures {
  mintable: boolean;
  burnable: boolean;
  sharded: boolean;
  onchainApi: boolean;
  jettonSendMode: boolean;
  governance: boolean;
}

export const defaultFeatures: JettonFeatures = {
  mintable: true,
  burnable: false,
  sharded: true,
  onchainApi: false,
  jettonSendMode: false,
  governance: false,
};

interface JettonFeatureSelectorProps {
  features: JettonFeatures;
  onChange: (features: JettonFeatures) => void;
}

export const JettonFeatureSelector: FC<JettonFeatureSelectorProps> = ({ features, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleFeatureToggle = (feature: keyof JettonFeatures, e?: React.MouseEvent) => {
    e?.stopPropagation(); // Prevent event bubbling
    onChange({
      ...features,
      [feature]: !features[feature],
    });
  };

  const featuresList = [
    {
      id: 'mintable',
      label: 'Mintable',
      description: 'Allow minting of new tokens after deployment',
    },
    {
      id: 'burnable',
      label: 'Burnable',
      description: 'Allow token holders to burn their tokens',
    },
    {
      id: 'sharded',
      label: 'Sharded',
      description: 'Enable sharding for high-load jettons',
    },
    {
      id: 'onchainApi',
      label: 'On-chain API',
      description: 'Enable on-chain API for smart contract interactions',
    },
    {
      id: 'jettonSendMode',
      label: 'Jetton Send Mode',
      description: 'Configure custom send modes for jetton transfers',
    },
    {
      id: 'governance',
      label: 'Governance',
      description: 'Enable DAO-like governance mechanics',
    },
  ] as const;

  return (
    <div className="jetton-feature-selector">
      <div 
        className="feature-header-main"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3>Features</h3>
        <button 
          className={`expand-button ${isExpanded ? 'expanded' : ''}`}
          aria-label={isExpanded ? 'Collapse features' : 'Expand features'}
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M3.5 6L8 10.5L12.5 6" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <div className={`features-grid ${isExpanded ? 'expanded' : ''}`}>
        {featuresList.map(({ id, label, description }) => (
          <div
            key={id}
            className={`feature-item ${features[id as keyof JettonFeatures] ? 'selected' : ''}`}
            onClick={(e) => handleFeatureToggle(id as keyof JettonFeatures, e)}
          >
            <div className="feature-header">
              <span className="feature-label">{label}</span>
              <div 
                className="feature-toggle"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFeatureToggle(id as keyof JettonFeatures);
                }}
              >
                <input
                  type="checkbox"
                  checked={features[id as keyof JettonFeatures]}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleFeatureToggle(id as keyof JettonFeatures);
                  }}
                  id={`feature-${id}`}
                />
                <label 
                  htmlFor={`feature-${id}`} 
                  className="toggle-label"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <p className="feature-description">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JettonFeatureSelector; 