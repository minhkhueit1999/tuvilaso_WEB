import mongoose, { Schema, Document } from 'mongoose';
import { ChartData } from '../engine/tuvi/types.js';

export interface IChartDocument extends Document, Omit<ChartData, 'id'> {
  id?: string;
}

const ChartSchema = new Schema(
  {
    thienBan: { type: Schema.Types.Mixed, required: true },
    palaces: { type: Schema.Types.Mixed, required: true },
    tamPhuongTuChinh: { type: Schema.Types.Mixed, required: true },
    interpretation: { type: Schema.Types.Mixed, required: true },
    createdAt: { type: String, default: () => new Date().toISOString() }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: any) => {
        if (ret._id) {
          ret.id = ret._id.toString();
          delete ret._id;
        }
        delete ret.__v;
        return ret;
      }
    }
  }
);

export const ChartModel = mongoose.model<IChartDocument>('Chart', ChartSchema);
