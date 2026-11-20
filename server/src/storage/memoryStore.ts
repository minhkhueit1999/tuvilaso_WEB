import fs from 'fs';
import path from 'path';
import { ChartData } from '../engine/tuvi/types.js';

class MemoryStore {
  private charts: Map<string, ChartData> = new Map();
  private dataDir: string;
  private dataFilePath: string;

  constructor() {
    this.dataDir = path.resolve(process.cwd(), 'data');
    this.dataFilePath = path.join(this.dataDir, 'charts_fallback.json');
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
      // Ignore disk load error, keep in-memory
    }
  }

  private persistToDisk(): void {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      const list = Array.from(this.charts.values());
      fs.writeFileSync(this.dataFilePath, JSON.stringify(list, null, 2), 'utf-8');
    } catch {
      // In-memory still survives in current process
    }
  }

  public saveChart(chart: ChartData): ChartData {
    const id = chart.id || `chart_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const savedChart: ChartData = {
      ...chart,
      id,
      createdAt: chart.createdAt || new Date().toISOString()
    };
    this.charts.set(id, savedChart);
    this.persistToDisk();
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

  public count(): number {
    return this.charts.size;
  }

  public clear(): void {
    this.charts.clear();
    try {
      if (fs.existsSync(this.dataFilePath)) {
        fs.unlinkSync(this.dataFilePath);
      }
    } catch {
      // Ignore
    }
  }
}

export const memoryStore = new MemoryStore();

