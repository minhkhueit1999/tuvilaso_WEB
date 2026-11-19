import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import { generateTuViChart, TuViInput } from './engine/tuvi/index.js';
import { getDatabaseStatus, saveChartRecord, getRecentChartRecords, getChartRecordById } from './config/db.js';
import { uploadImageBuffer, isCloudinaryConfigured } from './services/storageService.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static route for local uploads (fallback mode)
const uploadsPath = path.resolve(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));

// 1. Healthcheck endpoint for Render & local verification
app.get('/api/health', (_req: Request, res: Response) => {
  const dbStatus = getDatabaseStatus();
  const storageStatus = isCloudinaryConfigured() ? 'cloudinary' : 'local-fallback';

  res.status(200).json({
    status: 'ok',
    service: 'tuvilaso_server',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus,
    storage: storageStatus
  });
});

// 2. Generate Chart & Interpret
app.post('/api/laso/generate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      fullName,
      gender,
      calendarType,
      day,
      month,
      year,
      hour,
      minute,
      isLeapMonth,
      viewingYear
    } = req.body;

    if (!day || !month || !year) {
      res.status(400).json({
        success: false,
        error: 'Ngày, tháng, năm sinh là bắt buộc.'
      });
      return;
    }

    const input: TuViInput = {
      fullName: (fullName || 'Đương Số').trim(),
      gender: gender === 'female' ? 'female' : 'male',
      calendarType: calendarType === 'lunar' ? 'lunar' : 'solar',
      day: Number(day),
      month: Number(month),
      year: Number(year),
      hour: Number(hour ?? 12),
      minute: Number(minute ?? 0),
      isLeapMonth: Boolean(isLeapMonth),
      viewingYear: Number(viewingYear ?? 2026)
    };

    const chart = generateTuViChart(input);
    const saved = await saveChartRecord(chart);

    res.status(200).json({
      success: true,
      data: saved
    });
  } catch (error: any) {
    next(error);
  }
});

// 3. Get Chart History
app.get('/api/laso/history', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 12, 50);
    const charts = await getRecentChartRecords(limit);
    res.status(200).json({
      success: true,
      count: charts.length,
      data: charts
    });
  } catch (error: any) {
    next(error);
  }
});

// 4. Get Chart by ID
app.get('/api/laso/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const chart = await getChartRecordById(id);
    if (!chart) {
      res.status(404).json({
        success: false,
        error: 'Không tìm thấy lá số'
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: chart
    });
  } catch (error: any) {
    next(error);
  }
});

// 5. Upload Chart Image (Cloudinary with Local Fallback)
app.post('/api/laso/upload-image', upload.single('image'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    let buffer: Buffer | null = null;
    let filename = 'chart.png';

    if (req.file) {
      buffer = req.file.buffer;
      filename = req.file.originalname || filename;
    } else if (req.body.imageBase64) {
      const base64Data = req.body.imageBase64.replace(/^data:image\/\w+;base64,/, '');
      buffer = Buffer.from(base64Data, 'base64');
      if (req.body.filename) filename = req.body.filename;
    }

    if (!buffer) {
      res.status(400).json({
        success: false,
        error: 'Vui lòng cung cấp file ảnh hoặc base64 image.'
      });
      return;
    }

    const uploadRes = await uploadImageBuffer(buffer, filename);

    res.status(200).json({
      success: true,
      data: {
        url: uploadRes.secure_url,
        publicId: uploadRes.public_id,
        mode: uploadRes.mode
      }
    });
  } catch (error: any) {
    next(error);
  }
});

// Central Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[App Error]', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Lỗi hệ thống máy chủ'
  });
});
