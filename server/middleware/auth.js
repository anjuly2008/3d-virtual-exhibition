import jwt from 'jsonwebtoken';//这里的 jwt 是一个第三方库：用于JWT 的生成和验证。

const JWT_SECRET = process.env.JWT_SECRET || '3d-exhibition-secret-key-2024';//从 Node.js 的环境变量里面读取 JWT_SECRET
console.log(process.env.JWT_SECRET);
//不过从正式项目安全性来说，不应该长期使用这种写死的默认密钥。
export function generateToken(user) {//拿一个用户对象，生成一个 JWT token，然后返回
  return jwt.sign(//这是 jsonwebtoken 提供的函数，根据用户信息 + 秘密钥匙，制作一个 JWT
    { id: user.id, username: user.username, email: user.email, role: user.role },
    JWT_SECRET,//用于签名，让服务器能够验证这个 JWT 是不是可信的，以及内容有没有被篡改
    { expiresIn: '7d' }//配置；过期时间
  );
}

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;//只取 Authorization 这个请求头。
  if (!header || !header.startsWith('Bearer ')) {//Bearer这里很可能是在传 JWT
    //你有没有带 Authorization？格式对不对？不对的话，不让你进去
    return res.status(401).json({ error: '请先登录' });
  }
  try {
    const token = header.split(' ')[1];//按照空格拆开，split分裂
    const decoded = jwt.verify(token, JWT_SECRET);//decode破译，jwt.verify验证 JWT
    req.user = decoded;//把 JWT 里面解析出来的用户信息，放到当前请求对象 req 上。后面的接口就知道用户是谁
    next();//门卫检查完了，没问题，让请求继续。
  } catch {
    return res.status(401).json({ error: '登录已过期，请重新登录' });
  }
}

export function adminMiddleware(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: '无管理员权限' });//401你没有通过身份认证，403你是谁我知道。但是你没有权限做这件事。
  }
  next();//我知道你是管理员，让请求继续往下执行
}