import mongoose from 'mongoose';
import { memoryStore } from '../storage/memoryStore.js';
import { ChartModel } from '../models/ChartModel.js';
import { ChartData } from '../engine/tuvi/types.js';

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
