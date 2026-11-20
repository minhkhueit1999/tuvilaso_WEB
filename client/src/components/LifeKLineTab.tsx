import React, { useState } from 'react';
import { LifeKLineResult, KLineCandle } from '../engine/kline';
import { IconAnTrien, IconThaiCuc, IconMeanderCorner } from './OrientalIcons';
import { TrendingUp, Download, Eye, EyeOff, Award } from 'lucide-react';

interface LifeKLineTabProps {
  klineData?: LifeKLineResult;
  onSelectDecade?: (decadeAge: number) => void;
  brandName?: string;
}

export const LifeKLineTab: React.FC<LifeKLineTabProps> = ({
  klineData,
  onSelectDecade,
  brandName = 'Tử Vi Minh Khuê'
}) => {
  const [selectedCandle, setSelectedCandle] = useState<KLineCandle | null>(
    klineData?.candles?.[0] || null
  );
  const [showOverall, setShowOverall] = useState(true);
  const [showWealth, setShowWealth] = useState(true);
  const [showCareer, setShowCareer] = useState(true);
  const [showLove, setShowLove] = useState(false);

  if (!klineData || !klineData.candles || klineData.candles.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-paper-muted dark:text-night-muted">
        Chưa có dữ liệu K-Line năng lượng cuộc đời.
      </div>
    );
  }

  // SVG dimensions
  const svgWidth = 720;
  const svgHeight = 280;
  const paddingX = 45;
  const paddingY = 30;
  const chartW = svgWidth - paddingX * 2;
  const chartH = svgHeight - paddingY * 2;

  // Scale: scores 0..100
  const candleCount = klineData.candles.length;
  const stepX = chartW / Math.max(1, candleCount - 1);
  const getY = (val: number) => paddingY + chartH - (Math.min(100, Math.max(0, val)) / 100) * chartH;

  // Curve points generator
  const getCurvePath = (points: { age: number; score: number }[] | number[]) => {
    if (!points || points.length === 0) return '';
    return points
      .map((p, i) => {
        const x = paddingX + i * stepX;
        const val = typeof p === 'number' ? p : p.score;
        const y = getY(val);
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  };

  const handleExportPng = () => {
    // Generate simple notification or canvas export
    alert(`Đã kích hoạt tạo ảnh biểu đồ K-Line Cuộc Đời với Ấn Triện [${brandName}].`);
  };

  return (
    <div className="bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border p-4 sm:p-5 space-y-4 rounded-none relative">
      <IconMeanderCorner position="tl" className="absolute top-1 left-1 w-3.5 h-3.5 text-paper-gold/60" />
      <IconMeanderCorner position="tr" className="absolute top-1 right-1 w-3.5 h-3.5 text-paper-gold/60" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-paper-border/60">
        <div>
          <h3 className="font-serif text-sm sm:text-base font-bold text-paper-red dark:text-night-gold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-paper-gold" />
            <span>Biểu Đồ Life K-Line Năng Lượng Cuộc Đời (10–80 Tuổi)</span>
          </h3>
          <p className="text-2xs text-paper-muted dark:text-night-muted mt-0.5">
            Mô hình nến Nhật kết hợp Đẩu Số • Nến Xanh Ngọc (#245B43) Cát Vượng • Nến Đỏ Chu Sa (#9E2A22) Biến Động
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportPng}
            className="flex items-center gap-1 px-2.5 py-1 text-2xs font-serif font-bold text-paper-red dark:text-night-gold border border-paper-border hover:bg-paper-gold/10 transition-colors cursor-pointer"
          >
            <Download className="w-3 h-3" />
            <span>Xuất Biểu Đồ</span>
          </button>
        </div>
      </div>

      {/* Curve Toggles */}
      <div className="flex flex-wrap items-center gap-3 text-2xs">
        <span className="font-serif text-paper-muted dark:text-night-muted">Đường xu hướng:</span>
        <button
          type="button"
          onClick={() => setShowOverall(!showOverall)}
          className={`flex items-center gap-1 px-2 py-0.5 border cursor-pointer ${
            showOverall ? 'border-amber-700 bg-amber-500/10 text-amber-800 dark:text-amber-300 font-bold' : 'border-paper-border text-paper-muted'
          }`}
        >
          <span className="w-2 h-0.5 bg-amber-600 inline-block" />
          <span>Tổng Vận</span>
        </button>
        <button
          type="button"
          onClick={() => setShowWealth(!showWealth)}
          className={`flex items-center gap-1 px-2 py-0.5 border cursor-pointer ${
            showWealth ? 'border-emerald-700 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold' : 'border-paper-border text-paper-muted'
          }`}
        >
          <span className="w-2 h-0.5 bg-emerald-600 inline-block" />
          <span>Tài Lộc</span>
        </button>
        <button
          type="button"
          onClick={() => setShowCareer(!showCareer)}
          className={`flex items-center gap-1 px-2 py-0.5 border cursor-pointer ${
            showCareer ? 'border-blue-700 bg-blue-500/10 text-blue-800 dark:text-blue-300 font-bold' : 'border-paper-border text-paper-muted'
          }`}
        >
          <span className="w-2 h-0.5 bg-blue-600 inline-block" />
          <span>Sự Nghiệp</span>
        </button>
        <button
          type="button"
          onClick={() => setShowLove(!showLove)}
          className={`flex items-center gap-1 px-2 py-0.5 border cursor-pointer ${
            showLove ? 'border-rose-700 bg-rose-500/10 text-rose-800 dark:text-rose-300 font-bold' : 'border-paper-border text-paper-muted'
          }`}
        >
          <span className="w-2 h-0.5 bg-rose-600 inline-block" />
          <span>Tình Duyên</span>
        </button>
      </div>

      {/* SVG K-Line Chart */}
      <div className="w-full overflow-x-auto bg-paper-bg dark:bg-night-bg border border-paper-border/80 p-2">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[620px] select-none"
        >
          {/* Horizontal Grid lines (20, 40, 60, 80, 100) */}
          {[20, 40, 60, 80, 100].map((score) => {
            const y = getY(score);
            return (
              <g key={score}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity="0.12"
                  strokeDasharray="2 3"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] fill-paper-muted dark:fill-night-muted font-mono"
                >
                  {score}
                </text>
              </g>
            );
          })}

          {/* Trend Curves */}
          {showOverall && (
            <path
              d={getCurvePath(klineData.trendCurves.overall)}
              fill="none"
              stroke="#B8860B"
              strokeWidth="2"
              strokeOpacity="0.8"
            />
          )}
          {showWealth && (
            <path
              d={getCurvePath(klineData.trendCurves.wealth)}
              fill="none"
              stroke="#245B43"
              strokeWidth="1.5"
              strokeDasharray="3 2"
              strokeOpacity="0.75"
            />
          )}
          {showCareer && (
            <path
              d={getCurvePath(klineData.trendCurves.career)}
              fill="none"
              stroke="#2563EB"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              strokeOpacity="0.7"
            />
          )}
          {showLove && (
            <path
              d={getCurvePath(klineData.trendCurves.love)}
              fill="none"
              stroke="#BE123C"
              strokeWidth="1.5"
              strokeDasharray="2 2"
              strokeOpacity="0.7"
            />
          )}

          {/* Candles */}
          {klineData.candles.map((candle, idx) => {
            const x = paddingX + idx * stepX;
            const yHigh = getY(candle.high);
            const yLow = getY(candle.low);
            const yOpen = getY(candle.open);
            const yClose = getY(candle.close);

            const isBull = candle.close >= candle.open;
            const candleTop = Math.min(yOpen, yClose);
            const candleH = Math.max(3, Math.abs(yClose - yOpen));
            const candleW = 18;

            const candleDecade = (candle as any).decade ?? candle.decadeStartAge ?? 10;
            const isSelected = ((selectedCandle as any)?.decade ?? selectedCandle?.decadeStartAge) === candleDecade;
            const color = isBull ? '#245B43' : '#9E2A22';

            return (
              <g
                key={candleDecade}
                className="cursor-pointer transition-transform hover:opacity-90"
                onClick={() => {
                  setSelectedCandle(candle);
                  if (onSelectDecade) {
                    onSelectDecade(candleDecade);
                  }
                }}
              >
                {/* Highlight rect if selected */}
                {isSelected && (
                  <rect
                    x={x - candleW / 2 - 4}
                    y={paddingY}
                    width={candleW + 8}
                    height={chartH}
                    fill="currentColor"
                    fillOpacity="0.08"
                    stroke="#B8860B"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Wick (Râu nến) */}
                <line
                  x1={x}
                  y1={yHigh}
                  x2={x}
                  y2={yLow}
                  stroke={color}
                  strokeWidth="1.5"
                />

                {/* Candle Body */}
                <rect
                  x={x - candleW / 2}
                  y={candleTop}
                  width={candleW}
                  height={candleH}
                  fill={isBull ? '#245B43' : '#9E2A22'}
                  stroke={color}
                  strokeWidth="1"
                />

                {/* Age Label */}
                <text
                  x={x}
                  y={svgHeight - paddingY + 16}
                  textAnchor="middle"
                  className="text-[10px] fill-paper-text dark:fill-night-text font-serif font-bold"
                >
                  {candleDecade}t
                </text>

                {/* Palace name */}
                <text
                  x={x}
                  y={svgHeight - paddingY + 28}
                  textAnchor="middle"
                  className="text-[8px] fill-paper-muted dark:fill-night-muted"
                >
                  {candle.palaceName.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Candle Details Box */}
      {selectedCandle && (
        <div className="bg-paper-bg dark:bg-night-bg border border-paper-gold/60 p-3 sm:p-4 space-y-2 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-paper-border/60">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-paper-red dark:text-night-gold text-sm">
                Đại Vận {(selectedCandle as any).decade ?? selectedCandle.decadeStartAge} – {((selectedCandle as any).decade ?? selectedCandle.decadeStartAge) + 9} Tuổi (Cung {selectedCandle.palaceName})
              </span>
              <span className={`px-1.5 py-0.2 text-2xs font-bold border ${
                selectedCandle.close >= selectedCandle.open
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20'
                  : 'border-rose-600 text-rose-700 bg-rose-50 dark:bg-rose-950/20'
              }`}>
                {selectedCandle.close >= selectedCandle.open ? 'Vận Tăng Tiến (Thanh Ngọc)' : 'Vận Thử Thách (Chu Sa)'}
              </span>
            </div>
            <div className="text-2xs font-mono text-paper-muted dark:text-night-muted">
              Mở: {selectedCandle.open} • Đỉnh: {selectedCandle.high} • Đáy: {selectedCandle.low} • Đóng: {selectedCandle.close}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-2xs">
            <div>
              <span className="text-paper-muted dark:text-night-muted block">Sao chủ chốt cai quản đại vận:</span>
              <span className="font-serif font-bold text-paper-text dark:text-night-text">
                {(selectedCandle.keyStars || (selectedCandle as any).majorStars || []).length > 0
                  ? (selectedCandle.keyStars || (selectedCandle as any).majorStars).join(' • ')
                  : 'Không có chính tinh (Vô Chính Diệu)'}
              </span>
            </div>
            <div>
              <span className="text-paper-muted dark:text-night-muted block">Lời khuyên chiến lược:</span>
              <span className="text-paper-text dark:text-night-text">
                {selectedCandle.assessment || (selectedCandle as any).advice}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
