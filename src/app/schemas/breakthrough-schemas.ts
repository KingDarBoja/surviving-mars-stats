import { LocaleSchema } from "./locale-schemas";

/** The locale breakthrough desc csv column. */
export type BreakthroughSourceLocaleSchema = {
  break_id: BreakthroughId;
  name_en: string;
  name_br: string;
  name_fr: string;
};

export const BreakthroughMapping = {
  'Ancient Terraforming Device': 'AncientTerraformingDevice',
  'Designed Forestation': 'DesignedForestation',
  'Lake Vaporators': 'LakeVaporators',
  'Landscaping Nanites': 'LandscapingNanites',
  'Resilient Vegetation': 'ResilientVegetation',
  'Capture Asteroid': 'CaptureAsteroid',
  'Cargobay of holding': 'CargobayOfHolding',
  'Construction Nanites': 'ConstructionNanites',
  'Global Support': 'GlobalSupport',
  'Mars Marketing': 'MarsMarketing',
  'Mole People': 'MolePeople',
  'Vehicle Weight Optimizations': 'VehicleWeightOptimizations',
  'Hull Polarization': 'HullPolarization',
  'Project Phoenix': 'ProjectPhoenix',
  'Soylent Green': 'SoylentGreen',
  'Neural Empathy': 'NeuralEmpathy',
  'Rapid Sleep': 'RapidSleep',
  'The Positronic Brain': 'ThePositronicBrain',
  'Safe Mode': 'SafeMode',
  'Hive Mind': 'HiveMind',
  'Space Rehabilitation': 'SpaceRehabilitation',
  'Wireless Power': 'WirelessPower',
  'Printed Electronics': 'PrintedElectronics',
  'Core Metals': 'CoreMetals',
  'Core Water': 'CoreWater',
  'Core Rare Metals': 'CoreRareMetals',
  'Superior Cables': 'SuperiorCables',
  'Superior Pipes': 'SuperiorPipes',
  'Alien Imprints': 'AlienImprints',
  'Nocturnal Adaptation': 'NocturnalAdaptation',
  'Gene Selection': 'GeneSelection',
  'Martian Diet': 'MartianDiet',
  'Eternal Fusion': 'EternalFusion',
  'Superconducting Computing': 'SuperconductingComputing',
  'Nano Refinement': 'NanoRefinement',
  'Artificial Muscles': 'ArtificialMuscles',
  'Inspiring Architecture': 'InspiringArchitecture',
  'Giant Crops': 'GiantCrops',
  'Neo-Concrete': 'NeoConcrete',
  'Advanced Drone Drive': 'AdvancedDroneDrive',
  'Dry Farming': 'DryFarming',
  'Martian Steel': 'MartianSteel',
  'Vector Pump': 'VectorPump',
  Superfungus: 'Superfungus',
  'Hypersensitive Photovoltaics': 'HypersensitivePhotovoltaics',
  'Frictionless Composites': 'FrictionlessComposites',
  'Zero-Space Computing': 'ZeroSpaceComputing',
  'Multispiral Architecture': 'MultispiralArchitecture',
  'Magnetic Extraction': 'MagneticExtraction',
  'Sustained Workload': 'SustainedWorkload',
  'Forever Young': 'ForeverYoung',
  'Martianborn Ingenuity': 'MartianbornIngenuity',
  'Cryo-sleep': 'CryoSleep',
  Cloning: 'Cloning',
  'Good Vibrations': 'GoodVibrations',
  'Dome Streamlining': 'DomeStreamlining',
  'Prefab Compression': 'PrefabCompression',
  'Extractor AI': 'ExtractorAI',
  'Service Bots': 'ServiceBots',
  'Overcharge Amplifications': 'OverchargeAmplification',
  'Plutonium Synthesis': 'PlutoniumSynthesis',
  'Interplanetary Learning': 'InterplanetaryLearning',
  'Vocation-Oriented Society': 'Vocation-Oriented Society',
  'Plasma Rocket': 'PlasmaRocket',
  'Autonomous Hubs': 'AutonomousHubs',
  'Factory Automation': 'FactoryAutomation',
  'Gem Architecture': 'GemArchitecture',
} as const;

export type BreakthroughName = keyof typeof BreakthroughMapping;
export type BreakthroughId =
  (typeof BreakthroughMapping)[keyof typeof BreakthroughMapping];

export type BreakthroughLocaleSchema = {
  id: string;
  name_loc: LocaleSchema;
  desc_loc: LocaleSchema;
};

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
