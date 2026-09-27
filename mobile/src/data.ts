export type Road = {
  id: string;
  name: string;
  area: string;
  condition: 'Critical' | 'Poor' | 'Needs review' | 'Good';
  score: number;
  complaints: number;
  risk: 'High' | 'Medium' | 'Low';
  status: 'Proposal pending' | 'Work in progress' | 'Monitoring' | 'Completed';
  verified: boolean;
  lat: number;
  lng: number;
  source?: string;
  lastVerifiedAt?: string;
};

export type GovernmentLocation = {
  id: string;
  name: string;
  district: string;
  authority: string;
  adminLevel: string;
  population2011: number | null;
  populationScope: string;
  districtVillageRoadsKm: number;
  roadReferenceYear: string;
};

export const roads: Road[] = [
  { id: 'RD-NAL-001', name: 'Tulinj Road', area: 'Nalasopara East', condition: 'Critical', score: 92, complaints: 11, risk: 'High', status: 'Proposal pending', verified: true, lat: 19.4231, lng: 72.8245 },
  { id: 'RD-NAL-002', name: 'Nalasopara–Virar Link Road', area: 'Nalasopara West', condition: 'Poor', score: 84, complaints: 7, risk: 'High', status: 'Work in progress', verified: true, lat: 19.4117, lng: 72.8068 },
  { id: 'RD-NAL-003', name: 'Achole Road', area: 'Achole', condition: 'Poor', score: 76, complaints: 5, risk: 'Medium', status: 'Proposal pending', verified: false, lat: 19.4248, lng: 72.8298 },
  { id: 'RD-NAL-004', name: 'Station Road', area: 'Nalasopara East', condition: 'Needs review', score: 68, complaints: 3, risk: 'Medium', status: 'Monitoring', verified: true, lat: 19.4267, lng: 72.8234 },
  { id: 'RD-NAL-005', name: 'Central Park Road', area: 'Nalasopara West', condition: 'Needs review', score: 57, complaints: 2, risk: 'Low', status: 'Monitoring', verified: false, lat: 19.4058, lng: 72.8052 },
  { id: 'RD-NAL-006', name: 'Morya Nagar Lane', area: 'Morya Nagar', condition: 'Good', score: 31, complaints: 0, risk: 'Low', status: 'Completed', verified: true, lat: 19.4178, lng: 72.8172 },
];

export const alerts = [
  { id: 'ALT-01', level: 'critical', title: 'Tulinj Road needs inspection', detail: '11 open complaints · high waterlogging risk', time: '12 min ago' },
  { id: 'ALT-02', level: 'warning', title: 'Daily evidence awaiting review', detail: '2 worker reports need inspector action', time: '41 min ago' },
  { id: 'ALT-03', level: 'info', title: 'Road proposal submitted', detail: 'Nalasopara–Virar link repair is in progress', time: '2 hr ago' },
];

export const reports = [
  { id: 'DWR-260925-07', title: 'Pothole patching', road: 'Nalasopara–Virar Link Road', worker: 'R. Patil', status: 'Verified', photos: 3, date: '25 Sep 2026' },
  { id: 'DWR-260924-06', title: 'Base preparation', road: 'Nalasopara–Virar Link Road', worker: 'S. Jadhav', status: 'Needs review', photos: 2, date: '24 Sep 2026' },
  { id: 'DWR-260925-05', title: 'Site measurement', road: 'Tulinj Road', worker: 'A. More', status: 'Submitted', photos: 4, date: '25 Sep 2026' },
];

export const governmentLocations: GovernmentLocation[] = [
  { id: 'GOV-VASAI', name: 'Vasai', district: 'Palghar', authority: 'Vasai-Virar City Municipal Corporation', adminLevel: 'VVMC service area', population2011: null, populationScope: 'VVMC aggregate: 1,222,390 (2011)', districtVillageRoadsKm: 4418, roadReferenceYear: '2022-23' },
  { id: 'GOV-VIRAR', name: 'Virar', district: 'Palghar', authority: 'Vasai-Virar City Municipal Corporation', adminLevel: 'VVMC service area', population2011: null, populationScope: 'VVMC aggregate: 1,222,390 (2011)', districtVillageRoadsKm: 4418, roadReferenceYear: '2022-23' },
  { id: 'GOV-NALASOPARA', name: 'Nalasopara', district: 'Palghar', authority: 'Vasai-Virar City Municipal Corporation', adminLevel: 'VVMC service area', population2011: null, populationScope: 'VVMC aggregate: 1,222,390 (2011)', districtVillageRoadsKm: 4418, roadReferenceYear: '2022-23' },
  { id: 'GOV-PALGHAR', name: 'Palghar', district: 'Palghar', authority: 'Palghar Municipal Council', adminLevel: 'Municipal Council', population2011: 68930, populationScope: 'Palghar Municipal Council (2011 Census)', districtVillageRoadsKm: 4418, roadReferenceYear: '2022-23' },
];

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000';
