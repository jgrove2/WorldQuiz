/**
 * Maps sovereign country ISO codes to their dependent territories
 * Based on Natural Earth GeoJSON data (ne_50m_admin_0_countries.geojson)
 */
export const TERRITORY_MAPPINGS: Record<string, string[]> = {
  // Denmark
  'DNK': ['GRL', 'FRO'],  // Greenland, Faroe Islands
  
  // France (overseas territories)
  'FRA': [
    'SPM',  // Saint Pierre and Miquelon
    'WLF',  // Wallis and Futuna
    'MAF',  // Saint Martin
    'BLM',  // Saint Barthelemy
    'PYF',  // French Polynesia
    'NCL',  // New Caledonia
    'ATF',  // French Southern and Antarctic Lands
  ],
  
  // United Kingdom
  'GBR': [
    'SGS',  // South Georgia and South Sandwich Islands
    'IOT',  // British Indian Ocean Territory
    'SHN',  // Saint Helena, Ascension and Tristan da Cunha
    'PCN',  // Pitcairn Islands
    'AIA',  // Anguilla
    'FLK',  // Falkland Islands
    'CYM',  // Cayman Islands
    'BMU',  // Bermuda
    'VGB',  // British Virgin Islands
    'TCA',  // Turks and Caicos Islands
    'MSR',  // Montserrat
    'JEY',  // Jersey
    'GGY',  // Guernsey
    'IMN',  // Isle of Man
  ],
  
  // United States
  'USA': [
    'MNP',  // Northern Mariana Islands
    'VIR',  // US Virgin Islands
    'GUM',  // Guam
    'ASM',  // American Samoa
    'PRI',  // Puerto Rico
  ],
  
  // Netherlands
  'NLD': [
    'ABW',  // Aruba
    'CUW',  // Curaçao
    'SXM',  // Sint Maarten
  ],
  
  // Australia
  'AUS': [
    'HMD',  // Heard Island and McDonald Islands
    'NFK',  // Norfolk Island
  ],
  
  // New Zealand
  'NZL': [
    'NIU',  // Niue
    'COK',  // Cook Islands
  ],
  
  // China
  'CHN': [
    'MAC',  // Macao
    'HKG',  // Hong Kong
  ],
  
  // Norway
  'NOR': [
    'SJM',  // Svalbard and Jan Mayen
    'BVT',  // Bouvet Island
  ],
  
  // Finland
  'FIN': [
    'ALA',  // Åland Islands
  ],
};

/**
 * Reverse mapping: territory code -> parent country code
 * Automatically generated from TERRITORY_MAPPINGS
 */
export const TERRITORY_TO_PARENT: Record<string, string> = Object.entries(TERRITORY_MAPPINGS)
  .flatMap(([parent, territories]) => territories.map(territory => [territory, parent]))
  .reduce((acc, [territory, parent]) => ({ ...acc, [territory]: parent }), {});

/**
 * Full names for territories (for better tooltips)
 */
export const TERRITORY_NAMES: Record<string, string> = {
  'GRL': 'Greenland',
  'FRO': 'Faroe Islands',
  'SPM': 'Saint Pierre and Miquelon',
  'WLF': 'Wallis and Futuna',
  'MAF': 'Saint Martin',
  'BLM': 'Saint Barthélemy',
  'PYF': 'French Polynesia',
  'NCL': 'New Caledonia',
  'ATF': 'French Southern and Antarctic Lands',
  'SGS': 'South Georgia and South Sandwich Islands',
  'IOT': 'British Indian Ocean Territory',
  'SHN': 'Saint Helena',
  'PCN': 'Pitcairn Islands',
  'AIA': 'Anguilla',
  'FLK': 'Falkland Islands',
  'CYM': 'Cayman Islands',
  'BMU': 'Bermuda',
  'VGB': 'British Virgin Islands',
  'TCA': 'Turks and Caicos Islands',
  'MSR': 'Montserrat',
  'JEY': 'Jersey',
  'GGY': 'Guernsey',
  'IMN': 'Isle of Man',
  'MNP': 'Northern Mariana Islands',
  'VIR': 'US Virgin Islands',
  'GUM': 'Guam',
  'ASM': 'American Samoa',
  'PRI': 'Puerto Rico',
  'ABW': 'Aruba',
  'CUW': 'Curaçao',
  'SXM': 'Sint Maarten',
  'HMD': 'Heard and McDonald Islands',
  'NFK': 'Norfolk Island',
  'NIU': 'Niue',
  'COK': 'Cook Islands',
  'MAC': 'Macao',
  'HKG': 'Hong Kong',
  'SJM': 'Svalbard and Jan Mayen',
  'BVT': 'Bouvet Island',
  'ALA': 'Åland Islands',
};
