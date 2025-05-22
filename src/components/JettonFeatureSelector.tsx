import { FC } from 'react';
import { JettonFeatures, featuresList, FeatureId } from '../constants/features';

interface JettonFeatureSelectorProps {
  features: JettonFeatures;
  onChange: (features: JettonFeatures) => void;
}

export const JettonFeatureSelector: FC<JettonFeatureSelectorProps> = ({ features, onChange }) => {
  const handleFeatureToggle = (feature: FeatureId, e?: React.MouseEvent) => {
    e?.stopPropagation(); // Prevent event bubbling
    onChange({
      ...features,
      [feature]: !features[feature],
    });
  };

  const handleTooltipClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="features-grid">
      {featuresList.map(({ id, label, description, infoText }) => (
        <div
          key={id}
          className={`feature-item ${features[id] ? 'selected' : ''}`}
          onClick={(e) => handleFeatureToggle(id, e)}
        >
          <div className="feature-header">
            <span className="feature-label">
              {label}
              {infoText && (
                <span className="info-icon">
                  ℹ
                  <span 
                    className="info-tooltip"
                    onClick={handleTooltipClick}
                  >
                    {infoText.text}{' '}
                    <a 
                      href={infoText.linkUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {infoText.linkText}
                    </a>
                  </span>
                </span>
              )}
            </span>
            <div 
              className="feature-toggle"
              onClick={(e) => {
                e.stopPropagation();
                handleFeatureToggle(id);
              }}
            >
              <input
                type="checkbox"
                checked={features[id]}
                onChange={(e) => {
                  e.stopPropagation();
                  handleFeatureToggle(id);
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
  );
};

export default JettonFeatureSelector; 