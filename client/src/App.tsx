import React, { useState, useEffect, useRef } from 'react';
import { ChartData, TuViInput } from './types';
import { Header } from './components/Header';
import { ChartForm } from './components/ChartForm';
import { ChartGrid } from './components/ChartGrid';
import { InterpretationTabs } from './components/InterpretationTabs';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ExportModal } from './components/ExportModal';
import { Download, RotateCcw, Compass, AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  // Theme state
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('tuvi_theme') === 'dark';
  });

  // Chart data state
  const [chart, setChart] = useState<ChartData | null>(null);
  const [selectedPalaceId, setSelectedPalaceId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // History state
  const [historyList, setHistoryList] = useState<ChartData[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Export modal state
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const chartMatrixRef = useRef<HTMLDivElement>(null);

  // Apply theme class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('tuvi_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('tuvi_theme', 'light');
    }
  }, [isDark]);

  // Load history from API on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/laso/history');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setHistoryList(json.data);
          }
        }
      } catch {
        // Silently ignore on initial load if server is warming up
      }
    };
    fetchHistory();
  }, []);

  const handleToggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleGenerateChart = async (input: TuViInput) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/laso/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });

      if (!res.ok) {
        let errMessage = `Lỗi máy chủ (${res.status})`;
        try {
          const errJson = await res.json();
          if (errJson.error) errMessage = errJson.error;
        } catch {
          if (res.status === 502 || res.status === 504 || res.status === 500) {
            errMessage = 'Không thể kết nối đến máy chủ Backend (Port 5000). Vui lòng đảm bảo Backend đang chạy (gõ lệnh "npm run server" hoặc "npm run dev").';
          }
        }
        throw new Error(errMessage);
      }

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || 'Lỗi khi lập lá số');
      }

      const newChart: ChartData = json.data;
      setChart(newChart);

      // Auto select Cung Mệnh
      const menhPalace = newChart.palaces.find((p) => p.isMenh);
      setSelectedPalaceId(menhPalace ? menhPalace.id : 0);

      // Update history list
      setHistoryList((prev) => [newChart, ...prev.filter((c) => c.id !== newChart.id)]);

      // Scroll to chart
      setTimeout(() => {
        document.getElementById('chart-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      let msg = err.message || 'Không thể kết nối đến máy chủ. Vui lòng thử lại.';
      if (err.name === 'SyntaxError' || msg.includes('Unexpected end of JSON')) {
        msg = 'Chưa kết nối được với Backend Server (Port 5000). Vui lòng kiểm tra Terminal đã chạy lệnh "npm run server" (hoặc "npm run dev") chưa!';
      }
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectChartFromHistory = (savedChart: ChartData) => {
    setChart(savedChart);
    const menhPalace = savedChart.palaces.find((p) => p.isMenh);
    setSelectedPalaceId(menhPalace ? menhPalace.id : 0);
    setTimeout(() => {
      document.getElementById('chart-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-paper-bg text-paper-text dark:bg-night-bg dark:text-night-text flex flex-col transition-colors duration-200">
      {/* Header */}
      <Header
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={historyList.length}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Hero Banner */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-serif font-bold text-paper-red dark:text-night-gold bg-paper-red/10 dark:bg-night-gold/10 border border-paper-red/30 dark:border-night-gold/30">
            <Compass className="w-3.5 h-3.5" />
            <span>ĐẨU SỐ TOÀN THƯ • PHI BẢN TIÊU CHUẨN</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-paper-red dark:text-night-gold">
            Lập Lá Số & Luận Đoán Tử Vi Minh Khuê
          </h2>
          <p className="text-xs sm:text-sm text-paper-sub dark:text-night-sub">
            Quy chuẩn Can Chi, Cục số, Âm Dương thuận nghịch lý, an 14 Chính Tinh & Phụ Tinh,
            Tam Phương Tứ Chính tương tác động và luận giải vận trình cuộc đời.
          </p>
        </div>

        {/* Input Form */}
        <div className="max-w-2xl mx-auto">
          <ChartForm onSubmit={handleGenerateChart} isLoading={isLoading} />
          {errorMsg && (
            <div className="mt-3 p-3 rounded bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs sm:text-sm border border-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Chart Display Section */}
        {chart && (
          <div id="chart-section" className="space-y-4 pt-4 border-t border-paper-border dark:border-night-border animate-fadeIn">
            {/* Chart Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border rounded-lg p-3 sm:px-5">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-sm sm:text-base text-paper-red dark:text-night-gold">
                  Lá Số: {chart.thienBan.fullName}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-paper-bg dark:bg-night-bg border border-paper-border text-paper-sub dark:text-night-sub">
                  {chart.thienBan.canChiYear}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExportOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-paper-red hover:bg-paper-red/90 text-white dark:bg-night-gold dark:text-night-bg dark:hover:bg-night-gold/90 transition-all cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Xuất Ảnh PNG</span>
                </button>

                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border border-paper-border dark:border-night-border text-paper-text dark:text-night-text hover:bg-paper-bg dark:hover:bg-night-bg transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Lập số khác</span>
                </button>
              </div>
            </div>

            {/* 4x4 Grid Matrix with SVG Tam Phương Tứ Chính */}
            <ChartGrid
              chart={chart}
              selectedPalaceId={selectedPalaceId}
              onSelectPalace={(id) => setSelectedPalaceId(id)}
              chartRef={chartMatrixRef}
            />

            {/* 3 Tabs Luận Giải */}
            <InterpretationTabs
              chart={chart}
              selectedPalaceId={selectedPalaceId}
              onSelectPalace={(id) => setSelectedPalaceId(id)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-paper-border dark:border-night-border bg-paper-card dark:bg-night-card py-6 text-center text-xs text-paper-sub dark:text-night-sub">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-serif font-bold text-paper-red dark:text-night-gold">
            Tử Vi Minh Khuê • Tinh Hoa Đẩu Số Á Đông
          </p>
          <p>
            Mọi luận đoán mang tính tham khảo và hướng thiện. Bản quyền © 2026.
          </p>
        </div>
      </footer>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        charts={historyList}
        onSelectChart={handleSelectChartFromHistory}
      />

      {/* Export PNG Modal */}
      {chart && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          chartElementId="tuvi-laso-matrix"
          chartName={chart.thienBan.fullName}
        />
      )}
    </div>
  );
};
