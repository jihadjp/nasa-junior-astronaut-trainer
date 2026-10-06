// NASA Data Sources, API references, citations and asset registry

export interface DataSourceItem {
  id: string;
  name: string;
  agencyOrPublisher: string;
  dataType: 'Telemetry Model' | 'Atmospheric Data' | 'Radiation Measurements' | 'Life Support Parameters' | 'Engineering Principles';
  description: string;
  url: string;
  citation: string;
  license: string;
}

export const NASA_DATA_SOURCES: DataSourceItem[] = [
  {
    id: 'eclss_metrics',
    name: 'NASA ECLSS Exploration Water Recovery Architecture',
    agencyOrPublisher: 'NASA Marshall Space Flight Center & Johnson Space Center',
    dataType: 'Life Support Parameters',
    description: 'Operational metrics for ISS water processing, urine distillation, catalytic oxidation, and 98% loop closure benchmarks.',
    url: 'https://www.nasa.gov/international-space-station/space-station-research-and-technology/life-support-systems/',
    citation: 'Carter, D. L., et al. (2023). Exploration Water Recovery System Architecture and Ground Testing Milestones. 52nd International Conference on Environmental Systems (ICES-2023-142).',
    license: 'Public Domain / NASA Scientific Open Access'
  },
  {
    id: 'moxie_mars',
    name: 'Mars Oxygen In-Situ Resource Utilization Experiment (MOXIE)',
    agencyOrPublisher: 'NASA Jet Propulsion Laboratory (JPL) & MIT',
    dataType: 'Atmospheric Data',
    description: 'Data on Martian atmospheric carbon dioxide conversion to breathable oxygen via solid oxide electrolysis cells at 800°C.',
    url: 'https://mars.nasa.gov/mars2020/spacecraft/instruments/moxie/',
    citation: 'Hecht, M., et al. (2021). Mars Oxygen ISRU Experiment (MOXIE). Space Science Reviews, 217(1), 9.',
    license: 'NASA / JPL Open Public Mission Telemetry'
  },
  {
    id: 'radiation_msl_rad',
    name: 'Radiation Assessment Detector (RAD) Surface Measurements',
    agencyOrPublisher: 'NASA / Southwest Research Institute / Mars Science Laboratory',
    dataType: 'Radiation Measurements',
    description: 'In-situ galactic cosmic ray (GCR) and solar particle event (SPE) dose equivalent rates on the surface of Mars.',
    url: 'https://science.nasa.gov/mission/msl-curiosity/instruments/rad/',
    citation: 'Hassler, D. M., et al. (2014). Mars’ Surface Radiation Environment Measured with the Mars Science Laboratory’s Curiosity Rover. Science, 343(6169), 1244797.',
    license: 'NASA Planetary Data System (PDS)'
  },
  {
    id: 'lunar_environment_lro',
    name: 'Lunar Reconnaissance Orbiter (LRO) Diviner & CRaTER Instruments',
    agencyOrPublisher: 'NASA Goddard Space Flight Center',
    dataType: 'Radiation Measurements',
    description: 'Lunar surface thermal cycling (+120°C to -130°C) and cosmic ray radiation interaction with lunar regolith.',
    url: 'https://lunar.gsfc.nasa.gov/',
    citation: 'Spence, H. E., et al. (2010). CRaTER: The Cosmic Ray Telescope for the Effects of Radiation on the Lunar Reconnaissance Orbiter. Space Science Reviews, 150, 243–284.',
    license: 'NASA Open Science Data Repository'
  },
  {
    id: 'nasa_veggie_aph',
    name: 'NASA Veggie & Advanced Plant Habitat (APH)',
    agencyOrPublisher: 'NASA Kennedy Space Center',
    dataType: 'Life Support Parameters',
    description: 'Photosynthetic light spectra, transpiration recovery rates, and nutritional stability of fresh crops in extraterrestrial environments.',
    url: 'https://www.nasa.gov/missions/station/iss-research/growing-plants-in-space/',
    citation: 'Massa, G. D., et al. (2017). Selection of leafy green crops for a space station plant food production facility. Advances in Space Research, 60(11), 2412-2423.',
    license: 'NASA Open Access Scientific Publications'
  },
  {
    id: 'systems_engineering_handbook',
    name: 'NASA Systems Engineering Handbook (NASA/SP-2016-6105 Rev 2)',
    agencyOrPublisher: 'NASA Headquarters',
    dataType: 'Engineering Principles',
    description: 'Foundational framework for trade study analysis, dual-fault tolerance, risk assessment, and mission lifecycle modeling.',
    url: 'https://www.nasa.gov/reference/systems-engineering-handbook/',
    citation: 'National Aeronautics and Space Administration. (2016). NASA Systems Engineering Handbook (SP-2016-6105 Rev 2). Washington, D.C.',
    license: 'US Government Work / Public Domain'
  }
];
