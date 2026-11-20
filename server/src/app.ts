import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import { generateTuViChart, answerTuViQuestion, TuViInput } from './engine/tuvi/index.js';
import {
  getDatabaseStatus,
  saveChartRecord,
  getRecentChartRecords,
  getChartRecordById,
  saveClientChartRecord,
  getClientChartRecords,
  getClientChartRecordById,
  updateClientChartRecord,
  deleteClientChartRecord,
  addVerificationNoteRecord,
  deleteVerificationNoteRecord,
  getBrandConfigRecord,
  saveBrandConfigRecord
} from './config/db.js';
import { uploadImageBuffer, isCloudinaryConfigured } from './services/storageService.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
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
      viewingYear,
      school,
      showTamPhuongTuChinh,
      showLuuNien
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
      viewingYear: Number(viewingYear ?? 2026),
      school: school || 'tong_hop',
      showTamPhuongTuChinh: showTamPhuongTuChinh ?? true,
      showLuuNien: showLuuNien ?? true,
      ruleset: req.body.ruleset
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

// 3. Ask Tu Vi AI Assistant
app.post('/api/laso/ask', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chart, question, selectedPalaceName, school } = req.body;
    if (!chart || !question) {
      res.status(400).json({
        success: false,
        error: 'Vui lòng cung cấp dữ liệu lá số và câu hỏi cần tư vấn.'
      });
      return;
    }

    const result = answerTuViQuestion(chart, question, selectedPalaceName, school || chart.school);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    next(error);
  }
});

// 4. Get Chart History
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

// 5. Get Chart by ID
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

// 6. Upload Chart Image (Cloudinary with Local Fallback)
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

// 7. CRM Client Charts API
app.get('/api/crm/charts', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const tag = typeof req.query.tag === 'string' ? req.query.tag : undefined;
    const records = await getClientChartRecords({ search, tag });
    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error: any) {
    next(error);
  }
});

app.post('/api/crm/charts', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fullName, birthDate } = req.body;
    if (!fullName || !birthDate) {
      res.status(400).json({
        success: false,
        error: 'Họ tên và ngày sinh khách hàng là bắt buộc.'
      });
      return;
    }
    const saved = await saveClientChartRecord(req.body);
    res.status(201).json({
      success: true,
      data: saved
    });
  } catch (error: any) {
    next(error);
  }
});

app.get('/api/crm/charts/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const client = await getClientChartRecordById(id);
    if (!client) {
      res.status(404).json({
        success: false,
        error: 'Không tìm thấy hồ sơ khách hàng'
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: client
    });
  } catch (error: any) {
    next(error);
  }
});

app.put('/api/crm/charts/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updated = await updateClientChartRecord(id, req.body);
    if (!updated) {
      res.status(404).json({
        success: false,
        error: 'Không tìm thấy hồ sơ khách hàng để cập nhật'
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: updated
    });
  } catch (error: any) {
    next(error);
  }
});

app.delete('/api/crm/charts/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const deleted = await deleteClientChartRecord(id);
    res.status(200).json({
      success: deleted,
      message: deleted ? 'Đã xóa hồ sơ khách hàng' : 'Không tìm thấy hồ sơ'
    });
  } catch (error: any) {
    next(error);
  }
});

// 8. CRM Verification Notes API
app.post('/api/crm/charts/:id/notes', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { year, content } = req.body;
    if (!year || !content) {
      res.status(400).json({
        success: false,
        error: 'Năm và nội dung nghiệm lý là bắt buộc.'
      });
      return;
    }
    const note = await addVerificationNoteRecord(id, req.body);
    if (!note) {
      res.status(404).json({
        success: false,
        error: 'Không tìm thấy hồ sơ khách hàng'
      });
      return;
    }
    res.status(201).json({
      success: true,
      data: note
    });
  } catch (error: any) {
    next(error);
  }
});

app.delete('/api/crm/charts/:id/notes/:noteId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const noteId = Array.isArray(req.params.noteId) ? req.params.noteId[0] : req.params.noteId;
    const deleted = await deleteVerificationNoteRecord(id, noteId);
    res.status(200).json({
      success: deleted,
      message: deleted ? 'Đã xóa ghi chú nghiệm lý' : 'Không tìm thấy ghi chú'
    });
  } catch (error: any) {
    next(error);
  }
});

// 9. White-Label & Brand Config API
app.get('/api/crm/brand', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const brand = await getBrandConfigRecord();
    res.status(200).json({
      success: true,
      data: brand
    });
  } catch (error: any) {
    next(error);
  }
});

app.post('/api/crm/brand', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const saved = await saveBrandConfigRecord(req.body);
    res.status(200).json({
      success: true,
      data: saved
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
