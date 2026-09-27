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
  dataStatus: string;
};

export type GovernmentSource = {
  title: string;
  url: string;
  publisher: string;
};

export const governmentLocations: GovernmentLocation[] = [
  {
    id: 'GOV-VASAI', name: 'Vasai', district: 'Palghar',
    authority: 'Vasai-Virar City Municipal Corporation', adminLevel: 'VVMC service area',
    population2011: null,
    populationScope: 'Official Census population is published for the combined VVMC area: 1,222,390 (2011).',
    districtVillageRoadsKm: 4418, roadReferenceYear: '2022-23',
    dataStatus: 'official_admin_area_with_aggregate_population',
  },
  {
    id: 'GOV-VIRAR', name: 'Virar', district: 'Palghar',
    authority: 'Vasai-Virar City Municipal Corporation', adminLevel: 'VVMC service area',
    population2011: null,
    populationScope: 'Official Census population is published for the combined VVMC area: 1,222,390 (2011).',
    districtVillageRoadsKm: 4418, roadReferenceYear: '2022-23',
    dataStatus: 'official_admin_area_with_aggregate_population',
  },
  {
    id: 'GOV-NALASOPARA', name: 'Nalasopara', district: 'Palghar',
    authority: 'Vasai-Virar City Municipal Corporation', adminLevel: 'VVMC service area',
    population2011: null,
    populationScope: 'Official Census population is published for the combined VVMC area: 1,222,390 (2011).',
    districtVillageRoadsKm: 4418, roadReferenceYear: '2022-23',
    dataStatus: 'official_admin_area_with_aggregate_population',
  },
  {
    id: 'GOV-PALGHAR', name: 'Palghar', district: 'Palghar',
    authority: 'Palghar Municipal Council', adminLevel: 'Municipal Council',
    population2011: 68930,
    populationScope: 'Palghar Municipal Council (2011 Census)',
    districtVillageRoadsKm: 4418, roadReferenceYear: '2022-23',
    dataStatus: 'official_city_record',
  },
];

export const governmentSources: GovernmentSource[] = [
  { title: 'Palghar district municipality directory', url: 'https://palghar.gov.in/en/public-utility-category/municipality/', publisher: 'District Palghar, Government of Maharashtra' },
  { title: 'Census 2011 population tables', url: 'https://censusindia.gov.in/nada/index.php/catalog/11346', publisher: 'Office of the Registrar General & Census Commissioner, India' },
  { title: 'Maharashtra infrastructure report', url: 'https://mahades.maharashtra.gov.in/files/publication/Infra2023.pdf', publisher: 'Directorate of Economics and Statistics, Maharashtra' },
  { title: 'Palghar geographical information', url: 'https://palghar.gov.in/en/geographical-information-2/', publisher: 'District Palghar, Government of Maharashtra' },
];
