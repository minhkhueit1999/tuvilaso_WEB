import React from 'react';
import { ChartData } from '../types';
import { X, Calendar, User, Compass } from 'lucide-react';

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
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-paper-card dark:bg-night-card border-l border-paper-border dark:border-night-border shadow-xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-paper-border dark:border-night-border flex items-center justify-between">
            <h3 className="font-serif text-base sm:text-lg font-bold text-paper-red dark:text-night-gold flex items-center gap-2">
              <Compass className="w-5 h-5" />
              Lịch Sử Lá Số Đã Lập
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded text-paper-sub hover:text-paper-text dark:text-night-sub dark:hover:text-night-text"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {charts.length === 0 ? (
              <div className="text-center py-12 text-sm text-paper-sub dark:text-night-sub">
                Chưa có lá số nào trong lịch sử phiên này.
              </div>
            ) : (
              charts.map((item, idx) => (
                <div
                  key={item.id || idx}
                  onClick={() => {
                    onSelectChart(item);
                    onClose();
                  }}
                  className="p-3 rounded border border-paper-border dark:border-night-border bg-paper-bg dark:bg-night-bg hover:border-paper-red dark:hover:border-night-gold cursor-pointer transition-all shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-sm text-paper-text dark:text-night-text flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-paper-gold dark:text-night-gold" />
                      {item.thienBan.fullName}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-paper-red/10 text-paper-red dark:bg-night-gold/10 dark:text-night-gold font-medium">
                      {item.thienBan.gender}
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-paper-sub dark:text-night-sub space-y-0.5">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-paper-gold" />
                      <span>{item.thienBan.solarDate} ({item.thienBan.canChiYear})</span>
                    </div>
                    <div>
                      <span>Mệnh: <strong>{item.thienBan.banMenh}</strong> • Cục: <strong>{item.thienBan.cuc}</strong></span>
                    </div>
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
