import React, { useState } from 'react';
import { MonthlyCalendarResult, DailyFortune } from '../engine/calendar';
import { IconAnTrien, IconThaiCuc, IconMeanderCorner } from './OrientalIcons';
import { Calendar as CalendarIcon, CheckCircle2, AlertOctagon, Clock, Sun, Moon } from 'lucide-react';

interface PersonalCalendarTabProps {
  calendarData?: {
    year: number;
    currentMonth: number;
    months: MonthlyCalendarResult[];
  };
}

export const PersonalCalendarTab: React.FC<PersonalCalendarTabProps> = ({ calendarData }) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(calendarData?.currentMonth || 1);
  const [selectedDay, setSelectedDay] = useState<DailyFortune | null>(
    calendarData?.months?.[0]?.days?.[0] || null
  );

  if (!calendarData || !calendarData.months || calendarData.months.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-paper-muted dark:text-night-muted">
        Chưa có dữ liệu Lịch Vận Hạn Cá Nhân Hóa.
      </div>
    );
  }

  const currentMonthData = calendarData.months.find(m => m.lunarMonth === selectedMonth) || calendarData.months[0];

  return (
    <div className="bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border p-4 sm:p-5 space-y-4 rounded-none relative">
      <IconMeanderCorner position="tl" className="absolute top-1 left-1 w-3.5 h-3.5 text-paper-gold/60" />
      <IconMeanderCorner position="tr" className="absolute top-1 right-1 w-3.5 h-3.5 text-paper-gold/60" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-paper-border/60">
        <div>
          <h3 className="font-serif text-sm sm:text-base font-bold text-paper-red dark:text-night-gold flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-paper-gold" />
            <span>Lịch Vận Hạn Cá Nhân Hóa (Lưu Nguyệt & Lưu Nhật {calendarData.year})</span>
          </h3>
          <p className="text-2xs text-paper-muted dark:text-night-muted mt-0.5">
            Giao thoa Đẩu Quân Lưu Nguyệt với cung Lưu Nhật • Khảo sát Giờ Hoàng Đạo (Lưu Thời) & Cát Hung từng ngày
          </p>
        </div>
      </div>

      {/* 1..12 Lunar Month Pills */}
      <div className="space-y-1.5">
        <span className="text-2xs font-serif font-bold uppercase tracking-wider text-paper-muted dark:text-night-muted block">
          Chọn Tháng Âm Lịch (Lưu Nguyệt):
        </span>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-1.5 text-xs">
          {calendarData.months.map((m) => (
            <button
              key={m.lunarMonth}
              type="button"
              onClick={() => {
                setSelectedMonth(m.lunarMonth);
                setSelectedDay(m.days[0] || null);
              }}
              className={`p-1.5 text-center border rounded-none cursor-pointer transition-colors ${
                selectedMonth === m.lunarMonth
                  ? 'border-paper-red bg-paper-red text-paper-bg dark:bg-night-red dark:border-night-gold dark:text-night-bg font-bold'
                  : 'border-paper-border dark:border-night-border text-paper-text hover:border-paper-gold'
              }`}
            >
              <div className="font-serif text-2xs">Tháng {m.lunarMonth}</div>
              <div className="text-[9px] opacity-80 truncate">{m.monthPalaceName.split(' ')[0]}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Current Month Overview Banner */}
      <div className="p-3 bg-paper-bg dark:bg-night-bg border border-paper-border/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div>
          <span className="font-serif font-bold text-paper-red dark:text-night-gold">
            Tháng {currentMonthData.lunarMonth} Âm Lịch: Lưu Nguyệt Cung {currentMonthData.monthPalaceName}
          </span>
          <span className="text-2xs text-paper-muted dark:text-night-muted block mt-0.5">
            {currentMonthData.monthOverview}
          </span>
        </div>
        <div className="text-2xs font-mono text-paper-gold">
          {currentMonthData.days.length} Ngày Lưu Hạn
        </div>
      </div>

      {/* 30-Day Grid */}
      <div className="space-y-1.5">
        <span className="text-2xs font-serif text-paper-muted dark:text-night-muted">
          Bấm chọn ngày để xem chi tiết Lưu Nhật & Lưu Thời:
        </span>
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-1 text-2xs">
          {currentMonthData.days.map((day) => {
            const isSelected = selectedDay?.lunarDay === day.lunarDay;
            return (
              <div
                key={day.lunarDay}
                onClick={() => setSelectedDay(day)}
                className={`p-1.5 border text-center cursor-pointer transition-all ${
                  isSelected
                    ? 'border-paper-red bg-paper-red/10 dark:border-night-gold dark:bg-night-gold/15 font-bold shadow-xs'
                    : 'border-paper-border dark:border-night-border hover:border-paper-gold'
                }`}
              >
                <div className="font-serif font-bold text-paper-text dark:text-night-text">
                  Ngày {day.lunarDay}
                </div>
                <div className="text-[9px] text-paper-muted truncate">
                  {(day as any).canChiDay || `Cung ${day.palaceName}`}
                </div>
                <div className={`text-[8px] font-bold mt-0.5 px-0.5 ${
                  day.rating === 'dai_cat' || (day as any).level === 'dai_cat' ? 'text-emerald-700 dark:text-emerald-400' :
                  day.rating === 'kha' || (day as any).level === 'kha' ? 'text-blue-700 dark:text-blue-400' :
                  day.rating === 'than_trong' || (day as any).level === 'than_trong' ? 'text-rose-700 dark:text-rose-400' :
                  'text-amber-700 dark:text-amber-400'
                }`}>
                  {(day as any).ratingLabel || (day.rating === 'dai_cat' ? 'Đại Cát' : day.rating === 'kha' ? 'Khá' : day.rating === 'than_trong' ? 'Thận Trọng' : 'Bình Hòa')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details Panel */}
      {selectedDay && (
        <div className="bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-gold/60 p-4 space-y-3 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-paper-border/60">
            <div>
              <span className="font-serif text-sm font-bold text-paper-red dark:text-night-gold">
                Chi Tiết Lưu Nhật: Ngày {selectedDay.lunarDay} Tháng {(selectedDay as any).lunarMonth ?? selectedMonth}
              </span>
              <span className="text-2xs text-paper-muted block">
                Cung Lưu Nhật: {selectedDay.palaceName} • Đánh giá: {(selectedDay as any).ratingLabel || selectedDay.rating}
              </span>
            </div>
            <div className="text-2xs text-paper-text dark:text-night-text">
              Sao kích hoạt: {((selectedDay as any).activeStars || (selectedDay as any).goodStars || []).slice(0, 4).join(' • ') || 'Bình hòa'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-2xs">
            {/* Do's & Don'ts */}
            <div className="p-2.5 bg-paper-card dark:bg-night-card border border-paper-border space-y-1.5">
              <div className="font-serif font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Việc Nên Làm (Cát Lợi):</span>
              </div>
              <ul className="space-y-1 pl-4 list-disc text-paper-text dark:text-night-text">
                {selectedDay.doList.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="p-2.5 bg-paper-card dark:bg-night-card border border-paper-border space-y-1.5">
              <div className="font-serif font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                <span>Việc Nên Tránh (Thận Trọng):</span>
              </div>
              <ul className="space-y-1 pl-4 list-disc text-paper-text dark:text-night-text">
                {selectedDay.dontList.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Lucky Hours (Lưu Thời) */}
          <div className="pt-1 flex flex-wrap items-center gap-2 text-2xs">
            <span className="font-serif font-bold text-paper-gold flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Giờ Hoàng Đạo Khuyên Dùng (Lưu Thời):</span>
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {selectedDay.luckyHours.map((h, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-paper-bg dark:bg-night-bg border border-paper-border font-medium"
                >
                  Giờ {h}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
