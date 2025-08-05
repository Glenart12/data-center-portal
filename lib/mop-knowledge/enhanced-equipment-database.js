import { EQUIPMENT_DATABASE } from '../mop-knowledge';

// Enhanced equipment database with citation sources
export const ENHANCED_EQUIPMENT_DATABASE = {
  ...EQUIPMENT_DATABASE,
  'YORK': {
    'YVAA0350': {
      type: 'Air-Cooled Screw Chiller',
      coolingCapacity: '350 tons',
      powerRequirements: '480V/3PH/60Hz',
      refrigerant: {
        type: 'R-134a',
        charge: '250 lbs',
        source: {
          type: 'manufacturer_manual',
          document: 'York YVAA Operation Manual',
          documentId: '160.75-OM1',
          page: '3-2',
          section: 'Refrigerant Specifications'
        }
      },
      compressors: {
        count: 2,
        circuits: 2,
        source: {
          type: 'manufacturer_spec',
          document: 'York YVAA Technical Guide',
          page: '2-14'
        }
      },
      operationalDataPoints: [
        'Evaporator Entering Water Temp',
        'Evaporator Leaving Water Temp',
        'Condenser Entering Air Temp',
        'Suction Pressure',
        'Discharge Pressure',
        'Oil Pressure',
        'Compressor RLA %',
        'VSD Speed'
      ],
      torqueSpecs: {
        powerConnections: {
          value: '45 ft-lbs',
          source: {
            type: 'manufacturer_bulletin',
            document: 'York Service Bulletin SB-YVAA-001',
            section: 'Electrical Torque Values'
          }
        }
      }
    }
  }
};

// Function to get equipment data
export function getEquipmentData(manufacturer, model) {
  return ENHANCED_EQUIPMENT_DATABASE[manufacturer]?.[model] || null;
}

// Function to get compressor count for operational data tables
export function getCompressorCount(manufacturer, model) {
  const equipment = ENHANCED_EQUIPMENT_DATABASE[manufacturer]?.[model];
  return equipment?.compressors?.count || 1;
}