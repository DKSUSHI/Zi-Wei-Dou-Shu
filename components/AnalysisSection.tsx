// @ts-ignore
import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore
import { AnalysisInterpretation } from '../types.ts';
// @ts-ignore
import { BookOpen, Star, Sparkles, Sun } from './Icons.tsx';
// @ts-ignore
import { ALL_MAJOR_STARS } from '../constants.ts';

interface AnalysisSectionProps {
  analysis: AnalysisInterpretation;
}

const AnalysisSection: React.FC<AnalysisSectionProps> = ({ analysis }) => {
  const [activeTab, setActiveTab] = useState<string>('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Drag scrolling state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Set default tab
  useEffect(() => {
    if (analysis && analysis.palaces.length > 0) {
      const lifePalace = analysis.palaces.find(p => p.palace_name.includes('命宮'));
      setActiveTab(lifePalace ? lifePalace.palace_name : analysis.palaces[0].palace_name);
    }
  }, [analysis]);

  const activePalaceData = analysis.palaces.find(p => p.palace_name === activeTab);

  const handleTabClick = (palaceName: string, event: React.MouseEvent<HTMLButtonElement>) => {
    // If dragging happened recently, don't trigger click (optional refinement, usually separate logic handles this)
    if (isDragging) return;

    setActiveTab(palaceName);
    
    // Smooth scroll to center the clicked tab
    event.currentTarget.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  };

  // Drag Event Handlers
  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll-fast
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  if (!analysis || !analysis.palaces) return null;

  return (
    <div className="max-w-4xl mx-auto mt-12 pb-20 px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gold-400 mb-2">命盤解析</h2>
        <div className="h-1 w-20 bg-gold-600 mx-auto rounded-full"></div>
      </div>

      {/* Tabs Navigation (Draggable & Scrollable) */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto pb-4 mb-6 gap-3 snap-x no-scrollbar mask-gradient cursor-grab active:cursor-grabbing select-none"
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        {analysis.palaces.map((palace) => (
          <button
            key={palace.palace_name}
            onClick={(e) => handleTabClick(palace.palace_name, e)}
            className={`flex-none px-6 py-3 rounded-xl text-base font-bold transition-all whitespace-nowrap snap-center
              ${activeTab === palace.palace_name 
                ? 'bg-gold-600 text-white shadow-lg shadow-gold-600/20 scale-105' 
                : 'bg-mystic-800 text-mystic-400 hover:bg-mystic-700 hover:text-mystic-200 border border-mystic-700'
              }`}
          >
            {palace.palace_name}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[400px] transition-all duration-300">
        {activePalaceData ? (
          <div className="bg-mystic-800/80 backdrop-blur border border-mystic-600 rounded-2xl p-6 md:p-8 shadow-xl animate-in fade-in zoom-in-95 duration-300">
            
            {/* Header: Palace Name & Summary */}
            <div className="mb-8 border-b border-mystic-700 pb-6">
               <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-gold-500/10 rounded-lg">
                   <BookOpen className="w-6 h-6 text-gold-400" />
                 </div>
                 <h3 className="text-2xl font-bold text-white tracking-wide">
                   {activePalaceData.palace_name}總結
                 </h3>
               </div>
               <p className="text-lg text-mystic-100 leading-relaxed font-medium text-justify">
                 {activePalaceData.summary}
               </p>
            </div>

            {/* Detailed Star Analysis Grid */}
            <div>
              <h4 className="text-gold-500 font-bold mb-4 flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5" /> 星曜細節影響
              </h4>
              
              <div className="grid grid-cols-1 gap-4">
                {activePalaceData.stars_detail.map((star, idx) => {
                  // Determine if it's a major star
                  const isMajor = ALL_MAJOR_STARS.some(major => star.name.includes(major));
                  
                  return (
                    <div key={idx} className={`rounded-xl p-5 border transition-colors ${
                       isMajor 
                       ? 'bg-mystic-900/80 border-gold-600/40 hover:border-gold-500' 
                       : 'bg-mystic-900/40 border-mystic-700/40 hover:border-gold-500/30'
                    }`}>
                      <div className="flex items-center gap-3 mb-3">
                        {isMajor ? (
                            <div className="bg-gold-500 rounded-full p-1 shadow-lg shadow-gold-500/20">
                                <Sun className="w-4 h-4 text-mystic-950 fill-mystic-950" />
                            </div>
                        ) : (
                            <Star className="w-5 h-5 text-mystic-400" />
                        )}
                        
                        <span className={`text-xl font-bold ${isMajor ? 'text-white' : 'text-mystic-200'}`}>
                            {star.name}
                        </span>
                        
                        {star.brightness && (
                          <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                            ['廟', '旺'].includes(star.brightness) 
                              ? 'bg-red-900/40 text-red-300 border border-red-500/30' 
                              : 'bg-mystic-800 text-mystic-400 border border-mystic-600'
                          }`}>
                            {star.brightness}
                          </span>
                        )}
                      </div>
                      <p className="text-mystic-100 text-base leading-relaxed">
                        {star.influence}
                      </p>
                    </div>
                  );
                })}
                
                {activePalaceData.stars_detail.length === 0 && (
                  <div className="text-center py-8 text-mystic-500 italic">
                    此宮位無主要星曜，運勢較受對宮影響。
                  </div>
                )}
              </div>
            </div>

          </div>
        ) : (
          <div className="flex justify-center items-center h-64 text-mystic-500">
            請選擇一個宮位查看解析
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisSection;