// NASA Data Sources, API references, citations and asset registry

export interface DataSourceItem {
  id: string;
  name: string;
  nameBn?: string;
  agencyOrPublisher: string;
  dataType: 'Telemetry Model' | 'Atmospheric Data' | 'Radiation Measurements' | 'Life Support Parameters' | 'Engineering Principles' | 'Planetary Topography' | 'Planetary Mapping';
  dataTypeBn?: string;
  description: string;
  descriptionBn?: string;
  url: string;
  citation: string;
  license: string;
}

export const NASA_DATA_SOURCES: DataSourceItem[] = [
  {
    id: 'nasa_solar_system_treks',
    name: 'NASA Solar System Treks (Moon Trek & Mars Trek)',
    nameBn: 'নাসা সোলার সিস্টেম ট্রেক্স (মুন ট্রেক ও মার্স ট্রেক)',
    agencyOrPublisher: 'NASA Jet Propulsion Laboratory (JPL) & SSERVI',
    dataType: 'Planetary Mapping',
    dataTypeBn: 'গ্রহ মানচিত্র ও ভূখণ্ড ডেটা',
    description: 'Browser-based visualization of returned orbiter elevation, surface slopes, and candidate Artemis / Mars landing sites.',
    descriptionBn: 'চাঁদ ও মঙ্গলের অরবিটার স্যাটেলাইট থেকে পাওয়া উচ্চতা, ভূখণ্ড ঢাল, ক্র্যাটার ও অবতরণ সাইটের বিশ্লেষণ ও উন্মুক্ত ম্যাপিং পোর্টাল।',
    url: 'https://trek.nasa.gov/',
    citation: 'NASA Solar System Treks Project. (2024). Moon Trek and Mars Trek Web Portals. NASA JPL / SSERVI.',
    license: 'NASA Public Planetary Data Service'
  },
  {
    id: 'lro_lola_elevation',
    name: 'LRO Lunar Orbiter Laser Altimeter (LOLA) Global Topography',
    nameBn: 'এলআরও লুনার অল্টিমিটার (LOLA) উচ্চতা ডেটাসেট',
    agencyOrPublisher: 'NASA Goddard Space Flight Center',
    dataType: 'Planetary Topography',
    dataTypeBn: 'চন্দ্র ভূখণ্ড উচ্চতা',
    description: 'Gridded topographic model (LDEM) with sub-meter vertical precision detailing lunar south polar crater rims, massifs, and slope hazards.',
    descriptionBn: 'চাঁদের দক্ষিণ মেরুর ক্র্যাটার রিম ও শৈলশিরার সাব-মিটার নির্ভুল উচ্চতা ও ঢালের বৈজ্ঞানিক মডেল।',
    url: 'https://pds-geosciences.wustl.edu/missions/lro/lola.htm',
    citation: 'Smith, D. E., et al. (2010). Initial observations from the Lunar Orbiter Laser Altimeter (LOLA). Geophysical Research Letters, 37(18).',
    license: 'NASA PDS Geosciences Open Node'
  },
  {
    id: 'mgs_mola_mars',
    name: 'Mars Global Surveyor MOLA Topographic MEGDR Grid',
    nameBn: 'মার্স গ্লোবাল সারভেয়ার MOLA ভূখণ্ড গ্রিড',
    agencyOrPublisher: 'NASA Goddard Space Flight Center / JPL',
    dataType: 'Planetary Topography',
    dataTypeBn: 'মঙ্গল ভূখণ্ড উচ্চতা',
    description: 'Mission Elevation Experiment Gridded Data Record (MEGDR) establishing global topographic elevations for Olympus Mons, Jezero, and Gale Crater.',
    descriptionBn: 'অলিম্পাস মনস, জেজেরো এবং গেইল ক্র্যাটারের পৃষ্ঠের বৈশ্বিক উচ্চতা পরিমাপক ভিত্তি।',
    url: 'https://pds-geosciences.wustl.edu/missions/mgs/mola.html',
    citation: 'Smith, D. E., et al. (2001). Mars Orbiter Laser Altimeter: Experiment summary. JGR: Planets, 106(E10), 23689-23722.',
    license: 'NASA Planetary Data System (PDS)'
  },
  {
    id: 'eclss_metrics',
    name: 'NASA ECLSS Exploration Water Recovery Architecture',
    nameBn: 'নাসা ECLSS ওয়াটার রিকভারি আর্কিটেকচার',
    agencyOrPublisher: 'NASA Marshall Space Flight Center & Johnson Space Center',
    dataType: 'Life Support Parameters',
    dataTypeBn: 'লাইফ সাপোর্ট প্যারামিটার',
    description: 'Operational metrics for ISS water processing, urine distillation, catalytic oxidation, and 98% loop closure benchmarks.',
    descriptionBn: 'আন্তর্জাতিক মহাকাশ স্টেশনে (ISS) পানি প্রক্রিয়াকরণ, ইউরিন ডিস্টিলেশন, অনুঘটন জারণ এবং ৯৮% লুপ সমাপ্তির কর্মক্ষমতা মেট্রিক্স।',
    url: 'https://www.nasa.gov/international-space-station/space-station-research-and-technology/life-support-systems/',
    citation: 'Carter, D. L., et al. (2023). Exploration Water Recovery System Architecture and Ground Testing Milestones. 52nd International Conference on Environmental Systems (ICES-2023-142).',
    license: 'Public Domain / NASA Scientific Open Access'
  },
  {
    id: 'moxie_mars',
    name: 'Mars Oxygen In-Situ Resource Utilization Experiment (MOXIE)',
    nameBn: 'মার্স অক্সিজেন ইন-সিটু রিসোর্স এক্সপেরিমেন্ট (MOXIE)',
    agencyOrPublisher: 'NASA Jet Propulsion Laboratory (JPL) & MIT',
    dataType: 'Atmospheric Data',
    dataTypeBn: 'বায়ুমণ্ডলীয় ডেটা',
    description: 'Data on Martian atmospheric carbon dioxide conversion to breathable oxygen via solid oxide electrolysis cells at 800°C.',
    descriptionBn: 'মঙ্গলের বায়ুমণ্ডলের কার্বন ডাই-অক্সাইডকে ৮০০°C তাপমাত্রায় সলিড অক্সাইড ইলেক্ট্রোলাইসিসের মাধ্যমে শ্বাসযোগ্য অক্সিজেনে রূপান্তরের তথ্য।',
    url: 'https://mars.nasa.gov/mars2020/spacecraft/instruments/moxie/',
    citation: 'Hecht, M., et al. (2021). Mars Oxygen ISRU Experiment (MOXIE). Space Science Reviews, 217(1), 9.',
    license: 'NASA / JPL Open Public Mission Telemetry'
  },
  {
    id: 'radiation_msl_rad',
    name: 'Radiation Assessment Detector (RAD) Surface Measurements',
    nameBn: 'রেডিয়েশন অ্যাসেসমেন্ট ডিটেক্টর (RAD) পৃষ্ঠের পরিমাপ',
    agencyOrPublisher: 'NASA / Southwest Research Institute / Mars Science Laboratory',
    dataType: 'Radiation Measurements',
    dataTypeBn: 'তেজস্ক্রিয়তা পরিমাপ',
    description: 'In-situ galactic cosmic ray (GCR) and solar particle event (SPE) dose equivalent rates on the surface of Mars.',
    descriptionBn: 'মঙ্গল গ্রহের পৃষ্ঠে গ্যালাকটিক মহাজাগতিক রশ্মি (GCR) এবং সৌর কণা ঘটনার (SPE) বিকিরণ মাত্রা।',
    url: 'https://science.nasa.gov/mission/msl-curiosity/instruments/rad/',
    citation: 'Hassler, D. M., et al. (2014). Mars’ Surface Radiation Environment Measured with the Mars Science Laboratory’s Curiosity Rover. Science, 343(6169), 1244797.',
    license: 'NASA Planetary Data System (PDS)'
  },
  {
    id: 'lunar_environment_lro',
    name: 'Lunar Reconnaissance Orbiter (LRO) Diviner & CRaTER Instruments',
    nameBn: 'লুনার রিকনেসান্স অরবিটার (LRO) ডিভাইনার ও CRaTER যন্ত্র',
    agencyOrPublisher: 'NASA Goddard Space Flight Center',
    dataType: 'Radiation Measurements',
    dataTypeBn: 'চন্দ্র পরিবেশ ডেটা',
    description: 'Lunar surface thermal cycling (+120°C to -130°C) and cosmic ray radiation interaction with lunar regolith.',
    descriptionBn: 'চাঁদের পৃষ্ঠের চরম তাপমাত্রা (+১২০°C থেকে -১৩০°C) এবং চন্দ্রের রেগোলিথের সাথে মহাজাগতিক রশ্মির মিথস্ক্রিয়ার তথ্য।',
    url: 'https://lunar.gsfc.nasa.gov/',
    citation: 'Spence, H. E., et al. (2010). CRaTER: The Cosmic Ray Telescope for the Effects of Radiation on the Lunar Reconnaissance Orbiter. Space Science Reviews, 150, 243–284.',
    license: 'NASA Open Science Data Repository'
  },
  {
    id: 'nasa_veggie_aph',
    name: 'NASA Veggie & Advanced Plant Habitat (APH)',
    nameBn: 'নাসা ভেজি ও অ্যাডভান্সড প্ল্যান্ট হ্যাবিট্যাট (APH)',
    agencyOrPublisher: 'NASA Kennedy Space Center',
    dataType: 'Life Support Parameters',
    dataTypeBn: 'উদ্ভিদ বিজ্ঞান ডেটা',
    description: 'Photosynthetic light spectra, transpiration recovery rates, and nutritional stability of fresh crops in extraterrestrial environments.',
    descriptionBn: 'মহাশূন্যে তাজা উদ্ভিদের সালোকসংশ্লেষণ আলোর বর্ণালী, প্রস্বেদন পুনরুদ্ধার এবং পুষ্টির স্থিতিশীলতার পরিমাপ।',
    url: 'https://www.nasa.gov/missions/station/iss-research/growing-plants-in-space/',
    citation: 'Massa, G. D., et al. (2017). Selection of leafy green crops for a space station plant food production facility. Advances in Space Research, 60(11), 2412-2423.',
    license: 'NASA Open Access Scientific Publications'
  },
  {
    id: 'systems_engineering_handbook',
    name: 'NASA Systems Engineering Handbook (NASA/SP-2016-6105 Rev 2)',
    nameBn: 'নাসা সিস্টেমস ইঞ্জিনিয়ারিং হ্যান্ডবুক (SP-2016-6105)',
    agencyOrPublisher: 'NASA Headquarters',
    dataType: 'Engineering Principles',
    dataTypeBn: 'প্রকৌশল মূলনীতি',
    description: 'Foundational framework for trade study analysis, dual-fault tolerance, risk assessment, and mission lifecycle modeling.',
    descriptionBn: 'ট্রেড স্টাডি বিশ্লেষণ, ডুয়াল-ফল্ট সহনশীলতা, ঝুঁকি মূল্যায়ন এবং মিশন জীবনচক্রের মৌলিক কাঠামো।',
    url: 'https://www.nasa.gov/reference/systems-engineering-handbook/',
    citation: 'National Aeronautics and Space Administration. (2016). NASA Systems Engineering Handbook (SP-2016-6105 Rev 2). Washington, D.C.',
    license: 'US Government Work / Public Domain'
  }
];
