import mongoose, { Document, Schema } from 'mongoose';
import { TuViInput, ChartData } from '../engine/tuvi/types.js';

export interface VerificationNote {
  id: string;
  year: number;
  month?: number;
  content: string;
  status: 'verified' | 'tracking' | 'review';
  createdAt: string;
}

export interface ClientChartRecord {
  id: string;
  fullName: string;
  gender: 'male' | 'female';
  birthDate: string;
  lunarDate: string;
  birthHour: string;
  phone?: string;
  email?: string;
  tags: string[];
  notes?: string;
  verificationLogs: VerificationNote[];
  chartInput?: TuViInput;
  chartData?: ChartData;
  createdAt: string;
  updatedAt: string;
}

export interface ClientChartDocument extends Document, Omit<ClientChartRecord, 'id'> {}

const VerificationNoteSchema = new Schema<VerificationNote>(
  {
    id: { type: String, required: true },
    year: { type: Number, required: true },
    month: { type: Number },
    content: { type: String, required: true },
    status: { type: String, enum: ['verified', 'tracking', 'review'], default: 'tracking' },
    createdAt: { type: String, default: () => new Date().toISOString() }
  },
  { _id: false }
);

const ClientChartSchema = new Schema<ClientChartDocument>(
  {
    fullName: { type: String, required: true, trim: true, index: true },
    gender: { type: String, enum: ['male', 'female'], default: 'male' },
    birthDate: { type: String, required: true },
    lunarDate: { type: String, default: '' },
    birthHour: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    tags: { type: [String], default: ['Gia đình'], index: true },
    notes: { type: String, default: '' },
    verificationLogs: { type: [VerificationNoteSchema], default: [] },
    chartInput: { type: Schema.Types.Mixed },
    chartData: { type: Schema.Types.Mixed }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

ClientChartSchema.index({ fullName: 'text', tags: 'text', notes: 'text' });

export const ClientChartModel = mongoose.model<ClientChartDocument>('ClientChart', ClientChartSchema);
