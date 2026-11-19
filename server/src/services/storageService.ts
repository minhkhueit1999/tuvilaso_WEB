import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

export interface UploadResult {
  secure_url: string;
  public_id: string;
  mode: 'cloudinary' | 'local-fallback';
}

const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
  } catch {
    // Ignore
  }
}

export function isCloudinaryConfigured(): boolean {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  // If any is missing or default empty placeholder, return false
  return Boolean(cloudName && apiKey && apiSecret);
}

export async function uploadImageBuffer(
  buffer: Buffer,
  originalFilename = 'chart.png'
): Promise<UploadResult> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (cloudName && apiKey && apiSecret) {
    try {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret
      });

      const res = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'tuvilaso_charts',
            resource_type: 'image'
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });

      return {
        secure_url: res.secure_url,
        public_id: res.public_id,
        mode: 'cloudinary'
      };
    } catch (err: any) {
      console.warn(`[Storage] Cloudinary upload failed (${err?.message || err}). Falling back to local storage.`);
    }
  }

  // Local fallback
  const timestamp = Date.now();
  const safeName = originalFilename.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filename = `${timestamp}_${safeName}`;
  const filePath = path.join(uploadsDir, filename);

  await fs.promises.writeFile(filePath, buffer);

  return {
    secure_url: `/uploads/${filename}`,
    public_id: filename,
    mode: 'local-fallback'
  };
}
