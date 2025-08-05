export const EOP_REFERENCES = {
  'chiller': [
    {
      number: 'EOP-CHILL-001',
      title: 'Chiller Emergency Shutdown',
      relevantFor: ['maintenance', 'refrigerant leak', 'electrical fault']
    },
    {
      number: 'EOP-COOL-002',
      title: 'Loss of Cooling Response',
      relevantFor: ['chiller failure', 'pump failure']
    },
    {
      number: 'EOP-REFR-003',
      title: 'Refrigerant Leak Response',
      relevantFor: ['refrigerant work', 'pressure testing']
    }
  ],
  'generator': [
    {
      number: 'EOP-GEN-001',
      title: 'Generator Emergency Shutdown',
      relevantFor: ['generator maintenance', 'fuel system work']
    },
    {
      number: 'EOP-POWER-002',
      title: 'Total Power Failure Response',
      relevantFor: ['electrical work', 'ATS maintenance']
    }
  ],
  'ups': [
    {
      number: 'EOP-UPS-001',
      title: 'UPS Emergency Bypass',
      relevantFor: ['UPS maintenance', 'battery replacement']
    }
  ]
};

export function getRelevantEOPs(equipmentType, workType) {
  const eops = EOP_REFERENCES[equipmentType.toLowerCase()] || [];
  return eops.filter(eop => 
    eop.relevantFor.some(relevant => 
      workType.toLowerCase().includes(relevant)
    )
  );
}