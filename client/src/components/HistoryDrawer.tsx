import React from 'react';
import { ChartData } from '../types';
import { IconAnTrien } from './OrientalIcons';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  charts: ChartData[];
  onSelectChart: (chart: ChartData) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  charts,
  onSelectChart
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-paper-card dark:bg-night-card border-l-2 border-paper-gold/80 dark:border-night-gold/80 shadow-2xl flex flex-col rounded-none">
          {/* Header */}
          <div className="p-4 border-b border-paper-border dark:border-night-border flex items-center justify-between">
            <h3 className="font-serif text-base sm:text-lg font-bold text-paper-red dark:text-night-gold flex items-center gap-2">
              <IconAnTrien className="w-5 h-5 text-paper-gold" />
              <span>Lịch Sử Lá Số Đã Lập</span>
            </h3>
            <button
              onClick={onClose}
              aria-label="Đóng"
              className="p-1 text-paper-muted hover:text-paper-text dark:text-night-muted dark:hover:text-night-text cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {charts.length === 0 ? (
              <div className="text-center py-12 text-xs text-paper-muted dark:text-night-muted font-serif">
                Chưa có lá số nào trong lịch sử.
              </div>
            ) : (
              charts.map((item, idx) => (
                <div
                  key={item.id || idx}
                  onClick={() => {
                    onSelectChart(item);
                    onClose();
                  }}
                  className="p-3 border border-paper-border dark:border-night-border bg-paper-cardAlt dark:bg-night-cardAlt hover:border-paper-gold dark:hover:border-night-gold cursor-pointer transition-all rounded-none"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-sm text-paper-red dark:text-night-gold">
                      {item.thienBan.fullName}
                    </span>
                    <span className="text-[10px] text-paper-muted font-serif">
                      {item.thienBan.gender}
                    </span>
                  </div>
                  <div className="text-[11px] text-paper-muted dark:text-night-muted mt-1 space-y-0.5">
                    <div>{item.thienBan.canChiYear} • {item.thienBan.cuc}</div>
                    <div>Sinh: {item.thienBan.solarDate} ({item.thienBan.lunarDate})</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
