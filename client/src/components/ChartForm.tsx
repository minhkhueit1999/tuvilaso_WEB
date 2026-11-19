import React, { useState } from 'react';
import { TuViInput, Gender, CalendarType } from '../types';
import { Sparkles, Calendar, Clock, User, Compass } from 'lucide-react';

interface ChartFormProps {
  onSubmit: (data: TuViInput) => void;
  isLoading: boolean;
}

const CANH_GIO = [
  { chi: 'Tý', hour: 23, minute: 30, desc: 'Tý (23:00 - 00:59)' },
  { chi: 'Sửu', hour: 1, minute: 30, desc: 'Sửu (01:00 - 02:59)' },
  { chi: 'Dần', hour: 3, minute: 30, desc: 'Dần (03:00 - 04:59)' },
  { chi: 'Mão', hour: 5, minute: 30, desc: 'Mão (05:00 - 06:59)' },
  { chi: 'Thìn', hour: 7, minute: 30, desc: 'Thìn (07:00 - 08:59)' },
  { chi: 'Tỵ', hour: 9, minute: 30, desc: 'Tỵ (09:00 - 10:59)' },
  { chi: 'Ngọ', hour: 11, minute: 30, desc: 'Ngọ (11:00 - 12:59)' },
  { chi: 'Mùi', hour: 13, minute: 30, desc: 'Mùi (13:00 - 14:59)' },
  { chi: 'Thân', hour: 15, minute: 30, desc: 'Thân (15:00 - 16:59)' },
  { chi: 'Dậu', hour: 17, minute: 30, desc: 'Dậu (17:00 - 18:59)' },
  { chi: 'Tuất', hour: 19, minute: 30, desc: 'Tuất (19:00 - 20:59)' },
  { chi: 'Hợi', hour: 21, minute: 30, desc: 'Hợi (21:00 - 22:59)' },
];

export const ChartForm: React.FC<ChartFormProps> = ({ onSubmit, isLoading }) => {
  const [fullName, setFullName] = useState('Tống Minh Khuê');
  const [gender, setGender] = useState<Gender>('male');
  const [calendarType, setCalendarType] = useState<CalendarType>('solar');
  const [isLeapMonth, setIsLeapMonth] = useState(false);
  const [day, setDay] = useState(28);
  const [month, setMonth] = useState(10);
  const [year, setYear] = useState(1999);
  const [selectedCanhGioIndex, setSelectedCanhGioIndex] = useState(4); // Thìn (7h-9h)
  const [viewingYear, setViewingYear] = useState(2026);

  const handleQuickSample = () => {
    setFullName('Tống Minh Khuê');
    setGender('male');
    setCalendarType('solar');
    setIsLeapMonth(false);
    setDay(28);
    setMonth(10);
    setYear(1999);
    setSelectedCanhGioIndex(4); // Thìn
    setViewingYear(2026);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const canhGio = CANH_GIO[selectedCanhGioIndex];
    onSubmit({
      fullName: fullName.trim() || 'Đương Số',
      gender,
      calendarType,
      day: Number(day),
      month: Number(month),
      year: Number(year),
      hour: canhGio.hour,
      minute: canhGio.minute,
      isLeapMonth,
      viewingYear: Number(viewingYear)
    });
  };

  return (
    <div className="bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border rounded-lg p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-paper-border dark:border-night-border">
        <div>
          <h2 className="font-serif text-lg sm:text-xl font-bold text-paper-red dark:text-night-gold flex items-center gap-2">
            <Compass className="w-5 h-5" />
            Nhập Thông Tin Lập Lá Số
          </h2>
          <p className="text-xs text-paper-sub dark:text-night-sub mt-0.5">
            Quy chuẩn Can Chi, Cục, Ngũ Hành Nạp Âm và An Sao Đẩu Số
          </p>
        </div>
        <button
          type="button"
          onClick={handleQuickSample}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-paper-gold dark:text-night-gold border border-paper-gold/40 dark:border-night-gold/40 hover:bg-paper-gold/10 transition-colors"
          title="Điền dữ liệu mẫu nhanh"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Điền mẫu nhanh</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Họ tên & Giới tính */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-paper-sub dark:text-night-sub mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-paper-gold dark:text-night-gold" />
              Họ và tên
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ví dụ: Nguyễn Văn An"
              className="w-full px-3 py-2 rounded text-sm bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border text-paper-text dark:text-night-text focus:outline-none focus:border-paper-red dark:focus:border-night-gold transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-paper-sub dark:text-night-sub mb-1.5">
              Giới tính
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-2 px-3 text-sm rounded font-medium border text-center transition-all ${
                  gender === 'male'
                    ? 'border-paper-red bg-paper-red/10 text-paper-red dark:border-night-gold dark:bg-night-gold/10 dark:text-night-gold'
                    : 'border-paper-border dark:border-night-border text-paper-sub dark:text-night-sub'
                }`}
              >
                Nam
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-2 px-3 text-sm rounded font-medium border text-center transition-all ${
                  gender === 'female'
                    ? 'border-paper-red bg-paper-red/10 text-paper-red dark:border-night-gold dark:bg-night-gold/10 dark:text-night-gold'
                    : 'border-paper-border dark:border-night-border text-paper-sub dark:text-night-sub'
                }`}
              >
                Nữ
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Lịch & Ngày Tháng Năm */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-paper-sub dark:text-night-sub flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-paper-gold dark:text-night-gold" />
              Ngày tháng năm sinh
            </label>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center text-xs cursor-pointer">
                <input
                  type="radio"
                  name="calendarType"
                  checked={calendarType === 'solar'}
                  onChange={() => setCalendarType('solar')}
                  className="mr-1 text-paper-red focus:ring-0"
                />
                Dương Lịch
              </label>
              <label className="inline-flex items-center text-xs cursor-pointer">
                <input
                  type="radio"
                  name="calendarType"
                  checked={calendarType === 'lunar'}
                  onChange={() => setCalendarType('lunar')}
                  className="mr-1 text-paper-red focus:ring-0"
                />
                Âm Lịch
              </label>
              {calendarType === 'lunar' && (
                <label className="inline-flex items-center text-xs text-paper-gold dark:text-night-gold cursor-pointer ml-1">
                  <input
                    type="checkbox"
                    checked={isLeapMonth}
                    onChange={(e) => setIsLeapMonth(e.target.checked)}
                    className="mr-1"
                  />
                  Tháng nhuận
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <select
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className="w-full px-3 py-2 rounded text-sm bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border text-paper-text dark:text-night-text focus:outline-none focus:border-paper-red dark:focus:border-night-gold"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    Ngày {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full px-3 py-2 rounded text-sm bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border text-paper-text dark:text-night-text focus:outline-none focus:border-paper-red dark:focus:border-night-gold"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    Tháng {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-2 rounded text-sm bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border text-paper-text dark:text-night-text focus:outline-none focus:border-paper-red dark:focus:border-night-gold"
              >
                {Array.from({ length: 100 }, (_, i) => 2030 - i).map((y) => (
                  <option key={y} value={y}>
                    Năm {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Row 3: Canh Giờ Sinh & Năm xem hạn */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-paper-sub dark:text-night-sub mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-paper-gold dark:text-night-gold" />
              12 Canh giờ sinh (Địa Chi)
            </label>
            <select
              value={selectedCanhGioIndex}
              onChange={(e) => setSelectedCanhGioIndex(Number(e.target.value))}
              className="w-full px-3 py-2 rounded text-sm bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border text-paper-text dark:text-night-text focus:outline-none focus:border-paper-red dark:focus:border-night-gold"
            >
              {CANH_GIO.map((item, index) => (
                <option key={item.chi} value={index}>
                  Giờ {item.desc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-paper-sub dark:text-night-sub mb-1.5">
              Năm xem hạn
            </label>
            <select
              value={viewingYear}
              onChange={(e) => setViewingYear(Number(e.target.value))}
              className="w-full px-3 py-2 rounded text-sm bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border text-paper-text dark:text-night-text focus:outline-none focus:border-paper-red dark:focus:border-night-gold"
            >
              {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                <option key={y} value={y}>
                  Năm {y} ({y === 2026 ? 'Hiện tại' : ''})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded text-sm font-semibold tracking-wide bg-paper-red hover:bg-paper-red/90 text-white dark:bg-night-gold dark:text-night-bg dark:hover:bg-night-gold/90 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
                <span>Đang an sao và phân tích lá số...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>LẬP LÁ SỐ & LUẬN ĐOÁN CHI TIẾT</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
