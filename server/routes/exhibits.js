import { Router } from 'express';
import multer from 'multer';//multer 是 Express 处理文件上传的中间件
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

const storage = multer.diskStorage({//我要把上传文件保存到硬盘
  destination: function (req, file, cb) {
    if (file.fieldname === 'model') {
      cb(null, path.join(uploadsDir, 'models'));//告诉 multer cb 文件放哪里
    } else if (file.fieldname === 'thumbnail') {
      cb(null, path.join(uploadsDir, 'thumbnails'));
    } else {
      cb(null, uploadsDir);
    }
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);//uniqueName防止重名
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },//文件限制
  fileFilter: function (req, file, cb) {//fileFilter防止用户乱传
    if (file.fieldname === 'model') {
      const ext = path.extname(file.originalname).toLowerCase();
      if (['.glb', '.gltf', '.obj', '.fbx', '.stl'].includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error('仅支持 glb/gltf/obj/fbx/stl 格式的3D模型'));
      }
    } else if (file.fieldname === 'thumbnail') {
      const ext = path.extname(file.originalname).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error('仅支持 jpg/png/webp 格式的图片'));
      }
    } else {
      cb(null, true);
    }
  }
});

const router = Router();//创建router

router.get('/', (req, res) => {//router.get,router.post,router.put都是接口
  //首页作品列表
  try {
    const { category, search, page = '1', limit = '12' } = req.query;//获取参数：
    const result = db.exhibits.findApproved(category, search, parseInt(page), parseInt(limit));//db.exhibits.findApproved调用数据库
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: '获取作品列表失败：' + err.message });
  }
});

router.get('/:id', (req, res) => {//获取作品详情
  try {
    const id = parseInt(req.params.id);
    const exhibit = db.exhibits.findById(id);
    if (!exhibit) {
      return res.status(404).json({ error: '作品不存在' });
    }
    res.json({ exhibit });
  } catch (err) {
    res.status(500).json({ error: '获取作品详情失败：' + err.message });
  }
});

router.post('/', authMiddleware, upload.fields([//上传作品，用户登录了吗？
  { name: 'model', maxCount: 1 },//接受两个文件
  { name: 'thumbnail', maxCount: 1 }
]), (req, res) => {
  try {
    const { title, description, category } = req.body;//获取文本数据
    if (!title || !category) {
      return res.status(400).json({ error: '请填写作品标题和分类' });
    }

    const modelUrl = req.files && req.files.model ? '/uploads/models/' + req.files.model[0].filename : '';//保存模型路径
    //这里保存的是：访问地址
    const thumbnailUrl = req.files && req.files.thumbnail ? '/uploads/thumbnails/' + req.files.thumbnail[0].filename : '';

    const exhibit = db.exhibits.create({//创建作品数据，进入db.js
      title,
      description: description || '',
      creator_id: req.user.id,
      creator_name: req.user.username,
      category,
      model_url: modelUrl,
      thumbnail_url: thumbnailUrl,
    });

    res.json({ exhibit });
  } catch (err) {
    res.status(500).json({ error: '上传失败：' + err.message });
  }
});

router.put('/:id', authMiddleware, (req, res) => {//修改作品
  try {
    const id = parseInt(req.params.id);
    const exhibit = db.exhibits.findById(id);
    if (!exhibit) {
      return res.status(404).json({ error: '作品不存在' });
    }
    if (exhibit.creator_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: '无权修改此作品' });
    }

    const { title, description, category } = req.body;
    const updates = {};
    if (title) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (category) updates.category = category;

    const updated = db.exhibits.update(id, updates);
    res.json({ exhibit: updated });
  } catch (err) {
    res.status(500).json({ error: '更新失败：' + err.message });
  }
});

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const exhibit = db.exhibits.findById(id);
    if (!exhibit) {
      return res.status(404).json({ error: '作品不存在' });
    }
    if (exhibit.creator_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: '无权删除此作品' });
    }

    db.exhibits.delete(id);
    res.json({ message: '作品已删除' });
  } catch (err) {
    res.status(500).json({ error: '删除失败：' + err.message });
  }
});

router.post('/:id/like', (req, res) => {//点赞
  try {
    const id = parseInt(req.params.id);
    const exhibit = db.exhibits.like(id);
    if (!exhibit) {
      return res.status(404).json({ error: '作品不存在' });
    }
    res.json({ likes: exhibit.likes });
  } catch (err) {
    res.status(500).json({ error: '点赞失败：' + err.message });
  }
});

export default router;