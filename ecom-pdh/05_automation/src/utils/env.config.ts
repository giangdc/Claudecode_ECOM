import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  adminEmail: process.env.ADMIN_EMAIL || '',
  adminPassword: process.env.ADMIN_PASSWORD || '',
  viewerEmail: process.env.VIEWER_EMAIL || '',
  viewerPassword: process.env.VIEWER_PASSWORD || '',
};
