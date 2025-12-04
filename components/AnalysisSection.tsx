import React, { useState, useEffect, useRef } from 'react';
import { AnalysisInterpretation } from '../types';
import { BookOpen, Star, Sparkles, Sun } from './Icons';
import { ALL_MAJOR_STARS } from '../constants';

interface AnalysisSectionProps {
  analysis: AnalysisInterpretation;
}

const AnalysisSection: React.FC<AnalysisSectionProps> = ({ analysis }) => {
  const [activeTab, setActiveTab] = useState<string>('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (analysis && analysis.palaces.length > 0) {
      const lifePalace = analysis.palaces.find(p => p.palace_name.includes('命宮'));
      setActiveTab(lifePalace ? lifePalace.palace_name : analysis.palaces[0].palace_name);
    }
  }, [analysis]);

  const activePalaceData = analysis.palaces.find(p => p.palace_name === activeTab);

  const handleTabClick = (palaceName: string, event: React.MouseEvent<HTMLButtonElement>) => {
    setActiveTab(palaceName);
    event.currentTarget.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  };

  if (!analysis || !analysis.palaces) return null;

  return (
    <div className="max-w-4xl mx-auto mt-16 pb-24 px-4">
      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-wider">命盤解析</h2>
        <div className="h-1 w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto rounded-full opacity-60"></div>
      </div>

      {/* Modern Scrollable Tabs */}
      <div className="relative mb-8 group">
         {/* Fade masks for scroll indicators */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-mystic-950 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-mystic-950 to-transparent z-10 pointer-events-none"></div>

        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-2 pb-4 px-4 snap-x no-scrollbar"
        >
          {analysis.palaces.map((palace) => {
             const isActive = activeTab === palace.palace_name;
             return (
              <button
                key={palace.palace_name}
                onClick={(e) => handleTabClick(palace.palace_name, e)}
                className={`flex-none px-5 py-2.5 rounded-full text-sm md:text-base font-medium transition-all duration-300 snap-center whitespace-nowrap border
                  ${isActive 
                    ? 'bg-gold-500 text-mystic-950 border-gold-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                    : 'bg-mystic-900/50 text-mystic-400 border-white/5 hover:border-gold-500/30 hover:text-gold-200'
                  }`}
              >
                {palace.palace_name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Card */}
      <div className="min-h-[400px]">
        {activePalaceData ? (
          <div className="glass-panel rounded-3xl p-6 md:p-10 animate-fade-in relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl pointer-events-none"></div>

            {/* Summary Section */}
            <div className="mb-10 relative z-10">
               <div className="flex items-center gap-4 mb-6">
                 <div className="p-3 bg-mystic-800 rounded-xl shadow-inner border border-white/5">
                   <BookOpen className="w-6 h-6 text-gold-400" />
                 </div>
                 <h3 className="text-2xl font-bold text-white tracking-wide">
                   {activePalaceData.palace_name} · <span className="text-gold-400">總結</span>
                 </h3>
               </div>
               <div className="bg-mystic-950/30 rounded-xl p-6 border border-white/5">
                 <p className="text-lg text-mystic-100 leading-loose text-justify font-light tracking-wide">
                   {activePalaceData.summary}
                 </p>
               </div>
            </div>

            {/* Stars Detail Section */}
            <div>
              <h4 className="text-gold-200 font-bold mb-6 flex items-center gap-3 text-lg border-b border-white/5 pb-2">
                <Sparkles className="w-5 h-5 text-gold-500" /> 
                <span>星曜深度影響</span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activePalaceData.stars_detail.map((star, idx) => {
                  const isMajor = ALL_MAJOR_STARS.some(major => star.name.includes(major));
                  
                  return (
                    <div key={idx} className={`rounded-xl p-5 border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                       isMajor 
                       ? 'bg-gradient-to-br from-mystic-800 to-mystic-900 border-gold-500/20 hover:border-gold-500/50' 
                       : 'bg-mystic-900/40 border-white/5 hover:bg-mystic-800/60'
                    }`}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          {isMajor ? (
                              <Sun className="w-5 h-5 text-gold-400" />
                          ) : (
                              <Star className="w-4 h-4 text-mystic-500" />
                          )}
                          <span className={`text-lg font-bold ${isMajor ? 'text-white' : 'text-mystic-300'}`}>
                              {star.name}
                          </span>
                        </div>
                        
                        {star.brightness && (
                          <span className={`text-[10px] px-2 py-1 rounded-md font-bold tracking-wider ${
                            ['廟', '旺'].includes(star.brightness) 
                              ? 'bg-red-900/30 text-red-300 border border-red-500/20' 
                              : 'bg-mystic-950 text-mystic-500 border border-mystic-700'
                          }`}>
                            {star.brightness}
                          </span>
                        )}
                      </div>
                      <p className="text-mystic-200 text-sm leading-relaxed font-light">
                        {star.influence}
                      </p>
                    </div>
                  );
                })}
                
                {activePalaceData.stars_detail.length === 0 && (
                  <div className="col-span-full text-center py-10 bg-mystic-950/20 rounded-xl border border-dashed border-mystic-700">
                    <p className="text-mystic-500 italic">此宮位無主要星曜，運勢主要參考對宮影響。</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        ) : (
          <div className="flex justify-center items-center h-64 text-mystic-500 glass-panel rounded-3xl">
            <p>請點選上方宮位查看解析</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisSection;