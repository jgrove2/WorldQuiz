import type { NavigationMode } from './hooks/useNavigation';

export interface RouteConfig {
  path: string;
  mode: NavigationMode;
}

// Define all available routes
export const routes: RouteConfig[] = [
  { path: '/', mode: 'world' },
  { path: '/world', mode: 'world' },
  { path: '/africa', mode: 'africa' },
  { path: '/asia', mode: 'asia' },
  { path: '/europe', mode: 'europe' },
  { path: '/northamerica', mode: 'northamerica' },
  { path: '/southamerica', mode: 'southamerica' },
  { path: '/oceania', mode: 'oceania' },
];

// Valid navigation modes
const VALID_MODES: NavigationMode[] = [
  'world',
  'africa',
  'asia',
  'europe',
  'northamerica',
  'southamerica',
  'oceania',
];

/**
 * Normalize a mode string from URL to a valid NavigationMode
 * Handles case-insensitivity and validation
 */
export function normalizeMode(mode: string | undefined): NavigationMode {
  if (!mode) {
    return 'world';
  }

  const lowercaseMode = mode.toLowerCase();
  
  if (VALID_MODES.includes(lowercaseMode as NavigationMode)) {
    return lowercaseMode as NavigationMode;
  }

  // Invalid mode, default to world
  return 'world';
}

/**
 * Convert a NavigationMode to a URL path
 */
export function modeToPath(mode: NavigationMode): string {
  return `/${mode}`;
}

/**
 * Check if a mode string is valid
 */
export function isValidMode(mode: string): boolean {
  return VALID_MODES.includes(mode.toLowerCase() as NavigationMode);
}
