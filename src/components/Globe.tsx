import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import type { FeatureCollection } from 'geojson';
import { countries, type Continent } from '../data/countries';
import { CONTINENT_CAMERA_VIEWS, getCountriesByContinent } from '../data/continents';
import type { GameMode } from '../hooks/useNavigation';
import type { GlobeResolution, GlobeQuality } from '../hooks/useSettings';
import { isPolygonGuessed, getTerritoryDisplayName, getParentCountry } from '../utils/territoryHelper';

interface GlobeComponentProps {
  guessedCountryCodes: Set<string>;
  onCountryClick?: (countryName: string, isGuessed: boolean) => void;
  gameMode?: GameMode;
  selectedContinent?: Continent | null;
  resolution?: GlobeResolution;
  quality?: GlobeQuality;
}

interface TooltipData {
  name: string;
  isGuessed: boolean;
}

// Color scheme matching the light theme
const COLORS = {
  unguessed: '#c0c0c0', // Light grey for unguessed countries
  guessed: '#2ecc71',    // Green for guessed countries
  dimmed: '#808080',     // Dimmed color for non-selected continents (30% opacity effect)
  ocean: '#000000',
  atmosphere: '#0a1929',
};

// Quality-based rendering configurations
const QUALITY_CONFIGS = {
  low: {
    atmosphereColor: '#0a1929',
    atmosphereAltitude: 0.08,
    polygonCurvature: 2,
    showStars: false,
    starCount: 0,
  },
  medium: {
    atmosphereColor: '#1a3a52',
    atmosphereAltitude: 0.12,
    polygonCurvature: 4,
    showStars: false,
    starCount: 0,
  },
  high: {
    atmosphereColor: '#3a5a92', // Brighter, more vibrant blue for better halo
    atmosphereAltitude: 0.25, // Increased for more prominent glow
    polygonCurvature: 6,
    showStars: true,
    starCount: 15000, // More stars for high quality
  },
};

// Map problematic GeoJSON ISO codes to correct ones
// Natural Earth data has 8 polygons with ISO_A3 = '-99', we use ADM0_A3 as fallback
const ISO_CODE_MAPPINGS: Record<string, string> = {
  // Using compound key format: 'ISO_A3|NAME' or 'ISO_A3|ADM0_A3'
  '-99|France': 'FRA',
  '-99|Norway': 'NOR',
  '-99|Kosovo': 'UNK',  // Kosovo uses UNK in our country list
  '-99|Somaliland': 'SOL',
  '-99|N. Cyprus': 'CYN',
  '-99|Northern Cyprus': 'CYN',
  '-99|Indian Ocean Ter.': 'IOT',  // British Indian Ocean Territory
  '-99|Ashmore and Cartier Is.': 'AUS',  // Australian territory
  '-99|Siachen Glacier': 'KAS',
};

// Low resolution (fast load) - 838KB, ~172 countries
const GEOJSON_URL_LOW_RES = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson';

// High resolution (includes small countries) - 2.94MB, 234+ countries
const GEOJSON_URL_HIGH_RES = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson';

// Optimization 1: Create country code Map for O(1) lookups instead of O(n)
const countryCodeMap = new Map(countries.map(c => [c.code, c]));

// Helper function to normalize ISO codes from GeoJSON
const normalizeIsoCode = (properties: any): string => {
  const code = properties?.ISO_A3;
  if (!code) return '';
  
  // For problematic '-99' codes, use compound key with NAME
  if (code === '-99') {
    const name = properties?.NAME || '';
    const compoundKey = `${code}|${name}`;
    const mapped = ISO_CODE_MAPPINGS[compoundKey];
    
    if (mapped) {
      return mapped;
    }
    
    // Fallback to ADM0_A3 if compound key not found
    return properties?.ADM0_A3 || code;
  }
  
  return ISO_CODE_MAPPINGS[code] || code;
};

// Fetch function for React Query
const fetchGeoJson = async (url: string): Promise<FeatureCollection> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch GeoJSON data');
  }
  return response.json();
};

// Check for WebGL support
const hasWebGLSupport = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
};

// Calculate the center point (centroid) of a polygon
const calculatePolygonCenter = (coordinates: any): { lat: number; lng: number } => {
  let totalLat = 0;
  let totalLng = 0;
  let pointCount = 0;

  const processCoordinates = (coords: any) => {
    if (Array.isArray(coords[0])) {
      // Multi-dimensional array, recurse
      coords.forEach((c: any) => processCoordinates(c));
    } else if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
      // We have a coordinate pair [lng, lat]
      totalLng += coords[0];
      totalLat += coords[1];
      pointCount++;
    }
  };

  processCoordinates(coordinates);

  return {
    lat: pointCount > 0 ? totalLat / pointCount : 0,
    lng: pointCount > 0 ? totalLng / pointCount : 0,
  };
};

// Create a starfield background for the globe
const createStarField = (count: number = 10000): THREE.Points => {
  const starGeometry = new THREE.BufferGeometry();
  const starPositions = new Float32Array(count * 3);
  const starSizes = new Float32Array(count);
  const starColors = new Float32Array(count * 3);

  // Star color variations (subtle blues, whites, and warm tones)
  const starColorPalette = [
    new THREE.Color(0xffffff), // White
    new THREE.Color(0xffeedd), // Warm white
    new THREE.Color(0xaaccff), // Blue-white
    new THREE.Color(0xffffee), // Slightly yellow
    new THREE.Color(0xeeeeff), // Cool white
  ];

  // Generate random star positions in a sphere
  for (let i = 0; i < count; i++) {
    // Random spherical coordinates
    const radius = 300 + Math.random() * 100; // Stars far from globe
    const theta = Math.random() * Math.PI * 2; // Azimuth
    const phi = Math.acos((Math.random() * 2) - 1); // Inclination

    // Convert to Cartesian coordinates
    starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    starPositions[i * 3 + 2] = radius * Math.cos(phi);

    // Random star size with power distribution (more small stars than large)
    const sizePower = Math.pow(Math.random(), 2); // Square to bias toward smaller values
    starSizes[i] = 0.5 + sizePower * 2.5; // Range 0.5 to 3.0, but mostly smaller

    // Random color from palette with slight variation
    const colorChoice = starColorPalette[Math.floor(Math.random() * starColorPalette.length)];
    const variation = 0.9 + Math.random() * 0.1; // 90-100% of base color
    starColors[i * 3] = colorChoice.r * variation;
    starColors[i * 3 + 1] = colorChoice.g * variation;
    starColors[i * 3 + 2] = colorChoice.b * variation;
  }

  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
  starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  // Star material with slight transparency and additive blending
  const starMaterial = new THREE.PointsMaterial({
    size: 1.8, // Slightly larger base size
    transparent: true,
    opacity: 0.9, // Increased opacity for brighter stars
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
    vertexColors: true, // Enable per-vertex colors
  });

  const starField = new THREE.Points(starGeometry, starMaterial);
  starField.name = 'starField';
  
  return starField;
};

function GlobeComponent({ 
  guessedCountryCodes, 
  onCountryClick,
  gameMode = 'world',
  selectedContinent = null,
  resolution = 'auto',
  quality = 'medium',
}: GlobeComponentProps) {
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null);
  const tooltipTimeoutRef = useRef<number | null>(null);
  const previousGuessedCountsRef = useRef<number>(0);
  const starFieldRef = useRef<THREE.Points | null>(null);

  // Get quality configuration
  const qualityConfig = QUALITY_CONFIGS[quality];

  // Step 1: Load low-res GeoJSON first (fast initial display)
  // Load low-res unless user specifically wants high-res only
  const { data: lowResData, isLoading: isLoadingLowRes, error: lowResError } = useQuery({
    queryKey: ['globe-geojson-lowres'],
    queryFn: () => fetchGeoJson(GEOJSON_URL_LOW_RES),
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 2,
    enabled: resolution !== 'high-only', // Skip if user wants high-res only
  });

  // Step 2: Lazy load high-res GeoJSON based on resolution preference
  const shouldLoadHighRes = 
    resolution === 'high-only' || // User wants high-res only
    (resolution === 'auto' && !!lowResData); // Auto mode after low-res loads

  const { data: highResData, isLoading: isLoadingHighRes } = useQuery({
    queryKey: ['globe-geojson-highres'],
    queryFn: () => fetchGeoJson(GEOJSON_URL_HIGH_RES),
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 2,
    enabled: shouldLoadHighRes,
  });

  // Data selection logic based on resolution preference
  const geoJsonData = useMemo(() => {
    if (resolution === 'low-only') {
      return lowResData;
    }
    if (resolution === 'high-only') {
      return highResData;
    }
    // Auto mode: prefer high-res if available, fallback to low-res
    return highResData || lowResData;
  }, [resolution, lowResData, highResData]);

  const isLoading = resolution === 'high-only' ? !highResData : isLoadingLowRes;
  const error = lowResError;

  // Optimization 8: Check for WebGL support
  const webglSupported = useMemo(() => hasWebGLSupport(), []);

  // Log when high-res data loads (for debugging)
  useEffect(() => {
    if (highResData) {
      console.log('✓ High-resolution globe data loaded (includes small countries like Vatican, Malta, Monaco)');
    }
  }, [highResData]);

  // Get valid country codes for the selected continent
  const validCountryCodes = useMemo(() => {
    if (gameMode === 'world' || !selectedContinent) {
      return null; // null means all countries are valid
    }
    return new Set(getCountriesByContinent(selectedContinent).map(c => c.code));
  }, [gameMode, selectedContinent]);

  // Filter polygons to show only selected continent or dim others
  const filteredPolygons = useMemo(() => {
    if (!geoJsonData || gameMode === 'world' || !validCountryCodes) {
      return geoJsonData?.features || [];
    }
    // In continent mode, show all polygons but we'll dim the non-selected ones
    return geoJsonData.features;
  }, [geoJsonData, gameMode, validCountryCodes]);

  // Initial camera setup - center on world
  useEffect(() => {
    if (globeRef.current && geoJsonData) {
      // Center on equator with better view
      globeRef.current.pointOfView({ lat: 0, lng: 0, altitude: 2.2 }, 0);
    }
  }, [geoJsonData]);

  // Camera animation when continent changes
  useEffect(() => {
    if (!globeRef.current) return;

    if (gameMode === 'world' || !selectedContinent) {
      // Return to world view
      globeRef.current.pointOfView({ lat: 0, lng: 0, altitude: 2.2 }, 1000);
    } else {
      // Zoom to selected continent
      const cameraView = CONTINENT_CAMERA_VIEWS[selectedContinent];
      globeRef.current.pointOfView(cameraView, 1000);
    }
  }, [gameMode, selectedContinent]);

  // Zoom to newly guessed country
  useEffect(() => {
    if (!globeRef.current || !geoJsonData) return;

    const currentCount = guessedCountryCodes.size;
    const previousCount = previousGuessedCountsRef.current;

    // Check if a new country was just guessed
    if (currentCount > previousCount) {
      // Find the most recently guessed country
      const allCodes = Array.from(guessedCountryCodes);
      const newestCode = allCodes[allCodes.length - 1];

      // Find the polygon for this country in the GeoJSON data
      const countryPolygon = geoJsonData.features?.find(
        (feature: any) => normalizeIsoCode(feature.properties) === newestCode
      );

      if (countryPolygon?.geometry) {
        const geometry = countryPolygon.geometry as any;
        if (geometry.coordinates) {
          // Calculate the center of the country
          const center = calculatePolygonCenter(geometry.coordinates);
          
          // Zoom to the country with a nice altitude for viewing
          globeRef.current.pointOfView(
            { 
              lat: center.lat, 
              lng: center.lng, 
              altitude: 0.8 // Closer zoom to see the country details
            },
            800 // 800ms animation duration
          );

          console.log(`Zoomed to ${countryCodeMap.get(newestCode)?.name || newestCode} at lat: ${center.lat.toFixed(2)}, lng: ${center.lng.toFixed(2)}`);
        }
      }
    }

    // Update the previous count
    previousGuessedCountsRef.current = currentCount;
  }, [guessedCountryCodes, geoJsonData]);

  // Add/remove starfield based on quality setting
  useEffect(() => {
    if (!globeRef.current) return;

    const scene = globeRef.current.scene();
    if (!scene) return;

    // Remove existing starfield if any
    if (starFieldRef.current) {
      scene.remove(starFieldRef.current);
      starFieldRef.current.geometry.dispose();
      (starFieldRef.current.material as THREE.Material).dispose();
      starFieldRef.current = null;
    }

    // Add starfield only in high quality mode
    if (qualityConfig.showStars && geoJsonData) {
      const starCount = qualityConfig.starCount || 10000;
      const starField = createStarField(starCount);
      scene.add(starField);
      starFieldRef.current = starField;
      console.log(`✨ Starfield added (${starCount.toLocaleString()} stars)`);

      // Animate stars with very slow rotation
      let animationFrameId: number;
      const animateStars = () => {
        if (starFieldRef.current) {
          starFieldRef.current.rotation.y += 0.0001; // Very slow rotation
          starFieldRef.current.rotation.x += 0.00005;
        }
        animationFrameId = requestAnimationFrame(animateStars);
      };
      animateStars();

      // Cleanup animation on unmount or quality change
      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        if (starFieldRef.current && scene) {
          scene.remove(starFieldRef.current);
          starFieldRef.current.geometry.dispose();
          (starFieldRef.current.material as THREE.Material).dispose();
          starFieldRef.current = null;
        }
      };
    }
  }, [quality, qualityConfig.showStars, geoJsonData]);

  // Optimization 2: Fix setTimeout memory leak with proper cleanup
  useEffect(() => {
    // Clear any existing timeout when tooltip changes
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, [tooltipData]);

  // Optimization 7: Memoize color function to prevent recreation
  const getPolygonColor = useCallback((feature: any) => {
    const isoCode = normalizeIsoCode(feature.properties);
    
    // Check if country/territory is guessed (includes territories)
    if (isPolygonGuessed(isoCode, guessedCountryCodes)) {
      return COLORS.guessed;
    }
    
    // In continent mode, dim countries not in the selected continent
    if (gameMode === 'continent' && validCountryCodes && !validCountryCodes.has(isoCode)) {
      return COLORS.dimmed;
    }
    
    return COLORS.unguessed;
  }, [guessedCountryCodes, gameMode, validCountryCodes]);

  // Optimization 7: Memoize altitude function
  const getPolygonAltitude = useCallback((feature: any) => {
    const isoCode = normalizeIsoCode(feature.properties);
    
    // In continent mode, lower the altitude of non-selected countries
    if (gameMode === 'continent' && validCountryCodes && !validCountryCodes.has(isoCode)) {
      return 0.002; // Very low altitude for dimmed countries
    }
    
    return isPolygonGuessed(isoCode, guessedCountryCodes) ? 0.01 : 0.005;
  }, [guessedCountryCodes, gameMode, validCountryCodes]);

  // Optimized click handler with Map lookup (O(1) instead of O(n))
  const handlePolygonClick = useCallback((polygon: any) => {
    const rawIsoCode = polygon.properties?.ISO_A3;
    if (!rawIsoCode) return;
    
    const isoCode = normalizeIsoCode(polygon.properties);
    const isGuessed = isPolygonGuessed(isoCode, guessedCountryCodes);
    const countryData = countryCodeMap.get(isoCode); // O(1) lookup
    const isTerritory = getParentCountry(isoCode) !== null;

    const tooltipInfo: TooltipData = {
      name: isGuessed 
        ? (isTerritory 
            ? getTerritoryDisplayName(isoCode, true)
            : (countryData?.name || polygon.properties?.NAME || '?'))
        : '?',
      isGuessed,
    };

    setTooltipData(tooltipInfo);

    // Clear any existing timeout
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }

    // Auto-dismiss after 3 seconds
    tooltipTimeoutRef.current = setTimeout(() => {
      setTooltipData(null);
      tooltipTimeoutRef.current = null;
    }, 3000);

    // Call optional callback
    if (onCountryClick && countryData) {
      onCountryClick(countryData.name, isGuessed);
    }
  }, [guessedCountryCodes, onCountryClick]);

  // Dismiss tooltip when clicking outside
  const handleBackgroundClick = useCallback(() => {
    setTooltipData(null);
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
    }
  }, []);

  // Static functions (don't need to recreate)
  const getPolygonLabel = useCallback(() => '', []);
  const getPolygonSideColor = useCallback(() => '#00000055', []);
  const getPolygonStrokeColor = useCallback(() => '#ffffff', []); // Full opacity white for prominent borders

  // Optimization 8: Don't render if WebGL is not supported
  if (!webglSupported) {
    return (
      <div style={{
        width: '100%',
        height: '600px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#e74c3c',
        fontSize: '18px',
        gap: '10px',
      }}>
        <div>WebGL not supported</div>
        <div style={{ fontSize: '14px', color: '#999' }}>
          Please use a modern browser to view the globe
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div style={{
        width: '100%',
        height: '600px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#ffffff',
        fontSize: '18px',
      }}>
        Loading globe...
      </div>
    );
  }

  // Error state
  if (error || !geoJsonData) {
    return (
      <div style={{
        width: '100%',
        height: '600px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#e74c3c',
        fontSize: '18px',
        gap: '10px',
      }}>
        <div>Failed to load globe data</div>
        <div style={{ fontSize: '14px', color: '#999' }}>
          {error instanceof Error ? error.message : 'Please refresh the page'}
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{ 
        width: '100%', 
        height: '100%', 
        position: 'relative',
        cursor: 'grab',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={handleBackgroundClick}
    >
      <Globe
        ref={globeRef}
        width={852}
        height={600}
        // Optimization 6: Use simpler, lower-quality textures
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundColor="#000000"
        
        // Polygon configuration - use filtered polygons
        polygonsData={filteredPolygons}
        polygonCapColor={getPolygonColor}
        polygonSideColor={getPolygonSideColor}
        polygonStrokeColor={getPolygonStrokeColor}
        polygonAltitude={getPolygonAltitude}
        polygonLabel={getPolygonLabel}
        
        // Quality-based polygon complexity
        polygonCapCurvatureResolution={qualityConfig.polygonCurvature}
        
        // Interaction
        onPolygonClick={handlePolygonClick}
        polygonsTransitionDuration={200} // Slightly faster transitions
        
        // Quality-based atmosphere settings
        atmosphereColor={qualityConfig.atmosphereColor}
        atmosphereAltitude={qualityConfig.atmosphereAltitude}
        
        // Controls
        enablePointerInteraction={true}
        
        // Performance optimizations
        animateIn={false}
        waitForGlobeReady={false}
      />

      {/* Tooltip */}
      {tooltipData && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '20px',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            pointerEvents: 'none',
            border: tooltipData.isGuessed ? '2px solid #2ecc71' : '2px solid #999',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {tooltipData.name}
        </div>
      )}

      {/* Loading indicator for high-res data */}
      {resolution === 'auto' && isLoadingHighRes && !highResData && lowResData && (
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#ffffff',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            zIndex: 999,
            pointerEvents: 'none',
          }}
        >
          Loading detailed map...
        </div>
      )}
    </div>
  );
}

// Memoized export to prevent unnecessary re-renders
export default React.memo(GlobeComponent);
