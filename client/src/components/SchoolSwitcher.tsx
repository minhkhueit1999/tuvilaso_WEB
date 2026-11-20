import React from 'react';
import { TuViSchool } from '../types';
import { IconThaiCuc, IconAnTrien, IconQuatGiay, IconLaKinh } from './OrientalIcons';

interface SchoolSwitcherProps {
  currentSchool: TuViSchool;
  onSelectSchool: (school: TuViSchool) => void;
}

export const SchoolSwitcher: React.FC<SchoolSwitcherProps> = ({ currentSchool, onSelectSchool }) => {
  const schools: { id: TuViSchool; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'tong_hop',
      label: 'Tổng Hợp',
      desc: '110+ Sao • Tiên Thiên Tứ Hóa • Tam Phương & Phi Hóa',
      icon: <IconThaiCuc className="w-3.5 h-3.5" />
    },
    {
      id: 'nam_phai',
      label: 'Nam Phái',
      desc: 'Thuần 110+ Sao • Tam Hợp & Miếu Hãm • Cách Cục',
      icon: <IconQuatGiay className="w-3.5 h-3.5" />
    },
    {
      id: 'bac_phai',
      label: 'Bắc Phái',
      desc: 'Khâm Thiên Môn • 18 Tứ Hóa • Lai Nhân Cung • Tự Hóa',
      icon: <IconAnTrien className="w-3.5 h-3.5" />
    },
    {
      id: 'phi_tinh',
      label: 'Phi Tinh',
      desc: 'Tứ Hóa Bay • 4 Luồng Lộc Quyền Khoa Kỵ • Luận Giải Tương Tác',
      icon: <IconLaKinh className="w-3.5 h-3.5" />
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto my-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 p-1.5 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-border dark:border-night-border rounded-none">
        {schools.map(s => {
          const isActive = currentSchool === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelectSchool(s.id)}
              className={`flex flex-col items-center justify-center py-2 px-2 text-center transition-all cursor-pointer border ${
                isActive
                  ? 'bg-paper-red text-paper-bg dark:bg-night-red dark:text-night-bg border-paper-redHover dark:border-night-red shadow-xs'
                  : 'bg-paper-card dark:bg-night-card text-paper-muted dark:text-night-muted border-paper-border dark:border-night-border hover:text-paper-text dark:hover:text-night-text hover:border-paper-gold dark:hover:border-night-gold'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className={isActive ? 'text-paper-goldLight dark:text-night-gold' : 'text-paper-gold dark:text-night-gold'}>
                  {s.icon}
                </span>
                <span className="font-serif font-bold text-xs sm:text-sm tracking-wide">
                  {s.label}
                </span>
              </div>
              <span className="text-[10px] hidden sm:block opacity-80 leading-tight">
                {s.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
