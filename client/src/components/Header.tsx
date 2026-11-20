import React, { useState } from 'react';
import {
  IconBatQuai,
  IconSachCo,
  IconQuatGiay,
  IconAnTrien,
  IconNhatThuc,
  IconNguyetThuc,
  IconLaKinh,
  IconThaiCuc
} from './OrientalIcons';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenHistory: () => void;
  onOpenKnowledge: () => void;
  onOpenSamples: () => void;
  onOpenRectification?: () => void;
  onOpenRuleset?: () => void;
  onOpenCrm?: () => void;
  onOpenWhiteLabel?: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  onToggleTheme,
  onOpenHistory,
  onOpenKnowledge,
  onOpenSamples,
  onOpenRectification,
  onOpenRuleset,
  onOpenCrm,
  onOpenWhiteLabel,
  historyCount
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="border-b border-paper-border dark:border-night-border bg-paper-card/95 dark:bg-night-card/95 sticky top-0 z-40 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand with Bát Quái Woodblock Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 border border-paper-gold dark:border-night-gold flex items-center justify-center bg-paper-cardAlt dark:bg-night-cardAlt text-paper-red dark:text-night-gold transition-transform hover:rotate-45 duration-700 cursor-pointer"
            title="Tử Vi Minh Khuê - Bát Quái Đẩu Số"
          >
            <IconBatQuai className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-paper-red dark:text-night-gold leading-none">
              Tử Vi Minh Khuê
            </h1>
            <p className="text-[10px] sm:text-xs text-paper-muted dark:text-night-muted hidden sm:block tracking-wide mt-0.5">
              Lập Lá Số & Luận Đoán Đẩu Số Á Đông • Sách Mộc Bản Tống–Minh
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-xs font-medium text-paper-text dark:text-night-text">
          <button
            onClick={() => scrollTo('form-section')}
            className="px-3 py-1.5 rounded-none hover:text-paper-red dark:hover:text-night-gold hover:bg-paper-red/5 dark:hover:bg-night-gold/10 transition-colors cursor-pointer"
          >
            Lập Lá Số
          </button>
          <button
            onClick={() => scrollTo('chart-section')}
            className="px-3 py-1.5 rounded-none hover:text-paper-red dark:hover:text-night-gold hover:bg-paper-red/5 dark:hover:bg-night-gold/10 transition-colors cursor-pointer"
          >
            Lá Số & Luận Giải
          </button>
          <button
            onClick={onOpenKnowledge}
            className="px-3 py-1.5 rounded-none flex items-center gap-1.5 hover:text-paper-red dark:hover:text-night-gold hover:bg-paper-red/5 dark:hover:bg-night-gold/10 transition-colors cursor-pointer"
          >
            <IconSachCo className="w-3.5 h-3.5 text-paper-gold dark:text-night-gold" />
            <span>Kiến Thức Tử Vi</span>
          </button>
          <button
            onClick={onOpenSamples}
            className="px-3 py-1.5 rounded-none flex items-center gap-1.5 hover:text-paper-red dark:hover:text-night-gold hover:bg-paper-red/5 dark:hover:bg-night-gold/10 transition-colors text-paper-gold dark:text-night-gold font-semibold cursor-pointer"
          >
            <IconQuatGiay className="w-3.5 h-3.5" />
            <span>Kho Lá Số Mẫu</span>
          </button>
          {onOpenRectification && (
            <button
              onClick={onOpenRectification}
              className="px-3 py-1.5 rounded-none flex items-center gap-1.5 hover:text-paper-red dark:hover:text-night-gold hover:bg-paper-red/5 dark:hover:bg-night-gold/10 transition-colors cursor-pointer"
            >
              <IconLaKinh className="w-3.5 h-3.5 text-paper-red dark:text-night-gold" />
              <span>Định Giờ Sinh</span>
            </button>
          )}
          {onOpenCrm && (
            <button
              onClick={onOpenCrm}
              className="px-3 py-1.5 rounded-none flex items-center gap-1.5 hover:text-paper-red dark:hover:text-night-gold hover:bg-paper-red/5 dark:hover:bg-night-gold/10 transition-colors cursor-pointer"
            >
              <IconAnTrien className="w-3.5 h-3.5 text-paper-gold dark:text-night-gold" />
              <span>Hồ Sơ CRM</span>
            </button>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-none text-xs font-medium border border-paper-border dark:border-night-border text-paper-text dark:text-night-text hover:bg-paper-red/5 dark:hover:bg-night-gold/10 transition-colors cursor-pointer"
            title="Xem lịch sử lá số đã lập"
          >
            <IconAnTrien className="w-3.5 h-3.5 text-paper-gold dark:text-night-gold" />
            <span className="hidden sm:inline">Lịch Sử</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-none text-[10px] bg-paper-red dark:bg-night-red text-paper-bg dark:text-night-bg font-bold tabular-nums">
                {historyCount}
              </span>
            )}
          </button>

          {/* Theme Toggle (Tuyên Chỉ / Sơn Mài Huyền Dạ) */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-none border border-paper-border dark:border-night-border text-paper-text dark:text-night-text hover:bg-paper-red/5 dark:hover:bg-night-gold/10 transition-colors cursor-pointer"
            title={isDark ? 'Chuyển sang Giấy Tuyên Chỉ (Sáng)' : 'Chuyển sang Sơn Mài Huyền Dạ (Tối)'}
          >
            {isDark ? (
              <IconNhatThuc className="w-4 h-4 text-night-gold" />
            ) : (
              <IconNguyetThuc className="w-4 h-4 text-paper-gold" />
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-none border border-paper-border dark:border-night-border text-paper-text dark:text-night-text hover:bg-paper-cardAlt transition-colors cursor-pointer"
            aria-label="Menu"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {isMobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-paper-border dark:border-night-border bg-paper-card dark:bg-night-card px-4 py-3 space-y-2 text-xs animate-fadeIn">
          <button
            onClick={() => scrollTo('form-section')}
            className="block w-full text-left py-2 px-2 hover:bg-paper-cardAlt rounded-none text-paper-text dark:text-night-text"
          >
            Lập Lá Số
          </button>
          <button
            onClick={() => scrollTo('chart-section')}
            className="block w-full text-left py-2 px-2 hover:bg-paper-cardAlt rounded-none text-paper-text dark:text-night-text"
          >
            Lá Số & Luận Giải
          </button>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenKnowledge();
            }}
            className="flex items-center gap-2 w-full text-left py-2 px-2 hover:bg-paper-cardAlt rounded-none text-paper-text dark:text-night-text"
          >
            <IconSachCo className="w-4 h-4 text-paper-gold" />
            <span>Kiến Thức Tử Vi</span>
          </button>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenSamples();
            }}
            className="flex items-center gap-2 w-full text-left py-2 px-2 hover:bg-paper-cardAlt rounded-none text-paper-gold dark:text-night-gold font-semibold"
          >
            <IconQuatGiay className="w-4 h-4" />
            <span>Kho Lá Số Mẫu</span>
          </button>
          {onOpenRectification && (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenRectification();
              }}
              className="flex items-center gap-2 w-full text-left py-2 px-2 hover:bg-paper-cardAlt rounded-none text-paper-text dark:text-night-text"
            >
              <IconLaKinh className="w-4 h-4 text-paper-red" />
              <span>Định Giờ Sinh</span>
            </button>
          )}
          {onOpenCrm && (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenCrm();
              }}
              className="flex items-center gap-2 w-full text-left py-2 px-2 hover:bg-paper-cardAlt rounded-none text-paper-text dark:text-night-text"
            >
              <IconAnTrien className="w-4 h-4 text-paper-gold" />
              <span>Hồ Sơ CRM</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
