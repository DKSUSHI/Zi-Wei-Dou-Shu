import React from 'react';
import { Profile, PalaceChartData } from '../types';
import { GRID_MAPPING } from '../constants';

interface ChartGridProps {
  data: PalaceChartData;
  profile: Profile;
  overallDestiny?: string;
}

const ChartGrid: React.FC<ChartGridProps> = ({ data, profile, overallDestiny }) => {
  const parseStar = (starStr: string) => {
    const match = starStr.match(/^(.+?)(?:\((.+?)\))?$/);
    return { name: match ? match[1] : starStr, brightness: match ? match[2] : null };
  };

  const getBrightnessColor = (brightness: string | null) => {
    if (!brightness) return 'hidden';
    // Use badges instead of text color for better readability
    if (['廟', '旺'].includes(brightness)) return 'bg-red-500 text-white';
    if (['得', '利', '平'].includes(brightness)) return 'bg-gold-500 text-mystic-950';
    return 'bg-mystic-600 text-mystic-200'; // 陷/不
  };

  const renderStar = (starStr: string, isMajor: boolean) => {
    const { name, brightness } = parseStar(starStr);
    
    return (
      <div key={name} className={`flex items-center gap-1 ${isMajor ? 'mb-1' : 'mb-0.5'}`}>
        <span className={`leading-none ${
          isMajor 
            ? 'font-bold text-base md:text-lg text-white tracking-wide drop-shadow-sm' 
            : 'text-xs md:text-sm text-mystic-200 font-medium'
        }`}>
          {name}
        </span>
        {brightness && (
          <span className={`text-[9px] px-1 py-[1px] rounded-[3px] leading-none font-bold opacity-90 ${getBrightnessColor(brightness)}`}>
            {brightness}
          </span>
        )}
      </div>
    );
  };
  
  const getTransformationBadge = (txt: string) => {
      // Simplified badges: only show the character
      const char = txt.includes('化祿') ? '祿' : 
                   txt.includes('化權') ? '權' :
                   txt.includes('化科') ? '科' :
                   txt.includes('化忌') ? '忌' : '';
      
      const colorClass = txt.includes('化祿') ? 'bg-green-600' :
                         txt.includes('化權') ? 'bg-blue-600' :
                         txt.includes('化科') ? 'bg-purple-600' :
                         txt.includes('化忌') ? 'bg-red-600' : 'bg-gray-600';

      if (!char) return null;

      return (
        <span key={txt} className={`${colorClass} text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-sm mx-0.5 border border-white/20`}>
          {char}
        </span>
      );
  };

  return (
    <div className="flex flex-col gap-8">
      {/* The Chart Container */}
      <div className="w-full max-w-[800px] mx-auto aspect-square md:aspect-[4/3.8] bg-mystic-950 rounded-2xl shadow-2xl p-1 relative overflow-hidden border border-gold-900/50">
        
        {/* Background Grid Lines (CSS Grid) */}
        <div className="grid grid-cols-4 grid-rows-4 gap-[2px] bg-mystic-800 w-full h-full">
          
          {/* Center Info Panel (2x2) */}
          <div className="col-start-2 col-end-4 row-start-2 row-end-4 bg-mystic-900 flex flex-col items-center justify-center p-6 z-10 relative">
             <div className="absolute inset-0 border border-gold-500/20 m-2"></div>
             
             <div className="text-center space-y-3 w-full relative z-20">
               <div className="text-gold-500/80 text-xs font-medium tracking-[0.3em] uppercase">Zi Wei Dou Shu</div>
               
               <div className="py-2">
                 <div className="text-3xl md:text-4xl font-bold text-white tracking-widest drop-shadow-md">{profile.name}</div>
               </div>
               
               <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-600 to-transparent mx-auto opacity-50"></div>
               
               <div className="text-sm md:text-base text-mystic-200 font-light tracking-wide font-mono">
                 {profile.lunar_date_time}
               </div>
               
               <div className="flex items-center justify-center gap-3 mt-2">
                  <span className="bg-mystic-800 px-3 py-1 rounded text-gold-400 text-xs font-bold border border-gold-500/30">
                    {profile.five_elements_bureau}
                  </span>
                  <span className="text-mystic-500 text-xs">|</span>
                  <span className="text-mystic-300 text-xs font-medium">
                    {profile.gender}
                  </span>
               </div>
             </div>
          </div>
  
          {/* 12 Palaces */}
          {data.all_palaces.map((palace, index) => {
            const pos = GRID_MAPPING[palace.branch];
            if (!pos) return null;
  
            const isLife = palace.name.includes('命宮');
            const isBody = data.body_palace_location === palace.branch;
            
            // Simplified background logic
            let bgClass = 'bg-mystic-900 hover:bg-mystic-800 transition-colors duration-300';
            if (isLife) bgClass = 'bg-gradient-to-br from-mystic-800 to-red-900/20';

            return (
              <div 
                key={index}
                style={{ gridColumn: pos.col, gridRow: pos.row }}
                className={`${bgClass} relative flex flex-col justify-between p-2 md:p-3 overflow-hidden group`}
              >
                {/* Top: Stars */}
                <div className="flex flex-col items-start w-full h-full">
                  {/* Major Stars */}
                  <div className="flex flex-col w-full mb-2">
                     {palace.major_stars.map(s => renderStar(s, true))}
                  </div>
                  
                  {/* Minor Stars (Grid layout for compactness) */}
                  <div className="grid grid-cols-2 w-full gap-x-1 content-start">
                     {palace.minor_stars.map(s => renderStar(s, false))}
                  </div>
                </div>
  
                {/* Bottom: Info & Label */}
                <div className="flex flex-col w-full mt-1 relative z-20">
                   {/* Transformations (Floating above label) */}
                   {palace.is_four_transformed !== '否' && (
                     <div className="flex flex-wrap justify-end mb-1 absolute bottom-8 right-0">
                        {palace.is_four_transformed.split(' ').map(t => getTransformationBadge(t))}
                     </div>
                   )}
  
                   {/* Footer: Label & Branch */}
                   <div className="flex justify-between items-end border-t border-white/5 pt-1.5 mt-1">
                      
                      {/* Palace Name Label */}
                      <div className={`
                        px-2 py-0.5 text-xs md:text-sm font-bold tracking-widest rounded-sm border shadow-sm
                        ${isLife 
                          ? 'bg-red-700 text-white border-red-500/50' 
                          : 'bg-mystic-950 text-gold-500 border-gold-900/30'}
                      `}>
                         {palace.name} 
                         {isBody && <span className="text-[10px] ml-1 opacity-75 font-normal">身</span>}
                      </div>
                      
                      {/* Stem/Branch (Subtle) */}
                      <div className="text-right">
                         <span className="text-mystic-600 font-medium text-xs font-mono opacity-70 group-hover:opacity-100 transition-opacity">
                           {palace.stem}{palace.branch}
                         </span>
                      </div>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overall Destiny Card */}
      {overallDestiny && (
        <div className="w-full max-w-[800px] mx-auto glass-panel rounded-xl p-6 md:p-8 relative overflow-hidden">
           <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gold-400 to-gold-700"></div>
           <h3 className="text-xl text-white font-bold mb-4 flex items-center gap-3">
             <span className="text-gold-500 text-2xl">✦</span>
             本命格局總論
           </h3>
           <p className="text-mystic-100 text-base md:text-lg leading-loose text-justify font-light tracking-wide">
             {overallDestiny}
           </p>
        </div>
      )}
    </div>
  );
};

export default ChartGrid;