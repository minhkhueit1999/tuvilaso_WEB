import React from 'react';
import {
  IconAnTrien,
  IconLaKinh,
  IconButLong,
  IconThaiCuc,
  IconKhaiAn
} from './OrientalIcons';

interface MasterToolbarProps {
  isPrivacyMode: boolean;
  onTogglePrivacy: () => void;
  isWhiteboardActive: boolean;
  onToggleWhiteboard: () => void;
  onOpenRuleset: () => void;
  onOpenCrm: () => void;
  onOpenWhiteLabel: () => void;
  onSaveCurrentToCrm: () => void;
  onOpenRectification: () => void;
}

export const MasterToolbar: React.FC<MasterToolbarProps> = ({
  isPrivacyMode,
  onTogglePrivacy,
  isWhiteboardActive,
  onToggleWhiteboard,
  onOpenRuleset,
  onOpenCrm,
  onOpenWhiteLabel,
  onSaveCurrentToCrm,
  onOpenRectification
}) => {
  return (
    <aside
      aria-label="Thanh công cụ Thầy Tử Vi"
      className="bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border rounded-none p-2 sm:px-4 shadow-xs"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Left: Studio Branding Badge */}
        <div className="flex items-center gap-2 pr-2 border-r border-paper-border dark:border-night-border">
          <div className="w-5 h-5 flex items-center justify-center border border-paper-red dark:border-night-gold text-paper-red dark:text-night-gold bg-paper-red/5">
            <IconAnTrien className="w-3.5 h-3.5" />
          </div>
          <span className="font-serif font-bold text-xs uppercase tracking-wider text-paper-red dark:text-night-gold">
            Master's Studio
          </span>
        </div>

        {/* Action Buttons Group */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Privacy Masking Mode */}
          <button
            type="button"
            onClick={onTogglePrivacy}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-serif transition-colors cursor-pointer border ${
              isPrivacyMode
                ? 'bg-paper-red text-white border-paper-red dark:bg-night-red dark:text-night-bg font-bold'
                : 'border-paper-border dark:border-night-border text-paper-text dark:text-night-text hover:bg-paper-cardAlt'
            }`}
            title="Ẩn tên và ngày sinh khách hàng khi livestream hoặc chia sẻ màn hình"
          >
            <span className="text-[11px] font-mono">{isPrivacyMode ? '●' : '○'}</span>
            <span>{isPrivacyMode ? 'Ẩn Danh (Đang Bật)' : 'Chế Độ Ẩn Danh'}</span>
          </button>

          {/* Live Whiteboard Canvas */}
          <button
            type="button"
            onClick={onToggleWhiteboard}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-serif transition-colors cursor-pointer border ${
              isWhiteboardActive
                ? 'bg-paper-gold/20 text-paper-red dark:text-night-gold border-paper-gold font-bold'
                : 'border-paper-border dark:border-night-border text-paper-text dark:text-night-text hover:bg-paper-cardAlt'
            }`}
            title="Vẽ tự do, khoanh sao, kẻ đường Phi Hóa trực tiếp trên lá số"
          >
            <IconButLong className="w-3.5 h-3.5 text-paper-red dark:text-night-gold" />
            <span>{isWhiteboardActive ? 'Đang Vẽ' : 'Họa Bút'}</span>
          </button>

          {/* Smart Rectification */}
          <button
            type="button"
            onClick={onOpenRectification}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-serif border border-paper-border dark:border-night-border text-paper-text dark:text-night-text hover:bg-paper-cardAlt transition-colors cursor-pointer"
            title="Đối chiếu 3 lá số giờ liền kề & 8 tiêu chí kiểm chứng"
          >
            <IconLaKinh className="w-3.5 h-3.5 text-paper-gold dark:text-night-gold" />
            <span>Định Giờ Sinh</span>
          </button>

          {/* Custom Ruleset Drawer */}
          <button
            type="button"
            onClick={onOpenRuleset}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-serif border border-paper-border dark:border-night-border text-paper-text dark:text-night-text hover:bg-paper-cardAlt transition-colors cursor-pointer"
            title="Tùy biến Tứ Hóa Canh/Nhâm/Mậu, Vãn Tý 23h, Tháng Nhuận, Tiết Khí"
          >
            <IconThaiCuc className="w-3.5 h-3.5 text-paper-red dark:text-night-gold" />
            <span>Phái Luật</span>
          </button>

          {/* CRM Hồ Sơ Khách */}
          <button
            type="button"
            onClick={onOpenCrm}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-serif border border-paper-border dark:border-night-border text-paper-text dark:text-night-text hover:bg-paper-cardAlt transition-colors cursor-pointer"
            title="Quản lý danh sách khách hàng, nhật ký nghiệm lý sự kiện theo năm"
          >
            <IconKhaiAn className="w-3.5 h-3.5 text-paper-gold dark:text-night-gold" />
            <span>Hồ Sơ CRM</span>
          </button>

          {/* Quick Save Current to CRM */}
          <button
            type="button"
            onClick={onSaveCurrentToCrm}
            className="flex items-center gap-1.5 px-2 py-1 text-xs font-serif border border-paper-gold/60 dark:border-night-gold/60 text-paper-red dark:text-night-gold hover:bg-paper-gold/10 transition-colors cursor-pointer"
            title="Lưu nhanh lá số đang xem vào danh bạ khách hàng"
          >
            <span>+ Lưu CRM</span>
          </button>

          {/* White-Label Brand & Seal */}
          <button
            type="button"
            onClick={onOpenWhiteLabel}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-serif border border-paper-border dark:border-night-border text-paper-text dark:text-night-text hover:bg-paper-cardAlt transition-colors cursor-pointer"
            title="Khắc ấn triện đỏ Chu Sa và hiệu danh Thầy Tử Vi lên Thiên Bàn"
          >
            <IconAnTrien className="w-3.5 h-3.5 text-paper-red dark:text-night-gold" />
            <span>Ấn Triện Riêng</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
