import { Routes, Route, useParams, useNavigate, Navigate } from 'react-router-dom';
import { useCallback } from 'react';
import App from '../App';
import { normalizeMode } from '../routes';
import type { NavigationMode } from '../hooks/useNavigation';

/**
 * Component that handles routing for a specific mode
 */
function ModeRoute() {
  const { mode } = useParams<{ mode: string }>();
  const navigate = useNavigate();

  // Normalize the mode from URL (case-insensitive, validated)
  const normalizedMode = normalizeMode(mode);

  // If the URL mode is invalid or different case, redirect to normalized version
  if (mode && mode !== normalizedMode) {
    return <Navigate to={`/${normalizedMode}`} replace />;
  }

  // Create setMode function that updates the URL
  const setMode = useCallback(
    (newMode: NavigationMode) => {
      navigate(`/${newMode}`, { replace: false }); // Add to history
    },
    [navigate]
  );

  return <App activeMode={normalizedMode} setMode={setMode} />;
}

/**
 * Root route component (handles `/`)
 */
function RootRoute() {
  const navigate = useNavigate();

  const setMode = useCallback(
    (newMode: NavigationMode) => {
      navigate(`/${newMode}`, { replace: false });
    },
    [navigate]
  );

  return <App activeMode="world" setMode={setMode} />;
}

/**
 * Main router component that wraps the app with routing logic
 */
export function AppRouter() {
  return (
    <Routes>
      {/* Root route - defaults to World mode */}
      <Route path="/" element={<RootRoute />} />
      
      {/* Mode routes - /world, /africa, etc. */}
      <Route path="/:mode" element={<ModeRoute />} />
      
      {/* Catch-all for 404s - redirect to root */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
