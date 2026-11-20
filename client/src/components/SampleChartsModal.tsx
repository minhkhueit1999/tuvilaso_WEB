import React from 'react';
import { TuViInput } from '../types';
import {
  IconQuatGiay,
  IconAnTrien,
  IconMeanderCorner
} from './OrientalIcons';

interface SampleChartsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (sample: TuViInput) => void;
}

interface SampleItem {
  id: string;
  name: string;
  badge: string;
  desc: string;
  data: TuViInput;
}

export const SampleChartsModal: React.FC<SampleChartsModalProps> = ({
  isOpen,
  onClose,
  onSelectSample
}) => {
  if (!isOpen) return null;

  const SAMPLES: SampleItem[] = [
    {
      id: 'vo-nguyen-giap',
      name: 'Đại Tướng Võ Nguyên Giáp',
      badge: 'Tử Phủ Vũ Tướng',
      desc: 'Cách cục đại danh tướng lừng lẫy, trung quân ái quốc, tài đức vẹn toàn.',
      data: {
        fullName: 'Võ Nguyên Giáp',
        gender: 'male',
        calendarType: 'solar',
        day: 25,
        month: 8,
        year: 1911,
        hour: 9,
        minute: 30,
        viewingYear: 2026,
        school: 'tong_hop'
      }
    },
    {
      id: 'doanh-nhan-sat-pha-tham',
      name: 'Doanh Nhân Khởi Nghiệp (Startup)',
      badge: 'Sát Phá Tham',
      desc: 'Tiên phong mạo hiểm, đột phá thương trường, biến nguy thành cơ gặt hái đại lộc.',
      data: {
        fullName: 'Doanh Nhân Mẫu',
        gender: 'male',
        calendarType: 'solar',
        day: 15,
        month: 3,
        year: 1988,
        hour: 21,
        minute: 30,
        viewingYear: 2026,
        school: 'phi_tinh'
      }
    },
    {
      id: 'nha-khoa-hoc-co-nguyet',
      name: 'Học Giả & Nhà Nghiên Cứu',
      badge: 'Cơ Nguyệt Đồng Lương',
      desc: 'Tư duy mưu lược, thanh bạch, thâm sâu học thuật và cống hiến bền bỉ.',
      data: {
        fullName: 'Học Giả Mẫu',
        gender: 'female',
        calendarType: 'solar',
        day: 10,
        month: 6,
        year: 1992,
        hour: 5,
        minute: 30,
        viewingYear: 2026,
        school: 'bac_phai'
      }
    },
    {
      id: 'tong-minh-khue',
      name: 'Đương Số Kỷ Mão (Mẫu Tiêu Chuẩn)',
      badge: 'Khoa Quyền Lộc Hội',
      desc: 'Âm Dương thuận lý, bản mệnh vững vàng, hội tụ cát tinh trợ lực.',
      data: {
        fullName: 'Tống Minh Khuê',
        gender: 'male',
        calendarType: 'solar',
        day: 28,
        month: 10,
        year: 1999,
        hour: 9,
        minute: 30,
        viewingYear: 2026,
        school: 'tong_hop'
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-paper-card dark:bg-night-card border-2 border-paper-gold/80 dark:border-night-gold/80 rounded-none max-w-xl w-full p-5 shadow-xl relative animate-fadeIn">
        {/* Góc Hồi Văn */}
        <IconMeanderCorner position="tl" className="absolute top-1 left-1 w-3.5 h-3.5 text-paper-gold opacity-70" />
        <IconMeanderCorner position="tr" className="absolute top-1 right-1 w-3.5 h-3.5 text-paper-gold opacity-70" />
        <IconMeanderCorner position="bl" className="absolute bottom-1 left-1 w-3.5 h-3.5 text-paper-gold opacity-70" />
        <IconMeanderCorner position="br" className="absolute bottom-1 right-1 w-3.5 h-3.5 text-paper-gold opacity-70" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-paper-border dark:border-night-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 border border-paper-gold dark:border-night-gold flex items-center justify-center bg-paper-cardAlt dark:bg-night-cardAlt text-paper-gold dark:text-night-gold">
              <IconQuatGiay className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-paper-red dark:text-night-gold">
                Kho Lá Số Tử Vi Tiêu Biểu
              </h3>
              <p className="text-xs text-paper-muted dark:text-night-muted">
                Các cách cục danh nhân & điển hình để khảo sát học thuật
              </p>
            </div>
          </div>
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
        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {SAMPLES.map((s) => (
            <div
              key={s.id}
              onClick={() => onSelectSample(s.data)}
              className="p-3 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-border dark:border-night-border hover:border-paper-gold dark:hover:border-night-gold transition-all cursor-pointer rounded-none flex items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-paper-text dark:text-night-text">
                    {s.name}
                  </h4>
                  <span className="seal-stamp text-[9px]">
                    {s.badge}
                  </span>
                </div>
                <p className="text-[11px] text-paper-muted dark:text-night-muted leading-tight">
                  {s.desc}
                </p>
              </div>

              <span className="text-xs font-serif font-bold text-paper-gold dark:text-night-gold shrink-0 mt-1">
                Xem →
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
