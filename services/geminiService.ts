import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AstrologyResponse, PalaceChartData, Profile } from "../types";

// Enhanced Schema for Tab-based Analysis and Detailed Star info
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    overall_destiny: {
      type: Type.STRING,
      description: "A summary of the person's overall destiny, specifically identifying patterns (Geju) like 'Sha Po Lang', 'San Fang Si Zheng', etc."
    },
    palaces: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          palace_name: { type: Type.STRING },
          summary: { type: Type.STRING, description: "A concise summary of this palace's state." },
          stars_detail: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                brightness: { type: Type.STRING },
                influence: { type: Type.STRING, description: "Specific impact of this star in this palace." }
              },
              required: ["name", "influence"]
            }
          }
        },
        required: ["palace_name", "summary", "stars_detail"]
      }
    }
  },
  required: ["overall_destiny", "palaces"]
};

export const generateInterpretation = async (profile: Profile, chartData: PalaceChartData): Promise<any> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `
  角色： 精通「飛星派紫微斗數」的大師。
  任務： 解析命盤，提供結構化的數據。

  **核心分析要求**：
  1. **overall_destiny (本命特點 與 格局分析)**：
     - **必須** 分析「三方四正」（命宮、財帛、官祿、遷移）的整體架構。
     - **必須** 判斷是否存在特殊格局（例如：殺破狼、機月同梁、紫府同宮、日月並明、巨日同宮、石中隱玉...等）。
     - 若有格局，請說明該格局的特質（如：殺破狼主變動、開創；機月同梁主穩健、吏人...等）。
     - 字數控制在 150-200 字，精簡扼要。

  2. **palaces (宮位解析)**：
     - 順序：命宮、財帛宮、官祿宮，其餘按順序。
     - **stars_detail**：針對宮內每顆星曜（主星、吉煞星）進行影響分析。需結合「亮度（廟旺利陷）」與「四化（祿權科忌）」的交互影響。
     - **空宮處理**：若該宮位無主星（空宮），請務必參考提供的「借對宮主星」資訊進行分析，並在說明中提及是借用對宮力量，且力量會有所折損。
     - 風格：現代、口語、實用，避免過於艱澀的古文，直接給予生活建議。
  `;

  // Construct a prompt describing the calculated chart
  const chartDescription = `
  使用者：${profile.name}, ${profile.gender}, ${profile.five_elements_bureau}, 農曆：${profile.lunar_date_time}
  
  四化星：
  祿：${chartData.four_transformations.HUA_LU}
  權：${chartData.four_transformations.HUA_QUAN}
  科：${chartData.four_transformations.HUA_KE}
  忌：${chartData.four_transformations.HUA_JI}

  各宮位詳細星曜與狀態：
  ${chartData.all_palaces.map((p, index) => {
    const isEmpty = p.major_stars.length === 0;
    let contextInfo = `主星: [${p.major_stars.join(', ')}]`;
    let instruction = "";

    if (isEmpty) {
        // Calculate opposite palace index (current + 6) % 12
        const oppositeIndex = (index + 6) % 12;
        const oppositePalace = chartData.all_palaces[oppositeIndex];
        contextInfo = `主星: [無] (空宮)\n     借對宮主星參考: [${oppositePalace.major_stars.join(', ')}] (來自${oppositePalace.name})`;
        instruction = "指令：此為空宮，請借對宮主星進行分析，但請註明影響力較弱（約七成）。";
    }

    return `【${p.name}】(${p.stem}${p.branch}): 
     ${contextInfo}
     輔/煞/雜星: [${p.minor_stars.join(', ')}]
     四化標記: ${p.is_four_transformed}
     ${instruction}
    `;
  }).join('\n')}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: chartDescription,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        thinkingConfig: { thinkingBudget: 1024 } // Give it some thought for pattern recognition
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini Interpretation Error:", error);
    throw error;
  }
};