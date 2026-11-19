import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, Share2, X, Check, Loader2 } from 'lucide-react';

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
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#121110' : '#FBF8F1'
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
      const canvas = await html2canvas(el, { scale: 2, useCORS: true });
      dataUrl = canvas.toDataURL('image/png');
      setExportedUrl(dataUrl);
    }

    setIsUploading(true);
    try {
      const res = await fetch('/api/laso/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: dataUrl,
          filename: `laso_${chartName.replace(/\s+/g, '_')}.png`
        })
      });
      const json = await res.json();
      if (json.success && json.data?.url) {
        setCloudUrl(json.data.url);
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border rounded-lg max-w-md w-full p-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-paper-sub hover:text-paper-text dark:text-night-sub dark:hover:text-night-text"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-serif text-lg font-bold text-paper-red dark:text-night-gold mb-2">
          Xuất Ảnh Lá Số Tử Vi
        </h3>
        <p className="text-xs text-paper-sub dark:text-night-sub mb-4">
          Tải ảnh chất lượng cao để lưu trữ hoặc chia sẻ với bạn bè, đồng môn.
        </p>

        {exportedUrl && (
          <div className="mb-4 border border-paper-border rounded overflow-hidden max-h-48 flex justify-center bg-paper-bg dark:bg-night-bg">
            <img src={exportedUrl} alt="Lá số Tử Vi" className="object-contain h-full" />
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleCapture}
            disabled={isExporting}
            className="w-full py-2.5 px-4 rounded text-xs sm:text-sm font-semibold bg-paper-red hover:bg-paper-red/90 text-white dark:bg-night-gold dark:text-night-bg dark:hover:bg-night-gold/90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang kết xuất ảnh chất lượng cao...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>TẢI ẢNH VỀ MÁY (PNG)</span>
              </>
            )}
          </button>

          <button
            onClick={handleUploadCloud}
            disabled={isUploading}
            className="w-full py-2 px-4 rounded text-xs sm:text-sm font-medium border border-paper-border dark:border-night-border hover:bg-paper-bg dark:hover:bg-night-bg text-paper-text dark:text-night-text transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang tải lên máy chủ...</span>
              </>
            ) : cloudUrl ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Đã lưu lên máy chủ!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-paper-gold dark:text-night-gold" />
                <span>Lưu Trữ Ảnh Lên Máy Chủ</span>
              </>
            )}
          </button>

          {cloudUrl && (
            <div className="p-2 rounded bg-paper-bg dark:bg-night-bg border border-paper-border text-[11px] break-all">
              <span className="font-semibold text-paper-sub block mb-0.5">Đường dẫn ảnh:</span>
              <a
                href={cloudUrl}
                target="_blank"
                rel="noreferrer"
                className="text-paper-red dark:text-night-gold underline"
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
