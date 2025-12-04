import { BirthHour } from './types';

export const HOURS_LIST = Object.values(BirthHour);

export const EARTHLY_BRANCHES = [
  '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'
];

export const GRID_MAPPING: Record<string, { col: number, row: number }> = {
  '巳': { col: 1, row: 1 }, 
  '午': { col: 2, row: 1 }, 
  '未': { col: 3, row: 1 }, 
  '申': { col: 4, row: 1 },

  '辰': { col: 1, row: 2 },                                                    
  '酉': { col: 4, row: 2 },

  '卯': { col: 1, row: 3 },                                                    
  '戌': { col: 4, row: 3 },

  '寅': { col: 1, row: 4 }, 
  '丑': { col: 2, row: 4 }, 
  '子': { col: 3, row: 4 }, 
  '亥': { col: 4, row: 4 },
};

export const SAMPLE_DATA_LOADING = {
  message: "天機運算中...",
  subMessage: "正在定位星辰，排布命盤..."
};

export const ALL_MAJOR_STARS = [
  '紫微', '天機', '太陽', '武曲', '天同', '廉貞',
  '天府', '太陰', '貪狼', '巨門', '天相', '天梁', '七殺', '破軍'
];

export const STAR_PRIORITY = [
  ...ALL_MAJOR_STARS,
  '左輔', '右弼', '文昌', '文曲', '天魁', '天鉞', '祿存',
  '擎羊', '陀羅', '火星', '鈴星', '地空', '地劫'
];