import mongoose from 'mongoose';
import { memoryStore, MasterBrandConfig } from '../storage/memoryStore.js';
import { ChartModel } from '../models/ChartModel.js';
import { ClientChartModel, ClientChartRecord, VerificationNote } from '../models/ClientChart.js';
import { ChartData } from '../engine/tuvi/types.js';

export { MasterBrandConfig };

let isMongoConnected = false;
let dbMode: 'mongodb' | 'in-memory-fallback' = 'in-memory-fallback';

export async function connectDatabase(): Promise<{ isConnected: boolean; mode: string }> {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    console.warn('[DB] MONGODB_URI is not set. Running in resilient In-Memory / Local JSON fallback mode.');
    isMongoConnected = false;
    dbMode = 'in-memory-fallback';
    return { isConnected: false, mode: dbMode };
  }

  try {
    console.log('[DB] Connecting to MongoDB...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000, // Quick timeout for CI / local test
      connectTimeoutMS: 2000
    });
    isMongoConnected = true;
    dbMode = 'mongodb';
    console.log('[DB] MongoDB connected successfully.');
    return { isConnected: true, mode: dbMode };
  } catch (error: any) {
    console.warn(`[DB] Could not connect to MongoDB (${error?.message || error}). Switching automatically to In-Memory Fallback.`);
    isMongoConnected = false;
    dbMode = 'in-memory-fallback';
    return { isConnected: false, mode: dbMode };
  }
}

export function getDatabaseStatus(): { isConnected: boolean; mode: string } {
  return {
    isConnected: isMongoConnected,
    mode: dbMode
  };
}

export async function saveChartRecord(chart: ChartData): Promise<ChartData> {
  if (isMongoConnected && mongoose.connection.readyState === 1) {
    try {
      const doc = new ChartModel(chart);
      const saved = await doc.save();
      return {
        ...chart,
        id: saved.id
      };
    } catch (err) {
      console.warn('[DB] Mongo save failed, falling back to memory store', err);
    }
  }
  return memoryStore.saveChart(chart);
}

export async function getRecentChartRecords(limit = 10): Promise<ChartData[]> {
  if (isMongoConnected && mongoose.connection.readyState === 1) {
    try {
      const docs = await ChartModel.find().sort({ createdAt: -1 }).limit(limit).lean();
      return docs.map((d: any) => ({
        ...d,
        id: d._id.toString()
      }));
    } catch (err) {
      console.warn('[DB] Mongo fetch failed, falling back to memory store', err);
    }
  }
  return memoryStore.getRecentCharts(limit);
}

export async function getChartRecordById(id: string): Promise<ChartData | null> {
  if (isMongoConnected && mongoose.connection.readyState === 1) {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const doc = await ChartModel.findById(id).lean();
        if (doc) {
          return {
            ...(doc as any),
            id: (doc as any)._id.toString()
          };
        }
      }
    } catch (err) {
      console.warn('[DB] Mongo findById failed, falling back to memory store', err);
    }
  }
  return memoryStore.getChartById(id);
}

// --- CRM Client Chart Records ---
export async function saveClientChartRecord(record: any): Promise<ClientChartRecord> {
  if (isMongoConnected && mongoose.connection.readyState === 1) {
    try {
      const doc = new ClientChartModel(record);
      const saved = await doc.save();
      return {
        ...record,
        id: saved.id
      };
    } catch (err) {
      console.warn('[DB] Mongo CRM save failed, falling back to memory store', err);
    }
  }
  return memoryStore.saveClientChart(record);
}

export async function getClientChartRecords(filter?: { search?: string; tag?: string }): Promise<ClientChartRecord[]> {
  if (isMongoConnected && mongoose.connection.readyState === 1) {
    try {
      const query: any = {};
      if (filter?.tag && filter.tag !== 'Tất cả') {
        query.tags = filter.tag;
      }
      if (filter?.search) {
        query.$or = [
          { fullName: { $regex: filter.search, $options: 'i' } },
          { phone: { $regex: filter.search, $options: 'i' } },
          { notes: { $regex: filter.search, $options: 'i' } }
        ];
      }
      const docs = await ClientChartModel.find(query).sort({ updatedAt: -1 }).limit(100).lean();
      return docs.map((d: any) => ({
        ...d,
        id: d._id.toString()
      }));
    } catch (err) {
      console.warn('[DB] Mongo CRM fetch failed, falling back to memory store', err);
    }
  }
  return memoryStore.getClientCharts(filter);
}

export async function getClientChartRecordById(id: string): Promise<ClientChartRecord | null> {
  if (isMongoConnected && mongoose.connection.readyState === 1) {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const doc = await ClientChartModel.findById(id).lean();
        if (doc) {
          return {
            ...(doc as any),
            id: (doc as any)._id.toString()
          };
        }
      }
    } catch (err) {
      console.warn('[DB] Mongo find client failed, falling back to memory store', err);
    }
  }
  return memoryStore.getClientChartById(id);
}

export async function updateClientChartRecord(id: string, updates: Partial<ClientChartRecord>): Promise<ClientChartRecord | null> {
  if (isMongoConnected && mongoose.connection.readyState === 1) {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const doc = await ClientChartModel.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean();
        if (doc) {
          return {
            ...(doc as any),
            id: (doc as any)._id.toString()
          };
        }
      }
    } catch (err) {
      console.warn('[DB] Mongo update client failed, falling back to memory store', err);
    }
  }
  return memoryStore.updateClientChart(id, updates);
}

export async function deleteClientChartRecord(id: string): Promise<boolean> {
  if (isMongoConnected && mongoose.connection.readyState === 1) {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const res = await ClientChartModel.findByIdAndDelete(id);
        return Boolean(res);
      }
    } catch (err) {
      console.warn('[DB] Mongo delete client failed, falling back to memory store', err);
    }
  }
  return memoryStore.deleteClientChart(id);
}

export async function addVerificationNoteRecord(chartId: string, note: { year: number; month?: number; content: string; status?: 'verified' | 'tracking' | 'review' }): Promise<VerificationNote | null> {
  if (isMongoConnected && mongoose.connection.readyState === 1) {
    try {
      if (mongoose.Types.ObjectId.isValid(chartId)) {
        const noteId = `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const newNote: VerificationNote = {
          id: noteId,
          year: Number(note.year),
          month: note.month !== undefined ? Number(note.month) : undefined,
          content: note.content,
          status: note.status || 'tracking',
          createdAt: new Date().toISOString()
        };
        await ClientChartModel.findByIdAndUpdate(chartId, {
          $push: { verificationLogs: { $each: [newNote], $position: 0 } },
          $set: { updatedAt: new Date() }
        });
        return newNote;
      }
    } catch (err) {
      console.warn('[DB] Mongo add note failed, falling back to memory store', err);
    }
  }
  return memoryStore.addVerificationNote(chartId, note);
}

export async function deleteVerificationNoteRecord(chartId: string, noteId: string): Promise<boolean> {
  if (isMongoConnected && mongoose.connection.readyState === 1) {
    try {
      if (mongoose.Types.ObjectId.isValid(chartId)) {
        await ClientChartModel.findByIdAndUpdate(chartId, {
          $pull: { verificationLogs: { id: noteId } },
          $set: { updatedAt: new Date() }
        });
        return true;
      }
    } catch (err) {
      console.warn('[DB] Mongo delete note failed, falling back to memory store', err);
    }
  }
  return memoryStore.deleteVerificationNote(chartId, noteId);
}

// --- Brand Config ---
export async function getBrandConfigRecord(): Promise<MasterBrandConfig> {
  return memoryStore.getBrandConfig();
}

export async function saveBrandConfigRecord(config: Partial<MasterBrandConfig>): Promise<MasterBrandConfig> {
  return memoryStore.saveBrandConfig(config);
}


