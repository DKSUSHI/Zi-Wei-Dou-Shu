export enum Gender {
  MALE = '男',
  FEMALE = '女'
}

export enum CalendarType {
  SOLAR = '國曆',
  LUNAR = '農曆'
}

export enum BirthHour {
  ZI = '子時 (23:00-01:00)',
  CHOU = '丑時 (01:00-03:00)',
  YIN = '寅時 (03:00-05:00)',
  MAO = '卯時 (05:00-07:00)',
  CHEN = '辰時 (07:00-09:00)',
  SI = '巳時 (09:00-11:00)',
  WU = '午時 (11:00-13:00)',
  WEI = '未時 (13:00-15:00)',
  SHEN = '申時 (15:00-17:00)',
  YOU = '酉時 (17:00-19:00)',
  XU = '戌時 (19:00-21:00)',
  HAI = '亥時 (21:00-23:00)'
}

export interface UserInput {
  name: string;
  gender: Gender;
  calendarType: CalendarType;
  birthDate: string; // YYYY-MM-DD
  birthTime: BirthHour;
}

// Result Interfaces

export interface Profile {
  name: string;
  gender: string;
  lunar_date_time: string;
  five_elements_bureau: string;
}

export interface Palace {
  name: string;
  major_stars: string[]; // e.g. "紫微(廟)"
  minor_stars: string[]; // e.g. "文昌(廟)", "擎羊(陷)"
  adjective_stars: string[]; // Future expansion for smaller stars
  is_four_transformed: string; 
  branch: string;
  stem: string; 
}

export interface FourTransformations {
  HUA_LU: string;
  HUA_QUAN: string;
  HUA_KE: string;
  HUA_JI: string;
}

export interface PalaceChartData {
  life_palace_location: string;
  body_palace_location: string;
  four_transformations: FourTransformations;
  all_palaces: Palace[];
}

// Analysis Structures for Tabs

export interface StarInfluence {
  name: string;
  brightness: string;
  influence: string; // AI generated specific text
}

export interface PalaceAnalysis {
  palace_name: string;
  summary: string; // Overall summary of the palace
  stars_detail: StarInfluence[]; // Detailed breakdown per star
}

export interface AnalysisInterpretation {
  overall_destiny: string; // Global features (displayed under chart)
  palaces: PalaceAnalysis[]; // Array for tabs
}

export interface AstrologyResponse {
  profile: Profile;
  palace_chart_data: PalaceChartData;
  analysis_interpretation: AnalysisInterpretation;
}