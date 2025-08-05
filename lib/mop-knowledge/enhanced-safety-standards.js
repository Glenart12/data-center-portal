export const ENHANCED_PPE_REQUIREMENTS = {
  hearing: {
    standard: {
      specification: '90dB exposure limit',
      ppe: '3M E-A-R Classic, 29dB NRR minimum',
      models: ['3M E-A-R Classic (29dB)', 'Howard Leight MAX (33dB)'],
      source: {
        type: 'osha_standard',
        regulation: '29 CFR 1910.95',
        title: 'Occupational Noise Exposure'
      }
    }
  },
  electrical: {
    gloves: {
      specification: 'Class 0, 1000V rated, tested within 6 months',
      models: ['Salisbury E011B', 'Hubbell/Chance C0911B'],
      source: {
        type: 'safety_standard',
        standard: 'NFPA 70E-2024',
        article: '130.7(C)(7)(a)'
      }
    },
    arcFlash: {
      category2: {
        rating: '8 cal/cm²',
        models: ['Oberon TCG2B-S', 'Salisbury SK8'],
        source: {
          type: 'arc_flash_study',
          studyId: 'Site-specific study required',
          standard: 'NFPA 70E Table 130.7(C)(15)(c)'
        }
      }
    }
  },
  respiratory: {
    refrigerant: {
      specification: 'SCBA for > 1000 ppm exposure',
      models: ['3M Scott Air-Pak X3 Pro', 'MSA G1 SCBA'],
      source: {
        type: 'msds_requirement',
        document: 'R-134a SDS Section 8'
      }
    }
  }
};