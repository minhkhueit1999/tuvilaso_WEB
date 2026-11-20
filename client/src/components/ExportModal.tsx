import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { IconAnTrien } from './OrientalIcons';
import { safeJsonFetch } from '../utils/api';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  chartElementId: string;
  chartName: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  chartElementId,
  chartName
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportedUrl, setExportedUrl] = useState<string | null>(null);
  const [cloudUrl, setCloudUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleCapture = async () => {
    const el = document.getElementById(chartElementId);
    if (!el) return;

    setIsExporting(true);
    try {
      const isDark = document.documentElement.classList.contains('dark');
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: isDark ? '#141210' : '#F5F0E3'
      });
      const dataUrl = canvas.toDataURL('image/png');
      setExportedUrl(dataUrl);

      // Trigger direct download
      const link = document.createElement('a');
      link.download = `LaSoTuVi_${chartName.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export canvas error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleUploadCloud = async () => {
    let dataUrl = exportedUrl;
    if (!dataUrl) {
      const el = document.getElementById(chartElementId);
      if (!el) return;
      setIsUploading(true);
      const isDark = document.documentElement.classList.contains('dark');
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: isDark ? '#141210' : '#F5F0E3'
      });
      dataUrl = canvas.toDataURL('image/png');
      setExportedUrl(dataUrl);
    }

    setIsUploading(true);
    try {
      const res = await safeJsonFetch<{ success: boolean; data?: { url?: string } }>('/api/laso/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: dataUrl,
          filename: `laso_${chartName.replace(/\s+/g, '_')}.png`
        })
      });
      if (res.ok && res.data?.success && res.data?.data?.url) {
        setCloudUrl(res.data.data.url);
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-paper-card dark:bg-night-card border-2 border-paper-gold/80 dark:border-night-gold/80 rounded-none max-w-md w-full p-5 shadow-lg relative">
        <button
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-3 right-3 text-paper-muted hover:text-paper-text dark:text-night-muted dark:hover:text-night-text cursor-pointer p-1"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="flex items-center gap-2 mb-2">
          <IconAnTrien className="w-5 h-5 text-paper-gold" />
          <h3 className="font-serif text-lg font-bold text-paper-red dark:text-night-gold">
            Xuất Ảnh Lá Số Tử Vi Mộc Bản
          </h3>
        </div>
        <p className="text-xs text-paper-muted dark:text-night-muted mb-4">
          Tải ảnh chất lượng cao chuẩn nền Giấy Tuyên Chỉ, khung song biên và bố cục 3 tầng.
        </p>

        {exportedUrl && (
          <div className="mb-4 border border-paper-border rounded-none overflow-hidden max-h-48 flex justify-center bg-paper-bg dark:bg-night-bg">
            <img src={exportedUrl} alt="Lá số Tử Vi" className="object-contain h-full" />
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleCapture}
            disabled={isExporting}
            className="w-full py-2.5 px-4 rounded-none text-xs sm:text-sm font-serif font-bold bg-paper-red hover:bg-paper-redHover text-paper-bg dark:bg-night-red dark:text-night-bg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border border-paper-redHover"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-paper-bg border-t-transparent animate-spin" />
                <span>Đang kết xuất ảnh mộc bản...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                <span>TẢI ẢNH VỀ MÁY (PNG)</span>
              </>
            )}
          </button>

          <button
            onClick={handleUploadCloud}
            disabled={isUploading}
            className="w-full py-2 px-4 rounded-none text-xs sm:text-sm font-medium border border-paper-border dark:border-night-border hover:bg-paper-cardAlt dark:hover:bg-night-cardAlt text-paper-text dark:text-night-text transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-paper-gold border-t-transparent animate-spin" />
                <span>Đang lưu trữ lên máy chủ...</span>
              </>
            ) : cloudUrl ? (
              <>
                <span className="text-paper-jade font-bold">Đã lưu trữ thành công!</span>
              </>
            ) : (
              <>
                <IconAnTrien className="w-4 h-4 text-paper-gold" />
                <span>Lưu Trữ Ảnh Lên Máy Chủ</span>
              </>
            )}
          </button>

          {cloudUrl && (
            <div className="p-2.5 rounded-none bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-border text-[11px] break-all">
              <span className="font-semibold text-paper-muted block mb-0.5">Đường dẫn ảnh đã lưu:</span>
              <a
                href={cloudUrl}
                target="_blank"
                rel="noreferrer"
                className="text-paper-red dark:text-night-gold underline font-serif"
              >
                {cloudUrl}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
