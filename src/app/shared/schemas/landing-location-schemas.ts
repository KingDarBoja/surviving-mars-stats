import { BreakthroughName } from "./breakthrough-schemas";
import { SurvivingMarsMapId } from "./map-name-schemas";

/** The original csv column names. */
export type LandingLocationSchema = {
  Coordinates: string;
  'Latitude °': number;
  Latitude: 'N' | 'S';
  'Longitude °': number;
  Longitude: 'W' | 'E';
  Topography: 'Relatively Flat' | 'Steep' | 'Rough' | 'Mountanious';
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
  'Named Location': string | null;
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