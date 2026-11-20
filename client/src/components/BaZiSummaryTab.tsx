import React from 'react';
import { BaZiResult } from '../engine/battu';
import { IconAnTrien, IconThaiCuc, IconBatQuai, IconMeanderCorner } from './OrientalIcons';
import { Compass, Sparkles, ShieldCheck } from 'lucide-react';

interface BaZiSummaryTabProps {
  baziData?: BaZiResult;
}

export const BaZiSummaryTab: React.FC<BaZiSummaryTabProps> = ({ baziData }) => {
  if (!baziData) {
    return (
      <div className="p-6 text-center text-xs text-paper-muted dark:text-night-muted">
        Chưa có dữ liệu Bát Tự Tứ Trụ.
      </div>
    );
  }

  const yearP = baziData.yearPillar;
  const monthP = baziData.monthPillar;
  const dayP = baziData.dayPillar;
  const hourP = baziData.hourPillar;

  const baziRaw = baziData as any;
  const fiveElements = baziRaw.fiveElements || {
    Kim: baziData.elementDistribution?.find(e => e.element === 'Kim')?.percentage || 20,
    Moc: baziData.elementDistribution?.find(e => e.element === 'Mộc')?.percentage || 20,
    Thuy: baziData.elementDistribution?.find(e => e.element === 'Thủy')?.percentage || 20,
    Hoa: baziData.elementDistribution?.find(e => e.element === 'Hỏa')?.percentage || 20,
    Tho: baziData.elementDistribution?.find(e => e.element === 'Thổ')?.percentage || 20
  };

  const dayMaster = baziRaw.dayMaster || {
    stem: baziData.nhatChu?.can || 'Giáp',
    element: baziData.nhatChu?.element || 'Mộc',
    strength: baziData.strength?.overall || 'Bình Hòa',
    analysis: baziData.nhatChu?.description || ''
  };

  const currentJieQi = baziRaw.jieQi?.currentJieQi || 'Tiết Lệnh';
  const hyThan = baziRaw.hyThan || baziData.hyDungThan?.hyThan || 'Mộc';
  const dungThan = baziRaw.dungThan || baziData.hyDungThan?.dungThan || 'Thủy';

  const getElementColor = (elem: string) => {
    switch (elem) {
      case 'Kim': return 'text-amber-700 bg-amber-500/10 border-amber-600/40';
      case 'Moc': return 'text-emerald-700 bg-emerald-500/10 border-emerald-600/40';
      case 'Thuy': return 'text-blue-700 bg-blue-500/10 border-blue-600/40';
      case 'Hoa': return 'text-rose-700 bg-rose-500/10 border-rose-600/40';
      case 'Tho': return 'text-yellow-800 bg-yellow-500/10 border-yellow-600/40';
      default: return 'text-paper-text bg-paper-bg border-paper-border';
    }
  };

  return (
    <div className="bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border p-4 sm:p-5 space-y-4 rounded-none relative">
      <IconMeanderCorner position="tl" className="absolute top-1 left-1 w-3.5 h-3.5 text-paper-gold/60" />
      <IconMeanderCorner position="tr" className="absolute top-1 right-1 w-3.5 h-3.5 text-paper-gold/60" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-paper-border/60">
        <div>
          <h3 className="font-serif text-sm sm:text-base font-bold text-paper-red dark:text-night-gold flex items-center gap-2">
            <Compass className="w-4 h-4 text-paper-gold" />
            <span>Phụ Trợ Tứ Trụ Bát Tự (Bát Tự Tiểu Bàn)</span>
          </h3>
          <p className="text-2xs text-paper-muted dark:text-night-muted mt-0.5">
            Thuật toán JDN chuẩn xác cho Trụ Ngày • 24 Tiết Khí định Tiết Lệnh • Tàng Can & Thập Thần
          </p>
        </div>
        <div className="text-2xs font-mono text-paper-muted dark:text-night-muted">
          Tiết Khí: <span className="text-paper-gold font-bold">{currentJieQi}</span>
        </div>
      </div>

      {/* 4 Pillars Table (Năm - Tháng - Ngày - Giờ) */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        {[
          { label: 'Trụ Năm', pillar: yearP },
          { label: 'Trụ Tháng', pillar: monthP },
          { label: 'Trụ Ngày (Nhật Chủ)', pillar: dayP, isMain: true },
          { label: 'Trụ Giờ', pillar: hourP }
        ].map(({ label, pillar, isMain }) => (
          <div
            key={label}
            className={`p-2.5 border transition-all ${
              isMain
                ? 'border-paper-gold bg-paper-gold/5 dark:bg-night-gold/10'
                : 'border-paper-border dark:border-night-border bg-paper-bg dark:bg-night-bg'
            }`}
          >
            <span className="text-2xs text-paper-muted dark:text-night-muted uppercase tracking-wider block mb-1">
              {label}
            </span>
            <div className="font-serif text-base font-bold text-paper-red dark:text-night-gold">
              {pillar.can} {pillar.chi}
            </div>
            <div className="text-[10px] text-paper-muted mt-0.5">
              {pillar.element || (pillar as any).napAm || 'Bản Khí'}
            </div>
            {/* Tàng can */}
            <div className="mt-2 pt-1.5 border-t border-paper-border/60 text-2xs space-y-0.5">
              <span className="text-paper-muted block">Tàng Can:</span>
              <div className="text-paper-text dark:text-night-text font-medium">
                {(pillar.hiddenStems || []).map((h: any, i: number) => (
                  <div key={i} className="truncate">
                    {h.stem || h.can} ({h.element || h.tenGod || 'Khí'})
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 5-Element Percentage Distribution Bars */}
      <div className="bg-paper-bg dark:bg-night-bg border border-paper-border/80 p-3 space-y-2">
        <div className="flex items-center justify-between text-2xs">
          <span className="font-serif font-bold text-paper-text dark:text-night-text">
            Phân Bổ Ngũ Hành Bát Tự (Tổng 100%):
          </span>
          <span className="text-paper-muted">Cân Bằng Sinh Khắc</span>
        </div>

        {/* Stacked Bar */}
        <div className="w-full h-3 flex overflow-hidden border border-paper-border">
          <div style={{ width: `${fiveElements.Kim}%` }} className="bg-amber-400" title={`Kim: ${fiveElements.Kim}%`} />
          <div style={{ width: `${fiveElements.Moc}%` }} className="bg-emerald-500" title={`Mộc: ${fiveElements.Moc}%`} />
          <div style={{ width: `${fiveElements.Thuy}%` }} className="bg-blue-500" title={`Thủy: ${fiveElements.Thuy}%`} />
          <div style={{ width: `${fiveElements.Hoa}%` }} className="bg-rose-500" title={`Hỏa: ${fiveElements.Hoa}%`} />
          <div style={{ width: `${fiveElements.Tho}%` }} className="bg-yellow-600" title={`Thổ: ${fiveElements.Tho}%`} />
        </div>

        {/* Element Legend Pills */}
        <div className="grid grid-cols-5 gap-1.5 text-center text-2xs pt-1">
          <div className="p-1 border border-amber-400/40 bg-amber-500/5">
            <span className="text-amber-700 font-bold block">Kim</span>
            <span className="text-paper-text">{fiveElements.Kim}%</span>
          </div>
          <div className="p-1 border border-emerald-500/40 bg-emerald-500/5">
            <span className="text-emerald-700 font-bold block">Mộc</span>
            <span className="text-paper-text">{fiveElements.Moc}%</span>
          </div>
          <div className="p-1 border border-blue-500/40 bg-blue-500/5">
            <span className="text-blue-700 font-bold block">Thủy</span>
            <span className="text-paper-text">{fiveElements.Thuy}%</span>
          </div>
          <div className="p-1 border border-rose-500/40 bg-rose-500/5">
            <span className="text-rose-700 font-bold block">Hỏa</span>
            <span className="text-paper-text">{fiveElements.Hoa}%</span>
          </div>
          <div className="p-1 border border-yellow-600/40 bg-yellow-600/5">
            <span className="text-yellow-700 font-bold block">Thổ</span>
            <span className="text-paper-text">{fiveElements.Tho}%</span>
          </div>
        </div>
      </div>

      {/* Day Master (Nhật Chủ) & Hỷ/Dụng Thần Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="p-3 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-gold/60 space-y-1.5">
          <div className="font-serif font-bold text-paper-red dark:text-night-gold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-paper-gold" />
            <span>Đánh Giá Nhật Chủ ({dayMaster.stem})</span>
          </div>
          <p className="text-2xs text-paper-text dark:text-night-text leading-relaxed">
            {dayMaster.analysis}
          </p>
          <div className="flex items-center gap-2 pt-1 text-2xs font-mono text-paper-muted">
            <span>Trạng thái: <strong className="text-paper-red dark:text-night-gold">{dayMaster.strength}</strong></span>
          </div>
        </div>

        <div className="p-3 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-gold/60 space-y-1.5">
          <div className="font-serif font-bold text-paper-red dark:text-night-gold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-paper-gold" />
            <span>Hỷ Thần & Dụng Thần Định Đoán</span>
          </div>
          <div className="space-y-1 text-2xs">
            <div>
              <span className="text-paper-muted">Dụng Thần (Hóa giải thái quá): </span>
              <strong className="text-emerald-700 dark:text-emerald-400 font-serif">{dungThan}</strong>
            </div>
            <div>
              <span className="text-paper-muted">Hỷ Thần (Trợ lực phát triển): </span>
              <strong className="text-blue-700 dark:text-blue-400 font-serif">{hyThan}</strong>
            </div>
            <p className="text-[10px] text-paper-muted dark:text-night-muted pt-1 border-t border-paper-border/60">
              Kết hợp linh hoạt giữa Đẩu Số và Bát Tự giúp tăng độ chuẩn xác khi định niên hạn và chọn màu sắc, phương hướng tương trợ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
