import { useState } from 'react';
import { SettingsDropdown } from './SettingsDropdown';
import type { GlobeResolution, GlobeQuality } from '../hooks/useSettings';

interface SettingsButtonProps {
  resolution: GlobeResolution;
  onResolutionChange: (value: GlobeResolution) => void;
  quality: GlobeQuality;
  onQualityChange: (value: GlobeQuality) => void;
}

export const SettingsButton: React.FC<SettingsButtonProps> = ({
  resolution,
  onResolutionChange,
  quality,
  onQualityChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const showBadge = resolution !== 'auto' || quality !== 'medium';

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: '#ffffff',
          border: '2px solid #cccccc',
          borderRadius: '8px',
          padding: '10px 12px',
          cursor: 'pointer',
          fontSize: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
          position: 'relative',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#999999';
          e.currentTarget.style.backgroundColor = '#f9f9f9';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#cccccc';
          e.currentTarget.style.backgroundColor = '#ffffff';
        }}
        aria-label="Settings"
      >
        ⚙️
        {/* Badge indicator for non-default settings */}
        {showBadge && (
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '10px',
              height: '10px',
              backgroundColor: '#fbbf24',
              borderRadius: '50%',
              border: '2px solid #ffffff',
            }}
          />
        )}
      </button>

      {isOpen && (
        <SettingsDropdown
          resolution={resolution}
          onResolutionChange={onResolutionChange}
          quality={quality}
          onQualityChange={onQualityChange}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
