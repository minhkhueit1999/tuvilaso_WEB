import React, { useState } from 'react';
import { TuViInput, Gender, CalendarType, TuViSchool } from '../types';
import {
  IconLaKinh,
  IconQuatGiay,
  IconAnTrien,
  IconMeanderCorner,
  IconThaiCuc,
  IconBatQuai
} from './OrientalIcons';

interface ChartFormProps {
  onSubmit: (data: TuViInput) => void;
  isLoading: boolean;
  onOpenSamples: () => void;
  selectedSchool?: TuViSchool;
}

const CANH_GIO = [
  { chi: 'Tý', hour: 23, minute: 30, desc: 'Tý (23:00 - 00:59)' },
  { chi: 'Sửu', hour: 1, minute: 30, desc: 'Sửu (01:00 - 02:59)' },
  { chi: 'Dần', hour: 3, minute: 30, desc: 'Dần (03:00 - 04:59)' },
  { chi: 'Mão', hour: 5, minute: 30, desc: 'Mão (05:00 - 06:59)' },
  { chi: 'Thìn', hour: 7, minute: 30, desc: 'Thìn (07:00 - 08:59)' },
  { chi: 'Tỵ', hour: 9, minute: 30, desc: 'Tỵ (09:00 - 10:59)' },
  { chi: 'Ngọ', hour: 11, minute: 30, desc: 'Ngọ (11:00 - 12:59)' },
  { chi: 'Mùi', hour: 13, minute: 30, desc: 'Mùi (13:00 - 14:59)' },
  { chi: 'Thân', hour: 15, minute: 30, desc: 'Thân (15:00 - 16:59)' },
  { chi: 'Dậu', hour: 17, minute: 30, desc: 'Dậu (17:00 - 18:59)' },
  { chi: 'Tuất', hour: 19, minute: 30, desc: 'Tuất (19:00 - 20:59)' },
  { chi: 'Hợi', hour: 21, minute: 30, desc: 'Hợi (21:00 - 22:59)' },
];

export const ChartForm: React.FC<ChartFormProps> = ({
  onSubmit,
  isLoading,
  onOpenSamples,
  selectedSchool = 'tong_hop'
}) => {
  const [fullName, setFullName] = useState('Tống Minh Khuê');
  const [gender, setGender] = useState<Gender>('male');
  const [calendarType, setCalendarType] = useState<CalendarType>('solar');
  const [isLeapMonth, setIsLeapMonth] = useState(false);
  const [day, setDay] = useState(28);
  const [month, setMonth] = useState(10);
  const [year, setYear] = useState(1999);
  const [selectedCanhGioIndex, setSelectedCanhGioIndex] = useState(4); // Thìn (7h-9h)
  const [viewingYear, setViewingYear] = useState(2026);
  const [school, setSchool] = useState<TuViSchool>(selectedSchool);
  const [showTamPhuongTuChinh, setShowTamPhuongTuChinh] = useState(true);
  const [showLuuNien, setShowLuuNien] = useState(true);

  const handleUseSample = () => {
    setFullName('Tống Minh Khuê');
    setGender('male');
    setCalendarType('solar');
    setIsLeapMonth(false);
    setDay(28);
    setMonth(10);
    setYear(1999);
    setSelectedCanhGioIndex(4);
    setViewingYear(2026);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const canhGio = CANH_GIO[selectedCanhGioIndex];
    onSubmit({
      fullName: fullName.trim() || 'Đương Số',
      gender,
      calendarType,
      day: Number(day),
      month: Number(month),
      year: Number(year),
      hour: canhGio.hour,
      minute: canhGio.minute,
      isLeapMonth,
      viewingYear: Number(viewingYear),
      school,
      showTamPhuongTuChinh,
      showLuuNien
    });
  };

  return (
    <div
      id="form-section"
      className="relative bg-paper-card dark:bg-night-card border-2 border-paper-gold/60 dark:border-night-gold/60 p-5 sm:p-7 shadow-xs transition-colors rounded-none"
    >
      {/* 4 Corner Meander Accents (Hồi Văn Góc) */}
      <IconMeanderCorner position="tl" className="absolute top-1 left-1 w-4 h-4 text-paper-gold dark:text-night-gold pointer-events-none opacity-80" />
      <IconMeanderCorner position="tr" className="absolute top-1 right-1 w-4 h-4 text-paper-gold dark:text-night-gold pointer-events-none opacity-80" />
      <IconMeanderCorner position="bl" className="absolute bottom-1 left-1 w-4 h-4 text-paper-gold dark:text-night-gold pointer-events-none opacity-80" />
      <IconMeanderCorner position="br" className="absolute bottom-1 right-1 w-4 h-4 text-paper-gold dark:text-night-gold pointer-events-none opacity-80" />

      {/* Form Header */}
      <div className="flex flex-wrap items-center justify-between pb-3.5 mb-4 border-b border-paper-border dark:border-night-border gap-2">
        <div>
          <h2 className="font-serif text-lg sm:text-xl font-bold text-paper-red dark:text-night-gold flex items-center gap-2">
            <IconLaKinh className="w-5 h-5 text-paper-gold dark:text-night-gold" />
            <span>Nhập Thông Tin Lập Lá Số</span>
          </h2>
          <p className="text-xs text-paper-muted dark:text-night-muted mt-0.5">
            Quy Chuẩn Can Chi Bát Tự • Ngũ Hành Nạp Âm • An Đủ 110+ Tinh Tú
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUseSample}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-none text-xs font-medium text-paper-gold dark:text-night-gold border border-paper-gold/50 hover:bg-paper-gold/10 transition-colors cursor-pointer"
            title="Điền dữ liệu mẫu nhanh"
          >
            <IconThaiCuc className="w-3.5 h-3.5" />
            <span>Dùng dữ liệu mẫu</span>
          </button>
          <button
            type="button"
            onClick={onOpenSamples}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-none text-xs font-medium text-paper-red dark:text-night-gold border border-paper-red/40 hover:bg-paper-red/10 transition-colors cursor-pointer"
            title="Mở kho lá số mẫu"
          >
            <IconQuatGiay className="w-3.5 h-3.5" />
            <span>Kho Lá Số Mẫu</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Họ tên & Giới tính */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-serif font-bold text-paper-text dark:text-night-text mb-1.5 flex items-center gap-1.5">
              <IconAnTrien className="w-3.5 h-3.5 text-paper-gold dark:text-night-gold" />
              <span>Họ và tên đương số</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ví dụ: Tống Minh Khuê"
              className="w-full px-3 py-2 rounded-none text-sm bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border text-paper-text dark:text-night-text focus:outline-none focus:border-paper-red dark:focus:border-night-gold transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-serif font-bold text-paper-text dark:text-night-text mb-1.5">
              Giới tính
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-2 px-3 text-sm rounded-none border text-center transition-all cursor-pointer ${
                  gender === 'male'
                    ? 'border-paper-red bg-paper-red/10 text-paper-red dark:border-night-gold dark:bg-night-gold/15 dark:text-night-gold font-bold'
                    : 'border-paper-border dark:border-night-border text-paper-muted dark:text-night-muted hover:border-paper-gold'
                }`}
              >
                Nam
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-2 px-3 text-sm rounded-none border text-center transition-all cursor-pointer ${
                  gender === 'female'
                    ? 'border-paper-red bg-paper-red/10 text-paper-red dark:border-night-gold dark:bg-night-gold/15 dark:text-night-gold font-bold'
                    : 'border-paper-border dark:border-night-border text-paper-muted dark:text-night-muted hover:border-paper-gold'
                }`}
              >
                Nữ
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Loại lịch & Ngày Tháng Năm */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-serif font-bold text-paper-text dark:text-night-text flex items-center gap-1.5">
              <IconThaiCuc className="w-3.5 h-3.5 text-paper-gold dark:text-night-gold" />
              <span>Ngày, tháng, năm sinh</span>
            </label>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center text-xs cursor-pointer font-medium">
                <input
                  type="radio"
                  name="calendarType"
                  checked={calendarType === 'solar'}
                  onChange={() => setCalendarType('solar')}
                  className="mr-1 text-paper-red focus:ring-0"
                />
                Dương Lịch
              </label>
              <label className="inline-flex items-center text-xs cursor-pointer font-medium">
                <input
                  type="radio"
                  name="calendarType"
                  checked={calendarType === 'lunar'}
                  onChange={() => setCalendarType('lunar')}
                  className="mr-1 text-paper-red focus:ring-0"
                />
                Âm Lịch
              </label>
              {calendarType === 'lunar' && (
                <label className="inline-flex items-center text-xs text-paper-red dark:text-night-gold cursor-pointer ml-1 font-semibold">
                  <input
                    type="checkbox"
                    checked={isLeapMonth}
                    onChange={(e) => setIsLeapMonth(e.target.checked)}
                    className="mr-1"
                  />
                  Tháng nhuận
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <select
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-none text-sm bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border text-paper-text dark:text-night-text focus:outline-none focus:border-paper-red dark:focus:border-night-gold tabular-nums"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    Ngày {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-none text-sm bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border text-paper-text dark:text-night-text focus:outline-none focus:border-paper-red dark:focus:border-night-gold tabular-nums"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    Tháng {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-none text-sm bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border text-paper-text dark:text-night-text focus:outline-none focus:border-paper-red dark:focus:border-night-gold tabular-nums"
              >
                {Array.from({ length: 110 }, (_, i) => 2030 - i).map((y) => (
                  <option key={y} value={y}>
                    Năm {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Row 3: 12 Canh Giờ Sinh & Năm xem hạn */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-serif font-bold text-paper-text dark:text-night-text mb-1.5 flex items-center gap-1.5">
              <IconLaKinh className="w-3.5 h-3.5 text-paper-gold dark:text-night-gold" />
              <span>12 Canh giờ sinh (Địa Chi)</span>
            </label>
            <select
              value={selectedCanhGioIndex}
              onChange={(e) => setSelectedCanhGioIndex(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-none text-sm bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border text-paper-text dark:text-night-text focus:outline-none focus:border-paper-red dark:focus:border-night-gold"
            >
              {CANH_GIO.map((item, index) => (
                <option key={item.chi} value={index}>
                  Giờ {item.desc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-serif font-bold text-paper-text dark:text-night-text mb-1.5">
              Năm xem hạn
            </label>
            <select
              value={viewingYear}
              onChange={(e) => setViewingYear(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-none text-sm bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border text-paper-text dark:text-night-text focus:outline-none focus:border-paper-red dark:focus:border-night-gold tabular-nums"
            >
              {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                <option key={y} value={y}>
                  Năm {y} {y === 2026 ? '(Hiện tại)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 4: Chọn Trường Phái Học Thuật */}
        <div>
          <label className="block text-xs font-serif font-bold text-paper-text dark:text-night-text mb-1.5 flex items-center gap-1.5">
            <IconAnTrien className="w-3.5 h-3.5 text-paper-gold dark:text-night-gold" />
            <span>Trường Phái Đẩu Số</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[
              { id: 'tong_hop', label: 'Tổng Hợp (Toàn Đồ)' },
              { id: 'nam_phai', label: 'Nam Phái (Tam Hợp)' },
              { id: 'bac_phai', label: 'Bắc Phái (Khâm Thiên)' },
              { id: 'phi_tinh', label: 'Phi Tinh (Tương Tác)' }
            ].map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSchool(s.id as TuViSchool)}
                className={`py-2 px-2 text-center border rounded-none cursor-pointer transition-colors ${
                  school === s.id
                    ? 'border-paper-red bg-paper-red/10 text-paper-red dark:border-night-gold dark:bg-night-gold/15 dark:text-night-gold font-bold'
                    : 'border-paper-border dark:border-night-border text-paper-muted dark:text-night-muted hover:border-paper-gold'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 5: Tùy chọn hiển thị nâng cao */}
        <div className="pt-2 flex flex-wrap items-center gap-5 text-xs text-paper-muted dark:text-night-muted border-t border-paper-border/60 dark:border-night-border/60">
          <label className="inline-flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showTamPhuongTuChinh}
              onChange={(e) => setShowTamPhuongTuChinh(e.target.checked)}
              className="rounded-none text-paper-red focus:ring-0"
            />
            <span>Đường nối Tam Phương Tứ Chính</span>
          </label>

          <label className="inline-flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showLuuNien}
              onChange={(e) => setShowLuuNien(e.target.checked)}
              className="rounded-none text-paper-red focus:ring-0"
            />
            <span>Hiển thị Hệ Sao Lưu Niên (L.Thái Tuế, L.Kình Đà, L.Tứ Hóa...)</span>
          </label>
        </div>

        {/* Submit CTA */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-none text-xs sm:text-sm font-serif font-bold tracking-widest bg-paper-red hover:bg-paper-redHover text-paper-bg dark:bg-night-red dark:text-night-bg dark:hover:bg-paper-red transition-all border border-paper-redHover dark:border-night-gold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-xs"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-paper-bg border-t-transparent rounded-none animate-spin" />
                <span>Đang an sao và kiến tạo lá số mộc bản...</span>
              </>
            ) : (
              <>
                <IconBatQuai className="w-4 h-4" />
                <span>LẬP LÁ SỐ TỬ VI HUYỀN CƠ</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
