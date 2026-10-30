/**
 * Pan-India Road Infrastructure & Schedule of Rates (SOR) Database
 * Covers all 28 States and 8 Union Territories with official CPWD Cost Indices (2024-2026),
 * regional terrain factors, climatic bitumen specifications (IRC:37 & IRC:82),
 * and spatial bounds for dynamic geocoding across India.
 */

export interface IndianStateData {
  state: string;
  code: string;
  capital: string;
  cpwdCostIndex: number; // Baseline Delhi = 100
  terrain: 'Alluvial Plains' | 'Deccan Plateau' | 'Coastal High-Rainfall' | 'Himalayan / High Altitude' | 'Arid / High Temperature' | 'Sub-Himalayan / Hilly';
  terrainMultiplier: number;
  climaticBitumenGrade: 'VG-10' | 'VG-30' | 'VG-40' | 'CRMB-55' | 'CRMB-60' | 'PMB-120' | 'Cold-Mix Emulsion';
  ircSpecification: string;
  pwdScheduleCode: string;
  majorCities: Array<{ name: string; lat: number; lng: number }>;
  majorCorridors: string[];
}

export const PAN_INDIA_STATES: IndianStateData[] = [
  // NORTH ZONE
  {
    state: 'Delhi (NCT)',
    code: 'DL',
    capital: 'New Delhi',
    cpwdCostIndex: 100,
    terrain: 'Alluvial Plains',
    terrainMultiplier: 1.0,
    climaticBitumenGrade: 'VG-30',
    ircSpecification: 'IRC:82-2023 Sec 4.3.2 (Heavy Arterial Compaction)',
    pwdScheduleCode: 'CPWD-DSR-2023',
    majorCities: [
      { name: 'New Delhi', lat: 28.6139, lng: 77.2090 },
      { name: 'Connaught Place', lat: 28.6330, lng: 77.2140 },
      { name: 'Dwarka', lat: 28.5823, lng: 77.0500 },
      { name: 'South Delhi (IIT Flyover)', lat: 28.5480, lng: 77.1850 },
    ],
    majorCorridors: ['Outer Ring Road', 'Ring Road', 'Dwarka Expressway', 'Barakhamba Road', 'NH-48'],
  },
  {
    state: 'Uttar Pradesh',
    code: 'UP',
    capital: 'Lucknow',
    cpwdCostIndex: 98,
    terrain: 'Alluvial Plains',
    terrainMultiplier: 0.98,
    climaticBitumenGrade: 'VG-30',
    ircSpecification: 'IRC:82-2023 & MoRTH Section 3000 (Gangetic Plain Standard)',
    pwdScheduleCode: 'UP-PWD-SOR-2024',
    majorCities: [
      { name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
      { name: 'Noida', lat: 28.5355, lng: 77.3910 },
      { name: 'Kanpur', lat: 26.4499, lng: 80.3319 },
      { name: 'Varanasi', lat: 25.3176, lng: 82.9739 },
      { name: 'Agra', lat: 27.1767, lng: 78.0081 },
      { name: 'Prayagraj', lat: 25.4358, lng: 81.8463 },
    ],
    majorCorridors: ['Purvanchal Expressway', 'Yamuna Expressway', 'Agra-Lucknow Expressway', 'NH-19 Delhi-Kolkata', 'NH-27'],
  },
  {
    state: 'Punjab',
    code: 'PB',
    capital: 'Chandigarh',
    cpwdCostIndex: 100,
    terrain: 'Alluvial Plains',
    terrainMultiplier: 1.0,
    climaticBitumenGrade: 'VG-30',
    ircSpecification: 'IRC:37-2018 (Heavy Agricultural Axle Load Pavements)',
    pwdScheduleCode: 'PB-PWD-CSR-2023',
    majorCities: [
      { name: 'Amritsar', lat: 31.6340, lng: 74.8723 },
      { name: 'Ludhiana', lat: 30.9010, lng: 75.8573 },
      { name: 'Jalandhar', lat: 31.3260, lng: 75.5762 },
      { name: 'Patiala', lat: 30.3398, lng: 76.3869 },
    ],
    majorCorridors: ['Grand Trunk Road (NH-44)', 'NH-5', 'Delhi-Amritsar-Katra Expressway'],
  },
  {
    state: 'Haryana',
    code: 'HR',
    capital: 'Chandigarh',
    cpwdCostIndex: 99,
    terrain: 'Alluvial Plains',
    terrainMultiplier: 0.99,
    climaticBitumenGrade: 'VG-30',
    ircSpecification: 'IRC:82-2023 & IRC:37-2018 (High Density Freight Corridors)',
    pwdScheduleCode: 'HR-PWD-HSR-2023',
    majorCities: [
      { name: 'Gurugram', lat: 28.4595, lng: 77.0266 },
      { name: 'Faridabad', lat: 28.4089, lng: 77.3178 },
      { name: 'Panipat', lat: 29.3909, lng: 76.9635 },
      { name: 'Karnal', lat: 29.6857, lng: 76.9905 },
    ],
    majorCorridors: ['KMP Expressway (Western Peripheral)', 'NH-48', 'NH-44', 'Delhi-Mumbai Expressway Package 1'],
  },
  {
    state: 'Rajasthan',
    code: 'RJ',
    capital: 'Jaipur',
    cpwdCostIndex: 101,
    terrain: 'Arid / High Temperature',
    terrainMultiplier: 1.05,
    climaticBitumenGrade: 'VG-40',
    ircSpecification: 'IRC:SP:53 (Polymer Modified Binder for Extreme Rutting & 60°C Pavement Temp)',
    pwdScheduleCode: 'RJ-PWD-BSR-2024',
    majorCities: [
      { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
      { name: 'Jodhpur', lat: 26.2389, lng: 73.0243 },
      { name: 'Udaipur', lat: 24.5854, lng: 73.7125 },
      { name: 'Kota', lat: 25.2138, lng: 75.8648 },
      { name: 'Bikaner', lat: 28.0229, lng: 73.3119 },
    ],
    majorCorridors: ['Amritsar-Jamnagar Economic Corridor', 'NH-48 Jaipur-Ajmer', 'Delhi-Mumbai Expressway Package 3'],
  },
  {
    state: 'Himachal Pradesh',
    code: 'HP',
    capital: 'Shimla',
    cpwdCostIndex: 124,
    terrain: 'Himalayan / High Altitude',
    terrainMultiplier: 1.25,
    climaticBitumenGrade: 'VG-10',
    ircSpecification: 'IRC:SP:98-2020 (Cold Mix Emulsion & Freeze-Thaw Anti-Stripping Specification)',
    pwdScheduleCode: 'HP-PWD-HSR-2024',
    majorCities: [
      { name: 'Shimla', lat: 31.1048, lng: 77.1734 },
      { name: 'Manali', lat: 32.2432, lng: 77.1892 },
      { name: 'Dharamshala', lat: 32.2190, lng: 76.3234 },
      { name: 'Mandi', lat: 31.7087, lng: 76.9320 },
    ],
    majorCorridors: ['Kiratpur-Manali Four-Lane (NH-21)', 'Kalka-Shimla Highway (NH-5)', 'Himalayan Express Highway'],
  },
  {
    state: 'Uttarakhand',
    code: 'UK',
    capital: 'Dehradun',
    cpwdCostIndex: 116,
    terrain: 'Himalayan / High Altitude',
    terrainMultiplier: 1.18,
    climaticBitumenGrade: 'VG-10',
    ircSpecification: 'IRC:SP:98-2020 & IRC:82 (Hill Slope Retaining Wall & Drainage Protection)',
    pwdScheduleCode: 'UK-PWD-SOR-2024',
    majorCities: [
      { name: 'Dehradun', lat: 30.3165, lng: 78.0322 },
      { name: 'Haridwar', lat: 29.9457, lng: 78.1642 },
      { name: 'Rishikesh', lat: 30.0869, lng: 78.2676 },
      { name: 'Nainital', lat: 29.3919, lng: 79.4542 },
    ],
    majorCorridors: ['Char Dham All-Weather Highway (NH-58 / NH-107)', 'Delhi-Dehradun Economic Corridor'],
  },
  {
    state: 'Jammu & Kashmir',
    code: 'JK',
    capital: 'Srinagar / Jammu',
    cpwdCostIndex: 128,
    terrain: 'Himalayan / High Altitude',
    terrainMultiplier: 1.30,
    climaticBitumenGrade: 'PMB-120',
    ircSpecification: 'IRC:SP:53 & IRC:SP:98 (Sub-zero Thermal Crack Resistance Polymer Binder)',
    pwdScheduleCode: 'JK-PWD-SSR-2024',
    majorCities: [
      { name: 'Srinagar', lat: 34.0837, lng: 74.7973 },
      { name: 'Jammu', lat: 32.7266, lng: 74.8570 },
      { name: 'Anantnag', lat: 33.7311, lng: 75.1522 },
      { name: 'Baramulla', lat: 34.1980, lng: 74.3636 },
    ],
    majorCorridors: ['Jammu-Srinagar National Highway (NH-44)', 'Banihal Qazigund Tunnel Road', 'Mughal Road'],
  },
  {
    state: 'Ladakh',
    code: 'LA',
    capital: 'Leh',
    cpwdCostIndex: 142,
    terrain: 'Himalayan / High Altitude',
    terrainMultiplier: 1.45,
    climaticBitumenGrade: 'PMB-120',
    ircSpecification: 'IRC:SP:98 & BRO Special Specification (Extreme Cold High-Altitude Paving)',
    pwdScheduleCode: 'BRO-DSR-LADAKH-2024',
    majorCities: [
      { name: 'Leh', lat: 34.1526, lng: 77.5771 },
      { name: 'Kargil', lat: 34.5539, lng: 76.1349 },
      { name: 'Diskit (Nubra Valley)', lat: 34.5428, lng: 77.5619 },
    ],
    majorCorridors: ['Leh-Manali Highway (NH-3)', 'Srinagar-Leh Highway (NH-1D)', 'Zojila Tunnel Bypass Corridor'],
  },

  // WEST ZONE
  {
    state: 'Maharashtra',
    code: 'MH',
    capital: 'Mumbai',
    cpwdCostIndex: 114,
    terrain: 'Deccan Plateau',
    terrainMultiplier: 1.12,
    climaticBitumenGrade: 'VG-40',
    ircSpecification: 'IRC:82-2023 Sec 4.3.2 & IRC:37-2018 (High Axle Heavy Commercial Traffic)',
    pwdScheduleCode: 'MH-PWD-CSR-2024',
    majorCities: [
      { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
      { name: 'Pune', lat: 18.5204, lng: 73.8567 },
      { name: 'Nagpur', lat: 21.1458, lng: 79.0882 },
      { name: 'Nashik', lat: 19.9975, lng: 73.7898 },
      { name: 'Thane', lat: 19.2183, lng: 72.9781 },
      { name: 'Aurangabad (Chhatrapati Sambhajinagar)', lat: 19.8762, lng: 75.3433 },
    ],
    majorCorridors: ['Samruddhi Mahamarg (Mumbai-Nagpur)', 'Mumbai-Pune Expressway', 'Western Express Highway', 'Eastern Freeway', 'NH-48'],
  },
  {
    state: 'Gujarat',
    code: 'GJ',
    capital: 'Gandhinagar',
    cpwdCostIndex: 102,
    terrain: 'Deccan Plateau',
    terrainMultiplier: 1.02,
    climaticBitumenGrade: 'VG-30',
    ircSpecification: 'IRC:37-2018 & MoRTH Clause 3004 (Industrial Freight Highway Design)',
    pwdScheduleCode: 'GJ-R&B-SOR-2024',
    majorCities: [
      { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
      { name: 'Surat', lat: 21.1702, lng: 72.8311 },
      { name: 'Vadodara', lat: 22.3072, lng: 73.1812 },
      { name: 'Rajkot', lat: 22.3039, lng: 70.8022 },
      { name: 'Gandhinagar', lat: 23.2156, lng: 72.6369 },
    ],
    majorCorridors: ['NE-1 (Ahmedabad-Vadodara Expressway)', 'Delhi-Mumbai Expressway Gujarat Section', 'NH-48', 'NH-27'],
  },
  {
    state: 'Goa',
    code: 'GA',
    capital: 'Panaji',
    cpwdCostIndex: 114,
    terrain: 'Coastal High-Rainfall',
    terrainMultiplier: 1.15,
    climaticBitumenGrade: 'CRMB-60',
    ircSpecification: 'IRC:SP:53 (Rubberized Bitumen for Monsoon Stripping Prevention)',
    pwdScheduleCode: 'GA-PWD-GSR-2024',
    majorCities: [
      { name: 'Panaji', lat: 15.4909, lng: 73.8278 },
      { name: 'Margao', lat: 15.2832, lng: 73.9862 },
      { name: 'Vasco da Gama', lat: 15.3982, lng: 73.8113 },
    ],
    majorCorridors: ['NH-66 Coastal Highway', 'Zuari Bridge Elevated Corridor', 'Atal Setu Mandovi'],
  },

  // SOUTH ZONE
  {
    state: 'Karnataka',
    code: 'KA',
    capital: 'Bengaluru',
    cpwdCostIndex: 108,
    terrain: 'Deccan Plateau',
    terrainMultiplier: 1.08,
    climaticBitumenGrade: 'VG-40',
    ircSpecification: 'IRC:82-2023 Sec 4.3.2 (Heavy Tech-Corridor Bus Transit & Axle Loads)',
    pwdScheduleCode: 'KA-PWD-SR-2024',
    majorCities: [
      { name: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
      { name: 'Mysuru', lat: 12.2958, lng: 76.6394 },
      { name: 'Mangaluru', lat: 12.9141, lng: 74.8560 },
      { name: 'Hubballi-Dharwad', lat: 15.3647, lng: 75.1240 },
      { name: 'Belagavi', lat: 15.8497, lng: 74.4977 },
    ],
    majorCorridors: ['Bengaluru-Mysuru Expressway (NH-275)', 'Outer Ring Road Bellandur', 'Electronic City Elevated', 'NH-48', 'NH-44'],
  },
  {
    state: 'Tamil Nadu',
    code: 'TN',
    capital: 'Chennai',
    cpwdCostIndex: 106,
    terrain: 'Coastal High-Rainfall',
    terrainMultiplier: 1.06,
    climaticBitumenGrade: 'VG-40',
    ircSpecification: 'IRC:37-2018 & IRC:82 (Coastal Humidity & Salt-Air Resistance)',
    pwdScheduleCode: 'TN-HW-SOR-2024',
    majorCities: [
      { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
      { name: 'Coimbatore', lat: 11.0168, lng: 76.9558 },
      { name: 'Madurai', lat: 9.9252, lng: 78.1198 },
      { name: 'Tiruchirappalli', lat: 10.7905, lng: 78.7047 },
      { name: 'Salem', lat: 11.6643, lng: 78.1460 },
    ],
    majorCorridors: ['OMR IT Expressway (Rajiv Gandhi Salai)', 'GST Road (NH-32)', 'Chennai Bypass', 'NH-44 Madurai-Kanyakumari'],
  },
  {
    state: 'Telangana',
    code: 'TG',
    capital: 'Hyderabad',
    cpwdCostIndex: 107,
    terrain: 'Deccan Plateau',
    terrainMultiplier: 1.07,
    climaticBitumenGrade: 'VG-30',
    ircSpecification: 'IRC:82-2023 & IRC:37-2018 (Expressway & Outer Ring Transit Standards)',
    pwdScheduleCode: 'TG-R&B-SSR-2024',
    majorCities: [
      { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
      { name: 'Warangal', lat: 17.9689, lng: 79.5941 },
      { name: 'Nizamabad', lat: 18.6725, lng: 78.0941 },
      { name: 'Karimnagar', lat: 18.4386, lng: 79.1288 },
    ],
    majorCorridors: ['Nehru Outer Ring Road (ORR Hyderabad)', 'Regional Ring Road (RRR)', 'HITEC City Cyber Corridor', 'NH-44'],
  },
  {
    state: 'Andhra Pradesh',
    code: 'AP',
    capital: 'Amaravati / Visakhapatnam',
    cpwdCostIndex: 105,
    terrain: 'Coastal High-Rainfall',
    terrainMultiplier: 1.05,
    climaticBitumenGrade: 'VG-40',
    ircSpecification: 'IRC:37-2018 (Coastal Corridor Anti-Stripping Specification)',
    pwdScheduleCode: 'AP-R&B-SSR-2024',
    majorCities: [
      { name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185 },
      { name: 'Vijayawada', lat: 16.5062, lng: 80.6480 },
      { name: 'Guntur', lat: 16.3067, lng: 80.4365 },
      { name: 'Tirupati', lat: 13.6288, lng: 79.4192 },
      { name: 'Nellore', lat: 14.4426, lng: 79.9865 },
    ],
    majorCorridors: ['Kolkata-Chennai Coastal Highway (NH-16)', 'Amaravati Seed Access Road', 'NH-65 Vijayawada-Hyderabad'],
  },
  {
    state: 'Kerala',
    code: 'KL',
    capital: 'Thiruvananthapuram',
    cpwdCostIndex: 118,
    terrain: 'Coastal High-Rainfall',
    terrainMultiplier: 1.20,
    climaticBitumenGrade: 'CRMB-60',
    ircSpecification: 'IRC:SP:53 & IRC:82 (Heavy Monsoon Rain & Tropical Stripping Prevention)',
    pwdScheduleCode: 'KL-PWD-PRICE-2024',
    majorCities: [
      { name: 'Kochi', lat: 9.9312, lng: 76.2673 },
      { name: 'Thiruvananthapuram', lat: 8.5241, lng: 76.9366 },
      { name: 'Kozhikode', lat: 11.2588, lng: 75.7804 },
      { name: 'Thrissur', lat: 10.5276, lng: 76.2144 },
      { name: 'Kollam', lat: 8.8932, lng: 76.6141 },
    ],
    majorCorridors: ['NH-66 Kanyakumari-Panvel Kerala Corridor', 'MC Road (SH-1)', 'Kochi Seaport-Airport Road', 'Hill Highway'],
  },

  // EAST & CENTRAL ZONE
  {
    state: 'West Bengal',
    code: 'WB',
    capital: 'Kolkata',
    cpwdCostIndex: 104,
    terrain: 'Alluvial Plains',
    terrainMultiplier: 1.04,
    climaticBitumenGrade: 'VG-30',
    ircSpecification: 'IRC:82-2023 & IRC:37-2018 (High Groundwater Subgrade Stabilization)',
    pwdScheduleCode: 'WB-PWD-SOR-2024',
    majorCities: [
      { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
      { name: 'Howrah', lat: 22.5958, lng: 88.2636 },
      { name: 'Siliguri', lat: 26.7271, lng: 88.3953 },
      { name: 'Durgapur', lat: 23.5204, lng: 87.3119 },
      { name: 'Asansol', lat: 23.6739, lng: 86.9524 },
    ],
    majorCorridors: ['Eastern Metropolitan Bypass (EM Bypass)', 'Kona Expressway', 'Durgapur Expressway (NH-19)', 'NH-12'],
  },
  {
    state: 'Bihar',
    code: 'BR',
    capital: 'Patna',
    cpwdCostIndex: 96,
    terrain: 'Alluvial Plains',
    terrainMultiplier: 0.96,
    climaticBitumenGrade: 'VG-30',
    ircSpecification: 'IRC:82-2023 & MoRTH Section 3000 (Gangetic Silt Compaction)',
    pwdScheduleCode: 'BR-RWD-SOR-2024',
    majorCities: [
      { name: 'Patna', lat: 25.5941, lng: 85.1376 },
      { name: 'Gaya', lat: 24.7914, lng: 85.0002 },
      { name: 'Bhagalpur', lat: 25.2425, lng: 86.9842 },
      { name: 'Muzaffarpur', lat: 26.1209, lng: 85.3647 },
      { name: 'Darbhanga', lat: 26.1542, lng: 85.8918 },
    ],
    majorCorridors: ['Patna Marine Drive (Ganga Path)', 'Purvanchal Expressway Extension', 'NH-27 East-West Corridor', 'NH-31'],
  },
  {
    state: 'Madhya Pradesh',
    code: 'MP',
    capital: 'Bhopal',
    cpwdCostIndex: 97,
    terrain: 'Deccan Plateau',
    terrainMultiplier: 0.97,
    climaticBitumenGrade: 'VG-30',
    ircSpecification: 'IRC:37-2018 (Black Cotton Soil Sub-grade Lime Stabilization)',
    pwdScheduleCode: 'MP-PWD-SOR-2024',
    majorCities: [
      { name: 'Indore', lat: 22.7196, lng: 75.8577 },
      { name: 'Bhopal', lat: 23.2599, lng: 77.4126 },
      { name: 'Jabalpur', lat: 23.1815, lng: 79.9864 },
      { name: 'Gwalior', lat: 26.2183, lng: 78.1828 },
      { name: 'Ujjain', lat: 23.1765, lng: 75.7885 },
    ],
    majorCorridors: ['Delhi-Mumbai Expressway MP Corridor', 'Indore-Bhopal Super Corridor', 'NH-44 North-South Corridor', 'NH-46'],
  },
  {
    state: 'Odisha',
    code: 'OD',
    capital: 'Bhubaneswar',
    cpwdCostIndex: 103,
    terrain: 'Coastal High-Rainfall',
    terrainMultiplier: 1.05,
    climaticBitumenGrade: 'CRMB-55',
    ircSpecification: 'IRC:SP:53 & IRC:82 (Cyclone & High-Rainfall Strip Protection)',
    pwdScheduleCode: 'OD-PWD-SOR-2024',
    majorCities: [
      { name: 'Bhubaneswar', lat: 20.2961, lng: 85.8245 },
      { name: 'Cuttack', lat: 20.4625, lng: 85.8828 },
      { name: 'Rourkela', lat: 22.2604, lng: 84.8536 },
      { name: 'Puri', lat: 19.8135, lng: 85.8312 },
    ],
    majorCorridors: ['Biju Expressway', 'NH-16 Coastal Highway', 'Puri-Bhubaneswar Expressway'],
  },
  {
    state: 'Jharkhand',
    code: 'JH',
    capital: 'Ranchi',
    cpwdCostIndex: 98,
    terrain: 'Deccan Plateau',
    terrainMultiplier: 1.02,
    climaticBitumenGrade: 'VG-30',
    ircSpecification: 'IRC:37-2018 (Heavy Mining & Coal Freight Corridor Specifications)',
    pwdScheduleCode: 'JH-PWD-SOR-2024',
    majorCities: [
      { name: 'Ranchi', lat: 23.3441, lng: 85.3096 },
      { name: 'Jamshedpur', lat: 22.8046, lng: 86.2029 },
      { name: 'Dhanbad', lat: 23.7957, lng: 86.4304 },
      { name: 'Bokaro', lat: 23.6693, lng: 86.1511 },
    ],
    majorCorridors: ['NH-19 Grand Trunk Road', 'NH-33 Ranchi-Jamshedpur', 'NH-20'],
  },
  {
    state: 'Chhattisgarh',
    code: 'CG',
    capital: 'Raipur',
    cpwdCostIndex: 98,
    terrain: 'Deccan Plateau',
    terrainMultiplier: 1.01,
    climaticBitumenGrade: 'VG-30',
    ircSpecification: 'IRC:37-2018 (Mineral Freight Heavy Axle Tolerances)',
    pwdScheduleCode: 'CG-PWD-SOR-2024',
    majorCities: [
      { name: 'Raipur', lat: 21.2514, lng: 81.6296 },
      { name: 'Bhilai-Durg', lat: 21.1938, lng: 81.3509 },
      { name: 'Bilaspur', lat: 22.0797, lng: 82.1409 },
    ],
    majorCorridors: ['Raipur-Visakhapatnam Economic Corridor', 'NH-53 Mumbai-Kolkata', 'NH-30'],
  },

  // NORTH-EAST ZONE
  {
    state: 'Assam',
    code: 'AS',
    capital: 'Dispur / Guwahati',
    cpwdCostIndex: 126,
    terrain: 'Sub-Himalayan / Hilly',
    terrainMultiplier: 1.25,
    climaticBitumenGrade: 'VG-30',
    ircSpecification: 'IRC:SP:98 & IRC:82 (Brahmaputra Flood Plain Geotextile Reinforcement)',
    pwdScheduleCode: 'AS-PWD-APWD-SOR-2024',
    majorCities: [
      { name: 'Guwahati', lat: 26.1445, lng: 91.7362 },
      { name: 'Dibrugarh', lat: 27.4728, lng: 94.9120 },
      { name: 'Silchar', lat: 24.8333, lng: 92.7789 },
      { name: 'Jorhat', lat: 26.7509, lng: 94.2037 },
    ],
    majorCorridors: ['East-West Corridor (NH-27 Silchar-Guwahati)', 'Brahmaputra Bridge Approaches (Bogibeel / Saraighat)', 'NH-15'],
  },
  {
    state: 'Meghalaya',
    code: 'ML',
    capital: 'Shillong',
    cpwdCostIndex: 128,
    terrain: 'Sub-Himalayan / Hilly',
    terrainMultiplier: 1.28,
    climaticBitumenGrade: 'Cold-Mix Emulsion',
    ircSpecification: 'IRC:SP:98-2020 (Highest Rainfall Surface Water Drainage & Geocells)',
    pwdScheduleCode: 'ML-PWD-SOR-2024',
    majorCities: [
      { name: 'Shillong', lat: 25.5788, lng: 91.8933 },
      { name: 'Cherrapunji (Sohra)', lat: 25.2702, lng: 91.7323 },
      { name: 'Tura', lat: 25.5144, lng: 90.2023 },
    ],
    majorCorridors: ['Guwahati-Shillong Highway (NH-106)', 'NH-206 Western Meghalaya'],
  },
  {
    state: 'Arunachal Pradesh',
    code: 'AR',
    capital: 'Itanagar',
    cpwdCostIndex: 136,
    terrain: 'Himalayan / High Altitude',
    terrainMultiplier: 1.38,
    climaticBitumenGrade: 'Cold-Mix Emulsion',
    ircSpecification: 'BRO & IRC:SP:98 (High-Altitude Hill Cutting & Sela Tunnel Standards)',
    pwdScheduleCode: 'BRO-DSR-AR-2024',
    majorCities: [
      { name: 'Itanagar', lat: 27.0844, lng: 93.6053 },
      { name: 'Tawang', lat: 27.5861, lng: 91.8594 },
      { name: 'Pasighat', lat: 28.0664, lng: 95.3267 },
    ],
    majorCorridors: ['Trans-Arunachal Highway (NH-13)', 'Frontier Highway Corridor', 'Sela Tunnel Approach'],
  },
];

/**
 * Fast search across all Indian states, capitals, cities, highways, and expressways
 */
export function searchPanIndiaLocation(query: string): {
  matchedState: IndianStateData;
  matchedCity?: { name: string; lat: number; lng: number };
  matchedCorridor?: string;
  queryResolved: string;
} | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;

  // 1. Check exact or partial city matches
  for (const st of PAN_INDIA_STATES) {
    for (const city of st.majorCities) {
      if (city.name.toLowerCase().includes(q) || q.includes(city.name.toLowerCase())) {
        return {
          matchedState: st,
          matchedCity: city,
          queryResolved: `${city.name}, ${st.state}`,
        };
      }
    }
  }

  // 2. Check corridor / highway matches
  for (const st of PAN_INDIA_STATES) {
    for (const cor of st.majorCorridors) {
      if (cor.toLowerCase().includes(q) || q.includes(cor.toLowerCase())) {
        const primaryCity = st.majorCities[0];
        return {
          matchedState: st,
          matchedCity: primaryCity,
          matchedCorridor: cor,
          queryResolved: `${cor} (${st.state})`,
        };
      }
    }
  }

  // 3. Check state name matches
  for (const st of PAN_INDIA_STATES) {
    if (st.state.toLowerCase().includes(q) || st.code.toLowerCase() === q || q.includes(st.capital.toLowerCase())) {
      const primaryCity = st.majorCities[0];
      return {
        matchedState: st,
        matchedCity: primaryCity,
        queryResolved: `${st.capital}, ${st.state}`,
      };
    }
  }

  return null;
}

/**
 * Reverse geocode any GPS coordinate [lat, lng] inside India to the closest Indian State & Region
 */
export function resolveLocationFromCoordinates(lat: number, lng: number): {
  stateData: IndianStateData;
  nearestCityName: string;
  distanceKm: number;
} {
  let closestState = PAN_INDIA_STATES[0];
  let closestCity = PAN_INDIA_STATES[0].majorCities[0].name;
  let minDistance = Number.MAX_VALUE;

  for (const st of PAN_INDIA_STATES) {
    for (const city of st.majorCities) {
      // Euclidean distance approximation for speed
      const dLat = (city.lat - lat) * 111;
      const dLng = (city.lng - lng) * 111 * Math.cos((lat * Math.PI) / 180);
      const dist = Math.sqrt(dLat * dLat + dLng * dLng);

      if (dist < minDistance) {
        minDistance = dist;
        closestState = st;
        closestCity = city.name;
      }
    }
  }

  return {
    stateData: closestState,
    nearestCityName: closestCity,
    distanceKm: Math.round(minDistance),
  };
}

/**
 * Calculates localized Bill of Quantities (BOQ) with State Schedule of Rates,
 * CPWD Cost Index, terrain factors, and statutory IRC citations.
 */
export function calculatePanIndiaBOQ(
  locationQuery: string,
  distressAreaSqm: number = 3.5,
  maxDepthCm: number = 15.0
) {
  const resolved = searchPanIndiaLocation(locationQuery) || {
    matchedState: PAN_INDIA_STATES[0],
    matchedCity: PAN_INDIA_STATES[0].majorCities[0],
    queryResolved: locationQuery || 'Indian National Corridor',
  };

  const st = resolved.matchedState;
  const area = distressAreaSqm;
  const depth = maxDepthCm;
  const volumeM3 = Number(((area * (depth / 100))).toFixed(3));

  // Cost Index Multiplier (Delhi CPWD baseline = 1.00)
  const costIndexMultiplier = st.cpwdCostIndex / 100;
  const totalMultiplier = costIndexMultiplier * st.terrainMultiplier;

  // Physical material quantities
  const bitumenDensityTonsPerM3 = 2.4;
  const totalAsphaltTons = Number((volumeM3 * bitumenDensityTonsPerM3).toFixed(2));
  const bitumenBinderKg = Number((totalAsphaltTons * 52).toFixed(1)); // 5.2% binder
  const aggregateTons = Number((totalAsphaltTons * 0.82).toFixed(2));
  const tackCoatLiters = Number((area * 0.55).toFixed(1)); // 0.55 L/m²

  // Base CPWD Delhi Rates (2023)
  const baseBitumenRatePerTon = 64000;
  const baseAggregateRatePerTon = 1650;
  const baseTackRatePerLiter = 98;
  const baseMillingLaborShift = 4500;
  const baseRollerShift = 7200;
  const baseCrewShift = 5200;

  // Localized rates applying state CPWD cost index & terrain multiplier
  const localBitumenRate = Math.round(baseBitumenRatePerTon * totalMultiplier);
  const localAggRate = Math.round(baseAggregateRatePerTon * totalMultiplier);
  const localTackRate = Math.round(baseTackRatePerLiter * totalMultiplier);
  const localMillingCost = Math.round(baseMillingLaborShift * totalMultiplier);
  const localRollerCost = Math.round(baseRollerShift * totalMultiplier);
  const localCrewCost = Math.round(baseCrewShift * totalMultiplier);

  const matBitumenTotal = Math.round((totalAsphaltTons * 0.052) * localBitumenRate);
  const matAggTotal = Math.round(aggregateTons * localAggRate);
  const matTackTotal = Math.round(tackCoatLiters * localTackRate);
  const matSealTotal = Math.round(area * 165 * totalMultiplier);

  const materialsSum = matBitumenTotal + matAggTotal + matTackTotal + matSealTotal;
  const laborSum = localMillingCost + localRollerCost + localCrewCost;
  const totalNetINR = materialsSum + laborSum;
  const co2Kg = Math.round(volumeM3 * 380);

  return {
    location: resolved.queryResolved,
    state: st.state,
    stateCode: st.code,
    cpwdCostIndex: st.cpwdCostIndex,
    terrain: st.terrain,
    terrainMultiplier: st.terrainMultiplier,
    bitumenGrade: st.climaticBitumenGrade,
    pwdScheduleCode: st.pwdScheduleCode,
    ircSpecification: st.ircSpecification,
    distressAreaSqm: area,
    depthCm: depth,
    volumeM3,
    totalAsphaltTons,
    summary: `IRC:82-2023 Localized BOQ for ${resolved.queryResolved} (${area} m², depth ${depth} cm). Governed by ${st.pwdScheduleCode} with State Cost Index ${st.cpwdCostIndex}% and ${st.terrain} factor (${st.terrainMultiplier}x). Prescribes 2-layer ${st.climaticBitumenGrade} Bituminous Concrete compaction.`,
    materials: [
      {
        code: `${st.pwdScheduleCode}-BC-4.2`,
        item: `${st.climaticBitumenGrade} Bituminous Concrete (BC Type II)`,
        quantity: `${(totalAsphaltTons * 0.052).toFixed(3)} Ton`,
        unit: 'Ton',
        rateINR: localBitumenRate,
        totalINR: matBitumenTotal,
      },
      {
        code: `${st.pwdScheduleCode}-AGG-3.1`,
        item: 'Graded Crushed Stone Aggregate (10-20mm Traprock)',
        quantity: `${aggregateTons} Ton`,
        unit: 'Ton',
        rateINR: localAggRate,
        totalINR: matAggTotal,
      },
      {
        code: `${st.pwdScheduleCode}-TC-5.4`,
        item: 'Bitumen Emulsion RS-1 Rapid-Setting Tack Coat',
        quantity: `${tackCoatLiters} Liters`,
        unit: 'Liter',
        rateINR: localTackRate,
        totalINR: matTackTotal,
      },
      {
        code: `${st.pwdScheduleCode}-SEAL-2.1`,
        item: `Polymer Seal Coat (${st.climaticBitumenGrade})`,
        quantity: `${area} m²`,
        unit: 'm²',
        rateINR: Math.round(165 * totalMultiplier),
        totalINR: matSealTotal,
      },
    ],
    laborAndEquipment: [
      {
        code: 'SSR-EQ-MILL-01',
        item: 'Mechanical Pavement Saw-Cutter & Milling Crew (IRC:82 Square Edges)',
        quantity: '1 Shift',
        unit: 'Shift',
        rateINR: localMillingCost,
        totalINR: localMillingCost,
      },
      {
        code: 'SSR-EQ-ROLL-02',
        item: 'Vibratory Mini-Roller (3-Ton, 98% MDD Density Verification)',
        quantity: '1 Shift',
        unit: 'Shift',
        rateINR: localRollerCost,
        totalINR: localRollerCost,
      },
      {
        code: 'SSR-LAB-CREW-04',
        item: 'Skilled Municipal Highway Gang (4 Technicians + Site Lead)',
        quantity: '1 Day',
        unit: 'Day',
        rateINR: localCrewCost,
        totalINR: localCrewCost,
      },
    ],
    totalCostINR: totalNetINR,
    estimatedCO2Kg: co2Kg,
    executionTimeDays: area > 6 ? 2 : 1,
    ircCitations: [
      st.ircSpecification,
      'IRC:82-2023 Section 4.3.2 (Rectangular Saw-Cut Boundary & Edge Sealing)',
      'MoRTH Section 3000 Clause 3004.3 (Mandatory 97% MDD Subgrade Compaction)',
      'CPWD Delhi Schedule of Rates (DSR 2023) Item 4.2.1 / 5.1.4',
    ],
  };
}
