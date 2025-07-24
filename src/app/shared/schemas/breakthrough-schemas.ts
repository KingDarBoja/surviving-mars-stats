import { LocaleSchema } from './locale-schemas';

export type SurvivingMarsBreakthroughVersionId =
  | 'BASE'
  | 'GREEN_PLANET'
  | 'BELOW_AND_BEYOND'
  | 'GP_BB'
  | 'GP_BB_20';

export type SurvivingMarsBreakthroughVersionValue = {
  id: SurvivingMarsBreakthroughVersionId;
  label: string;
  path: string;
};

export const SurvivingMarsBreakthroughVersions: Record<
  SurvivingMarsBreakthroughVersionId,
  SurvivingMarsBreakthroughVersionValue
> = {
  BASE: {
    id: 'BASE',
    label: 'Base game (No DLCs)',
    path: './data/MapData-Breakthroughs.csv',
  },
  GREEN_PLANET: {
    id: 'GREEN_PLANET',
    label: 'Green Planet DLC',
    path: './data/MapData-Breakthroughs_GP.csv',
  },
  BELOW_AND_BEYOND: {
    id: 'BELOW_AND_BEYOND',
    label: 'Below and Beyond DLC',
    path: './data/MapData-Breakthroughs_BB.csv',
  },
  GP_BB: {
    id: 'GP_BB',
    label: 'Green Planet + Below and Beyond DLCs',
    path: './data/MapData-Breakthroughs_GP-BB.csv',
  },
  GP_BB_20: {
    id: 'GP_BB_20',
    label: 'Green Planet + B&B DLC (20 Breakthroughs)',
    path: './data/MapData-Breakthroughs_GP-BB_20.csv',
  },
};

/** The locale breakthrough desc csv column. */
export type BreakthroughSourceLocaleSchema = {
  break_id: BreakthroughId;
  name_en: string;
  name_br: string;
  name_fr: string;
};

export const BreakthroughMapping = {
  'Advanced Drone Drive': 'AdvancedDroneDrive',
  'Alien Imprints': 'AlienImprints',
  'Ancient Terraforming Device': 'AncientTerraformingDevice',
  'Artificial Muscles': 'ArtificialMuscles',
  'Autonomous Hubs': 'AutonomousHubs',
  'Capture Asteroid': 'CaptureAsteroid',
  'Cargobay of holding': 'CargobayOfHolding',
  Cloning: 'Cloning',
  'Construction Nanites': 'ConstructionNanites',
  'Core Metals': 'CoreMetals',
  'Core Rare Metals': 'CoreRareMetals',
  'Core Water': 'CoreWater',
  'Cryo-sleep': 'CryoSleep',
  'Designed Forestation': 'DesignedForestation',
  'Dome Streamlining': 'DomeStreamlining',
  'Dry Farming': 'DryFarming',
  'Eternal Fusion': 'EternalFusion',
  'Extractor AI': 'ExtractorAI',
  'Factory Automation': 'FactoryAutomation',
  'Forever Young': 'ForeverYoung',
  'Frictionless Composites': 'FrictionlessComposites',
  'Gem Architecture': 'GemArchitecture',
  'Gene Selection': 'GeneSelection',
  'Giant Crops': 'GiantCrops',
  'Global Support': 'GlobalSupport',
  'Good Vibrations': 'GoodVibrations',
  'Hive Mind': 'HiveMind',
  'Hull Polarization': 'HullPolarization',
  'Hypersensitive Photovoltaics': 'HypersensitivePhotovoltaics',
  'Inspiring Architecture': 'InspiringArchitecture',
  'Interplanetary Learning': 'InterplanetaryLearning',
  'Lake Vaporators': 'LakeVaporators',
  'Landscaping Nanites': 'LandscapingNanites',
  'Magnetic Extraction': 'MagneticExtraction',
  'Mars Marketing': 'MarsMarketing',
  'Martian Diet': 'MartianDiet',
  'Martian Steel': 'MartianSteel',
  'Martianborn Ingenuity': 'MartianbornIngenuity',
  'Mole People': 'MolePeople',
  'Multispiral Architecture': 'MultispiralArchitecture',
  'Nano Refinement': 'NanoRefinement',
  'Neo-Concrete': 'NeoConcrete',
  'Neural Empathy': 'NeuralEmpathy',
  'Nocturnal Adaptation': 'NocturnalAdaptation',
  'Overcharge Amplifications': 'OverchargeAmplification',
  'Plasma Rocket': 'PlasmaRocket',
  'Plutonium Synthesis': 'PlutoniumSynthesis',
  'Prefab Compression': 'PrefabCompression',
  'Printed Electronics': 'PrintedElectronics',
  'Project Phoenix': 'ProjectPhoenix',
  'Rapid Sleep': 'RapidSleep',
  'Resilient Vegetation': 'ResilientVegetation',
  'Safe Mode': 'SafeMode',
  'Service Bots': 'ServiceBots',
  'Soylent Green': 'SoylentGreen',
  'Space Rehabilitation': 'SpaceRehabilitation',
  'Superconducting Computing': 'SuperconductingComputing',
  Superfungus: 'Superfungus',
  'Superior Cables': 'SuperiorCables',
  'Superior Pipes': 'SuperiorPipes',
  'Sustained Workload': 'SustainedWorkload',
  'The Positronic Brain': 'ThePositronicBrain',
  'Vector Pump': 'VectorPump',
  'Vehicle Weight Optimizations': 'VehicleWeightOptimizations',
  'Vocation-Oriented Society': 'Vocation-Oriented Society',
  'Wireless Power': 'WirelessPower',
  'Zero-Space Computing': 'ZeroSpaceComputing',
} as const;

export type BreakthroughName = keyof typeof BreakthroughMapping;
export type BreakthroughId =
  (typeof BreakthroughMapping)[keyof typeof BreakthroughMapping];

export type BreakthroughLocaleSchema = {
  id: string;
  name_loc: LocaleSchema;
  desc_loc: LocaleSchema;
};

/** Mapping of breakthrough ids to icon names. */
export enum BreakthroughIcon {
  AdvancedDroneDrive = 'advanced_drone_drive',
  AlienImprints = 'alien_imprints',
  AncientTerraformingDevice = 'ancient_terraforming_device',
  ArtificialMuscles = 'artificial_muscles',
  AutonomousHubs = 'autonomous_hubs',
  CaptureAsteroid = 'capture_asteroid',
  CargobayOfHolding = 'cargobay_of_holding',
  Cloning = 'cloning',
  ConstructionNanites = 'construction_nanites',
  CoreMetals = 'core_metals',
  CoreRareMetals = 'core_rare_metals',
  CoreWater = 'core_water',
  CryoSleep = 'cryo-sleep',
  DesignedForestation = 'designed_forestation-',
  DomeStreamlining = 'dome_streamlining',
  DryFarming = 'dry_farming',
  EternalFusion = 'eternal_fusion',
  ExtractorAI = 'extractor_ai',
  FactoryAutomation = 'factory_automation',
  ForeverYoung = 'forever_young',
  FrictionlessComposites = 'frictionless_composites',
  GemArchitecture = 'gem_architecture',
  GeneSelection = 'gene_selection',
  GiantCrops = 'giant_crops',
  GlobalSupport = 'global_support',
  GoodVibrations = 'good_vibrations',
  HiveMind = 'hive_mind',
  HullPolarization = 'hull_polarization',
  HypersensitivePhotovoltaics = 'hypersensitive_photovoltaics',
  InspiringArchitecture = 'inspiring_architecture',
  InterplanetaryLearning = 'interplanetary_learning',
  LakeVaporators = 'lake_vaporators-',
  LandscapingNanites = 'landscaping_nanites-',
  MagneticExtraction = 'magnetic_extraction',
  MarsMarketing = 'mars_marketing',
  MartianbornIngenuity = 'martianborn_ingenuity',
  MartianDiet = 'martian_diet',
  MartianSteel = 'martian_steel',
  MolePeople = 'mole_people',
  MultispiralArchitecture = 'multispiral_architecture',
  NanoRefinement = 'nano_refinement',
  NeoConcrete = 'neo-concrete',
  NeuralEmpathy = 'neural_empathy',
  NocturnalAdaptation = 'nocturnal_adaptation',
  OverchargeAmplification = 'overcharge_amplifications',
  PlasmaRocket = 'plasma_rocket',
  PlutoniumSynthesis = 'plutonium_synthesis',
  PrefabCompression = 'prefab_compression',
  PrintedElectronics = 'printed_electronics',
  ProjectPhoenix = 'project_phoenix',
  RapidSleep = 'rapid_sleep',
  ResilientVegetation = 'broadleaf_adaptation-',
  SafeMode = 'safe_mode',
  ServiceBots = 'service_bots',
  SoylentGreen = 'soylent_green',
  SpaceRehabilitation = 'space_rehabilitation',
  SuperconductingComputing = 'superconducting_computing',
  Superfungus = 'superfungus',
  SuperiorCables = 'superior_cables',
  SuperiorPipes = 'superior_pipes',
  SustainedWorkload = 'sustainable_overtime',
  ThePositronicBrain = 'the_positronic_brain',
  VectorPump = 'vector_pump',
  VehicleWeightOptimizations = 'vehicle_optimization',
  'Vocation-Oriented Society' = 'vocation-oriented_society',
  WirelessPower = 'wireless_power',
  ZeroSpaceComputing = 'zero-space_computing',
}

// type BreakthroughId =
//   | 'AncientTerraformingDevice'
//   | 'DesignedForestation'
//   | 'LakeVaporators'
//   | 'LandscapingNanites'
//   | 'ResilientVegetation'
//   | 'CaptureAsteroid'
//   | 'CargobayOfHolding'
//   | 'ConstructionNanites'
//   | 'GlobalSupport'
//   | 'MarsMarketing'
//   | 'MolePeople'
//   | 'VehicleWeightOptimizations'
//   | 'HullPolarization'
//   | 'ProjectPhoenix'
//   | 'SoylentGreen'
//   | 'NeuralEmpathy'
//   | 'RapidSleep'
//   | 'ThePositronicBrain'
//   | 'SafeMode'
//   | 'HiveMind'
//   | 'SpaceRehabilitation'
//   | 'WirelessPower'
//   | 'PrintedElectronics'
//   | 'CoreMetals'
//   | 'CoreWater'
//   | 'CoreRareMetals'
//   | 'SuperiorCables'
//   | 'SuperiorPipes'
//   | 'AlienImprints'
//   | 'NocturnalAdaptation'
//   | 'GeneSelection'
//   | 'MartianDiet'
//   | 'EternalFusion'
//   | 'SuperconductingComputing'
//   | 'NanoRefinement'
//   | 'ArtificialMuscles'
//   | 'InspiringArchitecture'
//   | 'GiantCrops'
//   | 'NeoConcrete'
//   | 'AdvancedDroneDrive'
//   | 'DryFarming'
//   | 'MartianSteel'
//   | 'VectorPump'
//   | 'Superfungus'
//   | 'HypersensitivePhotovoltaics'
//   | 'FrictionlessComposites'
//   | 'ZeroSpaceComputing'
//   | 'MultispiralArchitecture'
//   | 'MagneticExtraction'
//   | 'SustainedWorkload'
//   | 'ForeverYoung'
//   | 'MartianbornIngenuity'
//   | 'CryoSleep'
//   | 'Cloning'
//   | 'GoodVibrations'
//   | 'DomeStreamlining'
//   | 'PrefabCompression'
//   | 'ExtractorAI'
//   | 'ServiceBots'
//   | 'OverchargeAmplification'
//   | 'PlutoniumSynthesis'
//   | 'InterplanetaryLearning'
//   | 'Vocation-Oriented Society'
//   | 'PlasmaRocket'
//   | 'AutonomousHubs'
//   | 'FactoryAutomation'
//   | 'GemArchitecture';
