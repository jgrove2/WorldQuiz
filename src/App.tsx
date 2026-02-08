import { Suspense, lazy, useEffect, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCountryQuiz } from './hooks/useCountryQuiz';
import { useSettings } from './hooks/useSettings';
import { useMobileMenu } from './hooks/useMobileMenu';
import { Counter } from './components/Counter';
import { CountryInput } from './components/CountryInput';
import { Header } from './components/Header';
import { MobileDrawer } from './components/MobileDrawer';
import { GlobeCard } from './components/GlobeCard';
import { SettingsButton } from './components/SettingsButton';
import { CountryList } from './components/CountryList';
import { countries, type Continent } from './data/countries';
import { getCountriesByContinent } from './data/continents';
import type { NavigationMode, GameMode } from './hooks/useNavigation';
import './App.css';

// Optimization 5: Lazy load Globe component (saves ~2MB on initial load)
const GlobeComponent = lazy(() => import('./components/Globe'));

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

// Loading skeleton for Globe
function GlobeLoadingSkeleton() {
  return (
    <div style={{
      width: '100%',
      height: '600px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#666666',
      fontSize: '18px',
    }}>
      <div>Loading globe visualization...</div>
    </div>
  );
}

// Helper function to convert NavigationMode to Continent
const modeToContinent = (mode: NavigationMode): Continent | null => {
  switch (mode) {
    case 'africa':
      return 'Africa';
    case 'asia':
      return 'Asia';
    case 'europe':
      return 'Europe';
    case 'northamerica':
      return 'North America';
    case 'southamerica':
      return 'South America';
    case 'oceania':
      return 'Oceania';
    case 'world':
      return null;
    default:
      return null;
  }
};

interface AppProps {
  activeMode: NavigationMode;
  setMode: (mode: NavigationMode) => void;
}

function App({ activeMode, setMode }: AppProps) {
  // Derive continent and game mode from activeMode
  const selectedContinent = modeToContinent(activeMode);
  const gameMode: GameMode = activeMode === 'world' ? 'world' : 'continent';

  // Mobile menu state
  const { isOpen: isMobileMenuOpen, toggle: toggleMobileMenu, close: closeMobileMenu } = useMobileMenu();

  // Settings state (resolution and quality preferences)
  const { resolution, updateResolution, quality, updateQuality } = useSettings();

  // Quiz state with continent filtering
  const { guessedCountryCodes, guessedCount, totalCountries, handleGuess, resetQuiz } = useCountryQuiz({
    gameMode,
    selectedContinent,
  });

  // Reset quiz whenever the mode changes
  useEffect(() => {
    resetQuiz();
  }, [activeMode, resetQuiz]);

  // Update page title based on active mode
  useEffect(() => {
    const titles: Record<NavigationMode, string> = {
      world: 'WorldGames - Countries Quiz',
      africa: 'Africa - Countries Quiz | WorldGames',
      asia: 'Asia - Countries Quiz | WorldGames',
      europe: 'Europe - Countries Quiz | WorldGames',
      northamerica: 'North America - Countries Quiz | WorldGames',
      southamerica: 'South America - Countries Quiz | WorldGames',
      oceania: 'Oceania - Countries Quiz | WorldGames',
    };
    document.title = titles[activeMode];
  }, [activeMode]);

  // Calculate the list of countries for the current game mode
  const currentCountries = useMemo(() => {
    if (gameMode === 'world' || !selectedContinent) {
      return countries;
    }
    return getCountriesByContinent(selectedContinent);
  }, [gameMode, selectedContinent]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        activeMode={activeMode}
        onModeChange={setMode}
        onClose={closeMobileMenu}
      />

      {/* Header with navigation, hamburger menu, and settings */}
      <Header 
        isMenuOpen={isMobileMenuOpen} 
        onMenuToggle={toggleMobileMenu}
        activeMode={activeMode}
        onModeChange={setMode}
      >
        <SettingsButton 
          resolution={resolution}
          onResolutionChange={updateResolution}
          quality={quality}
          onQualityChange={updateQuality}
        />
      </Header>

      <div style={{
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px',
        position: 'relative',
      }}>
        {/* Counter */}
        <Counter 
          guessedCount={guessedCount} 
          totalCount={totalCountries} 
          selectedContinent={selectedContinent}
        />

        {/* Input box */}
        <div style={{ marginBottom: '30px' }}>
          <CountryInput 
            onGuess={handleGuess} 
            selectedContinent={selectedContinent}
          />
        </div>
        
        {/* Globe in white card */}
        <GlobeCard>
          <Suspense fallback={<GlobeLoadingSkeleton />}>
            <GlobeComponent 
              guessedCountryCodes={guessedCountryCodes}
              gameMode={gameMode}
              selectedContinent={selectedContinent}
              resolution={resolution}
              quality={quality}
            />
          </Suspense>
        </GlobeCard>

        {/* Country List below the globe */}
        <div style={{ 
          maxWidth: '900px', 
          width: '90vw', 
          marginTop: '20px',
          marginBottom: '40px',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}>
            <CountryList 
              countries={currentCountries}
              guessedCountryCodes={guessedCountryCodes}
              gameMode={gameMode}
              selectedContinent={selectedContinent}
            />
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
