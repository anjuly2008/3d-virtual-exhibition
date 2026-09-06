import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';


// ==================== 基础路径 ====================

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const uploadsDir = path.join(
  __dirname,
  '..',
  '..',
  'uploads'
);


// ==================== 文件上传配置 ====================

// multer：负责处理文件上传
const storage = multer.diskStorage({

  // 决定文件保存位置
  destination: function (req, file, cb) {

    if (file.fieldname === 'model') {

      cb(
        null,
        path.join(uploadsDir, 'models')
      );

    } else if (file.fieldname === 'thumbnail') {

      cb(
        null,
        path.join(uploadsDir, 'thumbnails')
      );

    } else {

      cb(null, uploadsDir);

    }
  },


  // 决定保存后的文件名
  filename: function (req, file, cb) {

    // 时间戳 + 随机数，避免文件重名
    const uniqueName =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1E9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  }
});


// ==================== 上传限制 ====================

const upload = multer({

  storage,

  // 最大 50MB
  limits: {
    fileSize: 50 * 1024 * 1024
  },

  // 文件类型检查
  fileFilter: function (req, file, cb) {

    // 3D模型
    if (file.fieldname === 'model') {

      const ext =
        path.extname(file.originalname)
          .toLowerCase();

      if (
        ['.glb', '.gltf', '.obj', '.fbx', '.stl']
          .includes(ext)
      ) {

        cb(null, true);

      } else {

        cb(
          new Error(
            '仅支持 glb/gltf/obj/fbx/stl 格式的3D模型'
          )
        );

      }

    // 缩略图
    } else if (file.fieldname === 'thumbnail') {

      const ext =
        path.extname(file.originalname)
          .toLowerCase();

      if (
        ['.jpg', '.jpeg', '.png', '.webp']
          .includes(ext)
      ) {

        cb(null, true);

      } else {

        cb(
          new Error(
            '仅支持 jpg/png/webp 格式的图片'
          )
        );

      }

    } else {

      cb(null, true);

    }
  }
});


// ==================== 创建 Router ====================

const router = Router();


// ============================================================
// 获取作品列表
// ============================================================

router.get('/', (req, res) => {

  try {

    // 获取前端传来的筛选参数
    const {
      category,
      search,
      tags,
      usage
    } = req.query;


    // JSON字符串 → 数组
    const parsedTags =
      tags ? JSON.parse(tags) : [];

    const parsedUsage =
      usage ? JSON.parse(usage) : [];


    // 根据筛选条件查询作品
    const result = db.exhibits.findApproved(
      category,
      search,
      parsedTags,
      parsedUsage
    );


    // 返回查询结果
    res.json(result);

  } catch (err) {

    res.status(500).json({
      error: '获取作品列表失败：' + err.message
    });

  }
});


// ============================================================
// 获取单个作品详情
// ============================================================

router.get('/:id', (req, res) => {

  try {

    // 当前作品 ID
    const exhibitId =
      parseInt(req.params.id);


    // 获取作品
    const exhibit =
      db.exhibits.findById(exhibitId);


    // 作品不存在
    if (!exhibit) {

      return res.status(404).json({
        error: '作品不存在'
      });

    }


    // 返回作品
    res.json({
      exhibit
    });

  } catch (err) {

    console.error(
      '获取作品详情失败：',
      err
    );

    res.status(500).json({
      error: '获取作品详情失败：' + err.message
    });

  }
});
// ============================================================
// 上传作品
// ============================================================

router.post(
  '/',
  authMiddleware,
  upload.fields([
    { name: 'model', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]),
  (req, res) => {

    try {

      // 获取文本数据
      const {
        title,
        description,
        category
      } = req.body;


      // 标题和分类不能为空
      if (!title || !category) {

        return res.status(400).json({
          error: '请填写作品标题和分类'
        });

      }


      // 保存后的模型访问地址
      const modelUrl =
        req.files && req.files.model
          ? '/uploads/models/' +
            req.files.model[0].filename
          : '';


      // 保存后的缩略图访问地址
      const thumbnailUrl =
        req.files && req.files.thumbnail
          ? '/uploads/thumbnails/' +
            req.files.thumbnail[0].filename
          : '';


      // 创建作品
      const exhibit = db.exhibits.create({

        title: req.body.title,

        description: req.body.description,

        creator_id: req.user.id,

        creator_name: req.user.username,

        category: req.body.category,

        tags:
          req.body.tags
            ? JSON.parse(req.body.tags)
            : [],

        usage:
          req.body.usage
            ? JSON.parse(req.body.usage)
            : [],

        model_url: modelUrl,

        thumbnail_url: thumbnailUrl,

      });


      // 返回创建后的作品
      res.json({ exhibit });

    } catch (err) {

      res.status(500).json({
        error: '上传失败：' + err.message
      });

    }
  }
);


// ============================================================
// 修改作品
// ============================================================

router.put('/:id', authMiddleware, (req, res) => {

  try {

    const id =
      parseInt(req.params.id);

    const exhibit =
      db.exhibits.findById(id);


    if (!exhibit) {

      return res.status(404).json({
        error: '作品不存在'
      });

    }


    // 只有作者本人或管理员可以修改
    if (
      exhibit.creator_id !== req.user.id &&
      req.user.role !== 'admin'
    ) {

      return res.status(403).json({
        error: '无权修改此作品'
      });

    }


    const {
      title,
      description,
      category
    } = req.body;


    const updates = {};


    if (title) {
      updates.title = title;
    }

    if (description !== undefined) {
      updates.description =
        description;
    }

    if (category) {
      updates.category =
        category;
    }


    const updated =
      db.exhibits.update(id, updates);


    res.json({
      exhibit: updated
    });

  } catch (err) {

    res.status(500).json({
      error: '更新失败：' + err.message
    });

  }
});


// ============================================================
// 删除作品
// ============================================================

router.delete('/:id', authMiddleware, (req, res) => {

  try {

    const id =
      parseInt(req.params.id);

    const exhibit =
      db.exhibits.findById(id);


    if (!exhibit) {

      return res.status(404).json({
        error: '作品不存在'
      });

    }


    // 只有作者本人或管理员可以删除
    if (
      exhibit.creator_id !== req.user.id &&
      req.user.role !== 'admin'
    ) {

      return res.status(403).json({
        error: '无权删除此作品'
      });

    }


    db.exhibits.delete(id);


    res.json({
      message: '作品已删除'
    });

  } catch (err) {

    res.status(500).json({
      error: '删除失败：' + err.message
    });

  }
});


// ============================================================
// 查询当前用户是否已经点赞
// ============================================================

router.get(
  '/:id/like',
  authMiddleware,
  (req, res) => {

    try {

      // 当前作品 ID
      const exhibitId =
        parseInt(req.params.id);

      // 当前登录用户 ID
      const userId =
        req.user.id;


      // 查询当前用户是否已经点赞
      const liked =
        db.exhibits.hasLiked(
          userId,
          exhibitId
        );


      // 获取当前点赞数量
      const exhibit =
        db.exhibits.findById(
          exhibitId
        );


      // 作品不存在
      if (!exhibit) {

        return res.status(404).json({
          error: '作品不存在'
        });

      }


      // 返回点赞状态和点赞数量
      res.json({
        liked,
        likes: exhibit.likes
      });

    } catch (err) {

      res.status(500).json({
        error: '获取点赞状态失败：' + err.message
      });

    }
  }
);


// ============================================================
// 点赞 / 取消点赞
// ============================================================

router.post(
  '/:id/like',
  authMiddleware,
  (req, res) => {

    try {

      // 当前作品 ID
      const exhibitId =
        parseInt(req.params.id);

      // 当前登录用户 ID
      const userId =
        req.user.id;

      // 执行点赞 / 取消点赞
      const result =
        db.exhibits.like(
          userId,
          exhibitId
        );

      // 作品不存在
      if (!result) {
        return res.status(404).json({
          error: '作品不存在'
        });
      }

      // 返回最新点赞数量和当前点赞状态
      res.json({
        likes: result.exhibit.likes,
        liked: result.liked
      });

    } catch (err) {

      console.error(
        '获取点赞状态失败：',
        err
      );

      res.status(500).json({
        error: '获取点赞状态失败：' + err.message
      });

    }
  }
);


export default router;