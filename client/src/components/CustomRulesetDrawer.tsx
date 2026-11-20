import React, { useState } from 'react';
import { TuViRuleset, CanhVariant, NhamVariant, MauVariant, ZiHourMode, LeapMonthMode, YearBoundaryMode, KhoiVietVariant, SchoolPreset } from '../types';
import { IconAnTrien, IconLaKinh, IconMeanderCorner } from './OrientalIcons';

interface CustomRulesetDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentRuleset?: TuViRuleset;
  onApplyRuleset: (ruleset: TuViRuleset) => void;
}

export const PRESET_CONFIGS: Record<SchoolPreset, { name: string; desc: string; ruleset: TuViRuleset }> = {
  nam_phai_vn: {
    name: 'Nam Phái Việt Nam (Phổ Thông)',
    desc: 'Canh: Âm(Khoa)-Đồng(Kỵ), Nhâm: Phù(Khoa)-Vũ(Kỵ), Mậu: Bật(Khoa)-Cơ(Kỵ), Giờ Tý giữ ngày',
    ruleset: {
      schoolPreset: 'nam_phai_vn',
      canhVariant: 'vn_standard',
      nhamVariant: 'vn_standard',
      mauVariant: 'vn_standard',
      ziHourMode: 'keep_current_day',
      leapMonthMode: 'previous_month',
      yearBoundaryMode: 'lunar_new_year',
      khoiVietVariant: 'vn_standard'
    }
  },
  toan_thu: {
    name: 'Tử Vi Toàn Thư (Cổ Bản)',
    desc: 'Canh/Nhâm Hóa Khoa Thiên Phủ, Mậu Khoa Thái Dương, Vãn Tý đổi ngày, Nhuận chia 15',
    ruleset: {
      schoolPreset: 'toan_thu',
      canhVariant: 'toan_thu',
      nhamVariant: 'toan_thu',
      mauVariant: 'toan_thu',
      ziHourMode: 'split_next_day',
      leapMonthMode: 'split_day_15',
      yearBoundaryMode: 'lunar_new_year',
      khoiVietVariant: 'vn_standard'
    }
  },
  bac_phai_kham_thien: {
    name: 'Bắc Phái Khâm Thiên Môn',
    desc: 'Canh: Đồng(Khoa)-Âm(Kỵ), Khôi Việt Bắc Phái (Canh Sửu/Mùi), Vãn Tý sang ngày mới',
    ruleset: {
      schoolPreset: 'bac_phai_kham_thien',
      canhVariant: 'bac_phai_alt',
      nhamVariant: 'vn_standard',
      mauVariant: 'vn_standard',
      ziHourMode: 'split_next_day',
      leapMonthMode: 'previous_month',
      yearBoundaryMode: 'lunar_new_year',
      khoiVietVariant: 'bac_phai'
    }
  },
  trung_chau: {
    name: 'Trung Châu Phái (Vương Đình Chi)',
    desc: 'Canh: Âm(Khoa)-Đồng(Kỵ), Nhâm: Phủ(Khoa), Mậu: Dương(Khoa), Vãn Tý sang ngày',
    ruleset: {
      schoolPreset: 'trung_chau',
      canhVariant: 'vn_standard',
      nhamVariant: 'toan_thu',
      mauVariant: 'toan_thu',
      ziHourMode: 'split_next_day',
      leapMonthMode: 'split_day_15',
      yearBoundaryMode: 'lunar_new_year',
      khoiVietVariant: 'vn_standard'
    }
  },
  custom: {
    name: 'Phái Luật Riêng (Tự Định)',
    desc: 'Tùy biến toàn bộ tham số Tứ Hóa, Giờ Tý, Tháng Nhuận và Mốc Năm Sinh',
    ruleset: {
      schoolPreset: 'custom',
      canhVariant: 'vn_standard',
      nhamVariant: 'vn_standard',
      mauVariant: 'vn_standard',
      ziHourMode: 'keep_current_day',
      leapMonthMode: 'previous_month',
      yearBoundaryMode: 'lunar_new_year',
      khoiVietVariant: 'vn_standard'
    }
  }
};

export const CustomRulesetDrawer: React.FC<CustomRulesetDrawerProps> = ({
  isOpen,
  onClose,
  currentRuleset,
  onApplyRuleset
}) => {
  const [ruleset, setRuleset] = useState<TuViRuleset>(() => {
    return currentRuleset || PRESET_CONFIGS.nam_phai_vn.ruleset;
  });
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectPreset = (presetKey: SchoolPreset) => {
    const target = PRESET_CONFIGS[presetKey]?.ruleset || PRESET_CONFIGS.nam_phai_vn.ruleset;
    setRuleset({ ...target, schoolPreset: presetKey });
  };

  const handleSaveAsCustom = () => {
    const customConfig = { ...ruleset, schoolPreset: 'custom' as SchoolPreset };
    try {
      localStorage.setItem('tuvi_custom_ruleset', JSON.stringify(customConfig));
      setSavedSuccessMsg('Đã lưu cấu hình Phái Luật Riêng vào bộ nhớ máy!');
      setTimeout(() => setSavedSuccessMsg(null), 3000);
    } catch {}
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyRuleset(ruleset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 animate-fadeIn" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-paper-card dark:bg-night-card border-l-2 border-paper-gold/80 dark:border-night-gold/80 h-full overflow-y-auto p-5 sm:p-6 shadow-2xl space-y-5 rounded-none relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner Accents */}
        <IconMeanderCorner position="tl" className="absolute top-1 left-1 w-4 h-4 text-paper-gold/70" />
        <IconMeanderCorner position="bl" className="absolute bottom-1 left-1 w-4 h-4 text-paper-gold/70" />

        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-3 border-b border-paper-border dark:border-night-border">
          <div className="flex items-center gap-2">
            <IconAnTrien className="w-5 h-5 text-paper-red dark:text-night-gold" />
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-paper-red dark:text-night-gold">
                Cài Đặt Phái Luật Riêng
              </h3>
              <p className="text-[11px] text-paper-muted dark:text-night-muted">
                Tùy biến bảng Tứ Hóa, Giờ Tý, Tháng Nhuận & Mốc Đổi Năm
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-paper-muted dark:text-night-muted hover:text-paper-text text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {savedSuccessMsg && (
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs">
            {savedSuccessMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Presets Nhanh */}
          <div>
            <label className="block font-serif font-bold text-paper-text dark:text-night-text mb-1.5">
              1. Chọn Nhanh Bản Quy Ước Mẫu (Preset)
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(Object.keys(PRESET_CONFIGS) as SchoolPreset[]).map((key) => {
                const p = PRESET_CONFIGS[key];
                const isSelected = ruleset.schoolPreset === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectPreset(key)}
                    className={`p-2 border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-paper-red bg-paper-red/10 text-paper-red dark:border-night-red dark:text-night-gold font-bold shadow-xs'
                        : 'border-paper-border dark:border-night-border bg-paper-cardAlt dark:bg-night-cardAlt text-paper-muted hover:border-paper-gold'
                    }`}
                  >
                    <div className="font-serif text-[11px]">{p.name}</div>
                    <div className="text-[9px] opacity-75 line-clamp-1 mt-0.5">{p.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 1. Biến Thể Tứ Hóa */}
          <div className="space-y-2.5 pt-2 border-t border-paper-border/60 dark:border-night-border/60">
            <h4 className="font-serif font-bold text-paper-red dark:text-night-gold flex items-center gap-1.5">
              <IconLaKinh className="w-3.5 h-3.5" />
              2. Biến Thể Bảng Tứ Hóa Thập Can
            </h4>

            {/* Canh Variant */}
            <div className="p-2 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-border/60">
              <label className="block font-serif font-medium mb-1">
                Tứ Hóa Can Canh:
              </label>
              <select
                value={ruleset.canhVariant || 'vn_standard'}
                onChange={(e) => setRuleset({ ...ruleset, canhVariant: e.target.value as CanhVariant, schoolPreset: 'custom' })}
                className="w-full p-1.5 bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border rounded-none"
              >
                <option value="vn_standard">Nhật(Lộc) - Vũ(Quyền) - Âm(Khoa) - Đồng(Kỵ) [Chuẩn VN]</option>
                <option value="toan_thu">Nhật(Lộc) - Vũ(Quyền) - Phủ(Khoa) - Đồng(Kỵ) [Toàn Thư]</option>
                <option value="bac_phai_alt">Nhật(Lộc) - Vũ(Quyền) - Đồng(Khoa) - Âm(Kỵ) [Bắc Phái]</option>
              </select>
            </div>

            {/* Nhâm Variant */}
            <div className="p-2 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-border/60">
              <label className="block font-serif font-medium mb-1">
                Tứ Hóa Can Nhâm:
              </label>
              <select
                value={ruleset.nhamVariant || 'vn_standard'}
                onChange={(e) => setRuleset({ ...ruleset, nhamVariant: e.target.value as NhamVariant, schoolPreset: 'custom' })}
                className="w-full p-1.5 bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border rounded-none"
              >
                <option value="vn_standard">Lương(Lộc) - Tử(Quyền) - Tả Phù(Khoa) - Vũ(Kỵ) [Chuẩn VN]</option>
                <option value="toan_thu">Lương(Lộc) - Tử(Quyền) - Thiên Phủ(Khoa) - Vũ(Kỵ) [Toàn Thư/Trung Châu]</option>
              </select>
            </div>

            {/* Mậu Variant */}
            <div className="p-2 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-border/60">
              <label className="block font-serif font-medium mb-1">
                Tứ Hóa Can Mậu:
              </label>
              <select
                value={ruleset.mauVariant || 'vn_standard'}
                onChange={(e) => setRuleset({ ...ruleset, mauVariant: e.target.value as MauVariant, schoolPreset: 'custom' })}
                className="w-full p-1.5 bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border rounded-none"
              >
                <option value="vn_standard">Tham(Lộc) - Âm(Quyền) - Hữu Bật(Khoa) - Cơ(Kỵ) [Chuẩn VN]</option>
                <option value="toan_thu">Tham(Lộc) - Âm(Quyền) - Thái Dương(Khoa) - Cơ(Kỵ) [Toàn Thư]</option>
              </select>
            </div>
          </div>

          {/* 2. Quy Tắc Thời Gian & Lịch Pháp */}
          <div className="space-y-2.5 pt-2 border-t border-paper-border/60 dark:border-night-border/60">
            <h4 className="font-serif font-bold text-paper-red dark:text-night-gold">
              3. Quy Tắc Giờ Tý, Tháng Nhuận & Mốc Đổi Năm
            </h4>

            {/* Giờ Tý */}
            <div className="p-2 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-border/60">
              <label className="block font-serif font-medium mb-1">
                Giờ Tý (23h00 - 00h00 - Vãn Tý):
              </label>
              <select
                value={ruleset.ziHourMode || 'keep_current_day'}
                onChange={(e) => setRuleset({ ...ruleset, ziHourMode: e.target.value as ZiHourMode, schoolPreset: 'custom' })}
                className="w-full p-1.5 bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border rounded-none"
              >
                <option value="keep_current_day">Giữ nguyên ngày cũ (Chuẩn phổ thông Việt Nam)</option>
                <option value="split_next_day">Tính sang ngày hôm sau (Khâm Thiên / Bát Tự / Vãn Tý)</option>
              </select>
            </div>

            {/* Tháng Nhuận */}
            <div className="p-2 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-border/60">
              <label className="block font-serif font-medium mb-1">
                Tháng Nhuận (Leap Month):
              </label>
              <select
                value={ruleset.leapMonthMode || 'previous_month'}
                onChange={(e) => setRuleset({ ...ruleset, leapMonthMode: e.target.value as LeapMonthMode, schoolPreset: 'custom' })}
                className="w-full p-1.5 bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border rounded-none"
              >
                <option value="previous_month">Tính theo tháng trước (Toàn bộ ngày nhuận an theo tháng chính)</option>
                <option value="split_day_15">Nửa trước tháng trước, nửa sau tháng sau (Ngày 1–15 theo tháng trước, 16–30 theo sau)</option>
                <option value="next_month">Đẩy sang tháng sau (Tính hoàn toàn theo tháng kế tiếp)</option>
              </select>
            </div>

            {/* Mốc Năm */}
            <div className="p-2 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-border/60">
              <label className="block font-serif font-medium mb-1">
                Mốc Chuyển Năm Sinh:
              </label>
              <select
                value={ruleset.yearBoundaryMode || 'lunar_new_year'}
                onChange={(e) => setRuleset({ ...ruleset, yearBoundaryMode: e.target.value as YearBoundaryMode, schoolPreset: 'custom' })}
                className="w-full p-1.5 bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border rounded-none"
              >
                <option value="lunar_new_year">Mùng 1 Tết Âm Lịch (Chuẩn Tử Vi Toàn Thư & Nam Phái)</option>
                <option value="lichun">Tiết Lập Xuân ~ 4/2 Dương Lịch (Trường phái Bát Tự giao thoa)</option>
              </select>
            </div>

            {/* Khôi Việt Variant */}
            <div className="p-2 bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-border/60">
              <label className="block font-serif font-medium mb-1">
                An Sao Thiên Khôi / Thiên Việt:
              </label>
              <select
                value={ruleset.khoiVietVariant || 'vn_standard'}
                onChange={(e) => setRuleset({ ...ruleset, khoiVietVariant: e.target.value as KhoiVietVariant, schoolPreset: 'custom' })}
                className="w-full p-1.5 bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border rounded-none"
              >
                <option value="vn_standard">Chuẩn Nam Phái VN (Canh: Ngọ Khôi / Dần Việt)</option>
                <option value="bac_phai">Bắc Phái (Canh: Sửu Khôi / Mùi Việt; Tân: Dần Khôi / Ngọ Việt)</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-paper-border dark:border-night-border flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleSaveAsCustom}
              className="px-3 py-2 border border-paper-border hover:border-paper-gold text-paper-text dark:text-night-text bg-paper-cardAlt dark:bg-night-cardAlt transition-all cursor-pointer font-serif"
            >
              Lưu Thành Phái Luật Riêng
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-paper-red text-white hover:bg-paper-redHover font-serif font-bold transition-all cursor-pointer shadow-xs"
            >
              Áp Dụng Phái Luật Này
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
