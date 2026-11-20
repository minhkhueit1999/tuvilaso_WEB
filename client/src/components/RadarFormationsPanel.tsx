import React, { useState } from 'react';
import { FormationMatch, TrungPhungAlert } from '../engine/radar';
import { IconAnTrien, IconThaiCuc, IconMeanderCorner } from './OrientalIcons';
import { AlertTriangle, Sparkles, ShieldAlert, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface RadarFormationsPanelProps {
  formations?: FormationMatch[];
  trungPhungAlerts?: TrungPhungAlert[];
  onHighlightPalaces?: (palaceIds: number[]) => void;
  selectedHighlightedPalaces?: number[];
}

export const RadarFormationsPanel: React.FC<RadarFormationsPanelProps> = ({
  formations = [],
  trungPhungAlerts = [],
  onHighlightPalaces,
  selectedHighlightedPalaces = []
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'cat' | 'hung' | 'dac_biet'>('all');
  const [isExpanded, setIsExpanded] = useState(true);

  const catFormations = formations.filter(f => f.category === 'cat_cach' || (f as any).type === 'cat');
  const hungFormations = formations.filter(f => f.category === 'hung_cach' || (f as any).type === 'hung');
  const dacBietFormations = formations.filter(f => f.category === 'dac_biet' || (f as any).type === 'dac_biet');

  const filteredFormations = activeFilter === 'all'
    ? formations
    : activeFilter === 'cat'
    ? catFormations
    : activeFilter === 'hung'
    ? hungFormations
    : dacBietFormations;

  const handleFormationClick = (palaceIds: number[]) => {
    if (onHighlightPalaces) {
      onHighlightPalaces(palaceIds);
    }
  };

  return (
    <div className="bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border p-4 space-y-4 rounded-none relative">
      <IconMeanderCorner position="tl" className="absolute top-1 left-1 w-3.5 h-3.5 text-paper-gold/60" />
      <IconMeanderCorner position="tr" className="absolute top-1 right-1 w-3.5 h-3.5 text-paper-gold/60" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-paper-border/60">
        <div>
          <h3 className="font-serif text-sm font-bold text-paper-red dark:text-night-gold flex items-center gap-2">
            <IconThaiCuc className="w-4 h-4 text-paper-gold" />
            <span>Radar Quét 60+ Cách Cục & Cảnh Báo Trùng Phùng</span>
          </h3>
          <p className="text-2xs text-paper-muted dark:text-night-muted mt-0.5">
            Tự động nhận diện cấu trúc tinh hệ đắc/hãm, tương tác Tam Phương Tứ Chính và cảnh báo cát hung
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-paper-muted dark:text-night-muted hover:text-paper-red flex items-center gap-1 cursor-pointer"
        >
          <span>{isExpanded ? 'Thu gọn' : 'Mở rộng'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* 1. Trùng Phùng Alerts */}
          {trungPhungAlerts.length > 0 && (
            <div className="space-y-2">
              <span className="text-2xs font-serif font-bold uppercase tracking-wider text-paper-muted dark:text-night-muted block">
                Cảnh Báo Trùng Phùng (Đại Vận & Lưu Niên):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {trungPhungAlerts.map((alert, idx) => {
                  const severity = alert.level === 'dai_cat' || (alert as any).severity === 'cat'
                    ? 'cat'
                    : alert.level === 'canh_bao_do' || (alert as any).severity === 'hung'
                    ? 'hung'
                    : 'trung_tinh';
                  return (
                    <div
                      key={idx}
                      onClick={() => handleFormationClick(alert.palaceIds)}
                      className={`p-2.5 border text-xs cursor-pointer transition-colors ${
                        severity === 'cat'
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-500/50 hover:border-emerald-600'
                          : severity === 'hung'
                          ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-500/50 hover:border-rose-600'
                          : 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-500/50 hover:border-amber-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-serif font-bold flex items-center gap-1.5">
                          {severity === 'cat' ? (
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                          ) : severity === 'hung' ? (
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          )}
                          <span>{alert.title}</span>
                        </span>
                        <span className="text-2xs px-1.5 py-0.2 border text-paper-muted dark:text-night-muted">
                          Click soi cung
                        </span>
                      </div>
                      <p className="text-2xs text-paper-text dark:text-night-text leading-tight">
                        {alert.description || (alert as any).detail || alert.actionableAdvice}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-paper-border/60">
            <span className="text-2xs font-serif text-paper-muted dark:text-night-muted">Lọc cách cục:</span>
            {[
              { id: 'all', label: `Tất Cả (${formations.length})` },
              { id: 'cat', label: `Cát Cách (${catFormations.length})` },
              { id: 'hung', label: `Hung Cách (${hungFormations.length})` },
              { id: 'dac_biet', label: `Đặc Biệt (${dacBietFormations.length})` }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-2.5 py-1 text-2xs font-serif font-bold rounded-none cursor-pointer transition-colors ${
                  activeFilter === tab.id
                    ? 'bg-paper-red text-paper-bg dark:bg-night-red dark:text-night-bg border border-paper-red'
                    : 'border border-paper-border dark:border-night-border text-paper-muted hover:border-paper-gold'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 3. Formations Grid */}
          {filteredFormations.length === 0 ? (
            <div className="p-4 text-center text-xs text-paper-muted dark:text-night-muted">
              Không có cách cục nào thỏa mãn bộ lọc hiện tại.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {filteredFormations.map((f, idx) => {
                const isSelected = f.palaceIds.some(id => selectedHighlightedPalaces.includes(id));
                return (
                  <div
                    key={idx}
                    onClick={() => handleFormationClick(f.palaceIds)}
                    className={`p-3 border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-paper-red dark:border-night-gold bg-paper-red/5 dark:bg-night-gold/10'
                        : 'border-paper-border dark:border-night-border hover:border-paper-gold'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-serif text-xs font-bold text-paper-red dark:text-night-gold flex items-center gap-1.5">
                        <IconAnTrien className="w-3 h-3 text-paper-gold" />
                        <span>{f.name}</span>
                      </span>
                      <span className={`text-2xs px-1.5 py-0.5 border ${
                        (f.category === 'cat_cach' || (f as any).type === 'cat')
                          ? 'border-emerald-600 text-emerald-700 dark:text-emerald-300'
                          : (f.category === 'hung_cach' || (f as any).type === 'hung')
                          ? 'border-rose-600 text-rose-700 dark:text-rose-300'
                          : 'border-amber-600 text-amber-700 dark:text-amber-300'
                      }`}>
                        {(f.category === 'cat_cach' || (f as any).type === 'cat') ? 'Cát Cách' : (f.category === 'hung_cach' || (f as any).type === 'hung') ? 'Hung Cách' : 'Đặc Biệt'}
                      </span>
                    </div>
                    <p className="text-2xs text-paper-text dark:text-night-text mb-1.5 leading-snug">
                      {f.description || (f as any).meaning}
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-1 text-2xs text-paper-muted dark:text-night-muted pt-1 border-t border-paper-border/40">
                      <span>Cung: {f.palaceNames.join(' • ')}</span>
                      <span className="text-paper-gold">Nhấn để soi cung →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
