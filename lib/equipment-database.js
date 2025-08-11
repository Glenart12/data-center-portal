// Equipment specifications database for EOP generation
export const equipmentSpecs = {
  'Carrier': {
    '19XRV5P5': {
      voltage: '460VAC',
      phase: '3-phase',
      controlVoltage: '120VAC',
      refrigerant: 'R-134a',
      vfd: true,
      controlSystem: 'PIC III / CCN',
      arcFlashPPE: 'Category 2',
      compressorType: 'Centrifugal',
      capacity: '500-1500 tons',
      startingMethod: 'VFD Soft Start'
    },
    '19XRV': {
      voltage: '480VAC',
      phase: '3-phase',
      controlVoltage: '120VAC',
      refrigerant: 'R-134a',
      vfd: true,
      controlSystem: 'PIC 6 / CCN',
      arcFlashPPE: 'Category 2',
      compressorType: 'Centrifugal'
    },
    '30XA': {
      voltage: '480VAC',
      phase: '3-phase',
      controlVoltage: '24VAC',
      refrigerant: 'R-134a',
      controlSystem: 'Pro-Dialog Plus',
      arcFlashPPE: 'Category 2',
      compressorType: 'Screw',
      capacity: '80-500 tons'
    },
    '30HXC': {
      voltage: '460VAC',
      phase: '3-phase',
      controlVoltage: '115VAC',
      refrigerant: 'R-134a',
      controlSystem: 'Touch Pilot',
      arcFlashPPE: 'Category 2',
      compressorType: 'Screw'
    },
    '23XRV': {
      voltage: '4160VAC',
      phase: '3-phase',
      controlVoltage: '120VAC',
      refrigerant: 'R-134a',
      vfd: true,
      controlSystem: 'PIC 5',
      arcFlashPPE: 'Category 3',
      compressorType: 'Centrifugal',
      capacity: '450-1500 tons'
    }
  },
  'Trane': {
    'CVHE': {
      voltage: '480VAC',
      phase: '3-phase',
      controlVoltage: '115VAC',
      refrigerant: 'R-123',
      controlSystem: 'Tracer SC+',
      arcFlashPPE: 'Category 2',
      compressorType: 'Centrifugal',
      capacity: '150-400 tons'
    },
    'CVHF': {
      voltage: '460VAC',
      phase: '3-phase',
      controlVoltage: '115VAC',
      refrigerant: 'R-134a',
      controlSystem: 'Tracer SC+',
      arcFlashPPE: 'Category 2',
      compressorType: 'Centrifugal',
      vfd: true
    },
    'RTAC': {
      voltage: '460VAC',
      phase: '3-phase',
      refrigerant: 'R-134a',
      controlSystem: 'UC800',
      arcFlashPPE: 'Category 2',
      compressorType: 'Rotary Screw',
      capacity: '140-500 tons'
    },
    'RTWD': {
      voltage: '480VAC',
      phase: '3-phase',
      controlVoltage: '24VAC',
      refrigerant: 'R-134a',
      controlSystem: 'Tracer UC400',
      arcFlashPPE: 'Category 2',
      compressorType: 'Screw'
    },
    'CenTraVac': {
      voltage: '4160VAC',
      phase: '3-phase',
      controlVoltage: '120VAC',
      refrigerant: 'R-514A',
      vfd: true,
      controlSystem: 'Tracer SC+',
      arcFlashPPE: 'Category 3',
      compressorType: 'Centrifugal'
    }
  },
  'York': {
    'YT': {
      voltage: '460VAC',
      phase: '3-phase',
      controlVoltage: '120VAC',
      refrigerant: 'R-134a',
      controlSystem: 'OptiView',
      vfd: true,
      arcFlashPPE: 'Category 2',
      compressorType: 'Centrifugal',
      capacity: '250-2000 tons'
    },
    'YZ': {
      voltage: '480VAC',
      phase: '3-phase',
      controlVoltage: '120VAC',
      refrigerant: 'R-1233zd',
      controlSystem: 'OptiView',
      vfd: true,
      arcFlashPPE: 'Category 2',
      compressorType: 'Centrifugal'
    },
    'YVAA': {
      voltage: '460VAC',
      phase: '3-phase',
      controlVoltage: '24VAC',
      refrigerant: 'R-134a',
      controlSystem: 'Microcomputer Control Center',
      vfd: true,
      arcFlashPPE: 'Category 2',
      compressorType: 'Screw'
    },
    'YK': {
      voltage: '4160VAC',
      phase: '3-phase',
      controlVoltage: '120VAC',
      refrigerant: 'R-134a',
      controlSystem: 'OptiView',
      arcFlashPPE: 'Category 3',
      compressorType: 'Centrifugal',
      capacity: '500-3000 tons'
    }
  },
  'Caterpillar': {
    '3516': {
      voltage: '480VAC',
      phase: '3-phase',
      fuelType: 'Diesel',
      controlSystem: 'EMCP 4.4',
      startingVoltage: '24VDC',
      arcFlashPPE: 'Category 2',
      engineType: 'V16 Diesel',
      capacity: '2000-2500 kW',
      coolingSystem: 'Radiator'
    },
    '3512': {
      voltage: '480VAC',
      phase: '3-phase',
      fuelType: 'Diesel',
      controlSystem: 'EMCP 4.2',
      startingVoltage: '24VDC',
      arcFlashPPE: 'Category 2',
      engineType: 'V12 Diesel',
      capacity: '1000-1500 kW'
    },
    'C175': {
      voltage: '4160VAC',
      phase: '3-phase',
      fuelType: 'Diesel',
      controlSystem: 'EMCP 4.4',
      startingVoltage: '24VDC',
      arcFlashPPE: 'Category 3',
      engineType: 'V20 Diesel',
      capacity: '3000-4000 kW'
    },
    'C32': {
      voltage: '480VAC',
      phase: '3-phase',
      fuelType: 'Diesel',
      controlSystem: 'EMCP 4.1',
      startingVoltage: '24VDC',
      arcFlashPPE: 'Category 2',
      engineType: 'V12 Diesel',
      capacity: '830-1250 kW'
    }
  },
  'Liebert': {
    'DS': {
      voltage: '480VAC',
      phase: '3-phase',
      controlVoltage: '120VAC',
      refrigerant: 'R-410A',
      controlSystem: 'iCOM',
      arcFlashPPE: 'Category 1',
      unitType: 'CRAC',
      capacity: '28-105 kW',
      airflow: '7000-21000 CFM'
    },
    'DSE': {
      voltage: '460VAC',
      phase: '3-phase',
      controlVoltage: '24VAC',
      refrigerant: 'R-410A',
      controlSystem: 'iCOM S',
      arcFlashPPE: 'Category 1',
      unitType: 'CRAC',
      economizer: true
    },
    'CRV': {
      voltage: '208VAC',
      phase: '3-phase',
      controlVoltage: '24VAC',
      refrigerant: 'R-410A',
      controlSystem: 'Liebert iCOM',
      arcFlashPPE: 'Category 1',
      unitType: 'Row Cooling',
      capacity: '20-40 kW'
    },
    'PDX': {
      voltage: '480VAC',
      phase: '3-phase',
      controlVoltage: '120VAC',
      refrigerant: 'R-410A',
      controlSystem: 'iCOM',
      arcFlashPPE: 'Category 1',
      unitType: 'CRAC',
      directDrive: true
    },
    'NXR': {
      voltage: '480VAC',
      phase: '3-phase',
      controlVoltage: '120VAC',
      batteryType: 'VRLA',
      controlSystem: 'Intellislot',
      arcFlashPPE: 'Category 2',
      unitType: 'UPS',
      capacity: '40-200 kVA',
      topology: 'Double Conversion'
    }
  },
  'Eaton': {
    '9395': {
      voltage: '480VAC',
      phase: '3-phase',
      controlVoltage: '120VAC',
      batteryType: 'VRLA',
      controlSystem: 'Power Xpert',
      arcFlashPPE: 'Category 2',
      unitType: 'UPS',
      capacity: '225-1100 kVA',
      topology: 'Double Conversion'
    },
    '93PM': {
      voltage: '480VAC',
      phase: '3-phase',
      controlVoltage: '120VAC',
      batteryType: 'VRLA or Li-Ion',
      controlSystem: 'HMI Touch Screen',
      arcFlashPPE: 'Category 2',
      unitType: 'UPS',
      capacity: '30-200 kW'
    }
  },
  'Schneider': {
    'Galaxy': {
      voltage: '480VAC',
      phase: '3-phase',
      controlVoltage: '120VAC',
      batteryType: 'VRLA or Li-Ion',
      controlSystem: 'HMI Touch Display',
      arcFlashPPE: 'Category 2',
      unitType: 'UPS',
      capacity: '500-1500 kVA'
    },
    'Symmetra': {
      voltage: '480VAC',
      phase: '3-phase',
      controlVoltage: '120VAC',
      batteryType: 'VRLA',
      controlSystem: 'PowerView',
      arcFlashPPE: 'Category 2',
      unitType: 'UPS',
      modular: true
    }
  }
};

// Helper function to find equipment specs
export function getEquipmentSpecs(manufacturer, modelNumber) {
  if (!manufacturer || !modelNumber) return null;
  
  const mfgData = equipmentSpecs[manufacturer];
  if (!mfgData) return null;
  
  // Clean the model number for matching
  const cleanModel = modelNumber.toUpperCase().replace(/[^A-Z0-9]/g, '');
  
  // Try exact match first
  if (mfgData[modelNumber]) return mfgData[modelNumber];
  
  // Try exact match with cleaned model
  for (const [model, specs] of Object.entries(mfgData)) {
    const cleanDbModel = model.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (cleanModel === cleanDbModel) {
      return specs;
    }
  }
  
  // Try partial match (model starts with database entry)
  for (const [model, specs] of Object.entries(mfgData)) {
    if (modelNumber.toUpperCase().startsWith(model.toUpperCase()) || 
        model.toUpperCase().startsWith(modelNumber.toUpperCase().substring(0, 4))) {
      return specs;
    }
  }
  
  // Try partial match with cleaned versions
  for (const [model, specs] of Object.entries(mfgData)) {
    const cleanDbModel = model.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (cleanModel.startsWith(cleanDbModel) || cleanDbModel.startsWith(cleanModel.substring(0, 4))) {
      return specs;
    }
  }
  
  return null;
}

// Helper function to get emergency-specific PPE requirements
export function getEmergencyPPE(emergencyType, specs) {
  const basePPE = specs?.arcFlashPPE || 'Category 2';
  
  if (emergencyType.includes('Refrigerant') || emergencyType.includes('Leak')) {
    return {
      arcFlash: basePPE,
      respiratory: 'SCBA or Full-face Respirator with Acid Gas Cartridge',
      additional: 'Chemical-resistant gloves, Eye protection'
    };
  }
  
  if (emergencyType.includes('Fire') || emergencyType.includes('Smoke')) {
    return {
      arcFlash: basePPE,
      respiratory: 'N95 minimum, SCBA if active fire',
      additional: 'Fire-resistant clothing, Heat-resistant gloves'
    };
  }
  
  if (emergencyType.includes('Water') || emergencyType.includes('Flood')) {
    return {
      arcFlash: basePPE,
      additional: 'Rubber boots, Waterproof gloves, Rain gear'
    };
  }
  
  return {
    arcFlash: basePPE,
    additional: 'Safety glasses, Work gloves'
  };
}