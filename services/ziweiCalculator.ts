import { Solar, Lunar } from 'lunar-javascript';
import { UserInput, CalendarType, PalaceChartData, Profile, BirthHour } from '../types';
import { EARTHLY_BRANCHES } from '../constants';

// --- Constants & Tables ---

const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 12 Palaces Base Order (Counter-Clockwise)
const PALACE_NAMES = [
  '命宮', '兄弟', '夫妻', '子女', '財帛', '疾厄', 
  '遷移', '交友', '官祿', '田宅', '福德', '父母'
];

const FIVE_ELEMENTS = {
  '水二局': 2, '木三局': 3, '金四局': 4, '土五局': 5, '火六局': 6
};

// Five Tigers Chasing (Month/Palace Stem)
const TIGER_START_STEM = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0]; // 甲年起丙寅...

// Purple Star Tables (Days 1-30)
const PURPLE_STAR_LOOKUP: Record<number, number[]> = {
  2: [1,1,2,2,3,3,4,4,5,5,6,6,7,8,8,9,9,10,10,11,11,0,0,1,1,2,2,3,3,4],
  3: [4,1,5,2,5,3,8,4,9,5,10,6,11,7,0,8,1,9,2,10,5,11,6,0,7,1,8,2,9,3],
  4: [11,4,0,1,5,2,8,3,9,4,10,5,11,6,0,7,1,8,2,9,3,10,4,11,5,0,6,1,7,2],
  5: [6,11,0,5,1,8,2,9,3,10,4,11,5,0,6,1,7,2,8,3,9,4,10,5,11,6,0,7,1,8],
  6: [9,4,10,5,11,6,0,7,1,8,2,9,3,10,4,11,5,0,6,1,7,2,8,3,9,4,10,5,11,6]
};

// Major Stars offsets relative to Purple Star (CCW)
const ZIWEI_GROUP_OFFSET = [0, -1, -3, -4, -5, -8]; 
const ZIWEI_GROUP_NAMES = ['紫微', '天機', '太陽', '武曲', '天同', '廉貞'];

// Tian Fu Group relative to Tian Fu position (CW)
const TIANFU_GROUP_OFFSET = [0, 1, 2, 3, 4, 5, 6, 10];
const TIANFU_GROUP_NAMES = ['天府', '太陰', '貪狼', '巨門', '天相', '天梁', '七殺', '破軍'];

// --- Auxiliary & Sha Stars Logic ---

// Wenchang (Hour): Xu(10) CCW by hour-1. | Wenqu (Hour): Chen(4) CW by hour-1.
const getWenchangPos = (hourIdx: number) => norm(10 - hourIdx);
const getWenquPos = (hourIdx: number) => norm(4 + hourIdx);

// Zuofu (Month): Chen(4) CW by month-1. | Youbi (Month): Xu(10) CCW by month-1.
const getZuofuPos = (month: number) => norm(4 + (month - 1));
const getYoubiPos = (month: number) => norm(10 - (month - 1));

// Huoxing / Lingxing (Year Branch + Hour)
const getHuoLing = (yearBranchIdx: number, hourIdx: number) => {
  let startHuo = 2;
  let startLing = 10;
  
  if ([2, 6, 10].includes(yearBranchIdx)) { startHuo = 1; startLing = 3; }
  else if ([5, 9, 1].includes(yearBranchIdx)) { startHuo = 3; startLing = 10; }
  else if ([11, 3, 7].includes(yearBranchIdx)) { startHuo = 9; startLing = 10; }
  else { startHuo = 2; startLing = 10; } 

  return {
    huo: norm(startHuo + hourIdx),
    ling: norm(startLing - hourIdx) 
  };
};

// Di Jie: Hai(11) CW by hour. | Di Kong: Hai(11) CCW by hour.
const getDikongPos = (hourIdx: number) => norm(11 - hourIdx);
const getDijiePos = (hourIdx: number) => norm(11 + hourIdx);

// Lucun (Year Stem):
const LUCUN_MAP = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0];

// Tian Kui / Tian Yue (Year Stem)
const KUI_YUE_TABLE = [
  {k:1, y:7}, {k:0, y:8}, {k:11, y:9}, {k:11, y:9}, {k:1, y:7},
  {k:0, y:8}, {k:1, y:7}, {k:6, y:2}, {k:5, y:3}, {k:5, y:3}
];

// Full Brightness Map
const FULL_BRIGHTNESS_MAP: Record<string, string[]> = {
  '紫微': ['平','旺','廟','旺','得','陷','旺','廟','旺','旺','得','旺'],
  '天機': ['廟','陷','陷','旺','利','平','廟','陷','得','旺','廟','平'],
  '太陽': ['陷','陷','陷','旺','旺','旺','廟','得','得','平','陷','陷'],
  '武曲': ['旺','廟','平','旺','廟','平','旺','廟','平','旺','廟','平'],
  '天同': ['旺','陷','陷','平','平','廟','陷','陷','旺','平','平','廟'],
  '廉貞': ['平','利','廟','平','旺','陷','平','利','廟','平','旺','陷'],
  '天府': ['廟','廟','廟','平','廟','得','旺','廟','得','旺','廟','得'],
  '太陰': ['廟','廟','陷','陷','陷','陷','陷','平','利','旺','旺','廟'],
  '貪狼': ['旺','廟','平','平','廟','陷','旺','廟','平','平','廟','陷'],
  '巨門': ['旺','陷','廟','廟','平','陷','旺','陷','廟','廟','平','陷'],
  '天相': ['廟','廟','廟','陷','旺','平','廟','得','廟','陷','旺','平'],
  '天梁': ['廟','旺','廟','廟','旺','陷','廟','旺','廟','廟','旺','陷'],
  '七殺': ['旺','廟','廟','陷','旺','平','旺','廟','廟','陷','旺','平'],
  '破軍': ['廟','旺','陷','平','旺','陷','廟','旺','陷','平','旺','陷'],
  '文昌': ['陷','陷','利','利','廟','廟','陷','陷','利','利','廟','廟'],
  '文曲': ['廟','廟','陷','陷','利','利','廟','廟','陷','陷','利','利'],
};
FULL_BRIGHTNESS_MAP['紫微'][8] = '旺';

// Four Transformations
const FOUR_TRANSFORMATIONS_TABLE = [
  ['廉貞', '破軍', '武曲', '太陽'], // 甲
  ['天機', '天梁', '紫微', '太陰'], // 乙
  ['天同', '天機', '文昌', '廉貞'], // 丙
  ['太陰', '天同', '天機', '巨門'], // 丁
  ['貪狼', '太陰', '右弼', '天機'], // 戊
  ['武曲', '貪狼', '天梁', '文曲'], // 己
  ['太陽', '武曲', '太陰', '天同'], // 庚
  ['巨門', '太陽', '文曲', '文昌'], // 辛
  ['天梁', '紫微', '左輔', '武曲'], // 壬
  ['破軍', '巨門', '太陰', '貪狼'], // 癸
];

const norm = (n: number) => (n % 12 + 12) % 12;

export const calculateZiWeiChart = (userData: UserInput): { chart: PalaceChartData, profile: Profile } => {
  let lunar: Lunar;
  
  if (userData.calendarType === CalendarType.SOLAR) {
    const [y, m, d] = userData.birthDate.split('-').map(Number);
    const hourIdx = Object.values(BirthHour).indexOf(userData.birthTime);
    const solar = Solar.fromYmdHms(y, m, d, hourIdx * 2, 0, 0);
    lunar = solar.getLunar();
  } else {
     const [y, m, d] = userData.birthDate.split('-').map(Number);
     const hourIdx = Object.values(BirthHour).indexOf(userData.birthTime);
     lunar = Lunar.fromYmdHms(y, m, d, hourIdx * 2, 0, 0);
  }

  const lunarYear = lunar.getYear();
  let lunarMonth = lunar.getMonth(); // 1-12 (even if leap, number is same)
  const lunarDay = lunar.getDay();
  
  // --- Leap Month Correction (Purple Star Astrology Rule) ---
  // If current month is Leap Month:
  // Days 1-15: Count as current month (no change)
  // Days 16-end: Count as next month (month + 1)
  if (lunar.toString().includes('閏')) {
      if (lunarDay > 15) {
          lunarMonth = lunarMonth + 1;
          if (lunarMonth > 12) lunarMonth = 1; // Wrap around if needed (rare)
      }
  }

  const timeBranchIdx = Object.values(BirthHour).indexOf(userData.birthTime); 
  const yearBranchIdx = norm(lunarYear - 4);
  const yearZhiIdx = EARTHLY_BRANCHES.indexOf(lunar.getYearZhi());
  const yearGanStr = lunar.getYearGan();
  const yearGanIdx = HEAVENLY_STEMS.indexOf(yearGanStr);

  // Life Palace Position: Month + (Time - 1) is not correct. 
  // Formula: Yin(2) + Month - 1 - (Time)  <-- Check this
  // Standard: Month number + 1 (Start from Yin) -> then backward by Time.
  // Actually standard formula is: Start at Yin(2). Forward by Month-1. Backward by Time (0-11).
  let lifePos = norm(2 + (lunarMonth - 1) - timeBranchIdx);
  const lifeBranch = EARTHLY_BRANCHES[lifePos];

  // Body Palace Position: Start at Yin(2). Forward by Month-1. Forward by Time.
  let bodyPos = norm(2 + (lunarMonth - 1) + timeBranchIdx);
  const bodyBranch = EARTHLY_BRANCHES[bodyPos];

  const tigerStemIdx = TIGER_START_STEM[yearGanIdx];
  const shift = norm(lifePos - 2); 
  const palaceStemIdx = (tigerStemIdx + shift) % 10;
  
  // Bureau determination
  const bureauMap = [[4, 2, 6], [2, 6, 5], [6, 5, 3], [5, 3, 4], [3, 4, 2]];
  const stemPair = Math.floor(palaceStemIdx / 2);
  const branchPair = Math.floor(lifePos / 2) % 3;
  const bureauNum = bureauMap[stemPair][branchPair];
  const bureauName = Object.keys(FIVE_ELEMENTS).find(k => FIVE_ELEMENTS[k as keyof typeof FIVE_ELEMENTS] === bureauNum) || "水二局";

  const purpleTable = PURPLE_STAR_LOOKUP[bureauNum];
  const purplePos = purpleTable[lunarDay - 1] ?? 0;
  const tianFuPos = norm(16 - purplePos);

  const allPalaces = Array(12).fill(null).map((_, i) => {
    let dist = norm(lifePos - i);
    const name = PALACE_NAMES[dist];
    const offsetFromYin = norm(i - 2);
    const stemIndex = (tigerStemIdx + offsetFromYin) % 10;
    const stem = HEAVENLY_STEMS[stemIndex];

    return { 
      branch: EARTHLY_BRANCHES[i], 
      stem: stem,
      name, 
      major_stars: [] as string[], 
      minor_stars: [] as string[],
      adjective_stars: [] as string[],
      is_four_transformed: "否"
    };
  });

  const addStar = (name: string, pos: number, type: 'major' | 'minor') => {
    const brightnessList = FULL_BRIGHTNESS_MAP[name];
    const brightness = brightnessList ? brightnessList[pos] : '';
    const label = brightness ? `${name}(${brightness})` : name;
    if (type === 'major') allPalaces[pos].major_stars.push(label);
    else allPalaces[pos].minor_stars.push(label);
  };

  ZIWEI_GROUP_OFFSET.forEach((offset, idx) => addStar(ZIWEI_GROUP_NAMES[idx], norm(purplePos + offset), 'major'));
  TIANFU_GROUP_OFFSET.forEach((offset, idx) => addStar(TIANFU_GROUP_NAMES[idx], norm(tianFuPos + offset), 'major'));

  addStar('文昌', getWenchangPos(timeBranchIdx), 'minor');
  addStar('文曲', getWenquPos(timeBranchIdx), 'minor');

  addStar('左輔', getZuofuPos(lunarMonth), 'minor');
  addStar('右弼', getYoubiPos(lunarMonth), 'minor');

  const ky = KUI_YUE_TABLE[yearGanIdx];
  addStar('天魁', ky.k, 'minor');
  addStar('天鉞', ky.y, 'minor');

  const luPos = LUCUN_MAP[yearGanIdx];
  addStar('祿存', luPos, 'minor');
  addStar('擎羊', norm(luPos + 1), 'minor');
  addStar('陀羅', norm(luPos - 1), 'minor');

  const hl = getHuoLing(yearZhiIdx, timeBranchIdx);
  addStar('火星', hl.huo, 'minor');
  addStar('鈴星', hl.ling, 'minor');

  addStar('地空', getDikongPos(timeBranchIdx), 'minor');
  addStar('地劫', getDijiePos(timeBranchIdx), 'minor');

  const transStars = FOUR_TRANSFORMATIONS_TABLE[yearGanIdx]; 
  const transLabels = ['化祿', '化權', '化科', '化忌'];
  
  const fourTransResult = { HUA_LU: '', HUA_QUAN: '', HUA_KE: '', HUA_JI: '' };

  transStars.forEach((starName, idx) => {
    const label = transLabels[idx];
    let found = false;

    for (const p of allPalaces) {
      for (const s of p.major_stars) {
        if (s.startsWith(starName)) {
           const key = idx === 0 ? 'HUA_LU' : idx === 1 ? 'HUA_QUAN' : idx === 2 ? 'HUA_KE' : 'HUA_JI';
           fourTransResult[key as keyof typeof fourTransResult] = `${starName} (${p.branch})`;
           p.is_four_transformed = p.is_four_transformed === "否" ? label : p.is_four_transformed + " " + label;
           found = true;
           break;
        }
      }
      if (found) break;
    }
    
    if (!found) {
       for (const p of allPalaces) {
        for (const s of p.minor_stars) {
          if (s.startsWith(starName)) {
            const key = idx === 0 ? 'HUA_LU' : idx === 1 ? 'HUA_QUAN' : idx === 2 ? 'HUA_KE' : 'HUA_JI';
            fourTransResult[key as keyof typeof fourTransResult] = `${starName} (${p.branch})`;
            p.is_four_transformed = p.is_four_transformed === "否" ? label : p.is_four_transformed + " " + label;
            found = true;
            break;
          }
        }
        if (found) break;
      }
    }

    if (!found) {
        const key = idx === 0 ? 'HUA_LU' : idx === 1 ? 'HUA_QUAN' : idx === 2 ? 'HUA_KE' : 'HUA_JI';
        fourTransResult[key as keyof typeof fourTransResult] = `${starName} (未顯示)`;
    }
  });
  
  return {
    profile: {
      name: userData.name,
      gender: userData.gender,
      lunar_date_time: `${lunar.getYearInGanZhi()}年 ${lunar.getMonthInChinese()}月 ${lunar.getDayInChinese()} ${userData.birthTime} (閏月修正)`,
      five_elements_bureau: bureauName
    },
    chart: {
      life_palace_location: lifeBranch,
      body_palace_location: bodyBranch,
      four_transformations: fourTransResult,
      all_palaces: allPalaces
    }
  };
};