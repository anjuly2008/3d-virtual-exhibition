import { Router } from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../db.js';
import { generateToken, authMiddleware } from '../middleware/auth.js';

const router = Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const avatarDir = path.join(__dirname, '..', '..', 'uploads', 'avatars');

if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
}

const upload = multer({
  dest: avatarDir,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: '请填写所有必填字段' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: '密码至少6位' });
    }

    const existing = await db.users.findByEmail(email);

    if (existing) {
      return res.status(400).json({ error: '邮箱已被注册' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await db.users.create({
      username,
      email,
      password_hash: hash,
    });

    const token = generateToken(user);

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: '注册失败：' + err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: '请填写邮箱和密码' });
    }

    const user = await db.users.findByEmail(email);

    if (!user) {
      return res.status(400).json({ error: '邮箱或密码错误' });
    }

    const valid = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!valid) {
      return res.status(400).json({ error: '邮箱或密码错误' });
    }

    const token = generateToken(user);
    const { password_hash: _, ...safeUser } = user;

    res.json({
      token,
      user: safeUser,
    });
  } catch (err) {
    res.status(500).json({ error: '登录失败：' + err.message });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await db.users.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: '获取用户信息失败：' + err.message });
  }
});

router.put(
  '/avatar',
  authMiddleware,
  upload.single('avatar'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: '请选择头像图片' });
      }

      const ext = path.extname(req.file.originalname).toLowerCase();
      const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

      if (!allowed.includes(ext)) {
        fs.unlinkSync(req.file.path);

        return res.status(400).json({
          error: '只支持 JPG、PNG、GIF、WEBP 图片',
        });
      }

      const filename = `${Date.now()}-${req.user.id}${ext}`;
      const newPath = path.join(avatarDir, filename);

      fs.renameSync(req.file.path, newPath);

      const avatarUrl = `/uploads/avatars/${filename}`;

      const user = await db.users.updateAvatar(
        req.user.id,
        avatarUrl
      );

      if (!user) {
        return res.status(404).json({ error: '用户不存在' });
      }

      res.json({ user });
    } catch (err) {
      res.status(500).json({
        error: '头像上传失败：' + err.message,
      });
    }
  }
);

export default router;