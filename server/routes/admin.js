import { Router } from 'express';
//Router创建一个专门管理一组 HTTP 路由的“路由器”。
import db from '../db.js';//这个是你项目自己的数据库操作模块。
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = Router();//创建一个 Express 路由对象。

router.use(authMiddleware);//这个 router 下面的所有接口，都先经过 authMiddleware
router.use(adminMiddleware);//这个 router 下面的所有接口，都先经过 adminMiddleware

router.get('/exhibits', (req, res) => {//router.get，router.put，router.delete都是在这个 router 上注册接口。
  //'/exhibits' GET /api/admin/exhibits
  try {
    const { status, page = '1', limit = '20' } = req.query;
    const result = db.exhibits.findAllByStatus(status || null, parseInt(page), parseInt(limit));
    result.approved = db.exhibits.countByStatus('approved');//db.exhibits代表作品相关的数据操作,approved已通过
    result.pending = db.exhibits.countByStatus('pending');//pending待定的，待处理的
    result.rejected = db.exhibits.countByStatus('rejected');//rejected已拒绝
    res.json(result);//把结果返回给前端
  } catch (err) {
    res.status(500).json({ error: '获取作品列表失败：' + err.message });
  }
});

router.put('/exhibits/:id/status', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: '无效的状态值' });
    }
    db.exhibits.update(id, { status });
    res.json({ message: '审核完成' });
  } catch (err) {
    res.status(500).json({ error: '审核失败：' + err.message });
  }
});

router.delete('/exhibits/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    db.exhibits.delete(id);
    res.json({ message: '作品已删除' });
  } catch (err) {
    res.status(500).json({ error: '删除失败：' + err.message });
  }
});

router.get('/users', (req, res) => {
  try {
    const users = db.users.all();
    const total = db.users.count();
    res.json({ users, total });
  } catch (err) {
    res.status(500).json({ error: '获取用户列表失败：' + err.message });
  }
});

router.put('/users/:id/role', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: '无效的角色值' });
    }
    db.users.updateRole(id, role);//db.users代表用户相关的数据操作。
    res.json({ message: '角色修改成功' });
  } catch (err) {
    res.status(500).json({ error: '修改失败：' + err.message });
  }
});

router.get('/stats', (req, res) => {
  try {
    res.json({
      totalUsers: db.users.count(),
      totalExhibits: db.exhibits.count(),
      approvedExhibits: db.exhibits.countByStatus('approved'),
      pendingExhibits: db.exhibits.countByStatus('pending'),
    });
  } catch (err) {
    res.status(500).json({ error: '获取统计数据失败：' + err.message });
  }
});

export default router;