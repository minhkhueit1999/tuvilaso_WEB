import React from 'react';
import { VanHanCoordinates } from '../types';
import { IconLaKinh, IconThaiCuc, IconAnTrien } from './OrientalIcons';

interface InteractiveFortuneBarProps {
  vanHan: VanHanCoordinates;
  viewingYear: number;
  selectedDecadeIndex?: number;
  onSelectDecade: (decadeIndex: number) => void;
  onSelectYear: (year: number) => void;
  showPath: boolean;
  onToggleShowPath: (show: boolean) => void;
  luuNguyetMethod: 'thai_tue' | 'tieu_han';
  onChangeLuuNguyetMethod: (method: 'thai_tue' | 'tieu_han') => void;
}

export const InteractiveFortuneBar: React.FC<InteractiveFortuneBarProps> = ({
  vanHan,
  viewingYear,
  selectedDecadeIndex,
  onSelectDecade,
  onSelectYear,
  showPath,
  onToggleShowPath,
  luuNguyetMethod,
  onChangeLuuNguyetMethod
}) => {
  if (!vanHan) return null;

  const {
    age,
    isDongHan,
    dongHanPalaceName,
    dvDirectionLabel,
    dvPalaceName,
    dvCan,
    dvStartAge,
    dvEndAge,
    dvTuHoa,
    ldhPalaceName,
    tieuHanPalaceName,
    lnPalaceName,
    lnCan,
    lnTuHoa,
    daiVanList,
    daiVanYearlyPath
  } = vanHan;

  // Active decade index: either user override or calculated current decade
  const currentDecadeIdx = selectedDecadeIndex !== undefined
    ? selectedDecadeIndex
    : daiVanList.findIndex(d => age >= d.startAge && age <= d.endAge);

  return (
    <div
      data-testid="fortune-bar"
      className="w-full max-w-5xl mx-auto my-3 bg-paper-card dark:bg-night-card border border-paper-gold/40 dark:border-night-gold/40 shadow-xs transition-colors rounded-none p-3 text-xs"
    >
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between pb-2 mb-2 border-b border-paper-border dark:border-night-border gap-2">
        <div className="flex items-center gap-2">
          <IconLaKinh className="w-4 h-4 text-paper-red dark:text-night-gold" />
          <span className="font-serif font-bold text-sm text-paper-red dark:text-night-gold tracking-wide">
            DÒNG CHẢY VẬN HẠN
          </span>
          <span className="px-1.5 py-0.5 border border-paper-border dark:border-night-border bg-paper-cardAlt dark:bg-night-cardAlt text-[11px] font-serif text-paper-text dark:text-night-text">
            {dvDirectionLabel}
          </span>
          {isDongHan && (
            <span className="px-1.5 py-0.5 border border-amber-600/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px] font-serif">
              Đồng Hạn ({age} tuổi tại {dongHanPalaceName})
            </span>
          )}
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-3">
          {/* Toggle SVG Path */}
          <label className="flex items-center gap-1.5 cursor-pointer text-paper-muted dark:text-night-muted hover:text-paper-text dark:hover:text-night-text select-none">
            <input
              type="checkbox"
              checked={showPath}
              onChange={(e) => onToggleShowPath(e.target.checked)}
              className="w-3.5 h-3.5 accent-[#8B1E1E] cursor-pointer rounded-none"
            />
            <span className="text-[11px]">Vẽ đường Lưu Đ.Hạn (SVG)</span>
          </label>

          {/* Toggle Lưu Nguyệt Method */}
          <div className="flex items-center border border-paper-border dark:border-night-border bg-paper-cardAlt dark:bg-night-cardAlt p-0.5">
            <button
              type="button"
              onClick={() => onChangeLuuNguyetMethod('thai_tue')}
              className={`px-1.5 py-0.5 text-[10px] font-serif transition-colors cursor-pointer ${
                luuNguyetMethod === 'thai_tue'
                  ? 'bg-paper-red text-paper-bg dark:bg-night-red dark:text-night-bg font-bold'
                  : 'text-paper-muted dark:text-night-muted hover:text-paper-text dark:hover:text-night-text'
              }`}
              title="Khởi nguyệt từ cung Lưu Thái Tuế"
            >
              L.Nguyệt Thái Tuế
            </button>
            <button
              type="button"
              onClick={() => onChangeLuuNguyetMethod('tieu_han')}
              className={`px-1.5 py-0.5 text-[10px] font-serif transition-colors cursor-pointer ${
                luuNguyetMethod === 'tieu_han'
                  ? 'bg-paper-red text-paper-bg dark:bg-night-red dark:text-night-bg font-bold'
                  : 'text-paper-muted dark:text-night-muted hover:text-paper-text dark:hover:text-night-text'
              }`}
              title="Khởi nguyệt từ cung Tiểu Hạn"
            >
              L.Nguyệt Tiểu Hạn
            </button>
          </div>
        </div>
      </div>

      {/* Row 1: 12 Đại Vận (Thập Nhị Đại Vận 10 năm) */}
      <div className="mb-2">
        <div className="flex items-center justify-between text-[11px] text-paper-muted dark:text-night-muted mb-1">
          <span className="font-serif flex items-center gap-1 font-semibold text-paper-text dark:text-night-text">
            <IconThaiCuc className="w-3 h-3 text-paper-gold" />
            12 Đại Vận (10 Năm/vận):
          </span>
          <span className="text-[10px] italic text-paper-muted dark:text-night-muted">
            Nhấp để chuyển gốc Đại Vận
          </span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-1">
          {daiVanList.map((dv, idx) => {
            const isSelected = idx === currentDecadeIdx;
            const isCurrentAge = age >= dv.startAge && age <= dv.endAge;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectDecade(idx)}
                className={`flex flex-col items-center justify-center p-1 border text-center transition-all cursor-pointer rounded-none relative ${
                  isSelected
                    ? 'border-paper-red dark:border-night-red bg-paper-red/10 dark:bg-night-red/20 text-paper-red dark:text-night-gold font-bold shadow-xs'
                    : 'border-paper-border dark:border-night-border bg-paper-cardAlt dark:bg-night-cardAlt text-paper-muted dark:text-night-muted hover:border-paper-gold dark:hover:border-night-gold hover:text-paper-text dark:hover:text-night-text'
                }`}
                title={`Đại Vận ${dv.startAge} - ${dv.endAge} tuổi tại cung ${dv.branch} (${dv.palaceName})`}
              >
                {isCurrentAge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-paper-red dark:bg-night-red" title="Đương Vận hiện tại" />
                )}
                <span className="text-[11px] font-serif font-bold">
                  {dv.startAge}-{dv.endAge}t
                </span>
                <span className="text-[9px] text-paper-text/80 dark:text-night-text/80 leading-tight">
                  {dv.branch} • {dv.palaceName.replace('Cung ', '')}
                </span>
                <span className="text-[8px] opacity-75 font-serif">
                  {dv.can}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 2: 10 Năm của Đại Vận hiện tại (Lưu Đại Hạn ziczac) */}
      <div className="mb-2 pt-2 border-t border-paper-border/60 dark:border-night-border/60">
        <div className="flex items-center justify-between text-[11px] text-paper-muted dark:text-night-muted mb-1">
          <span className="font-serif flex items-center gap-1 font-semibold text-paper-text dark:text-night-text">
            <IconAnTrien className="w-3 h-3 text-paper-gold" />
            10 Năm của Đại Vận [{dvStartAge} - {dvEndAge} tuổi] — Đường Lưu Đại Hạn:
          </span>
          <span className="text-[10px] italic text-paper-muted dark:text-night-muted">
            Nhấp năm để chuyển Năm Xem Hạn
          </span>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1">
          {daiVanYearlyPath.map((step) => {
            const isSelectedYear = step.year === viewingYear;
            return (
              <button
                key={step.year}
                type="button"
                onClick={() => onSelectYear(step.year)}
                className={`flex flex-col items-center justify-center p-1 border text-center transition-all cursor-pointer rounded-none relative ${
                  isSelectedYear
                    ? 'border-paper-gold dark:border-night-gold bg-paper-gold/20 dark:bg-night-gold/25 text-paper-red dark:text-night-gold font-bold shadow-xs'
                    : 'border-paper-border dark:border-night-border bg-paper-cardAlt dark:bg-night-cardAlt text-paper-muted dark:text-night-muted hover:border-paper-gold dark:hover:border-night-gold hover:text-paper-text dark:hover:text-night-text'
                }`}
                title={`Năm ${step.year} (${step.age} tuổi) - Lưu Đại Hạn tại ${step.branch} (${step.palaceName})`}
              >
                <div className="flex items-center gap-0.5">
                  <span className="text-[9px] opacity-70 font-mono">#{step.offset + 1}</span>
                  <span className="text-[11px] font-serif font-bold">
                    {step.year}
                  </span>
                </div>
                <span className="text-[9px] text-paper-text/80 dark:text-night-text/80 leading-tight">
                  {step.age}t • {step.branch}
                </span>
                <span className="text-[8px] opacity-75 font-serif truncate max-w-full">
                  {step.palaceName.replace('Cung ', '')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 3: Tóm Lược Vận Hạn Năm Xem (Tam Bàn Hợp Nhất & Tứ Hóa Tầng Vận) */}
      <div className="pt-2 border-t border-paper-border/60 dark:border-night-border/60 flex flex-wrap items-center justify-between gap-y-1.5 text-[11px]">
        {/* Tọa độ 4 cung hạn then chốt */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="font-serif font-semibold text-paper-text dark:text-night-text">
            Năm {viewingYear} ({age} tuổi):
          </span>
          <span className="px-1 py-0.5 border border-paper-gold/40 bg-paper-gold/10 text-paper-text dark:text-night-text font-serif">
            ĐV.MỆNH: <strong className="text-paper-red dark:text-night-gold">{dvPalaceName}</strong> ({dvCan})
          </span>
          <span className="px-1 py-0.5 border border-red-500/40 bg-red-500/10 text-paper-text dark:text-night-text font-serif">
            Lưu Đ.Hạn: <strong className="text-paper-red">{ldhPalaceName}</strong>
          </span>
          <span className="px-1 py-0.5 border border-amber-500/40 bg-amber-500/10 text-paper-text dark:text-night-text font-serif">
            Tiểu Hạn: <strong className="text-amber-700 dark:text-amber-300">{tieuHanPalaceName}</strong>
          </span>
          <span className="px-1 py-0.5 border border-blue-500/40 bg-blue-500/10 text-paper-text dark:text-night-text font-serif">
            Lưu Thái Tuế: <strong className="text-blue-700 dark:text-blue-400">{lnPalaceName}</strong> ({lnCan})
          </span>
        </div>

        {/* Tứ Hóa Tầng Vận */}
        <div className="flex flex-wrap items-center gap-1 text-[10px] font-serif">
          <span className="text-paper-muted dark:text-night-muted">ĐV Tứ Hóa:</span>
          <span className="text-green-700 dark:text-green-400">Lộc: {dvTuHoa.loc}</span>
          <span className="text-blue-700 dark:text-blue-400">Quyền: {dvTuHoa.quyen}</span>
          <span className="text-amber-700 dark:text-amber-300">Khoa: {dvTuHoa.khoa}</span>
          <span className="text-red-700 dark:text-red-400">Kỵ: {dvTuHoa.ky}</span>
          <span className="text-paper-border dark:text-night-border mx-0.5">|</span>
          <span className="text-paper-muted dark:text-night-muted">LN Tứ Hóa:</span>
          <span className="text-green-700 dark:text-green-400">L.Lộc: {lnTuHoa.loc}</span>
          <span className="text-blue-700 dark:text-blue-400">L.Quyền: {lnTuHoa.quyen}</span>
          <span className="text-amber-700 dark:text-amber-300">L.Khoa: {lnTuHoa.khoa}</span>
          <span className="text-red-700 dark:text-red-400">L.Kỵ: {lnTuHoa.ky}</span>
        </div>
      </div>
    </div>
  );
};
