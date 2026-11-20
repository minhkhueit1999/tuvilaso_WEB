import React, { useMemo, useState } from 'react';
import { ChartData, Palace, PalacePosition, TuViSchool, Star } from '../types';
import {
  IconBatQuai,
  IconAnTrien,
  IconLaKinh,
  IconMeanderCorner
} from './OrientalIcons';
import { MasterBrandConfig, SealStampSVG } from './WhiteLabelModal';
import { WhiteboardCanvas } from './WhiteboardCanvas';

interface ChartGridProps {
  chart: ChartData;
  selectedPalaceId: number;
  onSelectPalace: (palaceId: number) => void;
  onOpenHistory: () => void;
  onOpenExport: () => void;
  chartRef?: React.Ref<HTMLDivElement>;
  showTamPhuongTuChinh?: boolean;
  showLuuNien?: boolean;
  activeSchool?: TuViSchool;
  isPrivacyMode?: boolean;
  brandConfig?: MasterBrandConfig | null;
  isWhiteboardActive?: boolean;
  onCloseWhiteboard?: () => void;
  highlightedPalaceIds?: number[];
}

export const ChartGrid: React.FC<ChartGridProps> = ({
  chart,
  selectedPalaceId,
  onSelectPalace,
  onOpenHistory,
  onOpenExport,
  chartRef,
  showTamPhuongTuChinh = true,
  showLuuNien = true,
  activeSchool = 'tong_hop',
  isPrivacyMode = false,
  brandConfig = null,
  isWhiteboardActive = false,
  onCloseWhiteboard = () => {},
  highlightedPalaceIds = []
}) => {
  const [copied, setCopied] = useState(false);
  const [showNhiHop, setShowNhiHop] = useState(false);
  const { thienBan, palaces, tamPhuongTuChinh, phiHoaTable } = chart;
  const currentSchool: TuViSchool = activeSchool || chart.school || 'tong_hop';

  // Build grid 4x4 matrix
  const gridCells = useMemo(() => {
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

  // Nhị Hợp (Ám Hợp) Target Palace
  const nhiHopTargetId = chart.nhiHopMap
    ? chart.nhiHopMap[selectedPalaceId]
    : [1, 0, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2][selectedPalaceId] ?? ((selectedPalaceId + 6) % 12);
  const nhiHopPalace = palaces.find((p) => p.id === nhiHopTargetId);
  const pNhiHop = getCenterCoord(nhiHopPalace?.position);

  // Phi Tinh Coordinates for selected palace
  const activePhiDetail = phiHoaTable?.[selectedPalaceId];
  const pPhiLoc = getCenterCoord(palaces.find(p => p.id === activePhiDetail?.loc?.toPalaceId)?.position);
  const pPhiQuyen = getCenterCoord(palaces.find(p => p.id === activePhiDetail?.quyen?.toPalaceId)?.position);
  const pPhiKhoa = getCenterCoord(palaces.find(p => p.id === activePhiDetail?.khoa?.toPalaceId)?.position);
  const pPhiKy = getCenterCoord(palaces.find(p => p.id === activePhiDetail?.ky?.toPalaceId)?.position);
  const pPhiKyXung = getCenterCoord(palaces.find(p => p.id === activePhiDetail?.ky?.xungPalaceId)?.position);

  // Star 5-Element Color Class
  const getStarColorClass = (element: string, category: string, isLuu?: boolean) => {
    if (isLuu || category === 'sao_luu_nien') {
      return 'text-amber-800 dark:text-amber-300 font-bold';
    }
    switch (element) {
      case 'Kim':
        return 'text-[#525B66] dark:text-[#CBD5E1]';
      case 'Moc':
        return 'text-[#1B6B3A] dark:text-[#4ADE80]';
      case 'Thuy':
        return 'text-[#1E4D8C] dark:text-[#60A5FA]';
      case 'Hoa':
        return 'text-[#B91C1C] dark:text-[#F87171]';
      case 'Tho':
        return 'text-[#C27803] dark:text-[#FBBF24]';
      default:
        return 'text-paper-text dark:text-night-text';
    }
  };

  // Copy Summary Handler
  const handleCopySummary = () => {
    const summary = `TỬ VI MINH KHUÊ — LÁ SỐ MỘC BẢN\nĐương số: ${thienBan.fullName} (${thienBan.gender})\nNgày sinh Dương lịch: ${thienBan.solarDate}\nNgày sinh Âm lịch: ${thienBan.lunarDate}\nGiờ sinh: ${thienBan.birthHour}\nCan Chi Bát Tự: ${thienBan.canChiYear} • ${thienBan.canChiMonth} • ${thienBan.canChiDay} • ${thienBan.canChiHour}\nBản Mệnh: ${thienBan.banMenh} | Cục: ${thienBan.cuc}\nChủ Mệnh: ${thienBan.chuMenh} | Chủ Thân: ${thienBan.chuThan}\nLai Nhân Cung: ${thienBan.laiNhanCung}\nNăm xem hạn: ${thienBan.viewingYear} (${thienBan.schoolName})`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-4 space-y-3">
      {/* Top Toolbar Above Matrix */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border rounded-none text-xs">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-sm text-paper-red dark:text-night-gold flex items-center gap-1.5">
            <IconLaKinh className="w-4 h-4 text-paper-gold dark:text-night-gold" />
            <span>Lá Số: {thienBan.fullName}</span>
          </span>
          <span className="text-[11px] px-2 py-0.5 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-border dark:border-night-border text-paper-muted dark:text-night-muted font-serif">
            {thienBan.canChiYear} • {thienBan.cuc}
          </span>
          <span className="seal-stamp text-[10px]">
            {currentSchool === 'tong_hop' ? 'TỔNG HỢP' : currentSchool === 'nam_phai' ? 'NAM PHÁI' : currentSchool === 'bac_phai' ? 'BẮC PHÁI' : 'PHI TINH'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-paper-border dark:border-night-border hover:bg-paper-cardAlt dark:hover:bg-night-cardAlt text-paper-text dark:text-night-text transition-colors cursor-pointer rounded-none"
            title="Sao chép tóm tắt thông tin lá số"
          >
            <svg className="w-3.5 h-3.5 text-paper-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="9" y="9" width="13" height="13" rx="1" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            <span>{copied ? 'Đã sao chép!' : 'Sao chép tóm tắt'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowNhiHop(!showNhiHop)}
            className={`flex items-center gap-1 px-2.5 py-1.5 border text-xs font-serif transition-colors cursor-pointer rounded-none ${
              showNhiHop
                ? 'border-emerald-700 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-bold'
                : 'border-paper-border dark:border-night-border text-paper-muted hover:border-paper-gold'
            }`}
            title="Bật/Tắt đường nối Cung Nhị Hợp (Ám Hợp) trong phong thủy mệnh lý"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
            <span>Nhị Hợp (Ám Hợp)</span>
          </button>

          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-paper-red hover:bg-paper-redHover text-paper-bg dark:bg-night-red dark:text-night-bg font-serif font-bold transition-all shadow-xs cursor-pointer rounded-none border border-paper-redHover"
            title="Xuất ảnh PNG lá số mộc bản độ phân giải cao"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            <span>Xuất Ảnh PNG</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1 px-2.5 py-1.5 border border-paper-border dark:border-night-border text-paper-muted hover:text-paper-text transition-colors cursor-pointer rounded-none"
            title="Xem lại lịch sử lá số"
          >
            <IconAnTrien className="w-3.5 h-3.5 text-paper-gold" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Wrapper for Mobile */}
      <div className="overflow-x-auto pb-2 -mx-2 px-2 sm:mx-0 sm:px-0">
        <div
          ref={chartRef}
          id="tuvi-laso-matrix"
          className="relative min-w-[760px] sm:min-w-0 bg-paper-bg dark:bg-night-bg border-2 border-paper-gold/80 dark:border-night-gold/80 p-1 sm:p-2 select-none shadow-xs"
        >
          {/* Animated SVG Lines Layer */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Arrow Markers for Phi Tinh - Nhỏ gọn và nhạt trang nhã */}
              <marker id="arrow-loc" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3.5" markerHeight="3.5" orient="auto-start-reverse">
                <path d="M 0 2 L 8 5 L 0 8 z" fill="#245B43" fillOpacity="0.65" />
              </marker>
              <marker id="arrow-quyen" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3.5" markerHeight="3.5" orient="auto-start-reverse">
                <path d="M 0 2 L 8 5 L 0 8 z" fill="#C27803" fillOpacity="0.65" />
              </marker>
              <marker id="arrow-khoa" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3.5" markerHeight="3.5" orient="auto-start-reverse">
                <path d="M 0 2 L 8 5 L 0 8 z" fill="#234B6E" fillOpacity="0.65" />
              </marker>
              <marker id="arrow-ky" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3.5" markerHeight="3.5" orient="auto-start-reverse">
                <path d="M 0 2 L 8 5 L 0 8 z" fill="#9E2A22" fillOpacity="0.7" />
              </marker>
            </defs>

            {/* 1. Mode: Nam Phái & Tổng Hợp -> Tam Phương Tứ Chính (Nét mảnh, thanh thoát, màu nhạt) */}
            {(currentSchool === 'nam_phai' || currentSchool === 'tong_hop') && showTamPhuongTuChinh && relation && (
              <g className="transition-all duration-300">
                {/* Tam Hợp triangle (nét mảnh mộc bản, nền mờ nhẹ) */}
                <polygon
                  points={`${pActive.x},${pActive.y} ${pTamHop1.x},${pTamHop1.y} ${pTamHop2.x},${pTamHop2.y}`}
                  fill="rgba(154, 123, 62, 0.025)"
                  stroke="rgba(154, 123, 62, 0.45)"
                  strokeWidth="0.25"
                  strokeLinejoin="round"
                />
                {/* Xung Chiếu line (đường đứt nét chu sa mảnh dịu) */}
                <line
                  x1={pActive.x}
                  y1={pActive.y}
                  x2={pXungChieu.x}
                  y2={pXungChieu.y}
                  stroke="rgba(158, 42, 34, 0.5)"
                  strokeWidth="0.25"
                  strokeDasharray="1.2,1.2"
                />
                <circle cx={pActive.x} cy={pActive.y} r="0.8" fill="#9E2A22" opacity="0.75" />
                <circle cx={pXungChieu.x} cy={pXungChieu.y} r="0.7" fill="#9E2A22" opacity="0.65" />
                <circle cx={pTamHop1.x} cy={pTamHop1.y} r="0.7" fill="#9A7B3E" opacity="0.65" />
                <circle cx={pTamHop2.x} cy={pTamHop2.y} r="0.7" fill="#9A7B3E" opacity="0.65" />
              </g>
            )}

            {/* 2. Mode: Phi Tinh -> 4 đường mũi tên Phi Hóa (Mảnh và thanh nhã) */}
            {(currentSchool === 'phi_tinh') && activePhiDetail && (
              <g className="transition-all duration-300">
                {/* Phi Lộc (Thanh Ngọc #245B43) */}
                <line
                  x1={pActive.x}
                  y1={pActive.y}
                  x2={pPhiLoc.x}
                  y2={pPhiLoc.y}
                  stroke="rgba(36, 91, 67, 0.55)"
                  strokeWidth="0.3"
                  markerEnd="url(#arrow-loc)"
                />
                {/* Phi Quyền (Cổ Đồng Kim #C27803) */}
                <line
                  x1={pActive.x}
                  y1={pActive.y}
                  x2={pPhiQuyen.x}
                  y2={pPhiQuyen.y}
                  stroke="rgba(194, 120, 3, 0.55)"
                  strokeWidth="0.3"
                  markerEnd="url(#arrow-quyen)"
                />
                {/* Phi Khoa (Thiên Thanh #234B6E) */}
                <line
                  x1={pActive.x}
                  y1={pActive.y}
                  x2={pPhiKhoa.x}
                  y2={pPhiKhoa.y}
                  stroke="rgba(35, 75, 110, 0.55)"
                  strokeWidth="0.3"
                  markerEnd="url(#arrow-khoa)"
                />
                {/* Phi Kỵ (Đỏ Chu Sa #9E2A22) */}
                <line
                  x1={pActive.x}
                  y1={pActive.y}
                  x2={pPhiKy.x}
                  y2={pPhiKy.y}
                  stroke="rgba(158, 42, 34, 0.6)"
                  strokeWidth="0.35"
                  markerEnd="url(#arrow-ky)"
                />
                {/* Xung Chiếu từ cung nhận Kỵ */}
                <line
                  x1={pPhiKy.x}
                  y1={pPhiKy.y}
                  x2={pPhiKyXung.x}
                  y2={pPhiKyXung.y}
                  stroke="rgba(158, 42, 34, 0.4)"
                  strokeWidth="0.25"
                  strokeDasharray="1.2,1.2"
                />
                <circle cx={pActive.x} cy={pActive.y} r="0.9" fill="#1C1915" stroke="#9A7B3E" strokeWidth="0.25" opacity="0.8" />
              </g>
            )}

            {/* 3. Mode: Nhị Hợp (Ám Hợp) -> Đường nối đứt nét Thanh Ngọc (#245B43) */}
            {showNhiHop && nhiHopPalace && (
              <g className="transition-all duration-300">
                <line
                  x1={pActive.x}
                  y1={pActive.y}
                  x2={pNhiHop.x}
                  y2={pNhiHop.y}
                  stroke="#245B43"
                  strokeWidth="0.4"
                  strokeDasharray="1.5,1.5"
                />
                <circle cx={pActive.x} cy={pActive.y} r="0.8" fill="#245B43" opacity="0.85" />
                <circle cx={pNhiHop.x} cy={pNhiHop.y} r="0.8" fill="#245B43" opacity="0.85" />
              </g>
            )}
          </svg>

          {/* 4x4 Grid Matrix */}
          <div className="grid grid-cols-4 grid-rows-4 gap-[2px] w-full min-h-[660px] bg-paper-border dark:bg-night-border border border-paper-border dark:border-night-border">
            {gridCells.map((row, rIdx) =>
              row.map((cell, cIdx) => {
                // Center 2x2: THIÊN BÀN MỘC BẢN
                if (rIdx === 1 && cIdx === 1) {
                  return (
                    <div
                      key="thien-ban"
                      className="col-span-2 row-span-2 bg-paper-card dark:bg-night-card p-4 sm:p-5 flex flex-col justify-between text-center relative z-20 overflow-hidden border border-paper-gold/50 dark:border-night-gold/50"
                    >
                      {/* Watermark Bát Quái Chìm */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-4 dark:opacity-8 pointer-events-none">
                        <IconBatQuai className="w-64 h-64 text-paper-gold" />
                      </div>

                      {/* Góc Hồi Văn Thiên Bàn */}
                      <IconMeanderCorner position="tl" className="absolute top-1 left-1 w-3.5 h-3.5 text-paper-gold opacity-70" />
                      <IconMeanderCorner position="tr" className="absolute top-1 right-1 w-3.5 h-3.5 text-paper-gold opacity-70" />
                      <IconMeanderCorner position="bl" className="absolute bottom-1 left-1 w-3.5 h-3.5 text-paper-gold opacity-70" />
                      <IconMeanderCorner position="br" className="absolute bottom-1 right-1 w-3.5 h-3.5 text-paper-gold opacity-70" />

                      {/* Header */}
                      <div className="relative z-10 pt-1">
                        <div className="inline-block px-3 py-0.5 text-[10px] sm:text-xs font-serif font-bold text-paper-red dark:text-night-gold border border-paper-red/40 dark:border-night-gold/40 mb-1 tracking-widest">
                          THIÊN BÀN TỬ VI {brandConfig?.enabled && brandConfig.brandName ? `• ${brandConfig.brandName.toUpperCase()}` : 'MINH KHUÊ'}
                        </div>
                        <h3 className="font-serif text-lg sm:text-2xl font-bold text-paper-text dark:text-night-text tracking-wide">
                          {isPrivacyMode ? 'Đương Số (Ẩn Danh)' : thienBan.fullName}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-paper-gold dark:text-night-gold font-medium mt-0.5">
                          {thienBan.gender} • {thienBan.amDuong} ({thienBan.amDuongLy})
                        </p>
                      </div>

                      {/* Natal Details */}
                      <div className="relative z-10 text-[10px] sm:text-xs text-paper-muted dark:text-night-muted space-y-1 my-1.5 border-y border-paper-border/70 dark:border-night-border/70 py-2">
                        <div className="flex justify-between px-2">
                          <span className="font-serif">Dương Lịch:</span>
                          <span className="font-medium text-paper-text dark:text-night-text tabular-nums">
                            {isPrivacyMode ? `**/**/${thienBan.solarDate.split('/').pop() || 'YYYY'}` : thienBan.solarDate}
                          </span>
                        </div>
                        <div className="flex justify-between px-2">
                          <span className="font-serif">Âm Lịch:</span>
                          <span className="font-medium text-paper-text dark:text-night-text tabular-nums">
                            {isPrivacyMode ? `**/**/${thienBan.lunarDate.split('/').pop() || 'YYYY'}` : thienBan.lunarDate}
                          </span>
                        </div>
                        <div className="flex justify-between px-2">
                          <span className="font-serif">Giờ Sinh:</span>
                          <span className="font-medium text-paper-text dark:text-night-text">{thienBan.birthHour}</span>
                        </div>
                        <div className="flex justify-between px-2">
                          <span className="font-serif">Bát Tự Can Chi:</span>
                          <span className="font-bold text-paper-red dark:text-night-gold font-serif">
                            {thienBan.canChiYear} • {thienBan.canChiMonth} • {thienBan.canChiDay} • {thienBan.canChiHour}
                          </span>
                        </div>
                        <div className="flex justify-between px-2 pt-1 border-t border-paper-border/40 text-[9px] sm:text-[10px]">
                          <span className="font-serif">Chủ Mệnh / Thân:</span>
                          <span className="font-semibold text-paper-text dark:text-night-text">
                            {thienBan.chuMenh} • {thienBan.chuThan}
                          </span>
                        </div>
                        <div className="flex justify-between px-2 text-[9px] sm:text-[10px]">
                          <span className="font-serif text-paper-red dark:text-night-gold font-semibold">Lai Nhân Cung:</span>
                          <span className="font-bold text-paper-red dark:text-night-gold font-serif">
                            {thienBan.laiNhanCung}
                          </span>
                        </div>
                      </div>

                      {/* Cinnabar Seal Stamp & Brand Info if Enabled */}
                      {brandConfig?.enabled && (
                        <div className="absolute bottom-2 right-2 z-20 pointer-events-none opacity-85">
                          <SealStampSVG text={brandConfig.sealText || 'THẦY'} className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-xs" />
                        </div>
                      )}

                      {/* Tứ Hóa & Mệnh Cục Footer */}
                      <div className="relative z-10 space-y-1">
                        {/* 4 Sao Sinh Niên Tứ Hóa */}
                        <div className="grid grid-cols-4 gap-1 text-[9px] font-serif font-bold text-center">
                          <div className="p-1 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-border dark:border-night-border text-paper-jade">
                            <span>Hóa Lộc [A]</span>
                            <span className="block text-[10px] text-paper-text dark:text-night-text">{thienBan.tuHoaYear.loc}</span>
                          </div>
                          <div className="p-1 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-border dark:border-night-border text-paper-gold">
                            <span>Hóa Quyền [B]</span>
                            <span className="block text-[10px] text-paper-text dark:text-night-text">{thienBan.tuHoaYear.quyen}</span>
                          </div>
                          <div className="p-1 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-border dark:border-night-border text-paper-azure">
                            <span>Hóa Khoa [C]</span>
                            <span className="block text-[10px] text-paper-text dark:text-night-text">{thienBan.tuHoaYear.khoa}</span>
                          </div>
                          <div className="p-1 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-border dark:border-night-border text-paper-red">
                            <span>Hóa Kỵ [D]</span>
                            <span className="block text-[10px] text-paper-text dark:text-night-text">{thienBan.tuHoaYear.ky}</span>
                          </div>
                        </div>

                        {/* Mệnh - Cục Info */}
                        <div className="grid grid-cols-2 gap-1 text-[10px] font-serif">
                          <div className="p-1 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-border/60">
                            <span className="text-paper-muted block text-[9px]">Bản Mệnh</span>
                            <span className="font-bold text-paper-text dark:text-night-text">{thienBan.banMenh}</span>
                          </div>
                          <div className="p-1 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-border/60">
                            <span className="text-paper-muted block text-[9px]">Cục Số</span>
                            <span className="font-bold text-paper-red dark:text-night-gold">{thienBan.cuc}</span>
                          </div>
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

                if (!cell) return <div key={`${rIdx}-${cIdx}`} className="bg-paper-card dark:bg-night-card" />;

                const isSelected = cell.id === selectedPalaceId;
                const isTamHop = (currentSchool === 'nam_phai' || currentSchool === 'tong_hop') && showTamPhuongTuChinh && relation?.tamHop.includes(cell.id);
                const isXungChieu = (currentSchool === 'nam_phai' || currentSchool === 'tong_hop') && showTamPhuongTuChinh && relation?.xungChieu === cell.id;

                // Phi Tinh active targets
                const isPhiLoc = currentSchool === 'phi_tinh' && activePhiDetail?.loc?.toPalaceId === cell.id;
                const isPhiQuyen = currentSchool === 'phi_tinh' && activePhiDetail?.quyen?.toPalaceId === cell.id;
                const isPhiKhoa = currentSchool === 'phi_tinh' && activePhiDetail?.khoa?.toPalaceId === cell.id;
                const isPhiKy = currentSchool === 'phi_tinh' && activePhiDetail?.ky?.toPalaceId === cell.id;
                const isPhiKyXung = currentSchool === 'phi_tinh' && activePhiDetail?.ky?.xungPalaceId === cell.id;
                const isNhiHopTarget = showNhiHop && cell.id === nhiHopTargetId;
                const isRadarHighlighted = highlightedPalaceIds?.includes(cell.id);

                const displaySatStars = showLuuNien
                  ? cell.satStars
                  : cell.satStars.filter(s => !s.isLuuNien);

                return (
                  <div
                    key={cell.id}
                    data-palace-id={cell.id}
                    data-palace-name={cell.name}
                    onClick={() => onSelectPalace(cell.id)}
                    className={`relative p-2 bg-paper-card dark:bg-night-card transition-all cursor-pointer flex flex-col justify-between overflow-hidden ${
                      isSelected
                        ? 'ring-2 ring-paper-red dark:ring-night-gold bg-paper-cardAlt dark:bg-night-cardAlt z-20 shadow-sm'
                        : isRadarHighlighted
                        ? 'ring-2 ring-paper-gold bg-amber-500/15 dark:bg-night-gold/20 z-10'
                        : isNhiHopTarget
                        ? 'ring-2 ring-emerald-600 bg-emerald-100/30 dark:bg-emerald-950/25 z-10'
                        : isPhiKy
                        ? 'ring-1 ring-paper-red bg-red-100/40 dark:bg-red-950/30'
                        : isPhiLoc
                        ? 'ring-1 ring-paper-jade bg-emerald-100/30 dark:bg-emerald-950/25'
                        : isTamHop
                        ? 'bg-paper-gold/10 dark:bg-night-gold/10'
                        : isXungChieu
                        ? 'bg-red-500/10 dark:bg-red-950/20'
                        : 'hover:bg-paper-cardAlt dark:hover:bg-night-cardAlt'
                    }`}
                  >
                    {/* TẦNG 1: HEADER CUNG (3 Cột Thẳng Hàng) */}
                    <div className="grid grid-cols-3 items-start border-b border-paper-border dark:border-night-border pb-1.5 mb-1 text-[10px]">
                      {/* Góc trên trái: Can Chi viết tắt & Âm Dương Ngũ Hành */}
                      <div className="leading-tight">
                        <div className="font-serif font-bold text-paper-text dark:text-night-text text-[11px] sm:text-xs">
                          {cell.shortCanChi}
                        </div>
                        <div className="text-[9px] text-paper-muted dark:text-night-muted font-sans font-medium">
                          {cell.branchYinYangElement}
                        </div>
                      </div>

                      {/* Chính giữa: TÊN CUNG & CHÍNH TINH */}
                      <div className="text-center leading-tight">
                        <div className="flex items-center justify-center gap-1">
                          <span className="font-serif font-bold text-xs sm:text-sm text-paper-red dark:text-night-gold tracking-wide">
                            {cell.name.toUpperCase()}
                          </span>
                          {cell.isThan && (
                            <span className="seal-stamp text-[8px]" title="Cung Thân">
                              THÂN
                            </span>
                          )}
                          {cell.isLaiNhan && (currentSchool === 'bac_phai' || currentSchool === 'tong_hop') && (
                            <span className="seal-stamp text-[8px]" title="Lai Nhân Cung">
                              LAI NHÂN
                            </span>
                          )}
                        </div>

                        {/* Chính tinh kèm Miếu/Hãm & Tứ Hóa */}
                        <div className="mt-0.5 space-y-0.5">
                          {cell.majorStars.length > 0 ? (
                            cell.majorStars.map((star) => (
                              <div
                                key={star.name}
                                className={`text-[10px] sm:text-[11px] font-serif font-bold tracking-tight ${getStarColorClass(
                                  star.element,
                                  star.category
                                )}`}
                              >
                                <span>{star.yinYang}{star.name.toUpperCase()}</span>
                                <span className="ml-0.5 text-[9px] font-sans opacity-85">({star.brightness})</span>
                                {/* Sinh Niên Tứ Hóa [A/B/C/D] */}
                                {(currentSchool !== 'nam_phai') && star.sinhNienHoa && (
                                  <span className="ml-0.5 px-0.8 py-0.2 text-[8px] font-bold bg-paper-red text-paper-bg dark:bg-night-red dark:text-night-bg">
                                    {star.sinhNienHoa}
                                  </span>
                                )}
                                {/* Tự Hóa Ly Tâm [↑A..D] */}
                                {(currentSchool !== 'nam_phai') && star.tuHoaLyTam && (
                                  <span className="ml-0.5 text-[8px] font-bold text-paper-red dark:text-night-gold" title={`Tự Hóa Ly Tâm ${star.tuHoaLyTam}`}>
                                    ↑{star.tuHoaLyTam}
                                  </span>
                                )}
                                {/* Tự Hóa Hướng Tâm [↓A..D] */}
                                {(currentSchool !== 'nam_phai') && star.tuHoaHuongTam && (
                                  <span className="ml-0.5 text-[8px] font-bold text-paper-jade dark:text-night-jade" title={`Tự Hóa Hướng Tâm ${star.tuHoaHuongTam}`}>
                                    ↓{star.tuHoaHuongTam}
                                  </span>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-[10px] italic text-paper-muted dark:text-night-muted font-serif">
                              (Vô Chính Diệu)
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Góc trên phải: Tuổi Đại Vận & Lưu Nguyệt */}
                      <div className="text-right leading-tight">
                        <div className="font-sans font-bold text-paper-text dark:text-night-text text-[11px] sm:text-xs tabular-nums" title="Tuổi Đại Vận">
                          {cell.daiHan}
                        </div>
                        <div className="text-[9px] text-paper-muted dark:text-night-muted font-sans tabular-nums" title="Lưu Nguyệt">
                          Th.{cell.luuNguyet}
                        </div>
                      </div>
                    </div>

                    {/* TẦNG 2: THÂN CUNG (2 Cột Phụ Tinh Thẳng Tắp) */}
                    <div className="flex-1 grid grid-cols-2 gap-1 text-[9px] sm:text-[10px] leading-tight overflow-hidden py-1">
                      {/* Cột Trái: Cát Tinh & Sao Lưu Tốt */}
                      <div className="space-y-0.5 pr-1 border-r border-paper-border/60 dark:border-night-border/60">
                        {cell.catStars.slice(0, 7).map((star) => (
                          <div
                            key={star.name}
                            className={`truncate ${getStarColorClass(star.element, star.category, star.isLuuNien)} ${
                              star.weight === 'bold' ? 'font-bold' : 'font-normal'
                            }`}
                            title={star.name}
                          >
                            <span>{star.name}</span>
                            {(currentSchool !== 'nam_phai') && star.sinhNienHoa && (
                              <span className="ml-0.5 text-[8px] font-bold text-paper-red">[{star.sinhNienHoa}]</span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Cột Phải: Sát Tinh & Sao Lưu Xấu */}
                      <div className="space-y-0.5 pl-1">
                        {displaySatStars.slice(0, 7).map((star) => (
                          <div
                            key={star.name}
                            className={`truncate ${getStarColorClass(star.element, star.category, star.isLuuNien)} ${
                              star.weight === 'bold' ? 'font-bold' : 'font-normal'
                            }`}
                            title={star.name}
                          >
                            <span>{star.name}</span>
                            {star.brightness && <span className="text-[8px] opacity-75"> ({star.brightness})</span>}
                            {(currentSchool !== 'nam_phai') && star.sinhNienHoa && (
                              <span className="ml-0.5 text-[8px] font-bold text-paper-red">[{star.sinhNienHoa}]</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tuần / Triệt Badge đặt ở biên */}
                    {(cell.triet || cell.tuan) && (
                      <div className="absolute top-1.5 right-1.5 flex gap-1 z-10 pointer-events-none">
                        {cell.triet && <span className="tuan-triet-badge">TRIỆT</span>}
                        {cell.tuan && <span className="tuan-triet-badge">TUẦN</span>}
                      </div>
                    )}

                    {/* TẦNG 3: FOOTER CUNG (3 Cột Chân Cung) */}
                    <div className="grid grid-cols-3 items-center pt-1 border-t border-paper-border dark:border-night-border text-[9px] sm:text-[10px] text-paper-muted dark:text-night-muted">
                      {/* Góc dưới trái: Cung Đại Vận */}
                      <div className="font-serif font-semibold text-paper-text dark:text-night-text truncate" title="Cung Đại Vận">
                        {cell.daiHanPalaceName}
                      </div>

                      {/* Chính giữa: Sao Vòng Tràng Sinh */}
                      <div className="text-center font-serif font-bold text-paper-gold dark:text-night-gold truncate">
                        {cell.minorStars.find(s => s.category === 'vong_trang_sinh')?.name || ''}
                      </div>

                      {/* Góc dưới phải: Cung Lưu Niên */}
                      <div className="text-right font-serif font-semibold text-paper-text dark:text-night-text truncate" title="Cung Lưu Niên">
                        {cell.luuNienPalaceName}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Họa Bút Whiteboard Canvas Overlay */}
          <WhiteboardCanvas
            isActive={!!isWhiteboardActive}
            chartContainerId="tuvi-laso-matrix"
            onClose={onCloseWhiteboard}
          />
        </div>
      </div>

      {/* Bảng Giải Mã Phi Tinh Thời Gian Thực (Chỉ hiển thị khi bật Phi Tinh hoặc Tổng Hợp) */}
      {activePhiDetail && (currentSchool === 'phi_tinh' || currentSchool === 'tong_hop') && (
        <div className="bg-paper-card dark:bg-night-card border border-paper-gold/60 dark:border-night-gold/60 p-3 sm:p-4 text-xs space-y-1.5 animate-fadeIn rounded-none">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-paper-border dark:border-night-border pb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="seal-stamp text-[9px]">PHI TINH TỨ HÓA</span>
              <span className="font-serif font-bold text-sm text-paper-red dark:text-night-gold">
                PHI TINH TỨ HÓA TỪ CUNG {activePhiDetail.fromPalaceName.toUpperCase()} ({activePhiDetail.fromCan} {activePhiDetail.fromBranch})
              </span>
            </div>
            <span className="text-[11px] text-paper-muted dark:text-night-muted">
              Nhấp cung bất kỳ trên lá số để khảo sát dòng chảy Phi Hóa
            </span>
          </div>

          {/* 4 Luồng Phi Hóa */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1 font-serif">
            <div className="p-2 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800">
              <span className="text-paper-jade font-bold block text-[11px]">→ Phi Lộc (Duyên Lành)</span>
              <span className="font-bold text-paper-text dark:text-night-text">
                {activePhiDetail.loc.starName} nhập {activePhiDetail.loc.toPalaceName}
              </span>
            </div>
            <div className="p-2 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800">
              <span className="text-paper-gold font-bold block text-[11px]">→ Phi Quyền (Thực Quyền)</span>
              <span className="font-bold text-paper-text dark:text-night-text">
                {activePhiDetail.quyen.starName} nhập {activePhiDetail.quyen.toPalaceName}
              </span>
            </div>
            <div className="p-2 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-300 dark:border-blue-800">
              <span className="text-paper-azure font-bold block text-[11px]">→ Phi Khoa (Danh Dự)</span>
              <span className="font-bold text-paper-text dark:text-night-text">
                {activePhiDetail.khoa.starName} nhập {activePhiDetail.khoa.toPalaceName}
              </span>
            </div>
            <div className="p-2 bg-red-50/50 dark:bg-red-950/20 border border-red-300 dark:border-red-800">
              <span className="text-paper-red font-bold block text-[11px]">→ Phi Kỵ (Áp Lực / Xung)</span>
              <span className="font-bold text-paper-text dark:text-night-text">
                {activePhiDetail.ky.starName} nhập {activePhiDetail.ky.toPalaceName} (xung {activePhiDetail.ky.xungPalaceName})
              </span>
            </div>
          </div>

          <p className="text-[11px] text-paper-muted dark:text-night-muted leading-relaxed pt-1">
            {activePhiDetail.practicalAdvice}
          </p>
        </div>
      )}

      {/* Guide Note Below Grid */}
      <div className="text-center text-xs text-paper-muted dark:text-night-muted">
        <span>Nhấp vào bất kỳ ô cung nào để kích hoạt <strong>Tam Phương Tứ Chính</strong> (Nam Phái) hoặc <strong>Tứ Hóa Phi Tinh</strong> và đồng bộ phần luận giải chi tiết bên dưới.</span>
      </div>
    </div>
  );
};
