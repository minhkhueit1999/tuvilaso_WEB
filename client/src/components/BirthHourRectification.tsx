import React, { useState, useMemo } from 'react';
import { ChartData, TuViInput } from '../types';
import {
  RECTIFICATION_CRITERIA,
  calculateRectificationScore,
  CandidateComparison
} from '../engine/rectification';
import {
  IconLaKinh,
  IconAnTrien,
  IconBatQuai,
  IconThaiCuc
} from './OrientalIcons';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';

interface BirthHourRectificationProps {
  initialInput?: TuViInput;
  onSelectFinalHour: (selectedChart: ChartData) => void;
  onClose: () => void;
}

const CANH_GIO_OPTIONS = [
  { index: 0, label: 'Tý (23:00 - 00:59)' },
  { index: 1, label: 'Sửu (01:00 - 02:59)' },
  { index: 2, label: 'Dần (03:00 - 04:59)' },
  { index: 3, label: 'Mão (05:00 - 06:59)' },
  { index: 4, label: 'Thìn (07:00 - 08:59)' },
  { index: 5, label: 'Tỵ (09:00 - 10:59)' },
  { index: 6, label: 'Ngọ (11:00 - 12:59)' },
  { index: 7, label: 'Mùi (13:00 - 14:59)' },
  { index: 8, label: 'Thân (15:00 - 16:59)' },
  { index: 9, label: 'Dậu (17:00 - 18:59)' },
  { index: 10, label: 'Tuất (19:00 - 20:59)' },
  { index: 11, label: 'Hợi (21:00 - 22:59)' }
];

export const BirthHourRectification: React.FC<BirthHourRectificationProps> = ({
  initialInput,
  onSelectFinalHour,
  onClose
}) => {
  const [primaryHourIndex, setPrimaryHourIndex] = useState<number>(() => {
    if (!initialInput) return 4; // Thìn
    const h = initialInput.hour;
    if (h >= 23 || h < 1) return 0;
    return Math.floor((h + 1) / 2) % 12;
  });

  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('appearance');

  const baseInput = useMemo(() => {
    return (
      initialInput || {
        fullName: 'Khảo Sát Đương Số',
        gender: 'male' as const,
        calendarType: 'solar' as const,
        day: 28,
        month: 10,
        year: 1999,
        hour: 7,
        minute: 30,
        viewingYear: 2026,
        school: 'tong_hop' as const
      }
    );
  }, [initialInput]);

  const candidates: CandidateComparison[] = useMemo(() => {
    return calculateRectificationScore(baseInput, primaryHourIndex, selectedOptionIds);
  }, [baseInput, primaryHourIndex, selectedOptionIds]);

  const toggleOption = (optId: string) => {
    setSelectedOptionIds((prev) =>
      prev.includes(optId) ? prev.filter((id) => id !== optId) : [...prev, optId]
    );
  };

  const bestCandidate = useMemo(() => {
    if (!candidates || candidates.length === 0) return null;
    return [...candidates].sort((a, b) => b.matchPercent - a.matchPercent)[0];
  }, [candidates]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 font-serif animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-paper-border dark:border-night-border">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 border border-paper-border dark:border-night-border hover:bg-paper-cardAlt dark:hover:bg-night-cardAlt cursor-pointer text-paper-muted hover:text-paper-text"
            title="Quay lại lá số chính"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-paper-red dark:text-night-gold flex items-center gap-2">
              <IconLaKinh className="w-5 h-5 text-paper-red dark:text-night-gold" />
              Định Giờ Sinh Thông Minh
            </h1>
            <p className="text-xs text-paper-muted dark:text-night-muted font-sans mt-0.5">
              Khảo sát đối chiếu 3 canh giờ giáp ranh & Ma trận 8 tiêu chí thực chứng
            </p>
          </div>
        </div>

        {/* Primary Hour Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-sans text-paper-muted dark:text-night-muted">
            Canh giờ nghi vấn tâm điểm:
          </label>
          <select
            value={primaryHourIndex}
            onChange={(e) => setPrimaryHourIndex(Number(e.target.value))}
            className="px-3 py-1.5 text-xs font-serif bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border text-paper-text dark:text-night-text focus:outline-none focus:border-paper-red"
          >
            {CANH_GIO_OPTIONS.map((opt) => (
              <option key={opt.index} value={opt.index}>
                Giờ {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3 Candidate Columns Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {candidates.map((cand) => {
          const isBest = bestCandidate?.hourIndex === cand.hourIndex && selectedOptionIds.length > 0;
          return (
            <div
              key={cand.hourIndex}
              className={`bg-paper-card dark:bg-night-card border p-4 flex flex-col justify-between transition-all ${
                isBest
                  ? 'border-paper-red dark:border-night-gold ring-1 ring-paper-red dark:ring-night-gold shadow-md'
                  : 'border-paper-border dark:border-night-border'
              }`}
            >
              <div>
                {/* Header card */}
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-paper-border dark:border-night-border">
                  <div>
                    <span className="text-[11px] font-sans text-paper-muted dark:text-night-muted">
                      {cand.hourIndex === primaryHourIndex ? '● Giờ Nghi Vấn' : '○ Giờ Giáp Ranh'}
                    </span>
                    <h3 className="font-bold text-base text-paper-red dark:text-night-gold">
                      Giờ {cand.hourName}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-bold border ${
                        isBest
                          ? 'bg-paper-red text-white border-paper-red dark:bg-night-red dark:text-night-bg'
                          : 'bg-paper-cardAlt border-paper-border text-paper-muted dark:text-night-muted'
                      }`}
                    >
                      {cand.matchPercent}% Khớp
                    </span>
                  </div>
                </div>

                {/* Main Palaces Snapshot */}
                <div className="space-y-2 text-xs font-sans">
                  {/* Cung Mệnh */}
                  <div className="p-2 bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border">
                    <div className="flex items-center justify-between font-serif font-bold text-paper-red dark:text-night-gold">
                      <span>CUNG MỆNH ({cand.keyPalaces.menh.branch})</span>
                      <span className="text-[11px] text-paper-gold dark:text-night-gold font-normal">
                        {cand.keyPalaces.menh.pattern}
                      </span>
                    </div>
                    <div className="mt-1 font-serif text-[13px] text-paper-text dark:text-night-text">
                      {cand.keyPalaces.menh.stars.length > 0
                        ? cand.keyPalaces.menh.stars.join(' • ')
                        : 'Vô Chính Diệu'}
                    </div>
                  </div>

                  {/* Cung Thân */}
                  <div className="p-2 bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border">
                    <div className="font-serif font-bold text-paper-gold dark:text-night-gold">
                      THÂN CƯ {cand.keyPalaces.than.name.toUpperCase()} ({cand.keyPalaces.than.branch})
                    </div>
                    <div className="mt-1 font-serif text-[12px] text-paper-text dark:text-night-text">
                      {cand.keyPalaces.than.stars.length > 0
                        ? cand.keyPalaces.than.stars.join(' • ')
                        : 'Không chính tinh tọa thủ'}
                    </div>
                  </div>

                  {/* Cung Phu Thê & Quan Lộc */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-1.5 border border-paper-border dark:border-night-border">
                      <span className="font-bold text-paper-muted dark:text-night-muted">Phu Thê:</span>
                      <p className="font-serif mt-0.5 truncate">
                        {cand.keyPalaces.phuThe.stars.join(', ') || 'Vô Chính Diệu'}
                      </p>
                    </div>
                    <div className="p-1.5 border border-paper-border dark:border-night-border">
                      <span className="font-bold text-paper-muted dark:text-night-muted">Quan Lộc:</span>
                      <p className="font-serif mt-0.5 truncate">
                        {cand.keyPalaces.quanLoc.stars.join(', ') || 'Vô Chính Diệu'}
                      </p>
                    </div>
                  </div>

                  {/* Matched reasons list */}
                  {cand.matchedReasons.length > 0 && (
                    <div className="pt-2 text-[11px] text-paper-muted dark:text-night-muted space-y-1">
                      <span className="font-bold text-paper-text dark:text-night-text">Dấu hiệu phù hợp:</span>
                      <ul className="list-disc list-inside space-y-0.5 pl-1">
                        {cand.matchedReasons.slice(0, 3).map((r, i) => (
                          <li key={i} className="truncate">{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Confirm Button */}
              <div className="pt-4 mt-3 border-t border-paper-border dark:border-night-border">
                <button
                  type="button"
                  onClick={() => onSelectFinalHour(cand.chart)}
                  className={`w-full py-2 px-3 text-xs font-serif font-bold tracking-wider cursor-pointer border transition-colors flex items-center justify-center gap-1.5 ${
                    isBest
                      ? 'bg-paper-red hover:bg-paper-redHover text-white border-paper-red dark:bg-night-red dark:text-night-bg'
                      : 'border-paper-border dark:border-night-border text-paper-text dark:text-night-text hover:bg-paper-cardAlt'
                  }`}
                >
                  <IconAnTrien className="w-3.5 h-3.5" />
                  <span>CHỐT GIỜ NÀY & MỞ LÁ SỐ</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 8-Criteria Interactive Questionnaire */}
      <div className="bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border p-4 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-paper-border dark:border-night-border">
          <div>
            <h2 className="font-serif font-bold text-base text-paper-red dark:text-night-gold flex items-center gap-2">
              <IconBatQuai className="w-4 h-4 text-paper-red dark:text-night-gold" />
              Khảo Sát Thực Chứng 8 Tiêu Chí Để Xác Quyết Canh Giờ
            </h2>
            <p className="text-xs text-paper-muted dark:text-night-muted font-sans mt-0.5">
              Chọn các đặc điểm thực tế của đương số để hệ thống so khớp độ tương hợp với tinh đẩu
            </p>
          </div>

          {selectedOptionIds.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedOptionIds([])}
              className="text-xs text-paper-muted hover:text-paper-red font-sans cursor-pointer underline"
            >
              Xóa chọn tất cả ({selectedOptionIds.length})
            </button>
          )}
        </div>

        {/* Categories Tab Pill */}
        <div className="flex flex-wrap gap-1.5">
          {RECTIFICATION_CRITERIA.map((crit) => (
            <button
              key={crit.id}
              type="button"
              onClick={() => setActiveCategory(crit.category)}
              className={`px-3 py-1 text-xs font-serif border transition-colors cursor-pointer ${
                activeCategory === crit.category
                  ? 'bg-paper-red text-white border-paper-red dark:bg-night-red dark:text-night-bg font-bold'
                  : 'border-paper-border dark:border-night-border text-paper-text dark:text-night-text hover:bg-paper-cardAlt'
              }`}
            >
              {crit.title.split('.')[1]?.trim() || crit.title}
            </button>
          ))}
        </div>

        {/* Options of current active category */}
        {RECTIFICATION_CRITERIA.filter((c) => c.category === activeCategory).map((crit) => (
          <div key={crit.id} className="space-y-2 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {crit.options.map((opt) => {
                const isChecked = selectedOptionIds.includes(opt.id);
                return (
                  <label
                    key={opt.id}
                    onClick={() => toggleOption(opt.id)}
                    className={`flex items-start gap-2.5 p-2.5 border cursor-pointer transition-colors text-xs font-sans select-none ${
                      isChecked
                        ? 'bg-paper-gold/10 border-paper-red dark:border-night-gold text-paper-text dark:text-night-text font-medium'
                        : 'border-paper-border dark:border-night-border hover:bg-paper-cardAlt'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 mt-0.5 flex items-center justify-center border shrink-0 ${
                        isChecked
                          ? 'bg-paper-red text-white border-paper-red dark:bg-night-red dark:text-night-bg'
                          : 'border-paper-border dark:border-night-border'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3" />}
                    </div>
                    <div>
                      <p>{opt.label}</p>
                      <span className="text-[10px] text-paper-muted dark:text-night-muted mt-0.5 block">
                        Ám hợp sao: {opt.tags.join(', ')}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
