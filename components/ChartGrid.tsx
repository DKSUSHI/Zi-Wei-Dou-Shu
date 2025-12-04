// @ts-ignore
import React from 'react';
// @ts-ignore
import { Profile, PalaceChartData } from '../types.ts';
// @ts-ignore
import { GRID_MAPPING } from '../constants.ts';

interface ChartGridProps {
  data: PalaceChartData;
  profile: Profile;
  overallDestiny?: string;
}

const ChartGrid: React.FC<ChartGridProps> = ({ data, profile, overallDestiny }) => {
  // Utility to split "Name(Brightness)" -> {name, brightness}
  const parseStar = (starStr: string) => {
    const match = starStr.match(/^(.+?)(?:\((.+?)\))?$/);
    return { name: match ? match[1] : starStr, brightness: match ? match[2] : null };
  };

  const getBrightnessColor = (brightness: string | null) => {
    if (!brightness) return 'hidden';
    if (['廟', '旺'].includes(brightness)) return 'text-red-300 bg-red-900/40 border border-red-500/30';
    if (['得', '利', '平'].includes(brightness)) return 'text-gold-200 bg-gold-900/30 border border-gold-600/20';
    return 'text-gray-400 bg-gray-800/50 border border-gray-600/30'; // 陷, 不
  };

  const renderStar = (starStr: string, isMajor: boolean) => {
    const { name, brightness } = parseStar(starStr);
    
    return (
      <div key={name} className="flex items-center gap-1.5 mb-0.5">
        <span className={`${isMajor ? 'font-bold text-base md:text-lg text-white tracking-wide' : 'text-sm text-mystic-200'}`}>
          {name}
        </span>
        {brightness && (
          <span className={`text-[10px] px-1 rounded-sm leading-tight ${getBrightnessColor(brightness)}`}>
            {brightness}
          </span>
        )}
      </div>
    );
  };
  
  const getTransformationBadge = (txt: string) => {
      if (txt.includes('化祿')) return <span className="bg-green-700 text-white text-[10px] font-bold px-1 py-0.5 rounded shadow-sm mx-0.5">祿</span>;
      if (txt.includes('化權')) return <span className="bg-blue-700 text-white text-[10px] font-bold px-1 py-0.5 rounded shadow-sm mx-0.5">權</span>;
      if (txt.includes('化科')) return <span className="bg-purple-600 text-white text-[10px] font-bold px-1 py-0.5 rounded shadow-sm mx-0.5">科</span>;
      if (txt.includes('化忌')) return <span className="bg-red-600 text-white text-[10px] font-bold px-1 py-0.5 rounded shadow-sm mx-0.5">忌</span>;
      return null;
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Chart Container - Height reduced from 800px to 640px */}
      <div className="w-full max-w-[900px] mx-auto aspect-square md:aspect-auto md:h-[640px] bg-mystic-950 rounded-xl shadow-2xl p-1.5 border-[3px] border-gold-600/50 relative">
        <div className="grid grid-cols-4 grid-rows-4 gap-1 bg-gold-600/40 w-full h-full border border-gold-600/30">
          
          {/* Center Info Block */}
          <div className="col-start-2 col-end-4 row-start-2 row-end-4 bg-mystic-900 flex flex-col items-center justify-center p-4 z-10 border-[2px] border-gold-500/50 shadow-inner">
             <div className="text-center space-y-3 w-full">
               <div className="text-mystic-400 text-xs font-medium tracking-widest">紫微斗數命盤</div>
               <div className="text-2xl md:text-4xl font-bold text-gold-400 tracking-widest drop-shadow-md">{profile.name}</div>
               <div className="h-px w-20 bg-gradient-to-r from-transparent via-gold-600 to-transparent mx-auto"></div>
               <div className="text-sm md:text-base text-white font-medium">{profile.lunar_date_time}</div>
               <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="bg-mystic-800 px-3 py-1 rounded-full text-gold-400 font-bold border border-gold-600/40 text-xs shadow-sm">{profile.gender}</span>
                  <span className="bg-mystic-800 px-3 py-1 rounded-full text-white font-bold border border-mystic-600 text-xs shadow-sm">{profile.five_elements_bureau}</span>
               </div>
             </div>
          </div>
  
          {/* 12 Palaces */}
          {data.all_palaces.map((palace, index) => {
            const branchChar = palace.branch;
            const pos = GRID_MAPPING[branchChar];
            if (!pos) return null;
  
            const isLife = palace.name.includes('命宮');
            const isBody = data.body_palace_location === palace.branch;
            
            // Contrast handling
            const bgClass = isLife 
              ? 'bg-gradient-to-br from-mystic-900 to-red-950/40' 
              : 'bg-mystic-900';

            return (
              <div 
                key={index}
                style={{ gridColumn: pos.col, gridRow: pos.row }}
                className={`${bgClass} relative flex flex-col justify-between p-1.5 md:p-2 overflow-hidden group border border-transparent hover:border-gold-400 transition-colors`}
              >
                {/* Top: Stars */}
                <div className="flex flex-col items-start w-full h-full overflow-hidden">
                  {/* Major Stars */}
                  <div className="flex flex-col gap-0 mb-1 w-full">
                     {palace.major_stars.map(s => renderStar(s, true))}
                  </div>
                  
                  {/* Minor Stars - 2 Columns */}
                  <div className="grid grid-cols-2 w-full gap-x-1">
                     {palace.minor_stars.map(s => renderStar(s, false))}
                  </div>
                </div>
  
                {/* Bottom: Transformations & Palace Info */}
                <div className="flex flex-col w-full mt-0.5">
                   {/* Transformations Badges */}
                   {palace.is_four_transformed !== '否' && (
                     <div className="flex flex-wrap justify-end mb-1 gap-0.5">
                        {palace.is_four_transformed.split(' ').map(t => getTransformationBadge(t))}
                     </div>
                   )}
  
                   <div className="flex justify-between items-end border-t border-mystic-700/30 pt-1">
                      {/* Palace Name (Bottom Left) - font-bold */}
                      <div className={`px-2 py-0.5 md:py-1 text-xs md:text-sm font-bold tracking-wider rounded border shadow-sm ${
                        isLife 
                          ? 'bg-red-900 text-red-100 border-red-500/50' 
                          : 'bg-mystic-800 text-gold-400 border-gold-600/40'
                        }`}>
                         {palace.name} {isBody && <span className="text-[10px] ml-0.5 opacity-80">(身)</span>}
                      </div>
                      
                      {/* Stem/Branch (Bottom Right) - font-normal */}
                      <div className="flex flex-col items-end leading-none">
                         <span className="font-normal text-mystic-500 text-xs md:text-sm tracking-widest">{palace.stem}{palace.branch}</span>
                      </div>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overall Destiny Feature Box */}
      {overallDestiny && (
        <div className="w-full max-w-[900px] mx-auto bg-mystic-800 border-l-4 border-gold-500 rounded-r-xl p-6 md:p-8 shadow-lg">
           <h3 className="text-xl md:text-2xl text-white font-bold mb-4 flex items-center gap-3">
             <span className="text-gold-500">✦</span>
             本命格局與特點
           </h3>
           <p className="text-mystic-100 text-base md:text-lg leading-relaxed text-justify font-medium">
             {overallDestiny}
           </p>
        </div>
      )}
    </div>
  );
};

export default ChartGrid;