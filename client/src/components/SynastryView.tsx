import React, { useState } from 'react';
import { ChartData, TuViInput } from '../types';
import { SynastryResult, calculateSynastry } from '../engine/synastry';
import { generateTuViChart } from '../engine';
import { safeJsonFetch } from '../utils/api';
import {
  IconBatQuai,
  IconThaiCuc,
  IconLaKinh,
  IconAnTrien,
  IconMeanderCorner
} from './OrientalIcons';
import { ArrowRight, ArrowLeftRight, Heart, Briefcase, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface SynastryViewProps {
  currentChart: ChartData | null;
  onBackToMain: () => void;
}

export const SynastryView: React.FC<SynastryViewProps> = ({ currentChart, onBackToMain }) => {
  const [purpose, setPurpose] = useState<'marriage' | 'business'>('marriage');

  // Person A
  const [nameA, setNameA] = useState(currentChart?.thienBan.fullName || 'Người Thứ Nhất');
  const [genderA, setGenderA] = useState<'male' | 'female'>(currentChart?.thienBan.gender === 'Nữ' ? 'female' : 'male');
  const [dayA, setDayA] = useState(28);
  const [monthA, setMonthA] = useState(10);
  const [yearA, setYearA] = useState(1999);
  const [hourA, setHourA] = useState(7);
  const [minuteA, setMinuteA] = useState(30);

  // Person B
  const [nameB, setNameB] = useState('Người Thứ Hai');
  const [genderB, setGenderB] = useState<'male' | 'female'>('female');
  const [dayB, setDayB] = useState(15);
  const [monthB, setMonthB] = useState(8);
  const [yearB, setYearB] = useState(2001);
  const [hourB, setHourB] = useState(11);
  const [minuteB, setMinuteB] = useState(30);

  const [isLoading, setIsLoading] = useState(false);
  const [synastryResult, setSynastryResult] = useState<SynastryResult | null>(null);

  const handleRunSynastry = async () => {
    setIsLoading(true);
    try {
      // 1. Generate or use charts
      const inputA: TuViInput = {
        fullName: nameA.trim() || 'Người A',
        gender: genderA,
        calendarType: 'solar',
        day: Number(dayA),
        month: Number(monthA),
        year: Number(yearA),
        hour: Number(hourA),
        minute: Number(minuteA)
      };

      const inputB: TuViInput = {
        fullName: nameB.trim() || 'Người B',
        gender: genderB,
        calendarType: 'solar',
        day: Number(dayB),
        month: Number(monthB),
        year: Number(yearB),
        hour: Number(hourB),
        minute: Number(minuteB)
      };

      const chartA = currentChart && currentChart.thienBan.fullName === nameA
        ? currentChart
        : generateTuViChart(inputA);
      const chartB = generateTuViChart(inputB);

      // Attempt server API first
      const res = await safeJsonFetch<{ success: boolean; data: SynastryResult }>('/api/laso/synastry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chartA, chartB, purpose })
      });

      if (res.ok && res.data?.success && res.data?.data) {
        setSynastryResult(res.data.data);
      } else {
        // In-browser fallback
        const clientRes = calculateSynastry(chartA, chartB, purpose);
        setSynastryResult(clientRes);
      }
    } catch {
      // Direct client fallback
      const cA = generateTuViChart({
        fullName: nameA,
        gender: genderA,
        calendarType: 'solar',
        day: dayA,
        month: monthA,
        year: yearA,
        hour: hourA,
        minute: minuteA
      });
      const cB = generateTuViChart({
        fullName: nameB,
        gender: genderB,
        calendarType: 'solar',
        day: dayB,
        month: monthB,
        year: yearB,
        hour: hourB,
        minute: minuteB
      });
      setSynastryResult(calculateSynastry(cA, cB, purpose));
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        document.getElementById('synastry-result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-paper-border dark:border-night-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-serif font-bold text-paper-red dark:text-night-gold bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-gold/30">
            <IconBatQuai className="w-3.5 h-3.5" />
            <span>HỢP BÀN ĐẨU SỐ TOÀN THƯ</span>
          </div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-paper-red dark:text-night-gold mt-1">
            Hợp Bàn Chồng Lá Số — Phi Tinh Tương Tác
          </h1>
          <p className="text-xs text-paper-muted dark:text-night-muted">
            Khảo sát Can Cung Mệnh/Tài/Phối bay Tứ Hóa 2 chiều • Hòa hợp Địa Chi & Ngũ Hành Nạp Âm
          </p>
        </div>
        <button
          onClick={onBackToMain}
          className="px-3 py-1.5 rounded-none text-xs font-serif font-bold text-paper-red dark:text-night-gold border border-paper-border dark:border-night-border hover:bg-paper-gold/10 transition-colors cursor-pointer"
        >
          ← Quay lại Lá Số Cá Nhân
        </button>
      </div>

      {/* Purpose Switcher */}
      <div className="bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border p-3 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-serif font-bold text-paper-text dark:text-night-text">
          Mục đích hợp bàn:
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPurpose('marriage')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs font-serif font-bold cursor-pointer transition-colors ${
              purpose === 'marriage'
                ? 'bg-paper-red text-paper-bg dark:bg-night-red dark:text-night-bg border border-paper-red'
                : 'border border-paper-border dark:border-night-border text-paper-muted dark:text-night-muted hover:border-paper-gold'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Hợp Hôn & Duyên Nợ Lứa Đôi</span>
          </button>
          <button
            type="button"
            onClick={() => setPurpose('business')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs font-serif font-bold cursor-pointer transition-colors ${
              purpose === 'business'
                ? 'bg-paper-red text-paper-bg dark:bg-night-red dark:text-night-bg border border-paper-red'
                : 'border border-paper-border dark:border-night-border text-paper-muted dark:text-night-muted hover:border-paper-gold'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Hợp Tác Đầu Tư & Kinh Doanh</span>
          </button>
        </div>
      </div>

      {/* 2-Person Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Person A Card */}
        <div className="relative bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border p-4 space-y-3">
          <IconMeanderCorner position="tl" className="absolute top-1 left-1 w-3.5 h-3.5 text-paper-gold/60" />
          <div className="flex items-center justify-between pb-2 border-b border-paper-border/60">
            <span className="font-serif text-sm font-bold text-paper-red dark:text-night-gold flex items-center gap-1.5">
              <IconAnTrien className="w-3.5 h-3.5 text-paper-gold" />
              <span>Đương Số Thứ Nhất (Người A)</span>
            </span>
            <span className="text-2xs text-paper-muted dark:text-night-muted uppercase tracking-wider">Chủ Thể</span>
          </div>
          <div>
            <label className="block text-2xs font-serif text-paper-muted dark:text-night-muted mb-1">Họ và tên</label>
            <input
              type="text"
              value={nameA}
              onChange={(e) => setNameA(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border text-paper-text dark:text-night-text rounded-none focus:outline-none focus:border-paper-red"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-2xs font-serif text-paper-muted dark:text-night-muted mb-1">Giới tính</label>
              <select
                value={genderA}
                onChange={(e) => setGenderA(e.target.value as any)}
                className="w-full px-2 py-1.5 text-xs bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border text-paper-text dark:text-night-text rounded-none"
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </select>
            </div>
            <div>
              <label className="block text-2xs font-serif text-paper-muted dark:text-night-muted mb-1">Năm sinh</label>
              <input
                type="number"
                value={yearA}
                onChange={(e) => setYearA(Number(e.target.value))}
                className="w-full px-2 py-1.5 text-xs bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border text-paper-text dark:text-night-text rounded-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-2xs font-serif text-paper-muted dark:text-night-muted mb-1">Ngày (DL)</label>
              <input
                type="number"
                value={dayA}
                onChange={(e) => setDayA(Number(e.target.value))}
                className="w-full px-2 py-1.5 text-xs bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border text-paper-text dark:text-night-text rounded-none"
              />
            </div>
            <div>
              <label className="block text-2xs font-serif text-paper-muted dark:text-night-muted mb-1">Tháng (DL)</label>
              <input
                type="number"
                value={monthA}
                onChange={(e) => setMonthA(Number(e.target.value))}
                className="w-full px-2 py-1.5 text-xs bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border text-paper-text dark:text-night-text rounded-none"
              />
            </div>
            <div>
              <label className="block text-2xs font-serif text-paper-muted dark:text-night-muted mb-1">Giờ sinh</label>
              <select
                value={hourA}
                onChange={(e) => setHourA(Number(e.target.value))}
                className="w-full px-2 py-1.5 text-xs bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border text-paper-text dark:text-night-text rounded-none"
              >
                <option value={23}>Tý (23h-1h)</option>
                <option value={1}>Sửu (1h-3h)</option>
                <option value={3}>Dần (3h-5h)</option>
                <option value={5}>Mão (5h-7h)</option>
                <option value={7}>Thìn (7h-9h)</option>
                <option value={9}>Tỵ (9h-11h)</option>
                <option value={11}>Ngọ (11h-13h)</option>
                <option value={13}>Mùi (13h-15h)</option>
                <option value={15}>Thân (15h-17h)</option>
                <option value={17}>Dậu (17h-19h)</option>
                <option value={19}>Tuất (19h-21h)</option>
                <option value={21}>Hợi (21h-23h)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Person B Card */}
        <div className="relative bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border p-4 space-y-3">
          <IconMeanderCorner position="tr" className="absolute top-1 right-1 w-3.5 h-3.5 text-paper-gold/60" />
          <div className="flex items-center justify-between pb-2 border-b border-paper-border/60">
            <span className="font-serif text-sm font-bold text-paper-gold dark:text-night-gold flex items-center gap-1.5">
              <IconAnTrien className="w-3.5 h-3.5 text-paper-red" />
              <span>Đối Tượng So Khớp (Người B)</span>
            </span>
            <span className="text-2xs text-paper-muted dark:text-night-muted uppercase tracking-wider">Khách Thể</span>
          </div>
          <div>
            <label className="block text-2xs font-serif text-paper-muted dark:text-night-muted mb-1">Họ và tên</label>
            <input
              type="text"
              value={nameB}
              onChange={(e) => setNameB(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border text-paper-text dark:text-night-text rounded-none focus:outline-none focus:border-paper-gold"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-2xs font-serif text-paper-muted dark:text-night-muted mb-1">Giới tính</label>
              <select
                value={genderB}
                onChange={(e) => setGenderB(e.target.value as any)}
                className="w-full px-2 py-1.5 text-xs bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border text-paper-text dark:text-night-text rounded-none"
              >
                <option value="female">Nữ</option>
                <option value="male">Nam</option>
              </select>
            </div>
            <div>
              <label className="block text-2xs font-serif text-paper-muted dark:text-night-muted mb-1">Năm sinh</label>
              <input
                type="number"
                value={yearB}
                onChange={(e) => setYearB(Number(e.target.value))}
                className="w-full px-2 py-1.5 text-xs bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border text-paper-text dark:text-night-text rounded-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-2xs font-serif text-paper-muted dark:text-night-muted mb-1">Ngày (DL)</label>
              <input
                type="number"
                value={dayB}
                onChange={(e) => setDayB(Number(e.target.value))}
                className="w-full px-2 py-1.5 text-xs bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border text-paper-text dark:text-night-text rounded-none"
              />
            </div>
            <div>
              <label className="block text-2xs font-serif text-paper-muted dark:text-night-muted mb-1">Tháng (DL)</label>
              <input
                type="number"
                value={monthB}
                onChange={(e) => setMonthB(Number(e.target.value))}
                className="w-full px-2 py-1.5 text-xs bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border text-paper-text dark:text-night-text rounded-none"
              />
            </div>
            <div>
              <label className="block text-2xs font-serif text-paper-muted dark:text-night-muted mb-1">Giờ sinh</label>
              <select
                value={hourB}
                onChange={(e) => setHourB(Number(e.target.value))}
                className="w-full px-2 py-1.5 text-xs bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border text-paper-text dark:text-night-text rounded-none"
              >
                <option value={23}>Tý (23h-1h)</option>
                <option value={1}>Sửu (1h-3h)</option>
                <option value={3}>Dần (3h-5h)</option>
                <option value={5}>Mão (5h-7h)</option>
                <option value={7}>Thìn (7h-9h)</option>
                <option value={9}>Tỵ (9h-11h)</option>
                <option value={11}>Ngọ (11h-13h)</option>
                <option value={13}>Mùi (13h-15h)</option>
                <option value={15}>Thân (15h-17h)</option>
                <option value={17}>Dậu (17h-19h)</option>
                <option value={19}>Tuất (19h-21h)</option>
                <option value={21}>Hợi (21h-23h)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center pt-2">
        <button
          type="button"
          disabled={isLoading}
          onClick={handleRunSynastry}
          className="px-6 py-3 bg-paper-red hover:bg-paper-redHover text-paper-bg dark:bg-night-red dark:text-night-bg text-xs sm:text-sm font-serif font-bold tracking-widest border border-paper-gold uppercase cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-2 mx-auto"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-paper-bg border-t-transparent rounded-none animate-spin" />
              <span>Đang tính toán Phi Tinh tương tác 2 chiều...</span>
            </>
          ) : (
            <>
              <ArrowLeftRight className="w-4 h-4" />
              <span>TIẾN HÀNH HỢP BÀN PHI TINH</span>
            </>
          )}
        </button>
      </div>

      {/* Synastry Results Section */}
      {synastryResult && (
        <div id="synastry-result-section" className="space-y-6 pt-4 border-t-2 border-paper-gold/40">
          {/* 1. Overall Verdict Banner */}
          <div className="bg-paper-card dark:bg-night-card border-2 border-paper-gold/60 p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-2xs text-paper-muted dark:text-night-muted uppercase tracking-wider">
                  Kết Luận Tổng Quan
                </span>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-paper-red dark:text-night-gold">
                  {synastryResult.overallVerdict.title}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-2xs text-paper-muted dark:text-night-muted block">Điểm hòa hợp</span>
                  <span className="font-serif text-2xl font-bold text-paper-red dark:text-night-gold">
                    {synastryResult.totalScore}/100
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-paper-text dark:text-night-text leading-relaxed">
              {synastryResult.overallVerdict.summary}
            </p>

            {/* Branch Harmony Quick Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-paper-border/60 text-2xs">
              <div className="p-2 bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border">
                <span className="text-paper-muted dark:text-night-muted block">Địa Chi Năm Sinh:</span>
                <span className="font-bold text-paper-text dark:text-night-text">
                  {synastryResult.branchHarmony.yearBranchRelation}
                </span>
              </div>
              <div className="p-2 bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border">
                <span className="text-paper-muted dark:text-night-muted block">Địa Chi Cung Mệnh:</span>
                <span className="font-bold text-paper-text dark:text-night-text">
                  {synastryResult.branchHarmony.menhBranchRelation}
                </span>
              </div>
              <div className="p-2 bg-paper-bg dark:bg-night-bg border border-paper-border dark:border-night-border">
                <span className="text-paper-muted dark:text-night-muted block">Ngũ Hành Nạp Âm:</span>
                <span className="font-bold text-paper-text dark:text-night-text">
                  {synastryResult.branchHarmony.napAmRelation}
                </span>
              </div>
            </div>
          </div>

          {/* 2. 4-Axis Quantitative Gauges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {synastryResult.scores.map((s) => (
              <div
                key={s.axis}
                className="bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-xs font-bold text-paper-text dark:text-night-text">
                    {s.label}
                  </span>
                  <span className={`font-serif text-sm font-bold ${
                    s.score >= 75 ? 'text-emerald-700 dark:text-emerald-400' : s.score >= 55 ? 'text-amber-700 dark:text-amber-400' : 'text-rose-700 dark:text-rose-400'
                  }`}>
                    {s.score}%
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-paper-border dark:bg-night-border">
                  <div
                    className={`h-full ${
                      s.score >= 75 ? 'bg-emerald-600' : s.score >= 55 ? 'bg-amber-600' : 'bg-rose-600'
                    }`}
                    style={{ width: `${s.score}%` }}
                  />
                </div>
                <p className="text-2xs text-paper-muted dark:text-night-muted leading-tight">
                  {s.assessment}
                </p>
              </div>
            ))}
          </div>

          {/* 3. 2-Way Phi Tinh Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* AtoB */}
            <div className="bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-paper-border/60">
                <span className="font-serif text-xs font-bold text-paper-red dark:text-night-gold flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-paper-gold" />
                  <span>{synastryResult.phiHoaAtoB.fromPersonName} Phi Hóa sang {synastryResult.phiHoaAtoB.toPersonName}</span>
                </span>
                <span className="text-2xs text-paper-muted dark:text-night-muted">A → B</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-emerald-50/50 dark:bg-emerald-950/20 border-l-2 border-emerald-600">
                  <div className="font-bold text-emerald-800 dark:text-emerald-300">
                    Hóa Lộc ({synastryResult.phiHoaAtoB.loc.starName}) → Cung {synastryResult.phiHoaAtoB.loc.targetPalaceName} của {synastryResult.phiHoaAtoB.toPersonName}
                  </div>
                  <p className="text-2xs text-paper-text dark:text-night-text mt-0.5">
                    {synastryResult.phiHoaAtoB.loc.meaning}
                  </p>
                </div>
                <div className="p-2 bg-blue-50/50 dark:bg-blue-950/20 border-l-2 border-blue-600">
                  <div className="font-bold text-blue-800 dark:text-blue-300">
                    Hóa Quyền ({synastryResult.phiHoaAtoB.quyen.starName}) → Cung {synastryResult.phiHoaAtoB.quyen.targetPalaceName} của {synastryResult.phiHoaAtoB.toPersonName}
                  </div>
                  <p className="text-2xs text-paper-text dark:text-night-text mt-0.5">
                    {synastryResult.phiHoaAtoB.quyen.meaning}
                  </p>
                </div>
                <div className="p-2 bg-amber-50/50 dark:bg-amber-950/20 border-l-2 border-amber-600">
                  <div className="font-bold text-amber-800 dark:text-amber-300">
                    Hóa Khoa ({synastryResult.phiHoaAtoB.khoa.starName}) → Cung {synastryResult.phiHoaAtoB.khoa.targetPalaceName} của {synastryResult.phiHoaAtoB.toPersonName}
                  </div>
                  <p className="text-2xs text-paper-text dark:text-night-text mt-0.5">
                    {synastryResult.phiHoaAtoB.khoa.meaning}
                  </p>
                </div>
                <div className="p-2 bg-rose-50/50 dark:bg-rose-950/20 border-l-2 border-rose-600">
                  <div className="font-bold text-rose-800 dark:text-rose-300">
                    Hóa Kỵ ({synastryResult.phiHoaAtoB.ky.starName}) → Cung {synastryResult.phiHoaAtoB.ky.targetPalaceName} (xung Cung {synastryResult.phiHoaAtoB.ky.xungPalaceName})
                  </div>
                  <p className="text-2xs text-paper-text dark:text-night-text mt-0.5">
                    {synastryResult.phiHoaAtoB.ky.meaning}
                  </p>
                </div>
              </div>
            </div>

            {/* BtoA */}
            <div className="bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-paper-border/60">
                <span className="font-serif text-xs font-bold text-paper-gold dark:text-night-gold flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-paper-red" />
                  <span>{synastryResult.phiHoaBtoA.fromPersonName} Phi Hóa sang {synastryResult.phiHoaBtoA.toPersonName}</span>
                </span>
                <span className="text-2xs text-paper-muted dark:text-night-muted">B → A</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-emerald-50/50 dark:bg-emerald-950/20 border-l-2 border-emerald-600">
                  <div className="font-bold text-emerald-800 dark:text-emerald-300">
                    Hóa Lộc ({synastryResult.phiHoaBtoA.loc.starName}) → Cung {synastryResult.phiHoaBtoA.loc.targetPalaceName} của {synastryResult.phiHoaBtoA.toPersonName}
                  </div>
                  <p className="text-2xs text-paper-text dark:text-night-text mt-0.5">
                    {synastryResult.phiHoaBtoA.loc.meaning}
                  </p>
                </div>
                <div className="p-2 bg-blue-50/50 dark:bg-blue-950/20 border-l-2 border-blue-600">
                  <div className="font-bold text-blue-800 dark:text-blue-300">
                    Hóa Quyền ({synastryResult.phiHoaBtoA.quyen.starName}) → Cung {synastryResult.phiHoaBtoA.quyen.targetPalaceName} của {synastryResult.phiHoaBtoA.toPersonName}
                  </div>
                  <p className="text-2xs text-paper-text dark:text-night-text mt-0.5">
                    {synastryResult.phiHoaBtoA.quyen.meaning}
                  </p>
                </div>
                <div className="p-2 bg-amber-50/50 dark:bg-amber-950/20 border-l-2 border-amber-600">
                  <div className="font-bold text-amber-800 dark:text-amber-300">
                    Hóa Khoa ({synastryResult.phiHoaBtoA.khoa.starName}) → Cung {synastryResult.phiHoaBtoA.khoa.targetPalaceName} của {synastryResult.phiHoaBtoA.toPersonName}
                  </div>
                  <p className="text-2xs text-paper-text dark:text-night-text mt-0.5">
                    {synastryResult.phiHoaBtoA.khoa.meaning}
                  </p>
                </div>
                <div className="p-2 bg-rose-50/50 dark:bg-rose-950/20 border-l-2 border-rose-600">
                  <div className="font-bold text-rose-800 dark:text-rose-300">
                    Hóa Kỵ ({synastryResult.phiHoaBtoA.ky.starName}) → Cung {synastryResult.phiHoaBtoA.ky.targetPalaceName} (xung Cung {synastryResult.phiHoaBtoA.ky.xungPalaceName})
                  </div>
                  <p className="text-2xs text-paper-text dark:text-night-text mt-0.5">
                    {synastryResult.phiHoaBtoA.ky.meaning}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Strengths, Cautions & Remedy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border p-4 space-y-2">
              <span className="font-serif text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Điểm Cộng Tương Hỗ (Cát Khí)</span>
              </span>
              <ul className="space-y-1.5 text-xs text-paper-text dark:text-night-text">
                {synastryResult.overallVerdict.strengths.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-paper-card dark:bg-night-card border border-paper-border dark:border-night-border p-4 space-y-2">
              <span className="font-serif text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Điểm Cần Lưu Ý & Nhượng Bộ</span>
              </span>
              <ul className="space-y-1.5 text-xs text-paper-text dark:text-night-text">
                {synastryResult.overallVerdict.cautions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Remedy Box */}
          <div className="bg-paper-cardAlt dark:bg-night-cardAlt border border-paper-gold/60 p-4 space-y-1.5">
            <span className="font-serif text-xs font-bold text-paper-red dark:text-night-gold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-paper-gold" />
              <span>Phương Pháp Hóa Giải & Lời Khuyên Của Thầy</span>
            </span>
            <p className="text-xs text-paper-text dark:text-night-text leading-relaxed">
              {synastryResult.overallVerdict.remedy}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
