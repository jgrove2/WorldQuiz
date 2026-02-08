import React from 'react';
import type { NavigationMode } from '../hooks/useNavigation';

interface MobileDrawerProps {
  isOpen: boolean;
  activeMode: NavigationMode;
  onModeChange: (mode: NavigationMode) => void;
  onClose: () => void;
}

interface NavOption {
  id: NavigationMode;
  label: string;
  icon: string;
}

const NAV_OPTIONS: NavOption[] = [
  { id: 'world', label: 'World', icon: '🌍' },
  { id: 'africa', label: 'Africa', icon: '🌍' },
  { id: 'asia', label: 'Asia', icon: '🌍' },
  { id: 'europe', label: 'Europe', icon: '🌍' },
  { id: 'northamerica', label: 'North America', icon: '🌍' },
  { id: 'southamerica', label: 'South America', icon: '🌍' },
  { id: 'oceania', label: 'Oceania', icon: '🌍' },
];

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  activeMode,
  onModeChange,
  onClose,
}) => {
  const handleOptionClick = (mode: NavigationMode) => {
    onModeChange(mode);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay backdrop */}
      <div
        onClick={onClose}
        className="mobile-drawer-overlay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 998,
          animation: 'fadeIn 0.2s ease-out',
        }}
      />

      {/* Drawer panel */}
      <div
        className="mobile-drawer-panel"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '280px',
          maxWidth: '80vw',
          backgroundColor: '#ffffff',
          zIndex: 999,
          overflowY: 'auto',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)',
          animation: 'slideIn 0.25s ease-out',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid #e0e0e0',
          }}
        >
          <div
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#333333',
            }}
          >
            WorldGames
          </div>
          <div
            style={{
              fontSize: '14px',
              color: '#666666',
              marginTop: '4px',
            }}
          >
            Countries Quiz
          </div>
        </div>

        {/* Navigation Options */}
        <nav style={{ padding: '12px 0' }}>
          {NAV_OPTIONS.map((option) => {
            const isActive = option.id === activeMode;

            return (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                className="mobile-drawer-option"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  padding: '16px 20px',
                  fontSize: '16px',
                  fontWeight: isActive ? '600' : '400',
                  color: isActive ? '#333333' : '#666666',
                  backgroundColor: isActive ? '#f5f5f5' : 'transparent',
                  border: 'none',
                  borderLeft: isActive ? '4px solid #4CAF50' : '4px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#fafafa';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span style={{ marginRight: '12px', fontSize: '20px' }}>
                  {option.icon}
                </span>
                <span>{option.label}</span>
                {isActive && (
                  <span style={{ marginLeft: 'auto', color: '#4CAF50' }}>✓</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        /* Touch feedback for mobile drawer options */
        .mobile-drawer-option:active {
          transform: scale(0.98);
          background-color: #eeeeee !important;
        }
      `}</style>
    </>
  );
};
