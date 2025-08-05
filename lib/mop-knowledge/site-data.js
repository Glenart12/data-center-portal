export const SITE_DATA = {
  "stewart": {
    name: "Stewart Data Center",
    address: {
      street: "123 Stewart Avenue",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA",
      fullAddress: "123 Stewart Avenue, New York, NY 10001, USA" // For AHJ requirements
    },
    ahjRegulations: {
      fireCode: "NFPA 70",
      electricalCode: "NEC 2023",
      buildingCode: "IBC 2021",
      localOrdinances: ["NYC Local Law 97", "NYC Energy Code"],
      jurisdiction: "New York City Department of Buildings"
    },
    emergencyContacts: {
      fire: "911 - FDNY Station 54",
      police: "911 - NYPD Precinct 10",
      medical: "911 - Mount Sinai Hospital",
      localEmergencyServices: {
        fireStation: "FDNY Station 54 - 782 8th Ave, New York, NY 10036",
        hospital: "Mount Sinai Hospital - 1468 Madison Ave, New York, NY 10029",
        responseTime: "Average 5-7 minutes"
      },
      utility: {
        electric: "Con Edison Emergency: 1-800-75-CONED",
        water: "NYC DEP: 311",
        gas: "National Grid: 1-718-643-4050"
      }
    },
    notificationContacts: {
      dataOpsManager: {
        title: "Data Center Operations Manager",
        name: "UPDATE NEEDED",
        phone: "UPDATE NEEDED",
        email: "UPDATE NEEDED"
      },
      siteSecurity: {
        title: "Site Security",
        name: "Security Desk",
        phone: "UPDATE NEEDED",
        email: "UPDATE NEEDED"
      },
      nocOperator: {
        title: "NOC/BMS Operator",
        name: "NOC 24/7",
        phone: "UPDATE NEEDED",
        email: "UPDATE NEEDED"
      }
    },
    escalationProcedure: {
      level1: "Facility Technician",
      level2: "Lead Technician",
      level3: "Chief Engineer",
      level4: "Data Center Manager",
      level5: "Equipment Manufacturer Service Representative"
    }
  }
};

export function getSiteData(location) {
  return SITE_DATA[location] || SITE_DATA.stewart;
}