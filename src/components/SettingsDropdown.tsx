import type { GlobeResolution } from '../hooks/useSettings';

interface SettingsDropdownProps {
  resolution: GlobeResolution;
  onResolutionChange: (value: GlobeResolution) => void;
  onClose: () => void;
}

export const SettingsDropdown: React.FC<SettingsDropdownProps> = ({
  resolution,
  onResolutionChange,
  onClose,
}) => {
  const handleOptionClick = (value: GlobeResolution) => {
    onResolutionChange(value);
    // Auto-close after selection
    setTimeout(() => onClose(), 300);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 998,
        }}
        onClick={onClose}
      />

      {/* Dropdown Panel */}
      <div
        style={{
          position: 'absolute',
          top: '50px',
          right: '0',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          padding: '20px',
          minWidth: '320px',
          zIndex: 999,
        }}
      >
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#333333', fontWeight: '600' }}>
          Globe Resolution
        </h3>

        {/* Auto Option */}
        <label
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            padding: '12px',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: resolution === 'auto' ? '#f0f9ff' : 'transparent',
            border: resolution === 'auto' ? '2px solid #2ecc71' : '2px solid transparent',
            marginBottom: '10px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (resolution !== 'auto') {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
            }
          }}
          onMouseLeave={(e) => {
            if (resolution !== 'auto') {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <input
            type="radio"
            name="resolution"
            value="auto"
            checked={resolution === 'auto'}
            onChange={() => handleOptionClick('auto')}
            style={{ marginRight: '12px', marginTop: '3px', cursor: 'pointer' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '600', color: '#333333', marginBottom: '4px' }}>
              Auto (Recommended)
            </div>
            <div style={{ fontSize: '13px', color: '#666666', lineHeight: '1.4' }}>
              Fast loading, automatically upgrades to high-res in background
            </div>
          </div>
        </label>

        {/* Low-res Only Option */}
        <label
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            padding: '12px',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: resolution === 'low-only' ? '#f0f9ff' : 'transparent',
            border: resolution === 'low-only' ? '2px solid #2ecc71' : '2px solid transparent',
            marginBottom: '10px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (resolution !== 'low-only') {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
            }
          }}
          onMouseLeave={(e) => {
            if (resolution !== 'low-only') {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <input
            type="radio"
            name="resolution"
            value="low-only"
            checked={resolution === 'low-only'}
            onChange={() => handleOptionClick('low-only')}
            style={{ marginRight: '12px', marginTop: '3px', cursor: 'pointer' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '600', color: '#333333', marginBottom: '4px' }}>
              Low Resolution Only
            </div>
            <div style={{ fontSize: '13px', color: '#666666', lineHeight: '1.4' }}>
              Faster, but small countries won't be visible
            </div>
            <div style={{ fontSize: '12px', color: '#f59e0b', marginTop: '4px' }}>
              ⚠️ Vatican, Malta, Monaco, and other tiny countries not shown
            </div>
          </div>
        </label>

        {/* High-res Only Option */}
        <label
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            padding: '12px',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: resolution === 'high-only' ? '#f0f9ff' : 'transparent',
            border: resolution === 'high-only' ? '2px solid #2ecc71' : '2px solid transparent',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (resolution !== 'high-only') {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
            }
          }}
          onMouseLeave={(e) => {
            if (resolution !== 'high-only') {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <input
            type="radio"
            name="resolution"
            value="high-only"
            checked={resolution === 'high-only'}
            onChange={() => handleOptionClick('high-only')}
            style={{ marginRight: '12px', marginTop: '3px', cursor: 'pointer' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '600', color: '#333333', marginBottom: '4px' }}>
              High Resolution Only
            </div>
            <div style={{ fontSize: '13px', color: '#666666', lineHeight: '1.4' }}>
              Best detail, includes all small countries (3 MB download)
            </div>
          </div>
        </label>
      </div>
    </>
  );
};
