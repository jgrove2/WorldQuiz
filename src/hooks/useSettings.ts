import { useState, useCallback } from 'react';

export type GlobeResolution = 'auto' | 'low-only' | 'high-only';
export type GlobeQuality = 'low' | 'medium' | 'high';

export interface UseSettingsReturn {
  resolution: GlobeResolution;
  updateResolution: (value: GlobeResolution) => void;
  quality: GlobeQuality;
  updateQuality: (value: GlobeQuality) => void;
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

  const [quality, setQuality] = useState<GlobeQuality>(() => {
    // Load from localStorage or default to 'medium'
    const saved = localStorage.getItem('globe-quality');
    if (saved === 'low' || saved === 'medium' || saved === 'high') {
      return saved;
    }
    return 'medium';
  });

  const updateResolution = useCallback((value: GlobeResolution) => {
    setResolution(value);
    localStorage.setItem('globe-resolution', value);
    console.log(`Globe resolution preference updated to: ${value}`);
  }, []);

  const updateQuality = useCallback((value: GlobeQuality) => {
    setQuality(value);
    localStorage.setItem('globe-quality', value);
    console.log(`Globe quality preference updated to: ${value}`);
  }, []);

  return { resolution, updateResolution, quality, updateQuality };
}
