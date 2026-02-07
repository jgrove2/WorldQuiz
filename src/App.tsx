import { Suspense, lazy, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCountryQuiz } from './hooks/useCountryQuiz';
import { useNavigation } from './hooks/useNavigation';
import { useSettings } from './hooks/useSettings';
import { Counter } from './components/Counter';
import { CountryInput } from './components/CountryInput';
import { Navigation } from './components/Navigation';
import { GlobeCard } from './components/GlobeCard';
import { SettingsButton } from './components/SettingsButton';
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

  // Settings state (resolution preference)
  const { resolution, updateResolution } = useSettings();

  // Quiz state with continent filtering
  const { guessedCountryCodes, guessedCount, totalCountries, handleGuess, resetQuiz } = useCountryQuiz({
    gameMode,
    selectedContinent,
  });

  // Reset quiz whenever the mode changes
  useEffect(() => {
    resetQuiz();
  }, [activeMode, resetQuiz]);

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
            />
          </Suspense>
        </GlobeCard>
      </div>
    </QueryClientProvider>
  );
}

export default App;
