// @ts-ignore
import React, { useState } from 'react';
// @ts-ignore
import { UserInput, Gender, CalendarType, BirthHour } from '../types.ts';
// @ts-ignore
import { HOURS_LIST } from '../constants.ts';
// @ts-ignore
import { Sparkles, Moon, Sun, Clock, Calendar, User } from './Icons.tsx';

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
    <div className="w-full max-w-lg mx-auto bg-mystic-800/80 backdrop-blur-md border border-mystic-600 rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gold-400 mb-2 flex justify-center items-center gap-2">
          <Sparkles className="w-6 h-6" />
          命運羅盤
        </h2>
        <p className="text-mystic-200 text-sm">輸入您的生辰，開啟紫微命盤解析</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-mystic-300 text-sm font-medium mb-2 flex items-center gap-2">
            <User className="w-4 h-4" /> 姓名
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-mystic-900 border border-mystic-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all placeholder-mystic-600"
            placeholder="請輸入姓名"
          />
        </div>

        {/* Gender & Calendar Type Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-mystic-300 text-sm font-medium mb-2">性別</label>
            <div className="flex bg-mystic-900 rounded-lg p-1 border border-mystic-600">
              {Object.values(Gender).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, gender: g }))}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                    formData.gender === g
                      ? 'bg-mystic-600 text-white shadow-md'
                      : 'text-mystic-400 hover:text-white'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-mystic-300 text-sm font-medium mb-2">曆法</label>
            <div className="flex bg-mystic-900 rounded-lg p-1 border border-mystic-600">
              {Object.values(CalendarType).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, calendarType: c }))}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-all flex justify-center items-center gap-1 ${
                    formData.calendarType === c
                      ? 'bg-gold-600 text-white shadow-md'
                      : 'text-mystic-400 hover:text-white'
                  }`}
                >
                  {c === CalendarType.LUNAR ? <Moon className="w-3 h-3"/> : <Sun className="w-3 h-3"/>}
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-mystic-300 text-sm font-medium mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> 出生日期
          </label>
          <input
            type="date"
            name="birthDate"
            required
            max="9999-12-31" 
            value={formData.birthDate}
            onChange={handleChange}
            className="w-full bg-mystic-900 border border-mystic-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all [color-scheme:dark]"
          />
        </div>

        {/* Time */}
        <div>
          <label className="block text-mystic-300 text-sm font-medium mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" /> 出生時辰
          </label>
          <select
            name="birthTime"
            value={formData.birthTime}
            onChange={handleChange}
            className="w-full bg-mystic-900 border border-mystic-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all appearance-none"
          >
            {HOURS_LIST.map((h: string) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-white font-bold py-4 rounded-xl shadow-lg transform transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              排盤運算中...
            </>
          ) : (
            '立即排盤'
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;