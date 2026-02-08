import React from 'react';
import { HamburgerButton } from './HamburgerButton';
import type { NavigationMode } from '../hooks/useNavigation';

interface HeaderProps {
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  activeMode: NavigationMode;
  onModeChange: (mode: NavigationMode) => void;
  children?: React.ReactNode;
}

interface NavTab {
  id: NavigationMode;
  label: string;
}

const NAV_TABS: NavTab[] = [
  { id: 'world', label: 'World' },
  { id: 'africa', label: 'Africa' },
  { id: 'asia', label: 'Asia' },
  { id: 'europe', label: 'Europe' },
  { id: 'northamerica', label: 'North America' },
  { id: 'southamerica', label: 'South America' },
  { id: 'oceania', label: 'Oceania' },
];

export const Header: React.FC<HeaderProps> = ({ 
  isMenuOpen, 
  onMenuToggle, 
  activeMode, 
  onModeChange,
  children 
}) => {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        gap: '16px',
      }}
    >
      {/* Left side: Hamburger button (mobile) or Logo (desktop) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            display: 'none',
          }}
          className="mobile-only"
        >
          <HamburgerButton isOpen={isMenuOpen} onClick={onMenuToggle} />
        </div>

        {/* Logo/Title */}
        <div
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#333333',
            whiteSpace: 'nowrap',
          }}
          className="desktop-only"
        >
          WorldGames
        </div>
      </div>

      {/* Center: Navigation tabs (desktop only) */}
      <nav
        className="header-navigation desktop-only"
        style={{
          display: 'none',
          flex: 1,
          justifyContent: 'center',
          gap: '4px',
          overflowX: 'auto',
          padding: '0 4px',
        }}
      >
        {NAV_TABS.map((tab) => {
          const isActive = tab.id === activeMode;
          
          return (
            <button
              key={tab.id}
              onClick={() => onModeChange(tab.id)}
              className="nav-tab"
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: isActive ? '600' : '400',
                color: isActive ? '#4CAF50' : '#666666',
                background: isActive ? '#f0f8ff' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = '#fafafa';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Right side: Settings or other actions */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {children}
      </div>

      {/* Inline media query styles */}
      <style>{`
        .nav-tab:active {
          transform: scale(0.97);
        }

        @media (max-width: 768px) {
          .mobile-only {
            display: flex !important;
          }
          .desktop-only {
            display: none !important;
          }
        }

        @media (min-width: 769px) {
          .mobile-only {
            display: none !important;
          }
          .desktop-only {
            display: flex !important;
          }
        }

        /* Custom scrollbar for navigation */
        .header-navigation::-webkit-scrollbar {
          height: 4px;
        }
        .header-navigation::-webkit-scrollbar-track {
          background: transparent;
        }
        .header-navigation::-webkit-scrollbar-thumb {
          background: #e0e0e0;
          border-radius: 2px;
        }
        .header-navigation::-webkit-scrollbar-thumb:hover {
          background: #cccccc;
        }
      `}</style>
    </header>
  );
};
