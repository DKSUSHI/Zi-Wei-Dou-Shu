import React, { useState } from 'react';
import { UserInput, Gender, CalendarType, BirthHour } from '../types';
import { HOURS_LIST } from '../constants';
import { Sparkles, Moon, Sun, Clock, Calendar, User } from './Icons';

interface InputFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UserInput>({
    name: '',
    gender: Gender.MALE,
    calendarType: CalendarType.SOLAR,
    birthDate: '',
    birthTime: BirthHour.ZI
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-md mx-auto glass-panel rounded-3xl p-8 relative overflow-hidden transition-all hover:shadow-2xl hover:shadow-mystic-500/10">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center justify-center p-3 bg-mystic-800/50 rounded-full mb-4 ring-1 ring-white/10 shadow-lg">
          <Sparkles className="w-6 h-6 text-gold-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2 tracking-wide">命運羅盤</h2>
        <p className="text-mystic-300 text-sm font-light">探索紫微星辰，預見人生軌跡</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        {/* Name Input */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-mystic-400 uppercase tracking-wider ml-1">姓名</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-mystic-500 group-focus-within:text-gold-400 transition-colors">
              <User className="w-5 h-5" />
            </div>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-mystic-950/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-mystic-600 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50 outline-none transition-all"
              placeholder="請輸入您的姓名"
            />
          </div>
        </div>

        {/* Gender & Calendar */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-mystic-400 uppercase tracking-wider ml-1">性別</label>
            <div className="flex bg-mystic-950/50 rounded-xl p-1 border border-white/10">
              {Object.values(Gender).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, gender: g }))}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    formData.gender === g
                      ? 'bg-mystic-700 text-white shadow-md'
                      : 'text-mystic-500 hover:text-mystic-300'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-mystic-400 uppercase tracking-wider ml-1">曆法</label>
            <div className="flex bg-mystic-950/50 rounded-xl p-1 border border-white/10">
              {Object.values(CalendarType).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, calendarType: c }))}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex justify-center items-center gap-1.5 ${
                    formData.calendarType === c
                      ? 'bg-gold-600 text-white shadow-md'
                      : 'text-mystic-500 hover:text-mystic-300'
                  }`}
                >
                  {c === CalendarType.LUNAR ? <Moon className="w-3.5 h-3.5"/> : <Sun className="w-3.5 h-3.5"/>}
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Date Input */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-mystic-400 uppercase tracking-wider ml-1">出生日期</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-mystic-500 group-focus-within:text-gold-400 transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <input
              type="date"
              name="birthDate"
              required
              max="9999-12-31"
              value={formData.birthDate}
              onChange={handleChange}
              className="w-full bg-mystic-950/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50 outline-none transition-all [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Time Input */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-mystic-400 uppercase tracking-wider ml-1">出生時辰</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-mystic-500 group-focus-within:text-gold-400 transition-colors">
              <Clock className="w-5 h-5" />
            </div>
            <select
              name="birthTime"
              value={formData.birthTime}
              onChange={handleChange}
              className="w-full bg-mystic-950/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50 outline-none transition-all appearance-none cursor-pointer"
            >
              {HOURS_LIST.map((h: string) => (
                <option key={h} value={h} className="bg-mystic-900 text-white">
                  {h}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-gold-900/20 transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 group"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white/80" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-white/80">天機運算中...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>立即排盤</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;