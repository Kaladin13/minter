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

  return (
    <div className="features-grid">
      {featuresList.map(({ id, label, description }) => (
        <div
          key={id}
          className={`feature-item ${features[id] ? 'selected' : ''}`}
          onClick={(e) => handleFeatureToggle(id, e)}
        >
          <div className="feature-header">
            <span className="feature-label">{label}</span>
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