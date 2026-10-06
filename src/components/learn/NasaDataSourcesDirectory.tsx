import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../sound/audioEngine';
import { Database, ExternalLink, Satellite, Flame, Droplets, Shield, Compass } from 'lucide-react';

interface NasaSource {
  id: string;
  name: string;
  nameBn: string;
  instrument: string;
  mission: string;
  description: string;
  descriptionBn: string;
  keyMetric: string;
  url: string;
  icon: React.ReactNode;
}

const NASA_DATASETS: NasaSource[] = [
  {
    id: 'treks',
    name: 'NASA Solar System Treks (Moon Trek & Mars Trek)',
    nameBn: 'নাসা সোলার সিস্টেম ট্রেক্স (মুন ও মার্স ট্রেকিং পোর্টাল)',
    instrument: 'Orbiter Laser Altimeter, Camera & Radar Data Mosaics',
    mission: 'LRO, MGS, MRO, Mars Odyssey & Global Spacecraft',
    description: 'Browser-based 3D terrain modeling, elevation profiles, sun angle simulation, and slope hazard analyses used directly to model OUTPOST base candidate sites.',
    descriptionBn: 'ব্রাউজার-ভিত্তিক থ্রি-ডি ভূখণ্ড মডেলিং, উচ্চতা প্রোফাইল ও সূর্যালোক কোণ বিশ্লেষণ, যা আউটপোস্টের অবতরণ সাইটের ভিত্তি হিসেবে ব্যবহৃত।',
    keyMetric: 'Global Planetary Topography & Sub-meter Slope Datasets',
    url: 'https://trek.nasa.gov/',
    icon: <Compass className="w-5 h-5 text-[#52D6FF]" />
  },
  {
    id: 'pds',
    name: 'NASA Planetary Data System (PDS)',
    nameBn: 'নাসা প্ল্যানেটারি ডেটা সিস্টেম (PDS)',
    instrument: 'LRO Diviner Lunar Radiometer & LOLA Altimeter',
    mission: 'Lunar Reconnaissance Orbiter (LRO)',
    description: 'Provides calibrated thermal measurements and elevation maps for the Lunar South Pole (Shackleton Crater and Peaks of Eternal Light).',
    descriptionBn: 'চাঁদের দক্ষিণ মেরু (শ্যাকলটন ক্র্যাটার) এর সঠিক পৃষ্ঠ তাপমাত্রা ও আলো-ছায়ার ভৌগোলিক মানচিত্র সরবরাহ করে।',
    keyMetric: 'Lunar Night Temp: -130°C to -246°C in PSRs',
    url: 'https://pds.nasa.gov/',
    icon: <Satellite className="w-5 h-5 text-[#52D6FF]" />
  },
  {
    id: 'moxie',
    name: 'NASA MOXIE Instrument Flight Data',
    nameBn: 'নাসা মোক্সি (MOXIE) ফ্লাইট টেস্ট ডেটা',
    instrument: 'Solid Oxide Electrolysis (SOXE) Cells',
    mission: 'Mars 2020 Perseverance Rover',
    description: 'Pioneered in-situ resource utilization by converting Mars atmospheric Carbon Dioxide (CO₂) into breathable Oxygen (O₂) with 98% purity.',
    descriptionBn: 'মঙ্গলের বিষাক্ত কার্বন ডাই-অক্সাইড গ্যাস ভেঙে সফলভাবে নিঃশ্বাস নেওয়ার উপযোগী খাঁটি অক্সিজেন উৎপাদনের প্রমাণিত নাসা প্রযুক্তি।',
    keyMetric: 'O₂ Yield: 6 to 12 grams/hr at ~300W electrical input',
    url: 'https://mars.nasa.gov/mars2020/spacecraft/instruments/moxie/',
    icon: <Flame className="w-5 h-5 text-amber-400" />
  },
  {
    id: 'eclss',
    name: 'NASA ECLSS Closed-Loop Water Recovery',
    nameBn: 'নাসা ইসিএলএসএস (ECLSS) ক্লোজড-লুপ ওয়াটার সিস্টেম',
    instrument: 'Urine Processor Assembly (UPA) & Water Processor (WPA)',
    mission: 'International Space Station (ISS)',
    description: 'State-of-the-art life support system achieving over 98% potable water recovery from crew respiration moisture, wash water, and urine distillation.',
    descriptionBn: 'নভোচারীদের ঘাম, নিঃশ্বাসের বাষ্প ও মূত্র ডিস্টিলেশন করে ৯৮% বিশুদ্ধ খাবার পানি রিসাইকেল করার আন্তর্জাতিক মহাকাশ স্টেশনের লাইফ সাপোর্ট।',
    keyMetric: 'Closed-Loop Water Recovery Efficiency: 98%+',
    url: 'https://www.nasa.gov/international-space-station/space-station-research-and-technology/life-support-systems/',
    icon: <Droplets className="w-5 h-5 text-emerald-400" />
  },
  {
    id: 'msl-rad',
    name: 'NASA MSL RAD Radiation Assessment Detector',
    nameBn: 'নাসা কিউরিওসিটি রোভার রেডিয়েশন ডিটেক্টর (RAD)',
    instrument: 'Silicon Solid-State Particle Telescope',
    mission: 'Mars Science Laboratory (Curiosity Rover)',
    description: 'Measured surface radiation doses from Galactic Cosmic Rays (GCR) and Solar Particle Events (SPE) inside Gale Crater on the Martian surface.',
    descriptionBn: 'মঙ্গলের মাটিতে মহাজাগতিক ক্ষতিকর বিকিরণ ও সৌরঝড়ের সঠিক তেজস্ক্রিয় মাত্রা পরিমাপকারী সেন্সর।',
    keyMetric: 'Surface Dose: ~0.64 mSv/sol (~230 mSv/year)',
    url: 'https://mars.nasa.gov/msl/spacecraft/instruments/rad/',
    icon: <Shield className="w-5 h-5 text-purple-400" />
  },
  {
    id: 'artemis-add',
    name: 'NASA Artemis Architecture Definition Document',
    nameBn: 'নাসা আর্টেমিস আর্কিটেকচার ডেফিনিশন ডকুমেন্ট (ADD)',
    instrument: 'Moon-to-Mars Exploration Architecture Framework',
    mission: 'NASA Artemis Base Camp & Lunar Gateway',
    description: 'Official NASA engineering baseline defining kilowatt surface power requirements, regolith sintering shelter specifications, and crew expedition limits.',
    descriptionBn: 'চাঁদে দীর্ঘমেয়াদী মানব বসতি ও পাওয়ার গ্রিড ডিজাইনের জন্য নাসার অফিশিয়াল প্রকৌশল গাইডলাইন।',
    keyMetric: 'Fission Surface Power & Microgrid Baseline: 40 kWe continuous',
    url: 'https://www.nasa.gov/moon-to-mars/architecture-definition-document/',
    icon: <Compass className="w-5 h-5 text-rose-400" />
  }
];

export const NasaDataSourcesDirectory: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <span className="text-xs font-mono text-[#52D6FF] uppercase tracking-wider block mb-1">
          {t('nasadata.badge')}
        </span>
        <h2 className="text-2xl font-display font-bold text-white mb-2">
          {t('nasadata.title')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
          {t('nasadata.desc')}
        </p>
      </div>

      {/* Dataset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {NASA_DATASETS.map((src) => (
          <div
            key={src.id}
            className="p-5 rounded-2xl bg-[#060B18] border border-slate-800 hover:border-[#52D6FF]/50 transition-all shadow-lg flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#101827] border border-slate-700/80">
                    {src.icon}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-white group-hover:text-[#52D6FF] transition-colors">
                      {language === 'bn' ? src.nameBn : src.name}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400">
                      {src.mission}
                    </p>
                  </div>
                </div>

                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playClick()}
                  className="p-2 rounded-lg bg-[#101827] hover:bg-[#152238] text-slate-400 hover:text-[#52D6FF] transition-colors shrink-0"
                  title="Open Official NASA Data"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="px-2.5 py-1 rounded-md bg-[#101827]/80 border border-slate-800 text-[10px] font-mono text-[#52D6FF] inline-block mb-3">
                Instrument: {src.instrument}
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4">
                {language === 'bn' ? src.descriptionBn : src.description}
              </p>
            </div>

            {/* Key Metric footer */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[11px] font-mono">
              <span className="text-slate-500 uppercase">Simulated Metric:</span>
              <span className="text-emerald-400 font-bold">{src.keyMetric}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info Box */}
      <div className="p-4 rounded-xl bg-[#101827] border border-[#52D6FF]/30 text-xs text-slate-300 font-sans flex items-center gap-3">
        <Database className="w-5 h-5 text-[#52D6FF] shrink-0" />
        <p>
          {language === 'bn'
            ? 'আমাদের গণনার প্রতিটি অ্যালগরিদম নাসার উন্মুক্ত বৈজ্ঞানিক প্রকাশনা ও প্রযুক্তিগত রিপোর্ট (NASA NTRS & PDS) থেকে সংগৃহীত বাস্তব প্যারামিটারের সাথে মেলানো।'
            : 'All life support and energy conversion equations in OUTPOST are verified against published NASA Technical Reports (NTRS) and planetary mission observations.'}
        </p>
      </div>
    </div>
  );
};
