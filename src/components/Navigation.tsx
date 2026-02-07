import type { NavigationMode } from '../hooks/useNavigation';

interface NavigationProps {
  activeMode: NavigationMode;
  onModeChange: (mode: NavigationMode) => void;
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

export const Navigation: React.FC<NavigationProps> = ({ activeMode, onModeChange }) => {
  return (
    <nav
      style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        padding: '0 4px',
        marginBottom: '24px',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {NAV_TABS.map((tab) => {
        const isActive = tab.id === activeMode;
        
        return (
          <button
            key={tab.id}
            onClick={() => onModeChange(tab.id)}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: isActive ? '600' : '400',
              color: isActive ? '#333333' : '#666666',
              background: isActive ? '#ffffff' : 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
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
  );
};
