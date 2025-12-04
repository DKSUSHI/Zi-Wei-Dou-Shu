import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ChartGrid from './components/ChartGrid';
import AnalysisSection from './components/AnalysisSection';
import { UserInput, AstrologyResponse } from './types';
import { calculateZiWeiChart } from './services/ziweiCalculator';
import { generateInterpretation } from './services/geminiService';
import { ArrowLeft } from './components/Icons';

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
      
      const initialResult: AstrologyResponse = {
        profile,
        palace_chart_data: chart,
        analysis_interpretation: {
          overall_destiny: "大師正在觀星中，請稍候...",
          palaces: [] 
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
    <div className="min-h-screen pb-10">
      <div className="relative z-10 container mx-auto px-4 py-6 md:py-12">
        
        <main className="w-full">
          {error && (
            <div className="max-w-md mx-auto mb-8 bg-red-500/10 border border-red-500/40 text-red-200 px-6 py-4 rounded-xl text-center backdrop-blur-sm shadow-lg">
              {error}
            </div>
          )}

          {!result && (
            <div className="flex flex-col items-center justify-center min-h-[70vh]">
              <InputForm onSubmit={handleFormSubmit} isLoading={loading} />
              
              {!loading && (
                <footer className="mt-16 text-center text-mystic-600 text-xs">
                  <p className="opacity-70">&copy; {new Date().getFullYear()} Destiny Compass. All rights reserved.</p>
                </footer>
              )}
            </div>
          )}
          
          {result && (
            <div className="animate-fade-in">
              {/* Header Nav */}
              <div className="flex justify-between items-center mb-8 bg-mystic-950/80 backdrop-blur-md sticky top-0 z-50 py-4 px-4 -mx-4 border-b border-white/5">
                <button 
                  onClick={handleReset}
                  className="flex items-center gap-2 text-mystic-400 hover:text-white transition-colors group"
                >
                  <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-gold-500 group-hover:text-mystic-950 transition-all">
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">重新排盤</span>
                </button>
              </div>

              {/* Chart */}
              <div className="mb-16">
                <ChartGrid 
                  data={result.palace_chart_data} 
                  profile={result.profile} 
                  overallDestiny={result.analysis_interpretation.overall_destiny !== "大師正在觀星中，請稍候..." ? result.analysis_interpretation.overall_destiny : undefined}
                />
              </div>

              {/* Analysis */}
              <div id="analysis" className="transition-opacity duration-500">
                {analyzing ? (
                   <div className="glass-panel rounded-3xl p-12 text-center max-w-2xl mx-auto">
                      <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                      <p className="text-gold-400 font-bold text-xl mb-2 animate-pulse">星象解讀中...</p>
                      <p className="text-mystic-400">正在連結天機，分析您的命盤格局</p>
                   </div>
                ) : (
                   <AnalysisSection analysis={result.analysis_interpretation} />
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;