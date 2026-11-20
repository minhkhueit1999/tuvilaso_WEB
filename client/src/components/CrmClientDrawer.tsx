import React, { useState, useEffect } from 'react';
import { ChartData } from '../types';
import { IconAnTrien, IconMeanderCorner, IconThaiCuc, IconLaKinh } from './OrientalIcons';
import { safeJsonFetch } from '../utils/api';

export interface VerificationNote {
  id: string;
  year: number;
  month?: number;
  content: string;
  status: 'verified' | 'tracking' | 'review';
  createdAt: string;
}

export interface ClientChartRecord {
  id: string;
  fullName: string;
  gender: 'male' | 'female';
  birthDate: string;
  lunarDate: string;
  birthHour: string;
  phone?: string;
  email?: string;
  tags: string[];
  notes?: string;
  verificationLogs: VerificationNote[];
  chartData?: ChartData;
  createdAt: string;
  updatedAt: string;
}

interface CrmClientDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentChart: ChartData | null;
  onLoadClientChart: (chartData: ChartData, viewingYear?: number) => void;
}

const CRM_TAGS = ['Tất cả', 'Gia đình', 'Doanh nhân', 'Hôn nhân', 'Khách VIP', 'Mẫu học thuật'];

export const CrmClientDrawer: React.FC<CrmClientDrawerProps> = ({
  isOpen,
  onClose,
  currentChart,
  onLoadClientChart
}) => {
  const [clients, setClients] = useState<ClientChartRecord[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<ClientChartRecord | null>(null);

  // Form add new client from current chart or blank
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newSelectedTags, setNewSelectedTags] = useState<string[]>(['Khách VIP']);

  // Note form
  const [noteYear, setNoteYear] = useState<number>(2025);
  const [noteMonth, setNoteMonth] = useState<number | ''>('');
  const [noteContent, setNoteContent] = useState('');
  const [noteStatus, setNoteStatus] = useState<'verified' | 'tracking' | 'review'>('tracking');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedTag !== 'Tất cả') params.append('tag', selectedTag);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await safeJsonFetch<{ success: boolean; data: ClientChartRecord[] }>(`/api/crm/charts?${params.toString()}`);
      if (res.ok && res.data?.success && Array.isArray(res.data.data)) {
        setClients(res.data.data);
        // Auto select first if none selected
        if (!selectedClient && res.data.data.length > 0) {
          setSelectedClient(res.data.data[0]);
        }
      }
    } catch {
      // Fallback local storage
      try {
        const local = JSON.parse(localStorage.getItem('tuvi_crm_clients') || '[]');
        setClients(local);
        if (!selectedClient && local.length > 0) setSelectedClient(local[0]);
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchClients();
    }
  }, [isOpen, selectedTag, searchQuery]);

  if (!isOpen) return null;

  const handleSaveCurrentToCrm = async () => {
    if (!currentChart) return;
    try {
      const record = {
        fullName: currentChart.thienBan.fullName,
        gender: currentChart.thienBan.gender === 'Nữ' ? 'female' : 'male',
        birthDate: currentChart.thienBan.solarDate,
        lunarDate: currentChart.thienBan.lunarDate,
        birthHour: currentChart.thienBan.birthHour,
        phone: newPhone,
        tags: newSelectedTags,
        notes: newNotes,
        verificationLogs: [],
        chartData: currentChart
      };

      const res = await safeJsonFetch('/api/crm/charts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });

      if (res.ok) {
        setIsAddingNew(false);
        fetchClients();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Không thể lưu hồ sơ');
    }
  };

  const handleAddVerificationNote = async (clientId: string) => {
    if (!noteContent.trim()) return;
    try {
      const notePayload = {
        year: Number(noteYear),
        month: noteMonth !== '' ? Number(noteMonth) : undefined,
        content: noteContent.trim(),
        status: noteStatus
      };

      const res = await safeJsonFetch<{ success: boolean; data: VerificationNote }>(`/api/crm/charts/${clientId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notePayload)
      });

      if (res.ok && res.data?.success && res.data.data) {
        if (selectedClient && selectedClient.id === clientId) {
          setSelectedClient({
            ...selectedClient,
            verificationLogs: [res.data.data, ...(selectedClient.verificationLogs || [])]
          });
        }
        setNoteContent('');
        fetchClients();
      }
    } catch {}
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa hồ sơ khách hàng này không?')) return;
    try {
      const res = await safeJsonFetch(`/api/crm/charts/${clientId}`, { method: 'DELETE' });
      if (res.ok) {
        setSelectedClient(null);
        fetchClients();
      }
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 animate-fadeIn" onClick={onClose}>
      <aside
        aria-label="Sổ Khách Hàng CRM"
        className="w-full max-w-4xl bg-paper-card dark:bg-night-card border-l-2 border-paper-gold/80 dark:border-night-gold/80 h-full overflow-hidden flex flex-col shadow-2xl relative rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner Accents */}
        <IconMeanderCorner position="tl" className="absolute top-1 left-1 w-4 h-4 text-paper-gold/70" />
        <IconMeanderCorner position="bl" className="absolute bottom-1 left-1 w-4 h-4 text-paper-gold/70" />

        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-paper-border dark:border-night-border shrink-0">
          <div className="flex items-center gap-2">
            <IconAnTrien className="w-5 h-5 text-paper-red dark:text-night-gold" />
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-paper-red dark:text-night-gold">
                Hồ Sơ Khách Hàng & Nhật Ký Nghiệm Lý (CRM)
              </h3>
              <p className="text-[11px] text-paper-muted dark:text-night-muted">
                Quản lý lịch sử tư vấn, phân nhóm khách VIP và đối chiếu năm ứng nghiệm
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentChart && (
              <button
                type="button"
                onClick={() => {
                  setNewFullName(currentChart.thienBan.fullName);
                  setIsAddingNew(true);
                }}
                className="px-2.5 py-1 text-xs font-serif font-semibold bg-paper-red text-white hover:bg-paper-redHover transition-colors cursor-pointer"
              >
                + Lưu Lá Số Này Vào CRM
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng CRM"
              className="p-1 text-paper-muted dark:text-night-muted hover:text-paper-text text-sm cursor-pointer ml-2"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Add Client from Current Chart */}
        {isAddingNew && (
          <div className="p-4 bg-paper-cardAlt dark:bg-night-cardAlt border-b border-paper-border space-y-3 text-xs">
            <div className="flex items-center justify-between font-serif font-bold text-paper-red dark:text-night-gold">
              <span>Lưu Hồ Sơ Mới Vào Hệ Thống CRM:</span>
              <button type="button" onClick={() => setIsAddingNew(false)} className="text-paper-muted hover:text-paper-text">✕</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Họ tên"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                className="p-1.5 bg-paper-card dark:bg-night-card border border-paper-border text-xs"
              />
              <input
                type="text"
                placeholder="Số điện thoại / Zalo"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="p-1.5 bg-paper-card dark:bg-night-card border border-paper-border text-xs"
              />
              <input
                type="text"
                placeholder="Ghi chú hoàn cảnh khách hàng"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="p-1.5 bg-paper-card dark:bg-night-card border border-paper-border text-xs"
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-paper-muted">Gắn nhóm:</span>
                {['Khách VIP', 'Doanh nhân', 'Hôn nhân', 'Gia đình', 'Mẫu học thuật'].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      if (newSelectedTags.includes(t)) setNewSelectedTags(newSelectedTags.filter(x => x !== t));
                      else setNewSelectedTags([...newSelectedTags, t]);
                    }}
                    className={`px-1.5 py-0.5 text-[10px] border ${
                      newSelectedTags.includes(t)
                        ? 'border-paper-red bg-paper-red/10 text-paper-red font-bold'
                        : 'border-paper-border text-paper-muted'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleSaveCurrentToCrm}
                className="px-3 py-1 bg-paper-red text-white font-serif font-bold cursor-pointer"
              >
                Xác Nhận Lưu
              </button>
            </div>
          </div>
        )}

        {/* Main 2-Column Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden text-xs">
          {/* Left Column: Client List & Filter */}
          <div className="w-full md:w-80 border-r border-paper-border dark:border-night-border flex flex-col overflow-hidden bg-paper-cardAlt/40 dark:bg-night-cardAlt/40">
            {/* Search and Tags */}
            <div className="p-3 border-b border-paper-border dark:border-night-border space-y-2 shrink-0">
              <input
                type="text"
                placeholder="Tìm tên, số ĐT, ghi chú..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-1.5 bg-paper-card dark:bg-night-card border border-paper-border text-xs rounded-none"
              />
              <div className="flex flex-wrap gap-1">
                {CRM_TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    className={`px-2 py-0.5 text-[10px] font-serif transition-colors cursor-pointer border ${
                      selectedTag === tag
                        ? 'bg-paper-red text-white border-paper-red font-bold'
                        : 'border-paper-border bg-paper-card text-paper-muted hover:border-paper-gold'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Client List */}
            <div className="flex-1 overflow-y-auto divide-y divide-paper-border/60 dark:divide-night-border/60">
              {loading && <div className="p-4 text-center text-paper-muted">Đang tải hồ sơ...</div>}
              {!loading && clients.length === 0 && (
                <div className="p-4 text-center text-paper-muted">Chưa có hồ sơ khách hàng nào trong nhóm này.</div>
              )}
              {clients.map(c => {
                const isSelected = selectedClient?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedClient(c)}
                    className={`p-3 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-paper-gold/15 dark:bg-night-gold/20 border-l-3 border-paper-red dark:border-night-gold'
                        : 'hover:bg-paper-cardAlt dark:hover:bg-night-cardAlt'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-sm text-paper-red dark:text-night-gold">
                        {c.fullName}
                      </span>
                      <span className="text-[10px] text-paper-muted">
                        {c.gender === 'female' ? 'Nữ' : 'Nam'}
                      </span>
                    </div>
                    <div className="text-[11px] text-paper-text/80 dark:text-night-text/80 mt-0.5">
                      Sinh: {c.birthDate} ({c.birthHour || ''})
                    </div>
                    <div className="flex flex-wrap items-center gap-1 mt-1">
                      {(c.tags || []).map(t => (
                        <span key={t} className="px-1 py-0.2 bg-paper-card dark:bg-night-card border border-paper-border text-[9px] text-paper-muted">
                          {t}
                        </span>
                      ))}
                      {c.verificationLogs?.length > 0 && (
                        <span className="px-1 py-0.2 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 text-[9px]">
                          {c.verificationLogs.length} nhật ký
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Client Details & Verification Logs */}
          <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-5 space-y-4">
            {selectedClient ? (
              <>
                {/* Profile Overview Card */}
                <div className="p-4 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-border dark:border-night-border space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-paper-border/60 pb-2">
                    <div>
                      <h4 className="font-serif font-bold text-base sm:text-lg text-paper-red dark:text-night-gold">
                        {selectedClient.fullName}
                      </h4>
                      <p className="text-[11px] text-paper-muted">
                        Dương Lịch: <strong>{selectedClient.birthDate}</strong> • Giờ: <strong>{selectedClient.birthHour || 'N/A'}</strong> • Âm Lịch: <strong>{selectedClient.lunarDate || 'N/A'}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {selectedClient.chartData && (
                        <button
                          type="button"
                          onClick={() => {
                            onLoadClientChart(selectedClient.chartData!);
                            onClose();
                          }}
                          className="px-3 py-1.5 bg-paper-red text-white hover:bg-paper-redHover font-serif font-bold transition-all cursor-pointer shadow-xs"
                        >
                          Mở Lá Số Đầy Đủ
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteClient(selectedClient.id)}
                        className="px-2 py-1 border border-red-300 text-red-600 hover:bg-red-50 text-[11px] cursor-pointer"
                        title="Xóa hồ sơ"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>

                  {/* Notes & Contacts */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-paper-muted block">Số Điện Thoại / Liên Lạc:</span>
                      <strong>{selectedClient.phone || 'Chưa lưu'}</strong>
                    </div>
                    <div>
                      <span className="text-paper-muted block">Ghi Chú Khách Hàng:</span>
                      <span>{selectedClient.notes || 'Không có ghi chú thêm.'}</span>
                    </div>
                  </div>
                </div>

                {/* Section: Verification Logs (Nhật Ký Nghiệm Lý Theo Năm) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-paper-border pb-1.5">
                    <h5 className="font-serif font-bold text-sm text-paper-red dark:text-night-gold flex items-center gap-1.5">
                      <IconLaKinh className="w-4 h-4" />
                      Nhật Ký Nghiệm Lý Theo Năm (Verification Log)
                    </h5>
                    <span className="text-[10px] text-paper-muted italic">
                      Nhấp vào năm để đối chiếu lá số năm đó
                    </span>
                  </div>

                  {/* Add note form */}
                  <div className="p-3 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-border space-y-2">
                    <div className="font-serif font-semibold text-paper-text text-[11px]">
                      + Thêm Ghi Chú Nghiệm Lý Mới:
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      <div>
                        <label className="text-[10px] text-paper-muted block">Năm:</label>
                        <input
                          type="number"
                          value={noteYear}
                          onChange={(e) => setNoteYear(Number(e.target.value))}
                          className="w-full p-1 bg-paper-card dark:bg-night-card border border-paper-border"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-paper-muted block">Tháng (Âm):</label>
                        <input
                          type="number"
                          placeholder="Tùy chọn"
                          value={noteMonth}
                          onChange={(e) => setNoteMonth(e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full p-1 bg-paper-card dark:bg-night-card border border-paper-border"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-paper-muted block">Trạng thái:</label>
                        <select
                          value={noteStatus}
                          onChange={(e) => setNoteStatus(e.target.value as any)}
                          className="w-full p-1 bg-paper-card dark:bg-night-card border border-paper-border"
                        >
                          <option value="verified">Đã ứng nghiệm</option>
                          <option value="tracking">Đang theo dõi</option>
                          <option value="review">Cần kiểm lại</option>
                        </select>
                      </div>
                      <div className="col-span-3 sm:col-span-4">
                        <textarea
                          rows={2}
                          placeholder="Nội dung sự kiện thực tế (VD: Tháng 8 âm đổi việc sang vị trí mới, đúng cung Quan gặp Lưu Mã...)"
                          value={noteContent}
                          onChange={(e) => setNoteContent(e.target.value)}
                          className="w-full p-1.5 bg-paper-card dark:bg-night-card border border-paper-border text-xs"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleAddVerificationNote(selectedClient.id)}
                        className="px-3 py-1 bg-paper-red text-white hover:bg-paper-redHover font-serif font-semibold transition-colors cursor-pointer"
                      >
                        Lưu Ghi Chú Nghiệm Lý
                      </button>
                    </div>
                  </div>

                  {/* List of verification notes */}
                  <div className="space-y-2">
                    {(!selectedClient.verificationLogs || selectedClient.verificationLogs.length === 0) && (
                      <p className="text-paper-muted italic py-3 text-center">Chưa có ghi chú nghiệm lý nào cho khách hàng này.</p>
                    )}
                    {(selectedClient.verificationLogs || []).map(n => {
                      const statusColor = n.status === 'verified'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : n.status === 'tracking'
                        ? 'border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                        : 'border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300';
                      const statusLabel = n.status === 'verified' ? 'Đã ứng nghiệm' : (n.status === 'tracking' ? 'Đang theo dõi' : 'Cần kiểm lại');

                      return (
                        <div
                          key={n.id}
                          className="p-3 bg-paper-card dark:bg-night-card border border-paper-border hover:border-paper-gold transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                        >
                          <div className="flex items-start gap-2.5">
                            <button
                              type="button"
                              onClick={() => {
                                if (selectedClient.chartData) {
                                  onLoadClientChart(selectedClient.chartData, n.year);
                                  onClose();
                                }
                              }}
                              className="px-2 py-1 bg-paper-gold/20 dark:bg-night-gold/25 border border-paper-gold text-paper-red font-serif font-bold text-xs hover:bg-paper-gold/30 cursor-pointer"
                              title={`Nhảy tới lá số năm ${n.year}`}
                            >
                              Năm {n.year}{n.month ? ` (Th.${n.month})` : ''} ↗
                            </button>
                            <p className="text-xs text-paper-text dark:text-night-text leading-relaxed">
                              {n.content}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                            <span className={`px-2 py-0.5 border text-[10px] font-serif ${statusColor}`}>
                              {statusLabel}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-paper-muted space-y-2">
                <IconThaiCuc className="w-8 h-8 opacity-40" />
                <p>Chọn một khách hàng bên trái hoặc lưu lá số hiện tại vào CRM.</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};
