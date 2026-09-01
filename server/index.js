import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';//authRoutes为router的重新命名
import exhibitRoutes from './routes/exhibits.js';//Express 项目 导入一个 Router 对象，然后挂载到服务器上
import adminRoutes from './routes/admin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();//express一个创建服务器应用的函数 创建服务器
//app就是一个 Express 应用对象
const PORT = process.env.PORT || 3001;
//配置服务器能力
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsPath = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });
app.use('/uploads', express.static(uploadsPath));
//注册接口
app.use('/api/auth', authRoutes);
app.use('/api/exhibits', exhibitRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
  console.log('[Server] Static mode: serving frontend from dist/');
} else {
  console.log('[Server] API-only mode: no dist/ found, use `npm run build` first');
}
//启动服务器
app.listen(PORT, () => {
  console.log(`[Server] Running on port ${PORT}`);
  console.log(`[Server] Health: http://localhost:${PORT}/api/health`);
});