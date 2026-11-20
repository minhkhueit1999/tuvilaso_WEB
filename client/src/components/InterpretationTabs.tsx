import React, { useState } from 'react';
import { ChartData, TuViSchool } from '../types';
import {
  IconSachCo,
  IconAnTrien,
  IconLaKinh,
  IconThaiCuc
} from './OrientalIcons';

interface InterpretationTabsProps {
  chart: ChartData;
  selectedPalaceId: number;
  onSelectPalace: (palaceId: number) => void;
  activeSchool?: TuViSchool;
}

export const InterpretationTabs: React.FC<InterpretationTabsProps> = ({
  chart,
  selectedPalaceId,
  onSelectPalace,
  activeSchool = 'tong_hop'
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'palaces' | 'luck'>('overview');

  const { interpretation, palaces, tamPhuongTuChinh } = chart;
  const currentPalace = palaces.find((p) => p.id === selectedPalaceId) || palaces[0];
  const relation = tamPhuongTuChinh[selectedPalaceId];
  const { aspectScores, classicPattern, khamThienMon } = interpretation;

  // 5 Aspects data
  const aspects = [
    { key: 'career', label: 'Công Danh - Sự Nghiệp', score: aspectScores?.career ?? 78, summary: aspectScores?.summary?.career, color: 'bg-paper-red dark:bg-night-red' },
    { key: 'wealth', label: 'Tài Lộc - Điền Sản', score: aspectScores?.wealth ?? 82, summary: aspectScores?.summary?.wealth, color: 'bg-[#C27803] dark:bg-amber-500' },
    { key: 'love', label: 'Tình Duyên - Hôn Nhân', score: aspectScores?.love ?? 75, summary: aspectScores?.summary?.love, color: 'bg-[#B91C1C] dark:bg-rose-500' },
    { key: 'health', label: 'Sức Khỏe - Thể Chất', score: aspectScores?.health ?? 85, summary: aspectScores?.summary?.health, color: 'bg-paper-jade dark:bg-emerald-500' },
    { key: 'fortune', label: 'Phúc Đức - Hậu Vận', score: aspectScores?.fortune ?? 80, summary: aspectScores?.summary?.fortune, color: 'bg-paper-azure dark:bg-blue-500' }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto my-5 bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border rounded-none shadow-xs overflow-hidden">
      {/* Tab Navigation Header */}
      <div className="flex border-b border-paper-border dark:border-night-border bg-paper-cardAlt dark:bg-night-cardAlt px-2 sm:px-4">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 py-3 px-3 sm:px-5 font-serif text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'border-paper-red text-paper-red dark:border-night-gold dark:text-night-gold bg-paper-card dark:bg-night-card'
              : 'border-transparent text-paper-muted dark:text-night-muted hover:text-paper-text dark:hover:text-night-text'
          }`}
        >
          <IconSachCo className="w-4 h-4 text-paper-gold dark:text-night-gold" />
          <span>Tổng Quan Mệnh Cục & 5 Phương Diện</span>
        </button>

        <button
          onClick={() => setActiveTab('palaces')}
          className={`flex items-center gap-2 py-3 px-3 sm:px-5 font-serif text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'palaces'
              ? 'border-paper-red text-paper-red dark:border-night-gold dark:text-night-gold bg-paper-card dark:bg-night-card'
              : 'border-transparent text-paper-muted dark:text-night-muted hover:text-paper-text dark:hover:text-night-text'
          }`}
        >
          <IconAnTrien className="w-4 h-4 text-paper-gold dark:text-night-gold" />
          <span>Chi Tiết 12 Cung ({currentPalace.name})</span>
        </button>

        <button
          onClick={() => setActiveTab('luck')}
          className={`flex items-center gap-2 py-3 px-3 sm:px-5 font-serif text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'luck'
              ? 'border-paper-red text-paper-red dark:border-night-gold dark:text-night-gold bg-paper-card dark:bg-night-card'
              : 'border-transparent text-paper-muted dark:text-night-muted hover:text-paper-text dark:hover:text-night-text'
          }`}
        >
          <IconLaKinh className="w-4 h-4 text-paper-gold dark:text-night-gold" />
          <span>Luận Vận Hạn Năm {chart.thienBan.viewingYear}</span>
        </button>
      </div>

      {/* Tab Body */}
      <div className="p-4 sm:p-6 text-paper-text dark:text-night-text leading-relaxed">
        {/* TAB 1: TỔNG QUAN & BIỂU ĐỒ 5 PHƯƠNG DIỆN */}
        {activeTab === 'overview' && (
          <div className="space-y-5 animate-fadeIn">
            {/* Cách cục kinh điển (Nam Phái & Tổng Hợp) */}
            {classicPattern && (
              <div className="p-3.5 bg-paper-cardAlt dark:bg-night-cardAlt border-l-3 border-paper-red dark:border-night-gold">
                <div className="flex items-center gap-2 mb-1">
                  <span className="seal-stamp text-[9px]">CÁCH CỤC</span>
                  <h4 className="font-serif font-bold text-sm sm:text-base text-paper-red dark:text-night-gold">
                    Cách Cục Nam Phái: {classicPattern.name}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-paper-muted dark:text-night-muted">
                  {classicPattern.description}
                </p>
              </div>
            )}

            {/* Mệnh Cục */}
            <div className="border-l-3 border-paper-gold dark:border-night-gold pl-3 py-1">
              <h4 className="font-serif text-sm sm:text-base font-bold text-paper-red dark:text-night-gold">
                Tương Quan Mệnh - Cục & Căn Cơ Bản Mệnh
              </h4>
              <p className="text-xs sm:text-sm mt-1 text-paper-muted dark:text-night-muted">
                {interpretation.overview.menhCuc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-border dark:border-night-border rounded-none">
                <span className="text-xs font-serif font-bold text-paper-gold dark:text-night-gold block mb-1">
                  Âm Dương & Khí Chất
                </span>
                <p className="text-xs sm:text-sm">{interpretation.overview.amDuong}</p>
              </div>

              <div className="p-3 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-border dark:border-night-border rounded-none">
                <span className="text-xs font-serif font-bold text-paper-gold dark:text-night-gold block mb-1">
                  Thân Cư & Hậu Vận (Nửa Đời Sau)
                </span>
                <p className="text-xs sm:text-sm">{interpretation.overview.thanCu}</p>
              </div>
            </div>

            {/* Khâm Thiên Môn (Bắc Phái) nếu đang ở chế độ Bắc Phái hoặc Tổng Hợp */}
            {khamThienMon && (activeSchool === 'bac_phai' || activeSchool === 'tong_hop') && (
              <div className="p-4 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-gold/60 dark:border-night-gold/60 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="seal-stamp text-[9px]">KHÂM THIÊN</span>
                  <h4 className="font-serif font-bold text-sm text-paper-red dark:text-night-gold">
                    Luận Giải Lai Nhân Cung & Tứ Hóa Thập Thiên Can
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-paper-muted dark:text-night-muted leading-relaxed">
                  {khamThienMon.laiNhanAnalysis}
                </p>
                <p className="text-xs sm:text-sm text-paper-muted dark:text-night-muted leading-relaxed">
                  {khamThienMon.sinhNienAnalysis}
                </p>
              </div>
            )}

            {/* Biểu đồ thanh điểm 5 phương diện cuộc đời */}
            <div className="p-4 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-border dark:border-night-border space-y-3">
              <h4 className="font-serif text-sm font-bold text-paper-red dark:text-night-gold flex items-center gap-2">
                <IconThaiCuc className="w-4 h-4 text-paper-gold" />
                <span>Đánh Giá Chỉ Số 5 Phương Diện Cuộc Đời (Thang Điểm 100)</span>
              </h4>

              <div className="space-y-3 pt-1">
                {aspects.map((item) => (
                  <div key={item.key} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-serif font-semibold text-paper-text dark:text-night-text">{item.label}</span>
                      <span className="font-bold tabular-nums text-paper-red dark:text-night-gold">{item.score}/100</span>
                    </div>
                    <div className="w-full bg-paper-border/60 dark:bg-night-border/80 h-2 rounded-none overflow-hidden">
                      <div
                        className={`${item.color} h-2 rounded-none transition-all duration-700`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                    {item.summary && (
                      <p className="text-[11px] text-paper-muted dark:text-night-muted italic pl-1">
                        • {item.summary}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Điểm mạnh & Điểm cần lưu tâm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800">
                <h5 className="font-serif text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-300 mb-2">
                  Điểm Mạnh Bản Mệnh
                </h5>
                <ul className="space-y-1.5 text-xs text-emerald-900 dark:text-emerald-200">
                  {interpretation.overview.strengths?.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span>{s}</span>
                    </li>
                  )) || <li>Tư duy linh hoạt, thích ứng tốt với thời thế.</li>}
                </ul>
              </div>

              <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800">
                <h5 className="font-serif text-xs sm:text-sm font-bold text-amber-800 dark:text-amber-300 mb-2">
                  Điểm Cần Lưu Tâm
                </h5>
                <ul className="space-y-1.5 text-xs text-amber-900 dark:text-amber-200">
                  {interpretation.overview.considerations?.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-700 font-bold">•</span>
                      <span>{c}</span>
                    </li>
                  )) || <li>Cần kiên nhẫn tích lũy nội lực trước khi mở rộng.</li>}
                </ul>
              </div>
            </div>

            {/* Đánh giá cốt cách */}
            <div className="p-4 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-gold/40 dark:border-night-gold/40">
              <h5 className="font-serif text-xs sm:text-sm font-bold text-paper-red dark:text-night-gold mb-1.5">
                Đánh Giá Tổng Thể
              </h5>
              <p className="text-xs sm:text-sm leading-relaxed">{interpretation.overview.generalAssessment}</p>
            </div>
          </div>
        )}

        {/* TAB 2: CHI TIẾT 12 CUNG */}
        {activeTab === 'palaces' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Quick 12 Palaces Switcher */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-paper-border/60">
              {palaces.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectPalace(p.id)}
                  className={`px-3 py-1.5 text-xs font-serif whitespace-nowrap transition-colors cursor-pointer border rounded-none ${
                    p.id === selectedPalaceId
                      ? 'bg-paper-red text-paper-bg dark:bg-night-red dark:text-night-bg font-bold border-paper-redHover'
                      : 'bg-paper-cardAlt dark:bg-night-cardAlt border-paper-border text-paper-muted hover:text-paper-text hover:border-paper-gold'
                  }`}
                >
                  {p.name} ({p.branch})
                </button>
              ))}
            </div>

            {/* Selected Palace Card */}
            <div className="p-4 sm:p-5 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-border">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-paper-border/60">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-base sm:text-lg font-bold text-paper-red dark:text-night-gold">
                    Cung {currentPalace.name} tại {currentPalace.branch}
                  </span>
                  <span className="text-xs text-paper-muted px-2 py-0.5 bg-paper-card dark:bg-night-card border border-paper-border font-serif">
                    Can {currentPalace.can} • {currentPalace.branchYinYangElement}
                  </span>
                  {currentPalace.isMenh && (
                    <span className="seal-stamp text-[9px]">MỆNH</span>
                  )}
                  {currentPalace.isThan && (
                    <span className="seal-stamp text-[9px]">THÂN</span>
                  )}
                  {currentPalace.isLaiNhan && (
                    <span className="seal-stamp text-[9px]">LAI NHÂN</span>
                  )}
                </div>

                {/* Tam Phương Tứ Chính quick jump buttons */}
                {relation && (
                  <div className="flex items-center gap-1.5 text-xs font-serif">
                    <span className="text-paper-muted">Hội chiếu:</span>
                    <button
                      onClick={() => onSelectPalace(relation.xungChieu)}
                      className="px-2 py-0.5 bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300 font-semibold border border-red-300 hover:border-red-500 cursor-pointer"
                    >
                      Xung: {palaces.find(p => p.id === relation.xungChieu)?.name}
                    </button>
                    <button
                      onClick={() => onSelectPalace(relation.tamHop[0])}
                      className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-semibold border border-amber-300 hover:border-amber-500 cursor-pointer"
                    >
                      Hợp: {palaces.find(p => p.id === relation.tamHop[0])?.name}
                    </button>
                    <button
                      onClick={() => onSelectPalace(relation.tamHop[1])}
                      className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-semibold border border-amber-300 hover:border-amber-500 cursor-pointer"
                    >
                      Hợp: {palaces.find(p => p.id === relation.tamHop[1])?.name}
                    </button>
                  </div>
                )}
              </div>

              {/* Interpretation body */}
              <div className="text-xs sm:text-sm space-y-3 leading-relaxed">
                <p>{interpretation.palaces[currentPalace.name] || 'Đang cập nhật phân tích cung...'}</p>
              </div>

              {/* Stars Breakdown */}
              <div className="mt-4 pt-3 border-t border-paper-border/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-paper-card dark:bg-night-card border border-paper-border">
                  <span className="font-serif font-bold text-paper-jade dark:text-emerald-400 block mb-1.5">
                    Cát Tinh Trợ Mệnh ({currentPalace.catStars.length})
                  </span>
                  <div className="flex flex-wrap gap-1 text-[11px]">
                    {currentPalace.catStars.map((s) => (
                      <span key={s.name} className="px-1.5 py-0.5 bg-paper-bg dark:bg-night-bg border border-paper-border text-paper-text">
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-paper-card dark:bg-night-card border border-paper-border">
                  <span className="font-serif font-bold text-paper-red dark:text-red-400 block mb-1.5">
                    Sát Tinh & Sao Lưu ({currentPalace.satStars.length})
                  </span>
                  <div className="flex flex-wrap gap-1 text-[11px]">
                    {currentPalace.satStars.map((s) => (
                      <span key={s.name} className="px-1.5 py-0.5 bg-paper-bg dark:bg-night-bg border border-paper-border text-paper-red dark:text-red-300">
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: VẬN HẠN NĂM XEM */}
        {activeTab === 'luck' && (
          <div className="space-y-4 animate-fadeIn">
            {/* THỂ: Đại Vận 10 Năm */}
            <div className="p-4 sm:p-5 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-border">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-paper-border/60 dark:border-night-border/60">
                <div className="flex items-center gap-2">
                  <span className="seal-stamp text-[9px] border-paper-gold text-paper-gold">THỂ</span>
                  <h4 className="font-serif text-sm sm:text-base font-bold text-paper-red dark:text-night-gold">
                    Đại Vận 10 Năm ({chart.vanHan?.dvStartAge || ''} - {chart.vanHan?.dvEndAge || ''} tuổi)
                  </h4>
                </div>
                <div className="flex items-center gap-2 text-xs font-serif text-paper-muted dark:text-night-muted">
                  <span>{chart.vanHan?.dvDirectionLabel}</span>
                  {chart.vanHan?.isDongHan && (
                    <span className="text-amber-700 dark:text-amber-300 font-bold">
                      [Đồng Hạn tại {chart.vanHan.dongHanPalaceName}]
                    </span>
                  )}
                </div>
              </div>

              {chart.vanHan && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-xs bg-paper-card dark:bg-night-card p-2.5 border border-paper-border/60 dark:border-night-border/60">
                  <div>
                    <span className="text-paper-muted dark:text-night-muted block">Gốc ĐV.MỆNH:</span>
                    <strong className="font-serif text-paper-red dark:text-night-gold">
                      {chart.vanHan.dvPalaceName} ({chart.vanHan.dvCan})
                    </strong>
                  </div>
                  <div>
                    <span className="text-paper-muted dark:text-night-muted block">ĐV.Hóa Lộc:</span>
                    <strong className="text-green-700 dark:text-green-400 font-serif">{chart.vanHan.dvTuHoa.loc}</strong>
                  </div>
                  <div>
                    <span className="text-paper-muted dark:text-night-muted block">ĐV.Hóa Quyền:</span>
                    <strong className="text-blue-700 dark:text-blue-400 font-serif">{chart.vanHan.dvTuHoa.quyen}</strong>
                  </div>
                  <div>
                    <span className="text-paper-muted dark:text-night-muted block">ĐV.Hóa Kỵ:</span>
                    <strong className="text-red-700 dark:text-red-400 font-serif">{chart.vanHan.dvTuHoa.ky}</strong>
                  </div>
                </div>
              )}

              <p className="text-xs sm:text-sm text-paper-text dark:text-night-text leading-relaxed">
                {interpretation.luckFortune.currentDecade}
              </p>
            </div>

            {/* DỤNG: Năm Xem Hạn & Chồng Cung Tam Bàn Hợp Nhất */}
            <div className="p-4 sm:p-5 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-border">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-paper-border/60 dark:border-night-border/60">
                <div className="flex items-center gap-2">
                  <span className="seal-stamp text-[9px] border-paper-red text-paper-red">DỤNG</span>
                  <h4 className="font-serif text-sm sm:text-base font-bold text-paper-red dark:text-night-gold">
                    Tam Bàn Hợp Nhất & Tọa Độ Vận Hạn Năm {chart.thienBan.viewingYear}
                  </h4>
                </div>
                <div className="text-xs font-serif text-paper-muted dark:text-night-muted">
                  {chart.vanHan?.age ? `Đương số: ${chart.vanHan.age} tuổi` : ''}
                </div>
              </div>

              {chart.vanHan && (
                <>
                  {/* 3 Tọa độ then chốt */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3 text-xs">
                    <div className="bg-paper-card dark:bg-night-card p-2 border border-red-500/30">
                      <span className="text-paper-muted dark:text-night-muted block text-[11px]">1. Lưu Đại Hạn (10 năm ziczac):</span>
                      <strong className="font-serif text-paper-red text-sm">{chart.vanHan.ldhPalaceName}</strong>
                    </div>
                    <div className="bg-paper-card dark:bg-night-card p-2 border border-amber-500/30">
                      <span className="text-paper-muted dark:text-night-muted block text-[11px]">2. Tiểu Hạn (Tam Hợp Khởi Cung):</span>
                      <strong className="font-serif text-amber-700 dark:text-amber-300 text-sm">{chart.vanHan.tieuHanPalaceName}</strong>
                    </div>
                    <div className="bg-paper-card dark:bg-night-card p-2 border border-blue-500/30">
                      <span className="text-paper-muted dark:text-night-muted block text-[11px]">3. Lưu Thái Tuế (LN.MỆNH):</span>
                      <strong className="font-serif text-blue-700 dark:text-blue-400 text-sm">
                        {chart.vanHan.lnPalaceName} ({chart.vanHan.lnCan})
                      </strong>
                    </div>
                  </div>

                  {/* Chồng Cung (Tam Bàn Hợp Nhất) */}
                  {chart.vanHan.chongCung && (
                    <div className="mb-3 p-2.5 bg-paper-card dark:bg-night-card border border-paper-gold/40 text-xs">
                      <span className="font-serif font-bold text-paper-red dark:text-night-gold block mb-1">
                        Chồng Cung (Tam Bàn Chiếu Rọi):
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] mb-2 font-serif">
                        <div>ĐV.Mệnh trên Mệnh Bàn: <strong>{chart.vanHan.chongCung.dvMenhOnBanMenh}</strong></div>
                        <div>Lưu Đ.Hạn trên Mệnh Bàn: <strong>{chart.vanHan.chongCung.ldhOnBanMenh}</strong></div>
                        <div>Tiểu Hạn trên Mệnh Bàn: <strong>{chart.vanHan.chongCung.tieuHanOnBanMenh}</strong></div>
                        <div>Lưu Thái Tuế trên Mệnh Bàn: <strong>{chart.vanHan.chongCung.lnMenhOnBanMenh}</strong></div>
                      </div>
                      {chart.vanHan.chongCung.relationships.length > 0 && (
                        <div className="space-y-0.5 pt-1.5 border-t border-paper-border/60 text-[11px] text-paper-text/90 dark:text-night-text/90">
                          {chart.vanHan.chongCung.relationships.map((rel, rIdx) => (
                            <div key={rIdx} className="flex items-center gap-1.5">
                              <span className="text-paper-red">•</span>
                              <span>{rel}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Lưu Niên Tứ Hóa */}
                  <div className="grid grid-cols-4 gap-1 sm:gap-2 mb-3 text-xs bg-paper-card dark:bg-night-card p-2 border border-paper-border/60">
                    <div>
                      <span className="text-paper-muted dark:text-night-muted block text-[10px]">L.Hóa Lộc:</span>
                      <strong className="text-green-700 dark:text-green-400 font-serif">{chart.vanHan.lnTuHoa.loc}</strong>
                    </div>
                    <div>
                      <span className="text-paper-muted dark:text-night-muted block text-[10px]">L.Hóa Quyền:</span>
                      <strong className="text-blue-700 dark:text-blue-400 font-serif">{chart.vanHan.lnTuHoa.quyen}</strong>
                    </div>
                    <div>
                      <span className="text-paper-muted dark:text-night-muted block text-[10px]">L.Hóa Khoa:</span>
                      <strong className="text-amber-700 dark:text-amber-300 font-serif">{chart.vanHan.lnTuHoa.khoa}</strong>
                    </div>
                    <div>
                      <span className="text-paper-muted dark:text-night-muted block text-[10px]">L.Hóa Kỵ:</span>
                      <strong className="text-red-700 dark:text-red-400 font-serif">{chart.vanHan.lnTuHoa.ky}</strong>
                    </div>
                  </div>
                </>
              )}

              <p className="text-xs sm:text-sm text-paper-text dark:text-night-text leading-relaxed">
                {interpretation.luckFortune.currentYear}
              </p>
            </div>

            {/* ỨNG KỲ: 12 Tháng Lưu Nguyệt */}
            {chart.vanHan?.luuNguyetTable && chart.vanHan.luuNguyetTable.length > 0 && (
              <div className="p-4 sm:p-5 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-border">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-paper-border/60 dark:border-night-border/60">
                  <div className="flex items-center gap-2">
                    <span className="seal-stamp text-[9px] border-paper-jade text-paper-jade">ỨNG KỲ</span>
                    <h4 className="font-serif text-sm sm:text-base font-bold text-paper-red dark:text-night-gold">
                      12 Tháng Lưu Nguyệt Năm {chart.thienBan.viewingYear}
                    </h4>
                  </div>
                  <span className="text-[11px] font-serif text-paper-muted dark:text-night-muted">
                    Phương pháp: {chart.vanHan.luuNguyetMethod === 'thai_tue' ? 'Lưu Thái Tuế' : 'Tiểu Hạn'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
                  {chart.vanHan.luuNguyetTable.map(m => (
                    <div
                      key={m.month}
                      className="bg-paper-card dark:bg-night-card p-2 border border-paper-border/60 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between border-b border-paper-border/40 pb-1 mb-1">
                          <strong className="font-serif text-paper-red dark:text-night-gold">
                            Tháng {m.month}
                          </strong>
                          <span className="text-[10px] text-paper-muted dark:text-night-muted font-serif">
                            {m.can} {m.branch}
                          </span>
                        </div>
                        <div className="font-serif text-[11px] text-paper-text dark:text-night-text">
                          {m.palaceName}
                        </div>
                        <div className="text-[10px] text-paper-muted dark:text-night-muted truncate mt-0.5">
                          {m.majorStars.length > 0 ? m.majorStars.join(', ') : 'Vô Chính Diệu'}
                        </div>
                      </div>
                      <div className="mt-1 pt-1 border-t border-paper-border/40 text-[10px] font-serif italic text-paper-gold dark:text-night-gold">
                        {m.assessment}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lời khuyên tu dưỡng */}
            <div className="p-4 sm:p-5 bg-paper-cardAlt dark:bg-night-cardAlt border-l-3 border-paper-gold dark:border-night-gold">
              <h4 className="font-serif text-xs sm:text-sm font-bold text-paper-gold dark:text-night-gold mb-1">
                Lời Khuyên Thời Vận & Tu Dưỡng
              </h4>
              <p className="text-xs sm:text-sm italic leading-relaxed">{interpretation.luckFortune.advice}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
