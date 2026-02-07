import { useState, useCallback } from 'react';

export type GlobeResolution = 'auto' | 'low-only' | 'high-only';

export interface UseSettingsReturn {
  resolution: GlobeResolution;
  updateResolution: (value: GlobeResolution) => void;
}

export function useSettings(): UseSettingsReturn {
  const [resolution, setResolution] = useState<GlobeResolution>(() => {
    // Load from localStorage or default to 'auto'
    const saved = localStorage.getItem('globe-resolution');
    if (saved === 'auto' || saved === 'low-only' || saved === 'high-only') {
      return saved;
    }
    return 'auto';
  });

  const updateResolution = useCallback((value: GlobeResolution) => {
    setResolution(value);
    localStorage.setItem('globe-resolution', value);
    console.log(`Globe resolution preference updated to: ${value}`);
  }, []);

  return { resolution, updateResolution };
}
