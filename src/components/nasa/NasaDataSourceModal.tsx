// NASA Data Source Modal: Clean progressive disclosure of real NASA mission datasets & Solar System Treks
import React from 'react';
import { ExternalLink, X, Database, Satellite, Compass } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../sound/audioEngine';
import type { NasaDatasetMetadata } from '../../types/game';
import { NASA_PLANETARY_DATASETS } from '../../data/nasaDatasets';

interface NasaDataSourceModalProps {
  dataset?: NasaDatasetMetadata;
  isOpen: boolean;
  onClose: () => void;
}

export const NasaDataSourceModal: React.FC<NasaDataSourceModalProps> = ({
  dataset,
  isOpen,
  onClose
}) => {
  const { language } = useLanguage();

  if (!isOpen) return null;

  // Default to LRO LOLA if no specific dataset passed
  const activeDataset = dataset || NASA_PLANETARY_DATASETS.lola_topography;

  const datasetName = (language === 'bn' && activeDataset.nameBn) ? activeDataset.nameBn : activeDataset.name;
  const usageDesc = (language === 'bn' && activeDataset.usageBn) ? activeDataset.usageBn : activeDataset.usage;
  const sciDesc = (language === 'bn' && activeDataset.scientificContextBn) ? activeDataset.scientificContextBn : activeDataset.scientificContext;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-lg bg-[#0A1020] border-2 border-sky-400/40 rounded-2xl shadow-2xl p-4 sm:p-6 text-slate-100 relative my-auto max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
          aria-label="Close NASA Data Panel"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-400/40 flex items-center justify-center text-sky-400 shrink-0">
            <Satellite className="w-5 h-5" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30">
              <Database className="w-3 h-3" />
              <span>{language === 'bn' ? 'নাসা তথ্যসূত্র ও আর্কাইভ' : 'OFFICIAL NASA DATASET'}</span>
            </div>
            <h3 className="text-base sm:text-lg font-display font-bold text-white mt-0.5">
              {datasetName}
            </h3>
          </div>
        </div>

        {/* Core Metadata Table */}
        <div className="space-y-2 mb-4 p-3.5 rounded-xl bg-[#060B18] border border-slate-800 text-xs font-mono">
          <div className="flex justify-between items-start gap-2 border-b border-slate-800/80 pb-2">
            <span className="text-slate-400 uppercase text-[11px]">{language === 'bn' ? 'উৎস / পোর্টাল:' : 'Primary Source:'}</span>
            <span className="text-sky-300 font-semibold text-right">{activeDataset.source}</span>
          </div>

          <div className="flex justify-between items-start gap-2 border-b border-slate-800/80 pb-2">
            <span className="text-slate-400 uppercase text-[11px]">{language === 'bn' ? 'মিশন ও নভোযান:' : 'Mission:'}</span>
            <span className="text-white font-semibold text-right">{activeDataset.mission}</span>
          </div>

          <div className="flex justify-between items-start gap-2 border-b border-slate-800/80 pb-2">
            <span className="text-slate-400 uppercase text-[11px]">{language === 'bn' ? 'বৈজ্ঞানিক যন্ত্র:' : 'Instrument:'}</span>
            <span className="text-amber-300 font-semibold text-right">{activeDataset.instrument}</span>
          </div>

          <div className="flex justify-between items-start gap-2 border-b border-slate-800/80 pb-2">
            <span className="text-slate-400 uppercase text-[11px]">{language === 'bn' ? 'আসল ডেটাসেট:' : 'Dataset Name:'}</span>
            <span className="text-slate-200 font-mono text-[11px] text-right">{activeDataset.dataset}</span>
          </div>

          {activeDataset.pdsNode && (
            <div className="flex justify-between items-start gap-2">
              <span className="text-slate-400 uppercase text-[11px]">NASA PDS Node:</span>
              <span className="text-slate-300 text-[11px] text-right">{activeDataset.pdsNode}</span>
            </div>
          )}
        </div>

        {/* How OUTPOST Uses This Data */}
        <div className="mb-4 space-y-2">
          <div className="p-3 rounded-xl bg-[#0F1B33]/80 border border-sky-500/30 text-xs text-sky-100 font-sans leading-relaxed">
            <strong className="block font-mono text-[11px] text-sky-400 uppercase tracking-wider mb-1">
              {language === 'bn' ? '💡 এই গেমে যেভাবে ব্যবহৃত হচ্ছে:' : '💡 HOW OUTPOST USES THIS DATA:'}
            </strong>
            {usageDesc}
          </div>

          <div className="p-3 rounded-xl bg-[#060B18] border border-slate-800 text-xs text-slate-300 font-sans leading-relaxed">
            <strong className="block font-mono text-[11px] text-slate-400 uppercase tracking-wider mb-1">
              {language === 'bn' ? '🔬 নাসার আসল বৈজ্ঞানিক প্রেক্ষাপট:' : '🔬 NASA SCIENTIFIC CONTEXT:'}
            </strong>
            {sciDesc}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-3 border-t border-slate-800">
          {activeDataset.trekUrl && (
            <a
              href={activeDataset.trekUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="w-full sm:flex-1 py-2.5 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-500/20"
            >
              <Compass className="w-4 h-4" />
              <span>{language === 'bn' ? 'নাসা সোলার সিস্টেম ট্রেক্স খুলুন' : 'Open NASA Solar System Treks'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <a
            href={activeDataset.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <span>{language === 'bn' ? 'নাসা ডেটা দলিল' : 'NASA Archive Docs'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
