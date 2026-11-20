import React, { useState } from 'react';
import { ChartData } from '../types';
import { MasterBrandConfig, SealStampSVG } from './WhiteLabelModal';
import {
  IconBatQuai,
  IconThaiCuc,
  IconAnTrien,
  IconMeanderCorner
} from './OrientalIcons';
import { Printer, X, Edit3, BookOpen, Check } from 'lucide-react';

interface BookExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  chart: ChartData | null;
  brandConfig: MasterBrandConfig;
}

export const BookExportModal: React.FC<BookExportModalProps> = ({
  isOpen,
  onClose,
  chart,
  brandConfig
}) => {
  const [forewordText, setForewordText] = useState(
    'Mệnh do Thiên định, Vận do Nhân tạo. Đẩu số mộc bản lưu truyền ngàn năm giúp con người thấu hiểu thiên thời địa lợi, quy hoạch nhân sinh, hướng thiện tích đức để chuyển hóa hung nguy thành cát tường.'
  );
  const [adviceText, setAdviceText] = useState(
    'Đương số nên giữ vững tâm tính chính trực, lấy đức dày chở vật; trong các giai đoạn biến động đại vận cần tĩnh tại quan sát, tránh nôn nóng mạo hiểm.'
  );
  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen || !chart) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-paper-card dark:bg-night-card border-2 border-paper-gold/80 p-5 sm:p-7 space-y-5 rounded-none max-h-[92vh] overflow-y-auto">
        <IconMeanderCorner position="tl" className="absolute top-1.5 left-1.5 w-4 h-4 text-paper-gold" />
        <IconMeanderCorner position="tr" className="absolute top-1.5 right-1.5 w-4 h-4 text-paper-gold" />
        <IconMeanderCorner position="bl" className="absolute bottom-1.5 left-1.5 w-4 h-4 text-paper-gold" />
        <IconMeanderCorner position="br" className="absolute bottom-1.5 right-1.5 w-4 h-4 text-paper-gold" />

        {/* Modal Top Header (Screen Only) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-paper-border print:hidden">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-paper-gold" />
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-paper-red dark:text-night-gold">
                Xuất "Thiên Thư Mệnh Lý" — Sách Tử Vi Khổ A4 Cổ Tịch
              </h2>
              <p className="text-2xs text-paper-muted dark:text-night-muted">
                Chuẩn định dạng sách cổ Tống - Minh • Có thể chỉnh sửa Lời Tựa của Thầy trước khi in
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-serif font-bold text-paper-gold border border-paper-gold/60 hover:bg-paper-gold/10 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Xong sửa đổi' : 'Sửa Lời Tựa & Lời Khuyên'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-serif font-bold tracking-wider bg-paper-red text-paper-bg dark:bg-night-red dark:text-night-bg border border-paper-gold hover:opacity-90 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>IN / LƯU PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-paper-muted hover:text-paper-red cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Edit fields if isEditing */}
        {isEditing && (
          <div className="p-3 bg-paper-bg dark:bg-night-bg border border-paper-gold/60 space-y-3 print:hidden">
            <div>
              <label className="block text-2xs font-serif font-bold text-paper-red mb-1">
                Lời Tựa Của Thầy (Trang Đầu):
              </label>
              <textarea
                value={forewordText}
                onChange={(e) => setForewordText(e.target.value)}
                rows={2}
                className="w-full p-2 text-xs bg-paper-card dark:bg-night-card border border-paper-border text-paper-text dark:text-night-text rounded-none focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-2xs font-serif font-bold text-paper-red mb-1">
                Lời Khuyên Đương Số & Hóa Giải:
              </label>
              <textarea
                value={adviceText}
                onChange={(e) => setAdviceText(e.target.value)}
                rows={2}
                className="w-full p-2 text-xs bg-paper-card dark:bg-night-card border border-paper-border text-paper-text dark:text-night-text rounded-none focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Printable Classical Book Layout */}
        <div id="classical-book-print-area" className="space-y-8 p-4 sm:p-6 bg-[#FBF8F1] text-[#1F1A17] border border-[#E5D8C1]">
          {/* Cover Page */}
          <div className="text-center py-10 border-4 border-double border-[#8B1E1E] p-6 space-y-4">
            <div className="inline-block px-3 py-1 border border-[#B8860B] text-xs font-serif tracking-widest text-[#8B1E1E]">
              {brandConfig.brandName || 'TỬ VI MINH KHUÊ'}
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#8B1E1E] tracking-widest">
              THIÊN THƯ MỆNH LÝ
            </h1>
            <p className="font-serif text-xs italic tracking-widest text-[#655A50]">
              Toàn Bộ Bản Đồ Vận Mệnh • Đẩu Số Toàn Thư & Tứ Hóa Phi Tinh
            </p>

            <div className="py-4 my-4 border-y border-[#B8860B]/40 max-w-md mx-auto space-y-1 text-xs font-serif">
              <div>Đương Số: <strong className="text-base text-[#8B1E1E]">{chart.thienBan.fullName}</strong> ({chart.thienBan.gender})</div>
              <div>Sinh Ngày: <strong>{chart.thienBan.solarDate}</strong> (Âm Lịch: <strong>{chart.thienBan.lunarDate}</strong>)</div>
              <div>Giờ Sinh: <strong>{chart.thienBan.birthHour}</strong></div>
              <div>Bát Tự Năm Sinh: <strong>{chart.thienBan.canChiYear}</strong> • Bản Mệnh: <strong>{chart.thienBan.banMenh}</strong></div>
              <div>Cục: <strong>{chart.thienBan.cuc}</strong> • Thân cư: <strong>{chart.thienBan.thanCu}</strong></div>
            </div>

            {/* Seal stamp */}
            <div className="pt-2 flex justify-center">
              <SealStampSVG
                text={brandConfig.sealText || 'MINH'}
                className="w-16 h-16 drop-shadow-xs"
              />
            </div>
            <div className="text-2xs text-[#655A50] font-serif">
              Ấn Khả Chứng Thư Mệnh Bản • Bản Quyền Thuộc Về {brandConfig.brandName || 'Tử Vi Minh Khuê'}
            </div>
          </div>

          {/* Foreword section */}
          <div className="p-4 border-l-4 border-[#8B1E1E] bg-[#FFFDF9] space-y-1.5 font-serif text-xs leading-relaxed">
            <span className="font-bold text-[#8B1E1E] block">LỜI TỰA CỦA PHÁI SƯ:</span>
            <p className="italic text-[#1F1A17]">{forewordText}</p>
          </div>

          {/* 12 Palaces Condensed Academic Summary */}
          <div className="space-y-3 font-serif">
            <h3 className="text-sm font-bold text-[#8B1E1E] pb-1 border-b border-[#B8860B] uppercase tracking-wider">
              Khảo Luận 12 Cung Bổn Mệnh
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-2xs">
              {chart.palaces.map((p) => (
                <div key={p.id} className="p-2 border border-[#E5D8C1] bg-[#FFFDF9] space-y-1">
                  <div className="flex items-center justify-between border-b border-[#E5D8C1]/60 pb-0.5">
                    <span className="font-bold text-[#8B1E1E]">{p.name} ({p.branch})</span>
                    <span className="text-[#B8860B]">{p.can}</span>
                  </div>
                  <div className="text-[#8B1E1E] font-medium truncate">
                    {p.majorStars.map(s => `${s.name} (${s.brightness})`).join(', ') || 'Vô Chính Diệu'}
                  </div>
                  <div className="text-[#655A50] line-clamp-2">
                    {chart.interpretation.palaces[p.name] || 'Đắc vị bình hòa, tương sinh tương hợp.'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Teacher's Strategic Advice & Closing Seal */}
          <div className="p-4 border border-[#B8860B] bg-[#FFFDF9] space-y-2 font-serif text-xs">
            <span className="font-bold text-[#8B1E1E] block uppercase tracking-wider">
              Lời Khuyên Khai Vận & Phương Pháp Hóa Giải
            </span>
            <p className="leading-relaxed text-[#1F1A17]">{adviceText}</p>
            <div className="pt-2 flex justify-between items-end border-t border-[#E5D8C1]">
              <span className="text-2xs text-[#655A50] italic">
                Xuất bản ngày: {new Date().toLocaleDateString('vi-VN')}
              </span>
              <div className="text-right">
                <span className="text-2xs text-[#655A50] block">Chủ Trì Khâm Định:</span>
                <span className="font-bold text-xs text-[#8B1E1E]">{brandConfig.brandName || 'Tử Vi Minh Khuê'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
