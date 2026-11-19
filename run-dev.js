import { spawn } from 'child_process';
import path from 'path';

console.log('\x1b[33m%s\x1b[0m', '★ [Tử Vi Minh Khuê] Đang khởi động đồng thời Backend (Port 5000) & Frontend (Port 3000)...');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

// 1. Khởi động Backend Server
const server = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.resolve(process.cwd(), 'server'),
  stdio: 'inherit',
  shell: true
});

// 2. Khởi động Frontend Client
const client = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.resolve(process.cwd(), 'client'),
  stdio: 'inherit',
  shell: true
});

server.on('error', (err) => {
  console.error('[Server Error]', err);
});

client.on('error', (err) => {
  console.error('[Client Error]', err);
});

process.on('SIGINT', () => {
  server.kill();
  client.kill();
  process.exit(0);
});
