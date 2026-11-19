import React, { useMemo } from 'react';
import { ChartData, Palace, PalacePosition } from '../types';

interface ChartGridProps {
  chart: ChartData;
  selectedPalaceId: number;
  onSelectPalace: (palaceId: number) => void;
  chartRef?: React.Ref<HTMLDivElement>;
}

export const ChartGrid: React.FC<ChartGridProps> = ({
  chart,
  selectedPalaceId,
  onSelectPalace,
  chartRef
}) => {
  const { thienBan, palaces, tamPhuongTuChinh } = chart;

  // Build grid 4x4 matrix
  const gridCells = useMemo(() => {
    // 4 rows, 4 cols
    const matrix: (Palace | null)[][] = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null]
    ];

    palaces.forEach((palace) => {
      const { row, col } = palace.position;
      matrix[row][col] = palace;
    });

    return matrix;
  }, [palaces]);

  // Coordinates for SVG lines
  const relation = tamPhuongTuChinh[selectedPalaceId];
  const activePalace = palaces.find((p) => p.id === selectedPalaceId);
  const xungChieuPalace = palaces.find((p) => p.id === relation?.xungChieu);
  const tamHop1Palace = palaces.find((p) => p.id === relation?.tamHop[0]);
  const tamHop2Palace = palaces.find((p) => p.id === relation?.tamHop[1]);

  const getCenterCoord = (pos?: PalacePosition) => {
    if (!pos) return { x: 50, y: 50 };
    return {
      x: pos.col * 25 + 12.5,
      y: pos.row * 25 + 12.5
    };
  };

  const pActive = getCenterCoord(activePalace?.position);
  const pXungChieu = getCenterCoord(xungChieuPalace?.position);
  const pTamHop1 = getCenterCoord(tamHop1Palace?.position);
  const pTamHop2 = getCenterCoord(tamHop2Palace?.position);

  // Helper colors for stars
  const getStarColor = (element: string, category: string) => {
    if (category === 'phu_tinh_hung') {
      return 'text-red-700 dark:text-red-400 font-semibold';
    }
    switch (element) {
      case 'Kim':
        return 'text-amber-600 dark:text-amber-300 font-semibold';
      case 'Moc':
        return 'text-emerald-700 dark:text-emerald-400 font-semibold';
      case 'Thuy':
        return 'text-blue-700 dark:text-blue-400 font-semibold';
      case 'Hoa':
        return 'text-red-700 dark:text-red-400 font-semibold';
      case 'Tho':
        return 'text-yellow-700 dark:text-yellow-500 font-semibold';
      default:
        return 'text-paper-text dark:text-night-text';
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto my-6 select-none">
      {/* Outer container */}
      <div
        ref={chartRef}
        id="tuvi-laso-matrix"
        className="relative bg-paper-bg dark:bg-night-bg border-2 border-paper-gold/60 dark:border-night-gold/60 shadow-md rounded p-1 sm:p-2"
      >
        {/* SVG Tam Phương Tứ Chính Layer */}
        {relation && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Tam hợp triangle */}
            <polygon
              points={`${pActive.x},${pActive.y} ${pTamHop1.x},${pTamHop1.y} ${pTamHop2.x},${pTamHop2.y}`}
              fill="rgba(184, 134, 11, 0.08)"
              stroke="#B8860B"
              strokeWidth="0.6"
              strokeLinejoin="round"
              className="dark:stroke-night-gold"
            />
            {/* Xung chiếu line (nét đứt màu đỏ son) */}
            <line
              x1={pActive.x}
              y1={pActive.y}
              x2={pXungChieu.x}
              y2={pXungChieu.y}
              stroke="#8B1E1E"
              strokeWidth="0.7"
              strokeDasharray="2,2"
              className="dark:stroke-red-400"
            />
            {/* Markers */}
            <circle cx={pActive.x} cy={pActive.y} r="1.5" fill="#8B1E1E" className="dark:fill-night-gold" />
            <circle cx={pXungChieu.x} cy={pXungChieu.y} r="1" fill="#8B1E1E" />
            <circle cx={pTamHop1.x} cy={pTamHop1.y} r="1" fill="#B8860B" />
            <circle cx={pTamHop2.x} cy={pTamHop2.y} r="1" fill="#B8860B" />
          </svg>
        )}

        {/* 4x4 Grid Matrix */}
        <div className="grid grid-cols-4 grid-rows-4 gap-1 w-full aspect-[4/3] sm:aspect-square min-h-[580px]">
          {gridCells.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              // Center 2x2: Thiên Bàn
              if (rIdx === 1 && cIdx === 1) {
                return (
                  <div
                    key="thien-ban"
                    className="col-span-2 row-span-2 bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border rounded p-3 sm:p-5 flex flex-col justify-between text-center relative z-20 shadow-inner"
                  >
                    {/* Header */}
                    <div>
                      <div className="inline-block px-2.5 py-0.5 rounded text-[10px] sm:text-xs font-serif font-bold text-paper-red dark:text-night-gold border border-paper-red/30 dark:border-night-gold/30 mb-1">
                        THIÊN BÀN TỬ VI
                      </div>
                      <h3 className="font-serif text-base sm:text-xl font-bold text-paper-text dark:text-night-text">
                        {thienBan.fullName}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-paper-gold dark:text-night-gold font-medium">
                        {thienBan.gender} • {thienBan.amDuong} ({thienBan.amDuongLy})
                      </p>
                    </div>

                    {/* Natal Details */}
                    <div className="text-[10px] sm:text-xs text-paper-sub dark:text-night-sub space-y-1 my-2 border-y border-paper-border/60 dark:border-night-border/60 py-2">
                      <div className="flex justify-between px-2">
                        <span>Dương Lịch:</span>
                        <span className="font-medium text-paper-text dark:text-night-text">{thienBan.solarDate}</span>
                      </div>
                      <div className="flex justify-between px-2">
                        <span>Âm Lịch:</span>
                        <span className="font-medium text-paper-text dark:text-night-text">{thienBan.lunarDate}</span>
                      </div>
                      <div className="flex justify-between px-2">
                        <span>Giờ sinh:</span>
                        <span className="font-medium text-paper-text dark:text-night-text">{thienBan.birthHour}</span>
                      </div>
                      <div className="flex justify-between px-2">
                        <span>Bát Tự:</span>
                        <span className="font-medium text-paper-red dark:text-night-gold">
                          {thienBan.canChiYear} • {thienBan.canChiMonth} • {thienBan.canChiDay} • {thienBan.canChiHour}
                        </span>
                      </div>
                    </div>

                    {/* Mệnh Cục Footer */}
                    <div className="grid grid-cols-2 gap-1 text-[10px] sm:text-xs font-serif">
                      <div className="p-1 rounded bg-paper-bg dark:bg-night-bg border border-paper-border/50 dark:border-night-border/50">
                        <span className="text-paper-sub dark:text-night-sub block text-[9px]">Bản Mệnh</span>
                        <span className="font-bold text-paper-text dark:text-night-text">{thienBan.banMenh}</span>
                      </div>
                      <div className="p-1 rounded bg-paper-bg dark:bg-night-bg border border-paper-border/50 dark:border-night-border/50">
                        <span className="text-paper-sub dark:text-night-sub block text-[9px]">Cục Số</span>
                        <span className="font-bold text-paper-red dark:text-night-gold">{thienBan.cuc}</span>
                      </div>
                      <div className="p-1 rounded bg-paper-bg dark:bg-night-bg border border-paper-border/50 dark:border-night-border/50">
                        <span className="text-paper-sub dark:text-night-sub block text-[9px]">Thân Cư</span>
                        <span className="font-bold text-paper-text dark:text-night-text">{thienBan.thanCu}</span>
                      </div>
                      <div className="p-1 rounded bg-paper-bg dark:bg-night-bg border border-paper-border/50 dark:border-night-border/50">
                        <span className="text-paper-sub dark:text-night-sub block text-[9px]">Xem Hạn</span>
                        <span className="font-bold text-paper-gold dark:text-night-gold">Năm {thienBan.viewingYear}</span>
                      </div>
                    </div>
                  </div>
                );
              }

              // Skip center inner cells
              if (
                (rIdx === 1 && cIdx === 2) ||
                (rIdx === 2 && cIdx === 1) ||
                (rIdx === 2 && cIdx === 2)
              ) {
                return null;
              }

              if (!cell) return <div key={`${rIdx}-${cIdx}`} />;

              const isSelected = cell.id === selectedPalaceId;
              const isTamHop = relation?.tamHop.includes(cell.id);
              const isXungChieu = relation?.xungChieu === cell.id;

              return (
                <div
                  key={cell.id}
                  onClick={() => onSelectPalace(cell.id)}
                  className={`relative p-2 sm:p-2.5 rounded border transition-all cursor-pointer flex flex-col justify-between overflow-hidden ${
                    isSelected
                      ? 'bg-paper-red/10 dark:bg-night-gold/20 border-paper-red dark:border-night-gold ring-1 ring-paper-red dark:ring-night-gold z-20 shadow-sm'
                      : isTamHop
                      ? 'bg-paper-gold/10 dark:bg-night-gold/10 border-paper-gold/60 dark:border-night-gold/60'
                      : isXungChieu
                      ? 'bg-red-500/5 dark:bg-red-950/20 border-red-500/50 dark:border-red-500/40'
                      : 'bg-paper-card dark:bg-night-card border-paper-border dark:border-night-border hover:border-paper-gold/50'
                  }`}
                >
                  {/* Top Bar: Palace Name, Can Chi & Badges */}
                  <div className="flex items-start justify-between border-b border-paper-border/50 dark:border-night-border/50 pb-1">
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-serif text-xs sm:text-sm font-bold text-paper-text dark:text-night-text">
                          {cell.name}
                        </span>
                        {cell.isMenh && (
                          <span className="px-1 py-0.2 bg-paper-red text-white text-[9px] font-bold rounded">
                            MỆNH
                          </span>
                        )}
                        {cell.isThan && (
                          <span className="px-1 py-0.2 bg-paper-gold text-white dark:bg-night-gold dark:text-night-bg text-[9px] font-bold rounded">
                            THÂN
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-paper-sub dark:text-night-sub">
                        {cell.can} {cell.branch}
                      </span>
                    </div>

                    {/* Tuần / Triệt */}
                    <div className="flex flex-col items-end gap-0.5">
                      {cell.triet && (
                        <span className="px-1 py-0.2 bg-red-600 text-white text-[9px] font-bold rounded">
                          TRIỆT
                        </span>
                      )}
                      {cell.tuan && (
                        <span className="px-1 py-0.2 bg-amber-600 text-white text-[9px] font-bold rounded">
                          TUẦN
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Middle: Major & Minor Stars */}
                  <div className="my-1.5 flex-1 overflow-y-auto max-h-[85px] sm:max-h-[110px] pr-0.5 text-[10px] sm:text-xs space-y-0.5">
                    {/* Major Stars */}
                    {cell.majorStars.length > 0 ? (
                      cell.majorStars.map((star) => (
                        <div key={star.name} className="flex items-center justify-between">
                          <span className={getStarColor(star.element, star.category)}>
                            {star.name}
                          </span>
                          <span className="text-[9px] font-serif text-paper-sub dark:text-night-sub px-0.5 rounded bg-paper-border/30">
                            {star.brightness}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-[10px] italic text-paper-sub/70 dark:text-night-sub/70">
                        Vô Chính Diệu
                      </div>
                    )}

                    {/* Minor Stars List */}
                    <div className="pt-1 flex flex-wrap gap-x-1.5 gap-y-0.5 text-[9px] sm:text-[10px]">
                      {cell.minorStars.slice(0, 8).map((star) => (
                        <span
                          key={star.name}
                          className={getStarColor(star.element, star.category)}
                          title={`${star.name} (${star.element})`}
                        >
                          {star.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom: Dai Han & Tieu Han */}
                  <div className="flex items-center justify-between text-[9px] sm:text-[10px] pt-1 border-t border-paper-border/50 dark:border-night-border/50 text-paper-sub dark:text-night-sub font-mono">
                    <span title="Đại Hạn (tuổi bắt đầu)">Đ.H: {cell.daiHan}</span>
                    <span title="Tiểu Hạn năm xem">T.H: {cell.tieuHan}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Quick helper notice */}
      <div className="mt-2 text-center text-xs text-paper-sub dark:text-night-sub flex items-center justify-center gap-2">
        <span>💡 Nhấp vào từng cung để xem <strong>Tam Phương Tứ Chính</strong> (Tam hợp + Xung chiếu) và đồng bộ luận giải bên dưới.</span>
      </div>
    </div>
  );
};
