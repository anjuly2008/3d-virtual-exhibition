import fs from 'fs';
import path from 'path';//负责处理路径，；例如../data.json
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbFile = path.join(__dirname, '..', 'data.json');//当前文件夹

let data = { users: [], exhibits: [] };

function load() {//读取 data.json。
  try {
    if (fs.existsSync(dbFile)) {//data.json存在吗？
      data = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
    }
  } catch {
    data = { users: [], exhibits: [] };
  }
}

function save() {//写入data.json
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

load();

const existing = data.users.find(u => u.role === 'admin');
if (!existing) {
  const hash = bcrypt.hashSync('admin123', 10);
  data.users.push({
    id: 1,
    username: 'admin',
    email: 'admin@3dshow.com',
    password_hash: hash,
    role: 'admin',
    avatar_url: null,
    created_at: new Date().toISOString(),
  });
  save();
  console.log('[DB] Admin account created: admin / admin123');
}

const seedExhibits = [//初始化数据。
  { id: 1, title: '未来城市天际线', description: '一个充满未来感的城市天际线3D模型，展示了高耸入云的摩天大楼、飞行器穿梭的空中走廊以及智能化的城市基础设施。建筑采用参数化设计，融合了可持续能源系统和垂直绿化理念。', creator_id: 1, creator_name: 'admin', category: 'Architecture', model_url: '/models/future-city.glb', thumbnail_url: 'https://picsum.photos/seed/futurecity/800/600', status: 'approved', likes: 128, created_at: '2026-05-20T08:00:00Z' },
  { id: 2, title: '智能手表概念设计', description: '新一代智能手表的概念设计，采用弧形AMOLED屏幕与钛合金边框。集成了心率监测、血氧检测、睡眠分析和运动追踪功能，表盘UI经过重新设计以提升交互体验。', creator_id: 1, creator_name: 'admin', category: 'Product Design', model_url: '/models/smartwatch.glb', thumbnail_url: 'https://picsum.photos/seed/smartwatch/800/600', status: 'approved', likes: 95, created_at: '2026-05-19T10:00:00Z' },
  { id: 3, title: '奇幻森林场景', description: '一个充满魔法氛围的3D森林场景，包含发光蘑菇、古老巨树、浮游生物和神秘的水晶矿脉。适合用于奇幻RPG游戏场景或虚拟现实体验。场景支持昼夜循环和动态天气效果。', creator_id: 1, creator_name: 'admin', category: 'Game Assets', model_url: '/models/magic-forest.glb', thumbnail_url: 'https://picsum.photos/seed/forest/800/600', status: 'approved', likes: 210, created_at: '2026-05-18T14:00:00Z' },
  { id: 4, title: '抽象几何艺术', description: '探索几何形态与色彩关系的抽象3D艺术装置。通过多面体、球体和环形的组合排列，创造出富有节奏感和空间张力的视觉作品。金属材质反射效果增强了作品的深度和层次感。', creator_id: 1, creator_name: 'admin', category: 'Art', model_url: '/models/geo-art.glb', thumbnail_url: 'https://picsum.photos/seed/geoart/800/600', status: 'approved', likes: 76, created_at: '2026-05-17T09:00:00Z' },
  { id: 5, title: '人体解剖模型', description: '高精度人体骨骼与器官系统的3D教育资源，包含完整的206块骨骼结构、主要器官位置标注以及神经系统概览。适用于医学教育和生物学课堂教学，支持逐层分解查看。', creator_id: 1, creator_name: 'admin', category: 'Education', model_url: '/models/anatomy.glb', thumbnail_url: 'https://picsum.photos/seed/anatomy/800/600', status: 'approved', likes: 156, created_at: '2026-05-16T11:00:00Z' },
  { id: 6, title: '古典建筑复原', description: '基于历史资料精确复原的古希腊帕特农神庙3D模型。包含46根多立克柱、精美的山花雕刻装饰以及完整的内殿结构。建筑比例严格遵循黄金分割法则，材质贴图还原大理石原貌。', creator_id: 1, creator_name: 'admin', category: 'Architecture', model_url: '/models/greek-temple.glb', thumbnail_url: 'https://picsum.photos/seed/greek/800/600', status: 'approved', likes: 183, created_at: '2026-05-15T13:00:00Z' },
  { id: 7, title: '新能源汽车设计', description: '未来电动跑车的概念设计模型，线条流畅、外形极具动感。全车采用轻量化碳纤维材料，四个轮毂电机独立驱动，续航里程突破800公里。车身侧面配置隐藏式门把手和电子后视镜。', creator_id: 1, creator_name: 'admin', category: 'Product Design', model_url: '/models/electric-car.glb', thumbnail_url: 'https://picsum.photos/seed/evcar/800/600', status: 'approved', likes: 267, created_at: '2026-05-14T16:00:00Z' },
  { id: 8, title: '赛博朋克街道', description: '一个充满霓虹灯光和未来科技感的赛博朋克城市街景。雨中街道反射着全息广告牌的光芒，悬浮车辆在楼宇间穿梭，街角的改造人商贩和无人机送餐服务共同构成了这个反乌托邦世界的日常。', creator_id: 1, creator_name: 'admin', category: 'Game Assets', model_url: '/models/cyberpunk-street.glb', thumbnail_url: 'https://picsum.photos/seed/cyberpunk/800/600', status: 'approved', likes: 341, created_at: '2026-05-13T18:00:00Z' },
  { id: 9, title: '数字雕塑系列', description: '探索数字技术与雕塑艺术融合的实验性作品系列。利用算法生成的有机形态，突破了传统雕塑材料与工艺的局限。每一件作品都是独一无二的，带有流动感和未来主义的美学特质。', creator_id: 1, creator_name: 'admin', category: 'Art', model_url: '/models/digital-sculpture.glb', thumbnail_url: 'https://picsum.photos/seed/digitalsculpt/800/600', status: 'approved', likes: 112, created_at: '2026-05-12T08:00:00Z' },
  { id: 10, title: '太阳系行星模型', description: '基于NASA天文数据精确构建的太阳系互动模型。包含太阳、八颗行星及其主要卫星，土星的光环、木星的大红斑等细节都得到真实还原。行星公转轨道和自转速度按比例精确计算。', creator_id: 1, creator_name: 'admin', category: 'Education', model_url: '/models/solar-system.glb', thumbnail_url: 'https://picsum.photos/seed/solarsystem/800/600', status: 'approved', likes: 298, created_at: '2026-05-11T12:00:00Z' },
  { id: 11, title: '未来社区规划', description: '下一代理想社区的完整规划设计模型，融合了阿那亚式的精神美学与城市社区的民生便利。包含社区美术馆、悬浮书吧、邻里礼堂、下沉庭院等精神地标，以及社区食堂、托育中心、医疗驿站等刚需配套。', creator_id: 1, creator_name: 'admin', category: 'Architecture', model_url: '/models/future-community.glb', thumbnail_url: 'https://picsum.photos/seed/community/800/600', status: 'approved', likes: 425, created_at: '2026-05-10T09:00:00Z' },
  { id: 12, title: '智能家居终端', description: '全屋智能中控系统的产品设计方案。10.1英寸触控屏采用极窄边框设计，顶部集成AI摄像头和远场麦克风阵列。支持语音控制、手势识别和场景联动，可管理灯光、温控、安防、影音等全屋设备。', creator_id: 1, creator_name: 'admin', category: 'Product Design', model_url: '/models/smart-home.glb', thumbnail_url: 'https://picsum.photos/seed/smarthome/800/600', status: 'approved', likes: 189, created_at: '2026-05-09T15:00:00Z' },
];

let nextUserId = data.users.length > 0 ? Math.max(...data.users.map(u => u.id)) + 1 : 1;
let nextExhibitId = data.exhibits.length > 0 ? Math.max(...data.exhibits.map(e => e.id)) + 1 : 1;

if (data.exhibits.length === 0) {
  data.exhibits.push(...seedExhibits);
  nextExhibitId = Math.max(...data.exhibits.map(e => e.id)) + 1;
  save();
  console.log(`[DB] ${seedExhibits.length} seed exhibits created`);
}

const db = {
  users: {
    create({ username, email, password_hash, role = 'user' }) {//创建用户对应注册用户
      const user = {
        id: nextUserId++,
        username,
        email,
        password_hash,
        role,
        avatar_url: null,
        created_at: new Date().toISOString(),
      };
      data.users.push(user);
      save();
      const { password_hash: _, ...safe } = user;
      return safe;
    },
    findByEmail(email) {//查邮箱对应登录
      return data.users.find(u => u.email === email) || null;
    },
    findById(id) {
      const u = data.users.find(u => u.id === id);
      if (!u) return null;
      const { password_hash: _, ...safe } = u;
      return safe;
    },
    findByIdRaw(id) {
      return data.users.find(u => u.id === id) || null;
    },
    all() {
      return data.users.map(({ password_hash: _, ...safe }) => safe);
    },
    updateRole(id, role) {//修改权限对应普通用户到管理员
      const u = data.users.find(u => u.id === id);
      if (u) { u.role = role; save(); return true; }
      return false;
    },
    count() {
      return data.users.length;
    },
  },
  exhibits: {//exhibits模块
    create({ title, description, creator_id, creator_name, category, model_url, thumbnail_url }) {//上传作品
      const exhibit = {
        id: nextExhibitId++,
        title,
        description: description || '',
        creator_id,
        creator_name,
        category,
        model_url: model_url || '',
        thumbnail_url: thumbnail_url || '',
        status: 'pending',
        likes: 0,
        created_at: new Date().toISOString(),
      };
      data.exhibits.push(exhibit);
      save();
      return exhibit;
    },
    findApproved(category, search, page = 1, limit = 12) {//查询对应首页显示（只显示审核通过的作品）
      let list = data.exhibits
        .filter(e => e.status === 'approved')
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      if (category) list = list.filter(e => e.category === category);
      if (search) {
        const s = search.toLowerCase();
        list = list.filter(e => e.title.toLowerCase().includes(s) || e.description.toLowerCase().includes(s));
      }
      const total = list.length;
      const start = (page - 1) * limit;
      const items = list.slice(start, start + limit);
      const enriched = items.map(e => ({ ...e, creator_avatar: db.users.findById(e.creator_id)?.avatar_url || null }));
      return { exhibits: enriched, total, page, limit };
    },
    findAllByStatus(status, page = 1, limit = 20) {//查看待审核作品
      let list = data.exhibits
        .filter(e => !status || e.status === status)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      const total = list.length;
      const items = list.slice((page - 1) * limit, page * limit);
      return { exhibits: items, total };
    },
    findById(id) {
      const e = data.exhibits.find(e => e.id === id);
      if (!e) return null;
      return { ...e, creator_avatar: db.users.findById(e.creator_id)?.avatar_url || null };
    },
    update(id, updates) {
      const idx = data.exhibits.findIndex(e => e.id === id);
      if (idx === -1) return null;
      Object.assign(data.exhibits[idx], updates);
      save();
      return data.exhibits[idx];
    },
    delete(id) {
      const idx = data.exhibits.findIndex(e => e.id === id);
      if (idx === -1) return false;
      data.exhibits.splice(idx, 1);
      save();
      return true;
    },
    like(id) {
      const e = data.exhibits.find(e => e.id === id);
      if (!e) return null;
      e.likes++;
      save();
      return e;
    },
    count() { return data.exhibits.length; },
    countByStatus(status) { return data.exhibits.filter(e => e.status === status).length; },
  },
};

export default db;