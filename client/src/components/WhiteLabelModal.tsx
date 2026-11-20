import React, { useState } from 'react';
import { IconAnTrien, IconBatQuai, IconMeanderCorner } from './OrientalIcons';

export interface MasterBrandConfig {
  brandName: string;
  sealText: string;
  contactInfo: string;
  subtitle?: string;
  logoUrl?: string;
  enabled: boolean;
}

interface WhiteLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandConfig: MasterBrandConfig;
  onSaveBrandConfig: (config: MasterBrandConfig) => void;
}

export const SealStampSVG: React.FC<{ text: string; className?: string }> = ({
  text,
  className = "w-16 h-16 sm:w-20 sm:h-20 drop-shadow-xs"
}) => {
  const chars = (text || 'MINH').trim().slice(0, 4).toUpperCase();
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
    >
      {/* Outer border (Double stone border with antique weathering) */}
      <rect
        x="4"
        y="4"
        width="92"
        height="92"
        fill="#8B1E1E"
        stroke="#5C1010"
        strokeWidth="3"
        rx="1"
      />
      <rect
        x="9"
        y="9"
        width="82"
        height="82"
        fill="none"
        stroke="#F8E5BD"
        strokeWidth="1.5"
        opacity="0.85"
      />

      {/* Seal Characters */}
      {chars.length <= 2 ? (
        <text
          x="50"
          y="64"
          fontFamily="'Noto Serif', serif"
          fontSize="34"
          fontWeight="bold"
          fill="#F8E5BD"
          textAnchor="middle"
          letterSpacing="2"
        >
          {chars}
        </text>
      ) : (
        <g fontFamily="'Noto Serif', serif" fontSize="24" fontWeight="bold" fill="#F8E5BD" textAnchor="middle">
          {/* Top row */}
          <text x="32" y="44">{chars[0]}</text>
          <text x="68" y="44">{chars[1]}</text>
          {/* Bottom row */}
          <text x="32" y="78">{chars[2]}</text>
          <text x="68" y="78">{chars[3] || ''}</text>
        </g>
      )}
    </svg>
  );
};

export const WhiteLabelModal: React.FC<WhiteLabelModalProps> = ({
  isOpen,
  onClose,
  brandConfig,
  onSaveBrandConfig
}) => {
  const [form, setForm] = useState<MasterBrandConfig>({ ...brandConfig });
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveBrandConfig(form);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn" onClick={onClose}>
      <div
        className="w-full max-w-xl bg-paper-card dark:bg-night-card border-2 border-paper-gold/80 dark:border-night-gold/80 p-5 sm:p-7 shadow-2xl relative space-y-4 rounded-none max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 4 Corner Meander Accents */}
        <IconMeanderCorner position="tl" className="absolute top-1 left-1 w-4 h-4 text-paper-gold/80" />
        <IconMeanderCorner position="tr" className="absolute top-1 right-1 w-4 h-4 text-paper-gold/80" />
        <IconMeanderCorner position="bl" className="absolute bottom-1 left-1 w-4 h-4 text-paper-gold/80" />
        <IconMeanderCorner position="br" className="absolute bottom-1 right-1 w-4 h-4 text-paper-gold/80" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-paper-border dark:border-night-border">
          <div className="flex items-center gap-2">
            <IconAnTrien className="w-5 h-5 text-paper-red dark:text-night-gold" />
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-paper-red dark:text-night-gold">
                Cài Đặt Thương Hiệu & Ấn Triện Riêng Của Thầy
              </h3>
              <p className="text-[11px] text-paper-muted dark:text-night-muted">
                Tự động thay thế tên hiệu, khắc ấn triện đỏ và thông tin liên hệ lên Thiên Bàn & Ảnh PNG xuất ra
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-paper-muted dark:text-night-muted hover:text-paper-text text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {savedNotice && (
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs">
            Đã lưu cấu hình thương hiệu thành công!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Toggle Enable */}
          <div className="flex items-center justify-between p-3 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-border dark:border-night-border">
            <div>
              <div className="font-serif font-bold text-paper-text dark:text-night-text text-sm">
                Kích Hoạt Thương Hiệu Riêng (White-Label)
              </div>
              <div className="text-[11px] text-paper-muted dark:text-night-muted">
                Khi bật, toàn bộ Thiên Bàn và File ảnh PNG xuất ra sẽ mang tên hiệu và ấn triện của bạn
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-stone-300 dark:bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#8B1E1E]"></div>
            </label>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-serif font-semibold text-paper-text dark:text-night-text mb-1">
                Tên Phái / Hiệu Danh Của Thầy:
              </label>
              <input
                type="text"
                required
                value={form.brandName}
                onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                placeholder="VD: Tử Vi Đường Minh Khang"
                className="w-full p-2 bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border rounded-none text-xs"
              />
            </div>

            <div>
              <label className="block font-serif font-semibold text-paper-text dark:text-night-text mb-1">
                Chữ Trong Con Dấu Ấn Triện (2–4 Chữ):
              </label>
              <input
                type="text"
                required
                maxLength={4}
                value={form.sealText}
                onChange={(e) => setForm({ ...form, sealText: e.target.value })}
                placeholder="VD: Minh Khang"
                className="w-full p-2 bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border rounded-none text-xs font-serif font-bold uppercase tracking-widest text-[#8B1E1E]"
              />
            </div>

            <div>
              <label className="block font-serif font-semibold text-paper-text dark:text-night-text mb-1">
                Khẩu Quyết / Dòng Phụ (Subtitle):
              </label>
              <input
                type="text"
                value={form.subtitle || ''}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="VD: Đẩu Số Toàn Thư • Khâm Thiên Môn"
                className="w-full p-2 bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border rounded-none text-xs"
              />
            </div>

            <div>
              <label className="block font-serif font-semibold text-paper-text dark:text-night-text mb-1">
                Hotline / Zalo / Thông Tin Liên Hệ:
              </label>
              <input
                type="text"
                value={form.contactInfo}
                onChange={(e) => setForm({ ...form, contactInfo: e.target.value })}
                placeholder="VD: Zalo: 0912.345.678"
                className="w-full p-2 bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border rounded-none text-xs"
              />
            </div>
          </div>

          {/* Logo / QR URL */}
          <div>
            <label className="block font-serif font-semibold text-paper-text dark:text-night-text mb-1">
              Link Ảnh Logo Hoặc Mã QR Cá Nhân (Tùy chọn):
            </label>
            <input
              type="url"
              value={form.logoUrl || ''}
              onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
              placeholder="https://example.com/qr-or-logo.png"
              className="w-full p-2 bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border rounded-none text-xs"
            />
          </div>

          {/* Live Preview Box */}
          <div className="p-3 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-gold/60 dark:border-night-gold/60">
            <div className="font-serif font-bold text-paper-red dark:text-night-gold mb-2 flex items-center justify-between">
              <span>Xem Trước Ấn Triện & Thiên Bàn:</span>
              <span className="text-[10px] text-paper-muted font-normal italic">
                {form.enabled ? 'Đang bật thương hiệu riêng' : 'Chưa bật (dùng mặc định)'}
              </span>
            </div>
            <div className="flex items-center gap-4 p-3 bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border">
              {/* Seal Stamp */}
              <div><SealStampSVG text={form.sealText || 'THẦY'} /></div>
              {/* Brand Text */}
              <div className="space-y-0.5">
                <div className="font-serif font-bold text-sm sm:text-base text-paper-red dark:text-night-gold">
                  {form.brandName || 'Tên Hiệu Thầy'}
                </div>
                <div className="text-[10px] text-paper-muted dark:text-night-muted">
                  {form.subtitle || 'Khẩu Quyết / Dòng Phụ'}
                </div>
                <div className="text-[11px] text-paper-text dark:text-night-text font-mono font-medium">
                  {form.contactInfo || 'Hotline / Zalo liên hệ'}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-paper-border dark:border-night-border">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-paper-border text-paper-muted hover:text-paper-text cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-paper-red text-white hover:bg-paper-redHover font-serif font-bold cursor-pointer shadow-xs"
            >
              Lưu & Áp Dụng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
