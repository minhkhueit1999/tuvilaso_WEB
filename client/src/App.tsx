import React, { useState, useEffect, useRef } from 'react';
import { ChartData, TuViInput, TuViSchool, TuViRuleset } from './types';
import { Header } from './components/Header';
import { ChartForm } from './components/ChartForm';
import { ChartGrid } from './components/ChartGrid';
import { SchoolSwitcher } from './components/SchoolSwitcher';
import { InterpretationTabs } from './components/InterpretationTabs';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ExportModal } from './components/ExportModal';
import { KnowledgeModal } from './components/KnowledgeModal';
import { SampleChartsModal } from './components/SampleChartsModal';
import { TuViAssistant } from './components/TuViAssistant';
import { MasterToolbar } from './components/MasterToolbar';
import { CustomRulesetDrawer } from './components/CustomRulesetDrawer';
import { CrmClientDrawer } from './components/CrmClientDrawer';
import { WhiteLabelModal, MasterBrandConfig } from './components/WhiteLabelModal';
import { BirthHourRectification } from './components/BirthHourRectification';
import { generateTuViChart } from './engine';
import { safeJsonFetch } from './utils/api';
import { Download, RotateCcw, AlertCircle } from 'lucide-react';
import { IconThaiCuc } from './components/OrientalIcons';

const DEFAULT_INPUT: TuViInput = {
  fullName: 'Tống Minh Khuê',
  gender: 'male',
  calendarType: 'solar',
  isLeapMonth: false,
  day: 28,
  month: 10,
  year: 1999,
  hour: 7,
  minute: 30,
  viewingYear: 2026,
  school: 'tong_hop',
  showTamPhuongTuChinh: true,
  showLuuNien: true
};

const DEFAULT_RULESET: TuViRuleset = {
  canhVariant: 'vn_standard',
  nhamVariant: 'vn_standard',
  mauVariant: 'vn_standard',
  ziHourMode: 'keep_current_day',
  leapMonthMode: 'split_day_15',
  yearBoundaryMode: 'lunar_new_year',
  khoiVietVariant: 'vn_standard'
};

const DEFAULT_BRAND: MasterBrandConfig = {
  brandName: 'Tử Vi Minh Khuê',
  sealText: 'MINH',
  contactInfo: 'tuvi.minhkhue@gmail.com',
  subtitle: 'Tinh Hoa Đẩu Số Á Đông',
  enabled: true
};

export const App: React.FC = () => {
  // Theme state
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('tuvi_theme') === 'dark';
  });

  // Navigation View State ('chart' | 'rectification')
  const [currentView, setCurrentView] = useState<'chart' | 'rectification'>('chart');

  // Chart data state
  const [chart, setChart] = useState<ChartData | null>(null);
  const [selectedPalaceId, setSelectedPalaceId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentSchool, setCurrentSchool] = useState<TuViSchool>('tong_hop');
  const [lastInput, setLastInput] = useState<TuViInput | null>(null);

  // Master's Studio State
  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(false);
  const [isWhiteboardActive, setIsWhiteboardActive] = useState<boolean>(false);
  const [isRulesetOpen, setIsRulesetOpen] = useState<boolean>(false);
  const [isCrmOpen, setIsCrmOpen] = useState<boolean>(false);
  const [isWhiteLabelOpen, setIsWhiteLabelOpen] = useState<boolean>(false);

  // Persistent Custom Ruleset & Brand
  const [ruleset, setRuleset] = useState<TuViRuleset>(() => {
    try {
      const saved = localStorage.getItem('tuvi_custom_ruleset');
      return saved ? JSON.parse(saved) : DEFAULT_RULESET;
    } catch {
      return DEFAULT_RULESET;
    }
  });

  const [brandConfig, setBrandConfig] = useState<MasterBrandConfig>(() => {
    try {
      const saved = localStorage.getItem('tuvi_master_brand');
      return saved ? JSON.parse(saved) : DEFAULT_BRAND;
    } catch {
      return DEFAULT_BRAND;
    }
  });

  // History state
  const [historyList, setHistoryList] = useState<ChartData[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Knowledge & Samples modals state
  const [isKnowledgeOpen, setIsKnowledgeOpen] = useState<boolean>(false);
  const [isSamplesOpen, setIsSamplesOpen] = useState<boolean>(false);

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

  // Load history from API or localStorage on mount (Safe fetch)
  useEffect(() => {
    const fetchHistory = async () => {
      let loadedFromApi = false;
      const res = await safeJsonFetch<{ success: boolean; data: ChartData[] }>('/api/laso/history');
      if (res.ok && res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setHistoryList(res.data.data);
        loadedFromApi = true;
      }

      if (!loadedFromApi) {
        try {
          const localSaved = JSON.parse(localStorage.getItem('tuvi_local_history') || '[]');
          if (Array.isArray(localSaved) && localSaved.length > 0) {
            setHistoryList(localSaved);
          }
        } catch {}
      }
    };
    fetchHistory();
  }, []);

  const handleToggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleSaveRuleset = (newRuleset: TuViRuleset) => {
    setRuleset(newRuleset);
    try {
      localStorage.setItem('tuvi_custom_ruleset', JSON.stringify(newRuleset));
    } catch {}
    // Re-calculate active chart with new ruleset if available
    const inputToUse = lastInput || DEFAULT_INPUT;
    handleGenerateChart({ ...inputToUse, ruleset: newRuleset });
  };

  const handleSaveBrandConfig = (newBrand: MasterBrandConfig) => {
    setBrandConfig(newBrand);
    try {
      localStorage.setItem('tuvi_master_brand', JSON.stringify(newBrand));
    } catch {}
    // Also sync to server in background if available
    safeJsonFetch('/api/crm/brand', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBrand)
    }).catch(() => {});
  };

  const handleGenerateChart = async (input: TuViInput) => {
    setIsLoading(true);
    setErrorMsg(null);
    const enrichedInput: TuViInput = {
      ...input,
      school: input.school || currentSchool,
      ruleset: input.ruleset || ruleset
    };
    setLastInput(enrichedInput);
    if (enrichedInput.school) {
      setCurrentSchool(enrichedInput.school);
    }
    let newChart: ChartData | null = null;

    try {
      // 1. Attempt safe fetch from backend REST API
      const res = await safeJsonFetch<{ success: boolean; data: ChartData }>('/api/laso/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enrichedInput)
      });

      if (res.ok && res.data?.success && res.data?.data) {
        newChart = res.data.data;
      }

      // 2. Seamless in-browser fallback if backend is offline or returned empty
      if (!newChart) {
        newChart = generateTuViChart(enrichedInput);
      }

      setChart(newChart);

      // Auto select Cung Mệnh
      const menhPalace = newChart.palaces.find((p) => p.isMenh);
      setSelectedPalaceId(menhPalace ? menhPalace.id : 0);

      // Update history list in state
      setHistoryList((prev) => [newChart!, ...prev.filter((c) => c.id !== newChart!.id)]);

      // Save to localStorage for persistent local history
      try {
        const localSaved = JSON.parse(localStorage.getItem('tuvi_local_history') || '[]');
        const updatedHistory = [newChart!, ...localSaved.filter((c: any) => c.id !== newChart!.id)].slice(0, 30);
        localStorage.setItem('tuvi_local_history', JSON.stringify(updatedHistory));
      } catch {}

      // Scroll to chart
      setTimeout(() => {
        document.getElementById('chart-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error('Fatal calculation error:', err);
      // Emergency in-browser fallback
      try {
        newChart = generateTuViChart(enrichedInput);
        setChart(newChart);
      } catch {
        setErrorMsg('Có lỗi xảy ra khi tính toán lá số. Vui lòng kiểm tra lại thông tin ngày giờ sinh.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSchool = (newSchool: TuViSchool) => {
    setCurrentSchool(newSchool);
    const inputToUse = lastInput || DEFAULT_INPUT;
    handleGenerateChart({ ...inputToUse, school: newSchool });
  };

  const handleSelectChartFromHistory = (savedChart: ChartData) => {
    setChart(savedChart);
    setCurrentView('chart');
    const menhPalace = savedChart.palaces.find((p) => p.isMenh);
    setSelectedPalaceId(menhPalace ? menhPalace.id : 0);
    setTimeout(() => {
      document.getElementById('chart-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleQuickSaveToCrm = async () => {
    if (!chart) return;
    try {
      const record = {
        fullName: chart.thienBan.fullName,
        gender: chart.thienBan.gender === 'Nữ' ? 'female' : 'male',
        birthDate: chart.thienBan.solarDate,
        lunarDate: chart.thienBan.lunarDate,
        birthHour: chart.thienBan.birthHour,
        tags: ['Khách Vãng Lai'],
        notes: `Lập ngày ${new Date().toLocaleDateString('vi-VN')}`,
        verificationLogs: [],
        chartData: chart
      };

      await safeJsonFetch('/api/crm/charts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });

      // Also persist to localStorage fallback
      try {
        const local = JSON.parse(localStorage.getItem('tuvi_crm_clients') || '[]');
        const updated = [{ ...record, id: `crm_${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...local];
        localStorage.setItem('tuvi_crm_clients', JSON.stringify(updated));
      } catch {}

      setIsCrmOpen(true);
    } catch {}
  };

  const selectedPalace = chart?.palaces.find((p) => p.id === selectedPalaceId);

  return (
    <div className="min-h-screen bg-paper-bg text-paper-text dark:bg-night-bg dark:text-night-text flex flex-col transition-colors duration-200">
      {/* Header */}
      <Header
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenKnowledge={() => setIsKnowledgeOpen(true)}
        onOpenSamples={() => setIsSamplesOpen(true)}
        onOpenRectification={() => setCurrentView('rectification')}
        onOpenRuleset={() => setIsRulesetOpen(true)}
        onOpenCrm={() => setIsCrmOpen(true)}
        onOpenWhiteLabel={() => setIsWhiteLabelOpen(true)}
        historyCount={historyList.length}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {currentView === 'rectification' ? (
          /* View: Định Giờ Sinh Thông Minh */
          <BirthHourRectification
            initialInput={lastInput || DEFAULT_INPUT}
            onSelectFinalHour={(selectedChart) => {
              setChart(selectedChart);
              setCurrentView('chart');
              const menhPalace = selectedChart.palaces.find((p) => p.isMenh);
              setSelectedPalaceId(menhPalace ? menhPalace.id : 0);
              setTimeout(() => {
                document.getElementById('chart-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            onClose={() => setCurrentView('chart')}
          />
        ) : (
          /* View: Lập Lá Số & Luận Đoán Tiêu Chuẩn */
          <>
            {/* Hero Banner */}
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none text-xs font-serif font-bold text-paper-red dark:text-night-gold bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-red/30 dark:border-night-gold/30">
                <IconThaiCuc className="w-3.5 h-3.5" />
                <span>ĐẨU SỐ TOÀN THƯ • KHÂM THIÊN BẮC PHÁI & NAM PHÁI</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-paper-red dark:text-night-gold">
                {brandConfig.enabled && brandConfig.brandName
                  ? brandConfig.brandName
                  : 'Tử Vi Minh Khuê'} — Lập Lá Số & Luận Đoán
              </h2>
              <p className="text-xs sm:text-sm text-paper-muted dark:text-night-muted">
                Quy chuẩn Can Chi Bát Tự, Ngũ Hành Nạp Âm, Cục số, Âm Dương thuận nghịch lý, an 110+ Tinh Diệu,
                Tam Phương Tứ Chính, Tứ Hóa Phi Tinh và Master's Studio cho giới Thầy Tử Vi.
              </p>
            </div>

            {/* Input Form */}
            <div id="form-section" className="max-w-2xl mx-auto">
              <ChartForm
                onSubmit={handleGenerateChart}
                isLoading={isLoading}
                onOpenSamples={() => setIsSamplesOpen(true)}
                selectedSchool={currentSchool}
              />
              {errorMsg && (
                <div className="mt-3 p-3 rounded-none bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs sm:text-sm border border-red-300 dark:border-red-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            {/* Chart Display Section */}
            {chart && (
              <div id="chart-section" className="space-y-4 pt-4 border-t border-paper-border dark:border-night-border animate-fadeIn">
                {/* 1. Master Toolbar */}
                <MasterToolbar
                  isPrivacyMode={isPrivacyMode}
                  onTogglePrivacy={() => setIsPrivacyMode((prev) => !prev)}
                  isWhiteboardActive={isWhiteboardActive}
                  onToggleWhiteboard={() => setIsWhiteboardActive((prev) => !prev)}
                  onOpenRuleset={() => setIsRulesetOpen(true)}
                  onOpenCrm={() => setIsCrmOpen(true)}
                  onOpenWhiteLabel={() => setIsWhiteLabelOpen(true)}
                  onSaveCurrentToCrm={handleQuickSaveToCrm}
                  onOpenRectification={() => setCurrentView('rectification')}
                />

                {/* 2. 4 Trường Phái Thao Tác Nhanh */}
                <SchoolSwitcher
                  currentSchool={currentSchool}
                  onSelectSchool={handleSelectSchool}
                />

                {/* 3. Chart Header Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border rounded-none p-3 sm:px-5">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sm sm:text-base text-paper-red dark:text-night-gold">
                      Lá Số: {isPrivacyMode ? 'Đương Số (Ẩn Danh)' : chart.thienBan.fullName}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-none bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border text-paper-muted dark:text-night-muted">
                      Năm {chart.thienBan.canChiYear} • {chart.thienBan.menh}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsExportOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs font-semibold bg-paper-red hover:bg-paper-redHover text-white dark:bg-night-red dark:text-night-bg dark:hover:bg-night-red/90 transition-all cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Xuất Ảnh PNG</span>
                    </button>

                    <button
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs font-medium border border-paper-border dark:border-night-border text-paper-text dark:text-night-text hover:bg-paper-cardAlt dark:hover:bg-night-cardAlt transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Lập số khác</span>
                    </button>
                  </div>
                </div>

                {/* 4. 4x4 Grid Matrix with SVG Tam Phương Tứ Chính / Phi Tinh & Whiteboard */}
                <ChartGrid
                  chart={chart}
                  selectedPalaceId={selectedPalaceId}
                  onSelectPalace={(id) => setSelectedPalaceId(id)}
                  onOpenHistory={() => setIsHistoryOpen(true)}
                  onOpenExport={() => setIsExportOpen(true)}
                  chartRef={chartMatrixRef}
                  showTamPhuongTuChinh={chart.showTamPhuongTuChinh ?? true}
                  showLuuNien={chart.showLuuNien ?? true}
                  activeSchool={currentSchool}
                  isPrivacyMode={isPrivacyMode}
                  brandConfig={brandConfig}
                  isWhiteboardActive={isWhiteboardActive}
                  onCloseWhiteboard={() => setIsWhiteboardActive(false)}
                />

                {/* 5. 3 Tabs Luận Giải */}
                <InterpretationTabs
                  chart={chart}
                  selectedPalaceId={selectedPalaceId}
                  onSelectPalace={(id) => setSelectedPalaceId(id)}
                  activeSchool={currentSchool}
                />

                {/* 6. Hộp Tư Vấn Tử Vi Minh Khuê (AI Assistant) */}
                <TuViAssistant
                  chart={chart}
                  selectedPalaceName={selectedPalace?.name || 'Mệnh'}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-paper-border dark:border-night-border bg-paper-card dark:bg-night-card py-6 text-center text-xs text-paper-muted dark:text-night-muted">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-serif font-bold text-paper-red dark:text-night-gold">
            {brandConfig.enabled && brandConfig.brandName ? brandConfig.brandName : 'Tử Vi Minh Khuê'} • {brandConfig.subtitle || 'Tinh Hoa Đẩu Số Á Đông'}
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

      {/* Knowledge Modal */}
      <KnowledgeModal
        isOpen={isKnowledgeOpen}
        onClose={() => setIsKnowledgeOpen(false)}
      />

      {/* Sample Charts Modal */}
      <SampleChartsModal
        isOpen={isSamplesOpen}
        onClose={() => setIsSamplesOpen(false)}
        onSelectSample={(sample) => {
          setIsSamplesOpen(false);
          handleGenerateChart(sample);
        }}
      />

      {/* Custom Ruleset Drawer */}
      <CustomRulesetDrawer
        isOpen={isRulesetOpen}
        onClose={() => setIsRulesetOpen(false)}
        currentRuleset={ruleset}
        onApplyRuleset={handleSaveRuleset}
      />

      {/* CRM Client Profiles & Verification Notes Drawer */}
      <CrmClientDrawer
        isOpen={isCrmOpen}
        onClose={() => setIsCrmOpen(false)}
        currentChart={chart}
        onLoadClientChart={(selectedChart: ChartData) => {
          setChart(selectedChart);
          setCurrentView('chart');
          const menhPalace = selectedChart.palaces.find((p) => p.isMenh);
          setSelectedPalaceId(menhPalace ? menhPalace.id : 0);
          setTimeout(() => {
            document.getElementById('chart-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
      />

      {/* Master White-Label & Cinnabar Seal Modal */}
      <WhiteLabelModal
        isOpen={isWhiteLabelOpen}
        onClose={() => setIsWhiteLabelOpen(false)}
        brandConfig={brandConfig}
        onSaveBrandConfig={handleSaveBrandConfig}
      />

      {/* Export PNG Modal */}
      {chart && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          chartElementId="tuvi-laso-matrix"
          chartName={isPrivacyMode ? 'Duong_So_An_Danh' : chart.thienBan.fullName}
        />
      )}
    </div>
  );
};
