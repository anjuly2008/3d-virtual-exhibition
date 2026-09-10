import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'model') {
      cb(null, path.join(uploadsDir, 'models'));
    } else if (file.fieldname === 'thumbnail') {
      cb(null, path.join(uploadsDir, 'thumbnails'));
    } else {
      cb(null, uploadsDir);
    }
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1E9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024
  },
  fileFilter: function (req, file, cb) {
    if (file.fieldname === 'model') {
      const ext = path.extname(file.originalname).toLowerCase();

      if (
        ['.glb', '.gltf', '.obj', '.fbx', '.stl'].includes(ext)
      ) {
        cb(null, true);
      } else {
        cb(
          new Error(
            '仅支持 glb/gltf/obj/fbx/stl 格式的3D模型'
          )
        );
      }
    } else if (file.fieldname === 'thumbnail') {
      const ext = path.extname(file.originalname).toLowerCase();

      if (
        ['.jpg', '.jpeg', '.png', '.webp'].includes(ext)
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

const router = Router();

router.get(
  '/likes/mine',
  authMiddleware,
  async (req, res) => {
    try {
      const exhibits =
        await db.exhibits.findLikedByUserId(
          req.user.id
        );

      res.json({
        exhibits,
        total: exhibits.length
      });
    } catch (err) {
      console.error(
        '获取我的点赞失败：',
        err
      );

      res.status(500).json({
        error:
          '获取我的点赞失败：' +
          err.message
      });
    }
  }
);

router.get(
  '/mine',
  authMiddleware,
  async (req, res) => {
    try {
      const exhibits =
        await db.exhibits.findByCreatorId(
          req.user.id
        );

      res.json({
        exhibits,
        total: exhibits.length
      });
    } catch (err) {
      console.error(
        '获取我的作品失败：',
        err
      );

      res.status(500).json({
        error:
          '获取我的作品失败：' +
          err.message
      });
    }
  }
);

router.get(
  '/',
  async (req, res) => {
    try {
      const {
        category,
        search,
        tags,
        usage
      } = req.query;

      const parsedTags =
        tags
          ? JSON.parse(tags)
          : [];

      const parsedUsage =
        usage
          ? JSON.parse(usage)
          : [];

      const result =
        await db.exhibits.findApproved(
          category,
          search,
          parsedTags,
          parsedUsage
        );

      res.json(result);
    } catch (err) {
      console.error(
        '获取作品列表失败：',
        err
      );

      res.status(500).json({
        error:
          '获取作品列表失败：' +
          err.message
      });
    }
  }
);

router.get(
  '/:id',
  async (req, res) => {
    try {
      const exhibitId =
        parseInt(req.params.id);

      const exhibit =
        await db.exhibits.findById(
          exhibitId
        );

      if (!exhibit) {
        return res.status(404).json({
          error: '作品不存在'
        });
      }

      if (exhibit.status !== 'approved') {
        return res.status(404).json({
          error: '作品不存在'
        });
      }

      res.json({
        exhibit
      });
    } catch (err) {
      console.error(
        '获取作品详情失败：',
        err
      );

      res.status(500).json({
        error:
          '获取作品详情失败：' +
          err.message
      });
    }
  }
);

router.post(
  '/',
  authMiddleware,
  upload.fields([
    {
      name: 'model',
      maxCount: 1
    },
    {
      name: 'thumbnail',
      maxCount: 1
    }
  ]),
  async (req, res) => {
    try {
      const {
        title,
        description,
        category
      } = req.body;

      if (!title || !category) {
        return res.status(400).json({
          error:
            '请填写作品标题和分类'
        });
      }

      const modelUrl =
        req.files &&
        req.files.model
          ? '/uploads/models/' +
            req.files.model[0].filename
          : '';

      const thumbnailUrl =
        req.files &&
        req.files.thumbnail
          ? '/uploads/thumbnails/' +
            req.files.thumbnail[0].filename
          : '';

      const exhibit =
        await db.exhibits.create({
          title: req.body.title,
          description:
            req.body.description,
          creator_id: req.user.id,
          creator_name:
            req.user.username,
          category:
            req.body.category,
          tags:
            req.body.tags
              ? JSON.parse(req.body.tags)
              : [],
          usage:
            req.body.usage
              ? JSON.parse(req.body.usage)
              : [],
          model_url: modelUrl,
          thumbnail_url:
            thumbnailUrl
        });

      res.json({
        exhibit
      });
    } catch (err) {
      console.error(
        '上传失败：',
        err
      );

      res.status(500).json({
        error:
          '上传失败：' +
          err.message
      });
    }
  }
);

router.put(
  '/:id',
  authMiddleware,
  async (req, res) => {
    try {
      const id =
        parseInt(req.params.id);

      const exhibit =
        await db.exhibits.findById(
          id
        );

      if (!exhibit) {
        return res.status(404).json({
          error: '作品不存在'
        });
      }

      if (
        exhibit.creator_id !==
          req.user.id &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({
          error:
            '无权修改此作品'
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

      if (
        description !==
        undefined
      ) {
        updates.description =
          description;
      }

      if (category) {
        updates.category =
          category;
      }

      const updated =
        await db.exhibits.update(
          id,
          updates
        );

      res.json({
        exhibit: updated
      });
    } catch (err) {
      console.error(
        '更新失败：',
        err
      );

      res.status(500).json({
        error:
          '更新失败：' +
          err.message
      });
    }
  }
);

router.delete(
  '/:id',
  authMiddleware,
  async (req, res) => {
    try {
      const id =
        parseInt(req.params.id);

      const exhibit =
        await db.exhibits.findById(
          id
        );

      if (!exhibit) {
        return res.status(404).json({
          error: '作品不存在'
        });
      }

      if (
        exhibit.creator_id !==
          req.user.id &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({
          error:
            '无权删除此作品'
        });
      }

      await db.exhibits.delete(
        id
      );

      res.json({
        message:
          '作品已删除'
      });
    } catch (err) {
      console.error(
        '删除失败：',
        err
      );

      res.status(500).json({
        error:
          '删除失败：' +
          err.message
      });
    }
  }
);

router.get(
  '/:id/likers',
  authMiddleware,
  async (req, res) => {
    try {
      const exhibitId =
        parseInt(req.params.id);

      const exhibit =
        await db.exhibits.findById(
          exhibitId
        );

      if (!exhibit) {
        return res.status(404).json({
          error:
            '作品不存在'
        });
      }

      const users =
        await db.exhibits.getLikers(
          exhibitId
        );

      res.json({
        users,
        total: users.length
      });
    } catch (err) {
      console.error(
        '获取点赞用户失败：',
        err
      );

      res.status(500).json({
        error:
          '获取点赞用户失败：' +
          err.message
      });
    }
  }
);

router.get(
  '/:id/like',
  authMiddleware,
  async (req, res) => {
    try {
      const exhibitId =
        parseInt(req.params.id);

      const userId =
        req.user.id;

      const liked =
        await db.exhibits.hasLiked(
          userId,
          exhibitId
        );

      const exhibit =
        await db.exhibits.findById(
          exhibitId
        );

      if (!exhibit) {
        return res.status(404).json({
          error:
            '作品不存在'
        });
      }

      res.json({
        liked,
        likes: exhibit.likes
      });
    } catch (err) {
      console.error(
        '获取点赞状态失败：',
        err
      );

      res.status(500).json({
        error:
          '获取点赞状态失败：' +
          err.message
      });
    }
  }
);

router.post(
  '/:id/like',
  authMiddleware,
  async (req, res) => {
    try {
      const exhibitId =
        parseInt(req.params.id);

      const userId =
        req.user.id;

      const result =
        await db.exhibits.like(
          userId,
          exhibitId
        );

      if (!result) {
        return res.status(404).json({
          error:
            '作品不存在'
        });
      }

      res.json({
        likes:
          result.exhibit.likes,
        liked:
          result.liked
      });
    } catch (err) {
      console.error(
        '点赞操作失败：',
        err
      );

      res.status(500).json({
        error:
          '点赞操作失败：' +
          err.message
      });
    }
  }
);

export default router;