import { NextResponse } from 'next/server';

export async function GET() {
  const geojson = {
    type: 'FeatureCollection',
    features: [
      // ================= DELHI NCR =================
      {
        type: 'Feature',
        id: 'road-delhi-1',
        properties: {
          id: 'road-delhi-1',
          name: 'Connaught Place Outer Circle',
          city: 'Delhi',
          state: 'Delhi (NCT)',
          ward: 'Ward 34 - NDMC',
          healthScore: 74,
          status: 'Fair',
          trafficVolume: '4,200 PCU/hr',
          potholesCount: 3,
          inspectionId: 'IR-DEL-2026-0527',
          historicalScores: [88, 85, 81, 78, 76, 74],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [77.214, 28.633],
            [77.218, 28.635],
            [77.221, 28.632],
            [77.219, 28.628],
            [77.214, 28.630],
            [77.214, 28.633],
          ],
        },
      },
      {
        type: 'Feature',
        id: 'road-delhi-2',
        properties: {
          id: 'road-delhi-2',
          name: 'Outer Ring Road (IIT Flyover Stretch)',
          city: 'Delhi',
          state: 'Delhi (NCT)',
          ward: 'Ward 12 - South Delhi',
          healthScore: 38,
          status: 'Critical',
          trafficVolume: '9,400 PCU/hr',
          potholesCount: 12,
          inspectionId: 'IR-DEL-2026-0528',
          historicalScores: [68, 62, 54, 47, 41, 38],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [77.185, 28.548],
            [77.193, 28.546],
            [77.202, 28.544],
          ],
        },
      },
      {
        type: 'Feature',
        id: 'road-delhi-3',
        properties: {
          id: 'road-delhi-3',
          name: 'Dwarka Expressway Sector 21',
          city: 'Delhi',
          state: 'Delhi (NCT)',
          ward: 'Ward 08 - Dwarka',
          healthScore: 92,
          status: 'Good',
          trafficVolume: '5,600 PCU/hr',
          potholesCount: 0,
          inspectionId: 'IR-DEL-2026-0529',
          historicalScores: [98, 97, 95, 94, 93, 92],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [77.050, 28.555],
            [77.058, 28.552],
            [77.065, 28.548],
          ],
        },
      },

      // ================= UTTAR PRADESH =================
      {
        type: 'Feature',
        id: 'road-up-1',
        properties: {
          id: 'road-up-1',
          name: 'Gomti Nagar Shaheed Path Corridor',
          city: 'Lucknow',
          state: 'Uttar Pradesh',
          ward: 'Zone 4 - Gomti Nagar',
          healthScore: 68,
          status: 'Fair',
          trafficVolume: '7,200 PCU/hr',
          potholesCount: 5,
          inspectionId: 'IR-LKO-2026-0601',
          historicalScores: [82, 79, 75, 72, 70, 68],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [80.985, 26.845],
            [80.998, 26.852],
            [81.012, 26.861],
          ],
        },
      },
      {
        type: 'Feature',
        id: 'road-up-2',
        properties: {
          id: 'road-up-2',
          name: 'Purvanchal Expressway Km 42',
          city: 'Lucknow',
          state: 'Uttar Pradesh',
          ward: 'Package 1 - UPEDA',
          healthScore: 88,
          status: 'Good',
          trafficVolume: '8,400 PCU/hr',
          potholesCount: 1,
          inspectionId: 'IR-PE-2026-0602',
          historicalScores: [95, 93, 91, 90, 89, 88],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [81.120, 26.780],
            [81.160, 26.760],
            [81.200, 26.740],
          ],
        },
      },
      {
        type: 'Feature',
        id: 'road-up-3',
        properties: {
          id: 'road-up-3',
          name: 'Varanasi Ring Road Phase II',
          city: 'Varanasi',
          state: 'Uttar Pradesh',
          ward: 'Zone 2 - Shivpur',
          healthScore: 46,
          status: 'Critical',
          trafficVolume: '6,100 PCU/hr',
          potholesCount: 8,
          inspectionId: 'IR-VNS-2026-0603',
          historicalScores: [72, 65, 58, 52, 49, 46],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [82.960, 25.350],
            [82.980, 25.365],
            [83.005, 25.380],
          ],
        },
      },

      // ================= MAHARASHTRA (MUMBAI & PUNE) =================
      {
        type: 'Feature',
        id: 'road-mumbai-1',
        properties: {
          id: 'road-mumbai-1',
          name: 'Western Express Highway (Andheri Flyover)',
          city: 'Mumbai',
          state: 'Maharashtra',
          ward: 'K-East Ward - Mumbai Suburban',
          healthScore: 42,
          status: 'Critical',
          trafficVolume: '14,800 PCU/hr',
          potholesCount: 9,
          inspectionId: 'IR-BOM-2026-0601',
          historicalScores: [74, 66, 58, 51, 46, 42],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [72.852, 19.112],
            [72.858, 19.124],
            [72.864, 19.138],
          ],
        },
      },
      {
        type: 'Feature',
        id: 'road-mumbai-2',
        properties: {
          id: 'road-mumbai-2',
          name: 'Bandra-Worli Sea Link Approach',
          city: 'Mumbai',
          state: 'Maharashtra',
          ward: 'H-West Ward - Bandra',
          healthScore: 89,
          status: 'Good',
          trafficVolume: '9,200 PCU/hr',
          potholesCount: 0,
          inspectionId: 'IR-BOM-2026-0602',
          historicalScores: [96, 94, 92, 91, 90, 89],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [72.812, 19.040],
            [72.816, 19.030],
            [72.822, 19.015],
          ],
        },
      },
      {
        type: 'Feature',
        id: 'road-pune-1',
        properties: {
          id: 'road-pune-1',
          name: 'Hinjewadi IT Park Phase 1 Main Road',
          city: 'Pune',
          state: 'Maharashtra',
          ward: 'PMRDA Tech Corridor',
          healthScore: 48,
          status: 'Critical',
          trafficVolume: '8,500 PCU/hr',
          potholesCount: 6,
          inspectionId: 'IR-PUN-2026-0601',
          historicalScores: [78, 70, 62, 55, 51, 48],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [73.738, 18.592],
            [73.746, 18.588],
            [73.755, 18.582],
          ],
        },
      },
      {
        type: 'Feature',
        id: 'road-mh-samruddhi',
        properties: {
          id: 'road-mh-samruddhi',
          name: 'Samruddhi Mahamarg (Nagpur-Mumbai Expressway)',
          city: 'Nagpur',
          state: 'Maharashtra',
          ward: 'Package 14 - MSRDC',
          healthScore: 94,
          status: 'Good',
          trafficVolume: '6,200 PCU/hr',
          potholesCount: 0,
          inspectionId: 'IR-SMR-2026-0604',
          historicalScores: [99, 98, 97, 96, 95, 94],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [79.050, 21.120],
            [79.080, 21.140],
            [79.110, 21.160],
          ],
        },
      },

      // ================= KARNATAKA (BENGALURU) =================
      {
        type: 'Feature',
        id: 'road-blr-1',
        properties: {
          id: 'road-blr-1',
          name: 'Outer Ring Road (Bellandur EcoSpace)',
          city: 'Bengaluru',
          state: 'Karnataka',
          ward: 'Mahadevapura Zone - BBMP',
          healthScore: 39,
          status: 'Critical',
          trafficVolume: '13,500 PCU/hr',
          potholesCount: 11,
          inspectionId: 'IR-BLR-2026-0601',
          historicalScores: [72, 64, 55, 48, 43, 39],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [77.675, 12.932],
            [77.683, 12.938],
            [77.692, 12.945],
          ],
        },
      },
      {
        type: 'Feature',
        id: 'road-blr-2',
        properties: {
          id: 'road-blr-2',
          name: 'Electronic City Elevated Expressway',
          city: 'Bengaluru',
          state: 'Karnataka',
          ward: 'Bommanahalli Zone - BBMP',
          healthScore: 86,
          status: 'Good',
          trafficVolume: '8,200 PCU/hr',
          potholesCount: 1,
          inspectionId: 'IR-BLR-2026-0602',
          historicalScores: [94, 92, 90, 88, 87, 86],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [77.638, 12.875],
            [77.652, 12.862],
            [77.668, 12.848],
          ],
        },
      },

      // ================= TELANGANA (HYDERABAD) =================
      {
        type: 'Feature',
        id: 'road-hyd-1',
        properties: {
          id: 'road-hyd-1',
          name: 'HITEC City Cyber Towers Corridor',
          city: 'Hyderabad',
          state: 'Telangana',
          ward: 'Serilingampally Zone - GHMC',
          healthScore: 71,
          status: 'Fair',
          trafficVolume: '10,400 PCU/hr',
          potholesCount: 4,
          inspectionId: 'IR-HYD-2026-0601',
          historicalScores: [86, 82, 78, 75, 73, 71],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [78.375, 17.442],
            [78.382, 17.447],
            [78.390, 17.452],
          ],
        },
      },
      {
        type: 'Feature',
        id: 'road-hyd-2',
        properties: {
          id: 'road-hyd-2',
          name: 'Nehru Outer Ring Road (Gachibowli Junction)',
          city: 'Hyderabad',
          state: 'Telangana',
          ward: 'HMDA ORR Corridor',
          healthScore: 91,
          status: 'Good',
          trafficVolume: '9,800 PCU/hr',
          potholesCount: 0,
          inspectionId: 'IR-HYD-2026-0602',
          historicalScores: [97, 95, 94, 93, 92, 91],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [78.345, 17.410],
            [78.358, 17.420],
            [78.372, 17.432],
          ],
        },
      },

      // ================= TAMIL NADU (CHENNAI) =================
      {
        type: 'Feature',
        id: 'road-maa-1',
        properties: {
          id: 'road-maa-1',
          name: 'OMR IT Expressway (Sholinganallur)',
          city: 'Chennai',
          state: 'Tamil Nadu',
          ward: 'Sholinganallur Zone - GCC',
          healthScore: 65,
          status: 'Fair',
          trafficVolume: '11,200 PCU/hr',
          potholesCount: 5,
          inspectionId: 'IR-MAA-2026-0601',
          historicalScores: [80, 76, 72, 69, 67, 65],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [80.235, 12.890],
            [80.243, 12.900],
            [80.250, 12.912],
          ],
        },
      },
      {
        type: 'Feature',
        id: 'road-maa-2',
        properties: {
          id: 'road-maa-2',
          name: 'GST Road Kathipara Elevated Junction',
          city: 'Chennai',
          state: 'Tamil Nadu',
          ward: 'Alandur Zone - GCC',
          healthScore: 47,
          status: 'Critical',
          trafficVolume: '15,600 PCU/hr',
          potholesCount: 8,
          inspectionId: 'IR-MAA-2026-0602',
          historicalScores: [75, 68, 60, 54, 50, 47],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [80.190, 12.990],
            [80.198, 12.996],
            [80.205, 13.004],
          ],
        },
      },

      // ================= KERALA (KOCHI) =================
      {
        type: 'Feature',
        id: 'road-kerala-1',
        properties: {
          id: 'road-kerala-1',
          name: 'Kochi Seaport-Airport Road Corridor',
          city: 'Kochi',
          state: 'Kerala',
          ward: 'Thrikkakara Zone - KMC',
          healthScore: 54,
          status: 'Fair',
          trafficVolume: '6,400 PCU/hr',
          potholesCount: 6,
          inspectionId: 'IR-COK-2026-0601',
          historicalScores: [76, 70, 64, 59, 56, 54],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [76.330, 9.995],
            [76.345, 10.010],
            [76.360, 10.025],
          ],
        },
      },

      // ================= RAJASTHAN (JAIPUR) =================
      {
        type: 'Feature',
        id: 'road-rj-1',
        properties: {
          id: 'road-rj-1',
          name: 'Tonk Road Elevated Arterial',
          city: 'Jaipur',
          state: 'Rajasthan',
          ward: 'Sanganer Zone - JMC',
          healthScore: 62,
          status: 'Fair',
          trafficVolume: '7,800 PCU/hr',
          potholesCount: 4,
          inspectionId: 'IR-JAI-2026-0601',
          historicalScores: [79, 74, 70, 66, 64, 62],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [75.795, 26.860],
            [75.805, 26.840],
            [75.815, 26.820],
          ],
        },
      },

      // ================= WEST BENGAL (KOLKATA) =================
      {
        type: 'Feature',
        id: 'road-ccu-1',
        properties: {
          id: 'road-ccu-1',
          name: 'Eastern Metropolitan Bypass (Salt Lake Sec V)',
          city: 'Kolkata',
          state: 'West Bengal',
          ward: 'Bidhannagar Zone - BMC',
          healthScore: 52,
          status: 'Fair',
          trafficVolume: '10,900 PCU/hr',
          potholesCount: 7,
          inspectionId: 'IR-CCU-2026-0601',
          historicalScores: [74, 67, 61, 56, 54, 52],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [88.390, 22.540],
            [88.398, 22.548],
            [88.406, 22.558],
          ],
        },
      },

      // ================= BIHAR (PATNA) =================
      {
        type: 'Feature',
        id: 'road-bihar-1',
        properties: {
          id: 'road-bihar-1',
          name: 'Patna Marine Drive (Loknayak Ganga Path)',
          city: 'Patna',
          state: 'Bihar',
          ward: 'Digha-Didarganj Corridor',
          healthScore: 84,
          status: 'Good',
          trafficVolume: '5,800 PCU/hr',
          potholesCount: 1,
          inspectionId: 'IR-PAT-2026-0601',
          historicalScores: [92, 90, 88, 86, 85, 84],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [85.110, 25.620],
            [85.135, 25.625],
            [85.160, 25.628],
          ],
        },
      },

      // ================= MADHYA PRADESH (INDORE / BHOPAL) =================
      {
        type: 'Feature',
        id: 'road-mp-1',
        properties: {
          id: 'road-mp-1',
          name: 'Indore Super Corridor (Airport Road)',
          city: 'Indore',
          state: 'Madhya Pradesh',
          ward: 'Zone 1 - IDA',
          healthScore: 82,
          status: 'Good',
          trafficVolume: '6,900 PCU/hr',
          potholesCount: 2,
          inspectionId: 'IR-IDR-2026-0601',
          historicalScores: [91, 89, 87, 85, 83, 82],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [75.820, 22.740],
            [75.835, 22.755],
            [75.850, 22.770],
          ],
        },
      },

      // ================= ASSAM & NORTH-EAST (GUWAHATI) =================
      {
        type: 'Feature',
        id: 'road-assam-1',
        properties: {
          id: 'road-assam-1',
          name: 'GS Road (Khanapara to Dispur Corridor)',
          city: 'Guwahati',
          state: 'Assam',
          ward: 'Dispur Zone - GMC',
          healthScore: 49,
          status: 'Critical',
          trafficVolume: '7,400 PCU/hr',
          potholesCount: 6,
          inspectionId: 'IR-GAU-2026-0601',
          historicalScores: [75, 68, 61, 55, 52, 49],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [91.770, 26.130],
            [91.785, 26.140],
            [91.800, 26.150],
          ],
        },
      },

      // ================= HIMALAYAN / HIGH ALTITUDE (SRINAGAR & LEH) =================
      {
        type: 'Feature',
        id: 'road-jk-1',
        properties: {
          id: 'road-jk-1',
          name: 'Boulevard Road Dal Lake Corridor',
          city: 'Srinagar',
          state: 'Jammu & Kashmir',
          ward: 'Dalgate Zone - SMC',
          healthScore: 66,
          status: 'Fair',
          trafficVolume: '4,100 PCU/hr',
          potholesCount: 4,
          inspectionId: 'IR-SXR-2026-0601',
          historicalScores: [83, 78, 73, 70, 68, 66],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [74.830, 34.080],
            [74.845, 34.090],
            [74.860, 34.100],
          ],
        },
      },
      {
        type: 'Feature',
        id: 'road-ladakh-1',
        properties: {
          id: 'road-ladakh-1',
          name: 'Leh-Manali Highway (Karu Sector)',
          city: 'Leh',
          state: 'Ladakh',
          ward: 'Project Himank - BRO',
          healthScore: 78,
          status: 'Fair',
          trafficVolume: '1,800 PCU/hr',
          potholesCount: 3,
          inspectionId: 'IR-LEH-2026-0601',
          historicalScores: [90, 86, 83, 81, 79, 78],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [77.560, 34.130],
            [77.580, 34.145],
            [77.600, 34.160],
          ],
        },
      },

      // ================= NATIONAL HIGHWAY ARTERIALS =================
      {
        type: 'Feature',
        id: 'road-nh-44',
        properties: {
          id: 'road-nh-44',
          name: 'NH-44 North-South Corridor (Nagpur-Hyderabad Section)',
          city: 'Hyderabad',
          state: 'Telangana',
          ward: 'NHAI Package 7',
          healthScore: 72,
          status: 'Fair',
          trafficVolume: '16,400 PCU/hr',
          potholesCount: 6,
          inspectionId: 'IR-NH44-2026-0601',
          historicalScores: [85, 81, 77, 75, 73, 72],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [78.420, 17.520],
            [78.435, 17.560],
            [78.450, 17.600],
          ],
        },
      },
      {
        type: 'Feature',
        id: 'road-nh-48',
        properties: {
          id: 'road-nh-48',
          name: 'NH-48 Golden Quadrilateral (Vadodara-Surat Highway)',
          city: 'Surat',
          state: 'Gujarat',
          ward: 'NHAI Gujarat Section',
          healthScore: 81,
          status: 'Good',
          trafficVolume: '18,200 PCU/hr',
          potholesCount: 2,
          inspectionId: 'IR-NH48-2026-0601',
          historicalScores: [91, 88, 86, 84, 82, 81],
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [72.880, 21.220],
            [72.910, 21.260],
            [72.940, 21.300],
          ],
        },
      },
    ],
  };

  return NextResponse.json(geojson);
}
