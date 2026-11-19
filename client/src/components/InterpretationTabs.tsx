import React, { useState, useEffect } from 'react';
import { ChartData } from '../types';
import { BookOpen, Layers, Hourglass, Compass, Award } from 'lucide-react';

interface InterpretationTabsProps {
  chart: ChartData;
  selectedPalaceId: number;
  onSelectPalace: (palaceId: number) => void;
}

export const InterpretationTabs: React.FC<InterpretationTabsProps> = ({
  chart,
  selectedPalaceId,
  onSelectPalace
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'palaces' | 'luck'>('overview');

  const { interpretation, palaces, tamPhuongTuChinh } = chart;
  const currentPalace = palaces.find((p) => p.id === selectedPalaceId) || palaces[0];
  const relation = tamPhuongTuChinh[selectedPalaceId];

  // Auto switch to 'palaces' tab if user clicks a palace while in another tab?
  // Let's keep tab choice user-driven, but when user clicks a palace on grid, if they are on 'palaces' tab it syncs immediately!

  return (
    <div className="w-full max-w-5xl mx-auto my-6 bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border rounded-lg shadow-sm overflow-hidden">
      {/* Tab Navigation Header */}
      <div className="flex border-b border-paper-border dark:border-night-border bg-paper-bg/50 dark:bg-night-bg/50 px-2 sm:px-4">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 py-3 px-3 sm:px-5 font-serif text-xs sm:text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'overview'
              ? 'border-paper-red text-paper-red dark:border-night-gold dark:text-night-gold'
              : 'border-transparent text-paper-sub dark:text-night-sub hover:text-paper-text dark:hover:text-night-text'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Tổng Quan Bản Mệnh</span>
        </button>

        <button
          onClick={() => setActiveTab('palaces')}
          className={`flex items-center gap-2 py-3 px-3 sm:px-5 font-serif text-xs sm:text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'palaces'
              ? 'border-paper-red text-paper-red dark:border-night-gold dark:text-night-gold'
              : 'border-transparent text-paper-sub dark:text-night-sub hover:text-paper-text dark:hover:text-night-text'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Chi Tiết 12 Cung ({currentPalace.name})</span>
        </button>

        <button
          onClick={() => setActiveTab('luck')}
          className={`flex items-center gap-2 py-3 px-3 sm:px-5 font-serif text-xs sm:text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'luck'
              ? 'border-paper-red text-paper-red dark:border-night-gold dark:text-night-gold'
              : 'border-transparent text-paper-sub dark:text-night-sub hover:text-paper-text dark:hover:text-night-text'
          }`}
        >
          <Hourglass className="w-4 h-4" />
          <span>Luận Vận Hạn</span>
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="p-4 sm:p-6 text-paper-text dark:text-night-text leading-relaxed">
        {/* TAB 1: TỔNG QUAN */}
        {activeTab === 'overview' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="border-l-2 border-paper-gold dark:border-night-gold pl-3 py-1">
              <h4 className="font-serif text-sm sm:text-base font-bold text-paper-red dark:text-night-gold">
                Phối Hợp Mệnh - Cục & Căn Cơ Bản Mệnh
              </h4>
              <p className="text-xs sm:text-sm mt-1 text-paper-sub dark:text-night-sub">
                {interpretation.overview.menhCuc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded bg-paper-bg dark:bg-night-bg border border-paper-border/70 dark:border-night-border/70">
                <span className="text-xs font-serif font-bold text-paper-gold dark:text-night-gold block mb-1">
                  Âm Dương & Khí Chất
                </span>
                <p className="text-xs sm:text-sm">{interpretation.overview.amDuong}</p>
              </div>

              <div className="p-3.5 rounded bg-paper-bg dark:bg-night-bg border border-paper-border/70 dark:border-night-border/70">
                <span className="text-xs font-serif font-bold text-paper-gold dark:text-night-gold block mb-1">
                  Trọng Tâm Thân Cư (Nửa Đời Sau)
                </span>
                <p className="text-xs sm:text-sm">{interpretation.overview.thanCu}</p>
              </div>
            </div>

            <div className="p-4 rounded bg-paper-red/5 dark:bg-night-gold/5 border border-paper-red/20 dark:border-night-gold/20">
              <h5 className="font-serif text-xs sm:text-sm font-bold text-paper-red dark:text-night-gold mb-1.5 flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                Đánh Giá Cốt Cách & Tiềm Năng Cuộc Đời
              </h5>
              <p className="text-xs sm:text-sm">{interpretation.overview.generalAssessment}</p>
            </div>
          </div>
        )}

        {/* TAB 2: CHI TIẾT 12 CUNG */}
        {activeTab === 'palaces' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Quick Palace Switcher Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-paper-border/60 dark:border-night-border/60">
              {palaces.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectPalace(p.id)}
                  className={`px-2.5 py-1 text-xs rounded font-medium whitespace-nowrap transition-colors ${
                    p.id === selectedPalaceId
                      ? 'bg-paper-red text-white dark:bg-night-gold dark:text-night-bg font-bold'
                      : 'bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border text-paper-sub hover:text-paper-text'
                  }`}
                >
                  {p.name} ({p.branch})
                </button>
              ))}
            </div>

            {/* Selected Palace Card */}
            <div className="p-4 rounded bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-paper-border/60 dark:border-night-border/60">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-base sm:text-lg font-bold text-paper-red dark:text-night-gold">
                    Cung {currentPalace.name} tại {currentPalace.branch}
                  </span>
                  <span className="text-xs text-paper-sub dark:text-night-sub px-2 py-0.5 rounded bg-paper-card dark:bg-night-card border border-paper-border/60">
                    Can {currentPalace.can} • Hành {currentPalace.element}
                  </span>
                  {currentPalace.isMenh && (
                    <span className="px-1.5 py-0.5 bg-paper-red text-white text-[10px] font-bold rounded">
                      Cung Mệnh
                    </span>
                  )}
                  {currentPalace.isThan && (
                    <span className="px-1.5 py-0.5 bg-paper-gold text-white dark:bg-night-gold dark:text-night-bg text-[10px] font-bold rounded">
                      Thân Cư
                    </span>
                  )}
                </div>

                {relation && (
                  <div className="text-[11px] text-paper-sub dark:text-night-sub">
                    <span>Xung chiếu: <strong>{palaces.find((p) => p.id === relation.xungChieu)?.name}</strong></span>
                    <span className="mx-2">•</span>
                    <span>Tam hợp: <strong>{palaces.find((p) => p.id === relation.tamHop[0])?.name}</strong>, <strong>{palaces.find((p) => p.id === relation.tamHop[1])?.name}</strong></span>
                  </div>
                )}
              </div>

              {/* Interpretation body */}
              <div className="text-xs sm:text-sm space-y-3">
                <p>{interpretation.palaces[currentPalace.name] || 'Đang cập nhật phân tích cung...'}</p>
              </div>

              {/* Stars summary tag cloud */}
              <div className="mt-4 pt-3 border-t border-paper-border/50 dark:border-night-border/50 flex flex-wrap gap-2 text-xs">
                <span className="font-medium text-paper-sub dark:text-night-sub">Sao tọa thủ:</span>
                {currentPalace.majorStars.map((s) => (
                  <span
                    key={s.name}
                    className="px-2 py-0.5 rounded bg-paper-card dark:bg-night-card border border-paper-border font-bold text-paper-red dark:text-night-gold"
                  >
                    {s.name} ({s.brightness})
                  </span>
                ))}
                {currentPalace.minorStars.slice(0, 10).map((s) => (
                  <span
                    key={s.name}
                    className="px-1.5 py-0.5 rounded bg-paper-card dark:bg-night-card border border-paper-border/70 text-paper-sub dark:text-night-sub text-[11px]"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LUẬN VẬN HẠN */}
        {activeTab === 'luck' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Decade Fortune */}
            <div className="p-4 rounded bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border">
              <h4 className="font-serif text-sm sm:text-base font-bold text-paper-red dark:text-night-gold mb-1.5 flex items-center gap-1.5">
                <Hourglass className="w-4 h-4 text-paper-gold dark:text-night-gold" />
                Đại Hạn 10 Năm Hiện Tại
              </h4>
              <p className="text-xs sm:text-sm text-paper-text dark:text-night-text">
                {interpretation.luckFortune.currentDecade}
              </p>
            </div>

            {/* Yearly Fortune */}
            <div className="p-4 rounded bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border">
              <h4 className="font-serif text-sm sm:text-base font-bold text-paper-red dark:text-night-gold mb-1.5 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-paper-gold dark:text-night-gold" />
                Tiểu Hạn Năm {chart.thienBan.viewingYear}
              </h4>
              <p className="text-xs sm:text-sm text-paper-text dark:text-night-text">
                {interpretation.luckFortune.currentYear}
              </p>
            </div>

            {/* Advice */}
            <div className="p-4 rounded bg-paper-gold/10 dark:bg-night-gold/10 border border-paper-gold/30 dark:border-night-gold/30">
              <h4 className="font-serif text-xs sm:text-sm font-bold text-paper-gold dark:text-night-gold mb-1">
                Lời Khuyên Tu Dưỡng & Ứng Xử Thời Vận
              </h4>
              <p className="text-xs sm:text-sm italic">{interpretation.luckFortune.advice}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
