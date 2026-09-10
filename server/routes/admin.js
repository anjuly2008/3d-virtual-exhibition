import { Router } from 'express';
import db from '../db.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/exhibits', async (req, res) => {
  try {
    const {
      status,
      page = '1',
      limit = '20'
    } = req.query;

    const result = await db.exhibits.findAllByStatus(
      status || null,
      parseInt(page),
      parseInt(limit)
    );

    result.approved =
      await db.exhibits.countByStatus('approved');

    result.pending =
      await db.exhibits.countByStatus('pending');

    result.rejected =
      await db.exhibits.countByStatus('rejected');

    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: '获取作品列表失败：' + err.message
    });
  }
});

router.get('/exhibits/:id/preview', async (req, res) => {
  try {
    const exhibitId =
      parseInt(req.params.id);

    const exhibit =
      await db.exhibits.findById(exhibitId);

    if (!exhibit) {
      return res.status(404).json({
        error: '作品不存在'
      });
    }

    res.json({
      exhibit
    });
  } catch (err) {
    res.status(500).json({
      error: '获取作品预览失败：' + err.message
    });
  }
});

router.put('/exhibits/:id/status', async (req, res) => {
  try {
    const id =
      parseInt(req.params.id);

    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        error: '无效的状态值'
      });
    }

    const result =
      await db.exhibits.update(id, {
        status
      });

    if (!result) {
      return res.status(404).json({
        error: '作品不存在'
      });
    }

    res.json({
      message: '审核完成'
    });
  } catch (err) {
    res.status(500).json({
      error: '审核失败：' + err.message
    });
  }
});

router.delete('/exhibits/:id', async (req, res) => {
  try {
    const id =
      parseInt(req.params.id);

    const deleted =
      await db.exhibits.delete(id);

    if (!deleted) {
      return res.status(404).json({
        error: '作品不存在'
      });
    }

    res.json({
      message: '作品已删除'
    });
  } catch (err) {
    res.status(500).json({
      error: '删除失败：' + err.message
    });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users =
      await db.users.all();

    const total =
      await db.users.count();

    res.json({
      users,
      total
    });
  } catch (err) {
    res.status(500).json({
      error: '获取用户列表失败：' + err.message
    });
  }
});

router.put('/users/:id/role', async (req, res) => {
  try {
    const id =
      parseInt(req.params.id);

    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        error: '无效的角色值'
      });
    }

    const updated =
      await db.users.updateRole(id, role);

    if (!updated) {
      return res.status(404).json({
        error: '用户不存在'
      });
    }

    res.json({
      message: '角色修改成功'
    });
  } catch (err) {
    res.status(500).json({
      error: '修改失败：' + err.message
    });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const totalUsers =
      await db.users.count();

    const totalExhibits =
      await db.exhibits.count();

    const approvedExhibits =
      await db.exhibits.countByStatus('approved');

    const pendingExhibits =
      await db.exhibits.countByStatus('pending');

    res.json({
      totalUsers,
      totalExhibits,
      approvedExhibits,
      pendingExhibits
    });
  } catch (err) {
    res.status(500).json({
      error: '获取统计数据失败：' + err.message
    });
  }
});

export default router;