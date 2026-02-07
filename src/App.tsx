import { Suspense, lazy, useEffect, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCountryQuiz } from './hooks/useCountryQuiz';
import { useNavigation } from './hooks/useNavigation';
import { useSettings } from './hooks/useSettings';
import { Counter } from './components/Counter';
import { CountryInput } from './components/CountryInput';
import { Navigation } from './components/Navigation';
import { GlobeCard } from './components/GlobeCard';
import { SettingsButton } from './components/SettingsButton';
import { CountryList } from './components/CountryList';
import { countries } from './data/countries';
import { getCountriesByContinent } from './data/continents';
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

function App() {
  // Navigation state (World, Africa, Asia, etc.)
  const { activeMode, setMode, getContinent, gameMode } = useNavigation();
  const selectedContinent = getContinent();

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

  // Calculate the list of countries for the current game mode
  const currentCountries = useMemo(() => {
    if (gameMode === 'world' || !selectedContinent) {
      return countries;
    }
    return getCountriesByContinent(selectedContinent);
  }, [gameMode, selectedContinent]);

  return (
    <QueryClientProvider client={queryClient}>
      <div style={{
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px',
        position: 'relative',
      }}>
        {/* Settings button in top-right corner */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 100,
        }}>
          <SettingsButton 
            resolution={resolution}
            onResolutionChange={updateResolution}
            quality={quality}
            onQualityChange={updateQuality}
          />
        </div>

        {/* Navigation tabs */}
        <Navigation activeMode={activeMode} onModeChange={setMode} />

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
