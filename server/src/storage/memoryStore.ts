import fs from 'fs';
import path from 'path';
import { ChartData } from '../engine/tuvi/types.js';
import { ClientChartRecord, VerificationNote } from '../models/ClientChart.js';

export interface MasterBrandConfig {
  brandName: string;
  sealText: string;
  contactInfo: string;
  subtitle?: string;
  logoUrl?: string;
  enabled: boolean;
}

const DEFAULT_BRAND: MasterBrandConfig = {
  brandName: 'Tử Vi Minh Khuê',
  sealText: 'Minh Khuê',
  contactInfo: 'Tư Vấn Tử Vi & Mệnh Lý Học Thuật',
  subtitle: 'Đẩu Số Toàn Thư • Khâm Thiên Môn',
  enabled: false
};

class MemoryStore {
  private charts: Map<string, ChartData> = new Map();
  private clientCharts: Map<string, ClientChartRecord> = new Map();
  private brandConfig: MasterBrandConfig = { ...DEFAULT_BRAND };
  private dataDir: string;
  private dataFilePath: string;
  private crmFilePath: string;
  private brandFilePath: string;

  constructor() {
    this.dataDir = path.resolve(process.cwd(), 'data');
    this.dataFilePath = path.join(this.dataDir, 'charts_fallback.json');
    this.crmFilePath = path.join(this.dataDir, 'crm_fallback.json');
    this.brandFilePath = path.join(this.dataDir, 'brand_fallback.json');
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    try {
      if (fs.existsSync(this.dataFilePath)) {
        const raw = fs.readFileSync(this.dataFilePath, 'utf-8');
        const list: ChartData[] = JSON.parse(raw);
        for (const item of list) {
          if (item.id) {
            this.charts.set(item.id, item);
          }
        }
      }
    } catch {
      // Ignore disk load error
    }

    try {
      if (fs.existsSync(this.crmFilePath)) {
        const raw = fs.readFileSync(this.crmFilePath, 'utf-8');
        const list: ClientChartRecord[] = JSON.parse(raw);
        for (const item of list) {
          if (item.id) {
            this.clientCharts.set(item.id, item);
          }
        }
      }
    } catch {
      // Ignore
    }

    try {
      if (fs.existsSync(this.brandFilePath)) {
        const raw = fs.readFileSync(this.brandFilePath, 'utf-8');
        this.brandConfig = JSON.parse(raw);
      }
    } catch {
      // Ignore
    }
  }

  private persistCharts(): void {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      fs.writeFileSync(this.dataFilePath, JSON.stringify(Array.from(this.charts.values()), null, 2), 'utf-8');
    } catch {}
  }

  private persistCrm(): void {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      fs.writeFileSync(this.crmFilePath, JSON.stringify(Array.from(this.clientCharts.values()), null, 2), 'utf-8');
    } catch {}
  }

  private persistBrand(): void {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      fs.writeFileSync(this.brandFilePath, JSON.stringify(this.brandConfig, null, 2), 'utf-8');
    } catch {}
  }

  // --- Chart history methods ---
  public saveChart(chart: ChartData): ChartData {
    const id = chart.id || `chart_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const savedChart: ChartData = {
      ...chart,
      id,
      createdAt: chart.createdAt || new Date().toISOString()
    };
    this.charts.set(id, savedChart);
    this.persistCharts();
    return savedChart;
  }

  public getChartById(id: string): ChartData | null {
    return this.charts.get(id) || null;
  }

  public getRecentCharts(limit = 10): ChartData[] {
    const all = Array.from(this.charts.values());
    all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return all.slice(0, limit);
  }

  // --- CRM Client Methods ---
  public saveClientChart(record: Omit<ClientChartRecord, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): ClientChartRecord {
    const id = record.id || `crm_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date().toISOString();
    const existing = this.clientCharts.get(id);

    const clientRecord: ClientChartRecord = {
      ...record,
      id,
      tags: record.tags && record.tags.length > 0 ? record.tags : ['Gia đình'],
      verificationLogs: record.verificationLogs || [],
      createdAt: existing ? existing.createdAt : now,
      updatedAt: now
    };

    this.clientCharts.set(id, clientRecord);
    this.persistCrm();
    return clientRecord;
  }

  public getClientCharts(filter?: { search?: string; tag?: string }): ClientChartRecord[] {
    let list = Array.from(this.clientCharts.values());

    if (filter?.tag && filter.tag !== 'Tất cả') {
      list = list.filter(c => c.tags && c.tags.includes(filter.tag!));
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(c =>
        c.fullName.toLowerCase().includes(q) ||
        (c.phone && c.phone.toLowerCase().includes(q)) ||
        (c.notes && c.notes.toLowerCase().includes(q)) ||
        (c.birthDate && c.birthDate.includes(q)) ||
        (c.tags && c.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return list;
  }

  public getClientChartById(id: string): ClientChartRecord | null {
    return this.clientCharts.get(id) || null;
  }

  public updateClientChart(id: string, updates: Partial<ClientChartRecord>): ClientChartRecord | null {
    const existing = this.clientCharts.get(id);
    if (!existing) return null;

    const updated: ClientChartRecord = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date().toISOString()
    };
    this.clientCharts.set(id, updated);
    this.persistCrm();
    return updated;
  }

  public deleteClientChart(id: string): boolean {
    const res = this.clientCharts.delete(id);
    if (res) this.persistCrm();
    return res;
  }

  public addVerificationNote(chartId: string, note: { year: number; month?: number; content: string; status?: 'verified' | 'tracking' | 'review' }): VerificationNote | null {
    const chart = this.clientCharts.get(chartId);
    if (!chart) return null;

    const newNote: VerificationNote = {
      id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      year: Number(note.year),
      month: note.month !== undefined ? Number(note.month) : undefined,
      content: note.content,
      status: note.status || 'tracking',
      createdAt: new Date().toISOString()
    };

    chart.verificationLogs = [newNote, ...(chart.verificationLogs || [])];
    chart.updatedAt = new Date().toISOString();
    this.clientCharts.set(chartId, chart);
    this.persistCrm();
    return newNote;
  }

  public deleteVerificationNote(chartId: string, noteId: string): boolean {
    const chart = this.clientCharts.get(chartId);
    if (!chart) return false;

    const prevLen = chart.verificationLogs.length;
    chart.verificationLogs = chart.verificationLogs.filter(n => n.id !== noteId);
    if (chart.verificationLogs.length !== prevLen) {
      chart.updatedAt = new Date().toISOString();
      this.clientCharts.set(chartId, chart);
      this.persistCrm();
      return true;
    }
    return false;
  }

  // --- Brand config methods ---
  public getBrandConfig(): MasterBrandConfig {
    return { ...this.brandConfig };
  }

  public saveBrandConfig(config: Partial<MasterBrandConfig>): MasterBrandConfig {
    this.brandConfig = {
      ...this.brandConfig,
      ...config
    };
    this.persistBrand();
    return { ...this.brandConfig };
  }

  public count(): number {
    return this.charts.size;
  }

  public clear(): void {
    this.charts.clear();
    this.clientCharts.clear();
    this.brandConfig = { ...DEFAULT_BRAND };
    try {
      if (fs.existsSync(this.dataFilePath)) fs.unlinkSync(this.dataFilePath);
      if (fs.existsSync(this.crmFilePath)) fs.unlinkSync(this.crmFilePath);
      if (fs.existsSync(this.brandFilePath)) fs.unlinkSync(this.brandFilePath);
    } catch {}
  }
}

export const memoryStore = new MemoryStore();
