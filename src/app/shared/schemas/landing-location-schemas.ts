import { BreakthroughName } from './breakthrough-schemas';
import { SurvivingMarsMapId } from './map-name-schemas';

/** The original csv column names. */
export type LandingLocationSchema = {
  Coordinates: string;
  'Latitude °': number;
  Latitude: 'N' | 'S';
  'Longitude °': number;
  Longitude: 'W' | 'E';
  Topography: Topography;
  'Difficulty Challenge': number;
  Altitude: number;
  Temperature: number;
  Metals: number;
  'Rare Metals': number;
  Concrete: number;
  Water: number;
  'Dust Devils': number;
  'Dust Storms': number;
  Meteors: number;
  'Cold Waves': number;
  'Map Name': SurvivingMarsMapId;
  'Named Location': NamedLocation | null;
  'Breakthrough 1': BreakthroughName;
  'Breakthrough 2': BreakthroughName;
  'Breakthrough 3': BreakthroughName;
  'Breakthrough 4': BreakthroughName;
  'Breakthrough 5': BreakthroughName;
  'Breakthrough 6': BreakthroughName;
  'Breakthrough 7': BreakthroughName;
  'Breakthrough 8': BreakthroughName;
  'Breakthrough 9': BreakthroughName;
  'Breakthrough 10': BreakthroughName;
  'Breakthrough 11': BreakthroughName;
  'Breakthrough 12': BreakthroughName;
  'Breakthrough 13': BreakthroughName;
  /* Usually the csv is up to 13 breakthroughs, but in case of more, take those
  into account. */
  'Breakthrough 14'?: BreakthroughName;
  'Breakthrough 15'?: BreakthroughName;
  'Breakthrough 16'?: BreakthroughName;
  'Breakthrough 17'?: BreakthroughName;
  'Breakthrough 18'?: BreakthroughName;
  'Breakthrough 19'?: BreakthroughName;
  'Breakthrough 20'?: BreakthroughName;
};

export enum LandingLocationTopography {
  FLAT = 'Relatively Flat',
  STEEP = 'Steep',
  ROUGH = 'Rough',
  MOUNTANIOUS = 'Mountanious',
}

export type Topography = typeof LandingLocationTopography[keyof typeof LandingLocationTopography];

export type NamedLocation = keyof typeof SurvivingMarsNamedLocationMapping;

export enum SurvivingMarsNamedLocation {
  ALBOR_THOLUS = 'ALBOR_THOLUS',
  ARABIA_TERRA = 'ARABIA_TERRA',
  ARCADIA_PLANITIA = 'ARCADIA_PLANITIA',
  ARGYRE_PLANITIA = 'ARGYRE_PLANITIA',
  ARSAI_MONS = 'ARSAI_MONS',
  ASCRAEUS_MONS = 'ASCRAEUS_MONS',
  COLONY_SITE = 'COLONY_SITE',
  ELYSIUM_MONS = 'ELYSIUM_MONS',
  GALE_CRATER = 'GALE_CRATER',
  HECATUS_THOLUS = 'HECATUS_THOLUS',
  HELLAS_PLANITIA = 'HELLAS_PLANITIA',
  MARS_PATHFINDER_LANDING_AREA = 'MARS_PATHFINDER_LANDING_AREA',
  NORTH_CAP = 'NORTH_CAP',
  OLYMPUS_MONS = 'OLYMPUS_MONS',
  OPPORTUNITY_LANDING_AREA = 'OPPORTUNITY_LANDING_AREA',
  PAVONIS_MONS = 'PAVONIS_MONS',
  PHOENIX_LANDING_AREA = 'PHOENIX_LANDING_AREA',
  SOUTH_CAP = 'SOUTH_CAP',
  SPIRIT_LANDING_AREA = 'SPIRIT_LANDING_AREA',
  TEMPA_TERRA = 'TEMPA_TERRA',
  TERRA_SABAEA = 'TERRA_SABAEA',
  TERRA_SIREUM = 'TERRA_SIREUM',
  UTOPIA_PLANITIA = 'UTOPIA_PLANITIA',
  VALLES_MARINERIS = 'VALLES_MARINERIS',
  VIKING_1_LANDING_AREA = 'VIKING_1_LANDING_AREA',
  VIKING_2_LANDING_AREA = 'VIKING_2_LANDING_AREA',
}

export const SurvivingMarsNamedLocationMapping = {
  'Albor Tholus': SurvivingMarsNamedLocation.ALBOR_THOLUS,
  'Arabia Terra': SurvivingMarsNamedLocation.ARABIA_TERRA,
  'Arcadia Planitia': SurvivingMarsNamedLocation.ARCADIA_PLANITIA,
  'Argyre Planitia': SurvivingMarsNamedLocation.ARGYRE_PLANITIA,
  'Arsai Mons': SurvivingMarsNamedLocation.ARSAI_MONS,
  'Ascraeus Mons': SurvivingMarsNamedLocation.ASCRAEUS_MONS,
  'Colony Site': SurvivingMarsNamedLocation.COLONY_SITE,
  'Elysium Mons': SurvivingMarsNamedLocation.ELYSIUM_MONS,
  'Gale Crater': SurvivingMarsNamedLocation.GALE_CRATER,
  'Hecatus Tholus': SurvivingMarsNamedLocation.HECATUS_THOLUS,
  'Hellas Planitia': SurvivingMarsNamedLocation.HELLAS_PLANITIA,
  'Mars Pathfinder Landing Area':
    SurvivingMarsNamedLocation.MARS_PATHFINDER_LANDING_AREA,
  'North Cap': SurvivingMarsNamedLocation.NORTH_CAP,
  'Olympus Mons': SurvivingMarsNamedLocation.OLYMPUS_MONS,
  'Opportunity Landing Area':
    SurvivingMarsNamedLocation.OPPORTUNITY_LANDING_AREA,
  'Pavonis Mons': SurvivingMarsNamedLocation.PAVONIS_MONS,
  'Phoenix Landing Area': SurvivingMarsNamedLocation.PHOENIX_LANDING_AREA,
  'South Cap': SurvivingMarsNamedLocation.SOUTH_CAP,
  'Spirit Landing Area': SurvivingMarsNamedLocation.SPIRIT_LANDING_AREA,
  'Tempa Terra': SurvivingMarsNamedLocation.TEMPA_TERRA,
  'Terra Sabaea': SurvivingMarsNamedLocation.TERRA_SABAEA,
  'Terra Sireum': SurvivingMarsNamedLocation.TERRA_SIREUM,
  'Utopia Planitia': SurvivingMarsNamedLocation.UTOPIA_PLANITIA,
  'Valles Marineris': SurvivingMarsNamedLocation.VALLES_MARINERIS,
  'Viking 1 Landing Area': SurvivingMarsNamedLocation.VIKING_1_LANDING_AREA,
  'Viking 2 Landing Area': SurvivingMarsNamedLocation.VIKING_2_LANDING_AREA,
} as const;
