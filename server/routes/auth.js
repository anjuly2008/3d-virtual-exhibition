import { Router } from 'express';//Express 是建立在 Node.js 之上的 Web 后端框架
//Router创建一个专门管理一组 HTTP 路由的“路由器”。
import bcrypt from 'bcryptjs';//密码哈希 / 密码验证
import db from '../db.js';//这个就是项目自己的数据库操作模块
import { generateToken, authMiddleware } from '../middleware/auth.js';//generateToken()生成 JWT,authMiddleware()检查请求有没有合法 JWT

const router = Router();//创建了一个 Express 路由对象

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: '请填写所有必填字段' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: '密码至少6位' });
    }

    const existing = db.users.findByEmail(email);//去数据库里找这个邮箱对应的用户。
    if (existing) {
      return res.status(400).json({ error: '邮箱已被注册' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = db.users.create({ username, email, password_hash: hash });//创建用户
    const token = generateToken(user);

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: '注册失败：' + err.message });
  }
});

router.post('/login', async (req, res) => {//当收到 POST /login 请求的时候，执行后面的函数。
  //告诉Express有人向这个路由发送 POST 请求的时候，执行这里。
  try {
    const { email, password } = req.body;//从前端发送过来的请求数据里面，拿出 email 和 password。
    if (!email || !password) {
      return res.status(400).json({ error: '请填写邮箱和密码' });
    }

    const user = db.users.findByEmail(email);//拿着用户输入的邮箱，到数据库里找用户。
    if (!user) {
      return res.status(400).json({ error: '邮箱或密码错误' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);//用户输入的明文密码和数据库里的密码哈希
    if (!valid) {
      return res.status(400).json({ error: '邮箱或密码错误' });
    }

    const token = generateToken(user);//生成 JWT
    const { password_hash: _, ...safeUser } = user;//返回用户信息时，把密码哈希去掉

    res.json({ token, user: safeUser });//把 JavaScript 对象作为 JSON 响应发送给前端
  } catch (err) {
    res.status(500).json({ error: '登录失败：' + err.message });
  }
});

router.get('/me', authMiddleware, (req, res) => {
  const user = db.users.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: '用户不存在' });
  }
  res.json({ user });
});

export default router;//包含router.post()，router.get()，router.put()，router.delete()，把这个 router 对象作为默认值导出去
//导入时名字随便取