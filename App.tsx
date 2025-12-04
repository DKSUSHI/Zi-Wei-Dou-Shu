// @ts-ignore
import React, { useState } from 'react';
// @ts-ignore
import InputForm from './components/InputForm.tsx';
// @ts-ignore
import ChartGrid from './components/ChartGrid.tsx';
// @ts-ignore
import AnalysisSection from './components/AnalysisSection.tsx';
// @ts-ignore
import { UserInput, AstrologyResponse, PalaceChartData, Profile } from './types.ts';
// @ts-ignore
import { calculateZiWeiChart } from './services/ziweiCalculator.ts';
// @ts-ignore
import { generateInterpretation } from './services/geminiService.ts';
// @ts-ignore
import { ArrowLeft } from './components/Icons.tsx';
// @ts-ignore
import { SAMPLE_DATA_LOADING } from './constants.ts';

const App: React.FC = () => {
  const [result, setResult] = useState<AstrologyResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: UserInput) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // 1. Local Calculation (Instant)
      const { chart, profile } = calculateZiWeiChart(data);
      
      // Set result immediately with chart data (Analysis is pending)
      const initialResult: AstrologyResponse = {
        profile,
        palace_chart_data: chart,
        analysis_interpretation: {
          overall_destiny: "大師正在觀星中，請稍候...",
          palaces: [] // Will be populated by AI
        }
      };
      
      setResult(initialResult);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setLoading(false);

      // 2. AI Interpretation (Async)
      setAnalyzing(true);
      const analysis = await generateInterpretation(profile, chart);
      
      setResult(prev => prev ? {
        ...prev,
        analysis_interpretation: analysis
      } : null);

    } catch (err: any) {
      console.error(err);
      let errorMessage = "排盤發生錯誤，請檢查輸入資料。";
      if (err instanceof Error) {
         if (err.message.includes('API Key')) {
            errorMessage = "分析服務連線失敗 (API Key Error)，但排盤已完成。";
         }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-mystic-900 text-mystic-50 font-sans selection:bg-gold-500 selection:text-white pb-12">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-mystic-800 via-mystic-900 to-black opacity-60"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        
        {/* Header */}
        {!result && (
            <header className="flex justify-center items-center py-10">
              {/* Logo or Title Placeholder */}
            </header>
        )}

        {/* Main Content Area */}
        <main className="w-full">
          {error && (
            <div className="max-w-lg mx-auto mb-6 bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          )}

          {!result && (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <InputForm onSubmit={handleFormSubmit} isLoading={loading} />
              
              {!loading && (
                <div className="mt-12 text-center text-mystic-500 text-xs max-w-md">
                  <p>本服務採用標準曆法運算排盤，結合 AI 進行深度解析。</p>
                  <p>算命結果僅供參考，命運掌握在自己手中。</p>
                </div>
              )}
            </div>
          )}
          
          {result && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              {/* Result Header & Nav */}
              <div className="flex justify-between items-center mb-8 sticky top-0 z-20 bg-mystic-900/90 backdrop-blur-md py-4 px-2 border-b border-mystic-800">
                <button 
                  onClick={handleReset}
                  className="flex items-center gap-2 text-mystic-400 hover:text-gold-400 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="hidden sm:inline">重新排盤</span>
                </button>
                <div className="text-center">
                   <h1 className="text-xl font-bold text-gold-400 tracking-wider">紫微斗數命盤</h1>
                </div>
                <div className="w-20"></div> {/* Spacer for centering */}
              </div>

              {/* Chart Visualization */}
              <div className="mb-12">
                <ChartGrid 
                  data={result.palace_chart_data} 
                  profile={result.profile} 
                  overallDestiny={result.analysis_interpretation.overall_destiny !== "大師正在觀星中，請稍候..." ? result.analysis_interpretation.overall_destiny : undefined}
                />
              </div>

              {/* Detailed Analysis */}
              <div id="analysis" className="transition-opacity duration-500">
                {analyzing ? (
                   <div className="flex flex-col items-center justify-center py-20 space-y-4">
                      <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-gold-300 font-bold text-lg animate-pulse">大師正在解讀星象...</p>
                      <p className="text-mystic-400 text-sm">正在分析全盤格局與宮位細節</p>
                   </div>
                ) : (
                   <AnalysisSection analysis={result.analysis_interpretation} />
                )}
              </div>

              <div className="text-center mt-20 mb-10">
                 <button 
                  onClick={handleReset}
                  className="bg-mystic-800 hover:bg-mystic-700 text-mystic-300 font-medium py-3 px-8 rounded-full transition-all border border-mystic-600"
                >
                  算另一位
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;