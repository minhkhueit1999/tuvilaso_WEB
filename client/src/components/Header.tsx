import React from 'react';
import { Sun, Moon, History, Compass } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  onToggleTheme,
  onOpenHistory,
  historyCount
}) => {
  return (
    <header className="border-b border-paper-border dark:border-night-border bg-paper-card dark:bg-night-card shadow-sm sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-paper-gold dark:border-night-gold flex items-center justify-center bg-paper-red/5 dark:bg-night-gold/10 text-paper-red dark:text-night-gold">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-paper-red dark:text-night-gold">
              Tử Vi Minh Khuê
            </h1>
            <p className="text-xs text-paper-sub dark:text-night-sub hidden sm:block tracking-wide">
              Huyền Học Á Đông • Lập Lá Số & Luận Đoán Đẩu Số
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs sm:text-sm font-medium border border-paper-border dark:border-night-border text-paper-text dark:text-night-text hover:bg-paper-red/5 dark:hover:bg-night-gold/10 transition-colors"
            title="Xem lịch sử lá số đã lập"
          >
            <History className="w-4 h-4 text-paper-gold dark:text-night-gold" />
            <span className="hidden sm:inline">Lịch Sử</span>
            {historyCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-paper-red text-white dark:bg-night-gold dark:text-night-bg rounded-full text-[10px] font-bold">
                {historyCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs sm:text-sm font-medium border border-paper-border dark:border-night-border text-paper-text dark:text-night-text hover:bg-paper-red/5 dark:hover:bg-night-gold/10 transition-colors"
            title={isDark ? 'Chuyển sang Giấy Dó (Sáng)' : 'Chuyển sang Huyền Đêm (Tối)'}
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-night-gold" />
                <span className="hidden md:inline">Giấy Dó</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-paper-red" />
                <span className="hidden md:inline">Huyền Đêm</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
