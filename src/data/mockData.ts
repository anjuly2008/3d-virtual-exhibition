import type { Exhibit, Category } from '@/types';

export const mockCategories: Category[] = [
  { id: '1', name: 'Architecture', icon: 'Building2', color: '#3b82f6' },
  { id: '2', name: 'Product Design', icon: 'Box', color: '#10b981' },
  { id: '3', name: 'Game Assets', icon: 'Gamepad2', color: '#f59e0b' },
  { id: '4', name: 'Art', icon: 'Palette', color: '#ec4899' },
  { id: '5', name: 'Education', icon: 'GraduationCap', color: '#8b5cf6' },
];

export const mockExhibits: Exhibit[] = [
  {
    id: 1, title: '未来城市天际线 / Future City Skyline',
    description: '一个展现未来科技城市的3D模型，融合了可持续建筑和智能交通系统。 / A 3D model showcasing a futuristic tech city, integrating sustainable architecture and intelligent transportation systems.',
    creator_id: 1, creator_name: '张明', category: 'Architecture',
    model_url: 'future-city.glb', thumbnail_url: 'https://picsum.photos/seed/city/800/450',
    status: 'approved', likes: 128, created_at: '2024-01-15',
  },
  {
    id: 2, title: '智能手表概念设计 / Smartwatch Concept Design',
    description: '下一代智能穿戴设备的概念设计，具有全息显示和健康监测功能。 / A concept design for next-generation smart wearable devices featuring holographic display and health monitoring functions.',
    creator_id: 2, creator_name: '李华', category: 'Product Design',
    model_url: 'smartwatch.glb', thumbnail_url: 'https://picsum.photos/seed/watch/800/450',
    status: 'approved', likes: 96, created_at: '2024-01-20',
  },
  {
    id: 3, title: '奇幻森林场景 / Fantasy Forest Scene',
    description: '充满魔法元素的游戏场景，包含神秘的树木和发光生物。 / A game scene filled with magical elements, including mysterious trees and glowing creatures.',
    creator_id: 3, creator_name: '王芳', category: 'Game Assets',
    model_url: 'magic-forest.glb', thumbnail_url: 'https://picsum.photos/seed/forest/800/450',
    status: 'approved', likes: 156, created_at: '2024-01-25',
  },
  {
    id: 4, title: '抽象几何艺术 / Abstract Geometric Art',
    description: '探索几何形态与光影关系的抽象艺术作品。 / An abstract artwork exploring the relationship between geometric forms and light and shadow.',
    creator_id: 4, creator_name: '陈静', category: 'Art',
    model_url: 'geometric-art.glb', thumbnail_url: 'https://picsum.photos/seed/abstract/800/450',
    status: 'approved', likes: 78, created_at: '2024-02-01',
  },
  {
    id: 5, title: '人体解剖模型 / Human Anatomy Model',
    description: '用于医学教育的高精度人体解剖3D模型。 / A high-precision 3D human anatomy model for medical education.',
    creator_id: 5, creator_name: '刘洋', category: 'Education',
    model_url: 'anatomy.glb', thumbnail_url: 'https://picsum.photos/seed/medical/800/450',
    status: 'approved', likes: 134, created_at: '2024-02-05',
  },
  {
    id: 6, title: '古典建筑复原 / Classical Architecture Restoration',
    description: '古代神庙的数字化复原项目，基于考古资料和历史文献重建。 / A digital restoration project of ancient temples, reconstructed based on archaeological data and historical documents.',
    creator_id: 6, creator_name: '赵云', category: 'Architecture',
    model_url: 'greek-temple.glb', thumbnail_url: 'https://picsum.photos/seed/temple/800/450',
    status: 'approved', likes: 89, created_at: '2024-02-10',
  },
  {
    id: 7, title: '新能源汽车设计 / New Energy Vehicle Design',
    description: '未来新能源汽车的概念设计，采用流线型车身和隐藏式车门把手。 / A concept design for future new energy vehicles, featuring streamlined body and hidden door handles.',
    creator_id: 7, creator_name: '周杰', category: 'Product Design',
    model_url: 'ev-car.glb', thumbnail_url: 'https://picsum.photos/seed/car/800/450',
    status: 'approved', likes: 167, created_at: '2024-02-15',
  },
  {
    id: 8, title: '赛博朋克街道 / Cyberpunk Street',
    description: '充满未来感的赛博朋克风格城市街道，包含霓虹灯牌和悬浮广告牌。 / A futuristic cyberpunk-style city street featuring neon signs and floating billboards.',
    creator_id: 8, creator_name: '林晓', category: 'Game Assets',
    model_url: 'cyberpunk-street.glb', thumbnail_url: 'https://picsum.photos/seed/cyberpunk/800/450',
    status: 'approved', likes: 203, created_at: '2024-02-20',
  },
  {
    id: 9, title: '数字雕塑系列 / Digital Sculpture Series',
    description: '一组探索数字与实体边界的当代艺术雕塑。 / A series of contemporary art sculptures exploring the boundary between digital and physical.',
    creator_id: 9, creator_name: '吴婷', category: 'Art',
    model_url: 'digital-sculptures.glb', thumbnail_url: 'https://picsum.photos/seed/sculpture/800/450',
    status: 'approved', likes: 145, created_at: '2024-02-25',
  },
  {
    id: 10, title: '太阳系行星模型 / Solar System Planet Model',
    description: '高精度太阳系行星模型，包含太阳和八颗行星及其主要卫星。 / A high-precision solar system planet model, including the sun, eight planets, and their major moons.',
    creator_id: 10, creator_name: '孙伟', category: 'Education',
    model_url: 'solar-system.glb', thumbnail_url: 'https://picsum.photos/seed/solar/800/450',
    status: 'approved', likes: 198, created_at: '2024-03-01',
  },
  {
    id: 11, title: '未来社区规划 / Future Community Planning',
    description: '基于阿那亚模式设计的未来社区规划模型。 / A future community planning model based on the Aranya model.',
    creator_id: 11, creator_name: '郑强', category: 'Architecture',
    model_url: 'future-community.glb', thumbnail_url: 'https://picsum.photos/seed/community/800/450',
    status: 'approved', likes: 234, created_at: '2024-03-05',
  },
  {
    id: 12, title: '智能家居终端 / Smart Home Terminal',
    description: '智能家居控制中心的工业设计模型。 / An industrial design model for a smart home control center.',
    creator_id: 12, creator_name: '黄丽', category: 'Product Design',
    model_url: 'smart-home.glb', thumbnail_url: 'https://picsum.photos/seed/smarthome/800/450',
    status: 'approved', likes: 112, created_at: '2024-03-10',
  },
];