# 3D Showcase System

一个基于 **React + TypeScript + Three.js** 构建的 Web 端 3D 虚拟作品展示平台，面向 3D 模型作品的上传、审核、浏览与在线预览场景。

项目采用前后端分离式目录组织：前端负责页面展示、用户交互与 3D 可视化，后端基于 Node.js + Express 提供用户认证、作品管理、点赞、管理员审核以及 AI 展览助手等接口。项目使用 **MySQL** 作为核心业务数据的持久化数据库。

---

## 项目概览

### 核心能力

* 3D 虚拟展览首页与沉浸式视觉界面
* 3D 作品库浏览、搜索与分类筛选
* GLB / GLTF / OBJ / FBX / STL 等 3D 模型上传
* 作品缩略图上传与作品信息管理
* Three.js 在线 3D 模型预览
* 用户注册、登录与 JWT 身份认证
* 用户头像上传与个人中心
* 我的作品 / 我的点赞作品管理
* 作品点赞与点赞用户查看
* 管理员作品审核与状态管理
* 管理员在线预览待审核作品
* 管理员用户角色管理与数据统计
* AI 虚拟展览助手
* 中英文界面文案与双语页面展示
* 响应式布局，兼容桌面端与移动端

---

## 技术栈

### 前端

| 技术                | 用途                  |
| ----------------- | ------------------- |
| React 18          | 用户界面与组件化开发          |
| TypeScript 5      | 类型安全与工程化开发          |
| Vite 5            | 前端开发与构建             |
| React Router 6    | 页面路由管理              |
| Three.js          | 3D 场景与模型渲染          |
| React Three Fiber | React 与 Three.js 集成 |
| @react-three/drei | Three.js 常用辅助组件     |
| Zustand           | 全局状态管理              |
| Tailwind CSS 3    | UI 样式与响应式布局         |
| Lucide React      | 图标组件                |

### 后端

| 技术         | 用途                    |
| ---------- | --------------------- |
| Node.js    | JavaScript 服务端运行环境    |
| Express    | HTTP API 服务           |
| MySQL      | 用户、作品、点赞等核心业务数据持久化    |
| mysql2     | Node.js 与 MySQL 数据库连接 |
| JWT        | 用户身份认证                |
| bcryptjs   | 用户密码哈希                |
| Multer     | 文件上传处理                |
| CORS       | 跨域请求处理                |
| OpenRouter | AI 展览助手模型接口           |

---

## 系统架构

```text
┌──────────────────────────────────────────────┐
│                  浏览器 / Browser            │
│                                              │
│  React + TypeScript + Vite                   │
│  React Router + Zustand + Tailwind CSS       │
│  Three.js + React Three Fiber                │
└──────────────────────┬───────────────────────┘
                       │
                       │ /api
                       ▼
┌──────────────────────────────────────────────┐
│              Node.js + Express               │
│                                              │
│  Auth API        Exhibit API                 │
│  Admin API       AI API                      │
│                                              │
│  JWT Auth        File Upload                 │
│  Role Control    Data Operations             │
└───────────────┬──────────────────┬───────────┘
                │                  │
                │                  │
                ▼                  ▼
      ┌──────────────────┐  ┌────────────────┐
      │      MySQL       │  │    uploads/    │
      │                  │  │                │
      │ users            │  │ 模型 / 图片    │
      │ exhibits         │  │ 头像 / 缩略图  │
      │ like_records     │  │                │
      └──────────────────┘  └────────────────┘
```

项目的核心业务数据通过 Node.js + Express 后端进行统一管理，并通过 `mysql2` 连接 MySQL 数据库。

主要数据关系包括：

```text
用户 users
   │
   ├───────────────┐
   │               │
   ▼               ▼
作品 exhibits   点赞记录 like_records
   │
   ▼
模型 / 缩略图文件
   │
   ▼
uploads/
```

AI 助手的调用链为：

```text
AI 聊天窗口
    ↓
POST /api/ai/chat
    ↓
Node.js / Express
    ↓
OpenRouter
    ↓
模型返回结果
    ↓
前端展示回答
```

---

## 页面结构

| 路由                   | 页面            | 说明                   |
| -------------------- | ------------- | -------------------- |
| `/`                  | Home          | 首页、3D Hero、精选作品、作品分类 |
| `/gallery`           | Gallery       | 作品库、搜索、分类与筛选         |
| `/viewer/:id`        | Viewer        | 普通用户查看审核通过的 3D 作品    |
| `/upload`            | Upload        | 登录用户上传作品             |
| `/login`             | Login         | 用户登录                 |
| `/register`          | Register      | 用户注册                 |
| `/profile`           | Profile       | 个人中心、我的作品、我的点赞、头像    |
| `/admin`             | Admin         | 管理员后台、作品审核、用户管理、统计   |
| `/admin-preview/:id` | Admin Preview | 管理员预览待审核或其他状态作品      |

---

## 主要功能流程

### 1. 用户注册与登录

用户通过注册页面创建账号，后端使用 `bcryptjs` 对密码进行哈希处理，并通过 JWT 返回登录凭证。

用户数据存储在 MySQL 的 `users` 表中。

登录状态由前端 `AuthContext` 与 `localStorage` 共同维护，后续 API 请求会自动携带：

```text
Authorization: Bearer <token>
```

### 2. 作品上传

登录用户可以在 `/upload` 页面填写：

* 作品标题
* 作品描述
* 作品分类
* 标签
* 使用场景
* 3D 模型文件
* 作品缩略图

模型文件当前支持：

```text
.glb
.gltf
.obj
.fbx
.stl
```

单个上传文件大小上限为 **50 MB**。

缩略图支持：

```text
.jpg
.jpeg
.png
.webp
```

作品信息及其审核状态等核心数据保存至 MySQL，实际模型和图片文件保存于 `uploads/` 目录。

### 3. 作品审核

用户提交作品后，作品进入待审核状态。

管理员在 `/admin` 中可以：

```text
待审核 → 通过

待审核 → 拒绝
```

审核通过后的作品才会进入普通用户作品展示流程。

管理员还可以通过 `/admin-preview/:id` 对作品进行在线 3D 预览。

### 4. 3D 在线预览

项目通过 `@react-three/fiber` 与 `@react-three/drei` 创建 3D 场景，并结合 `useGLTF` 加载 GLB / GLTF 模型。

在线预览支持：

* 鼠标旋转
* 缩放
* 平移
* 模型自动归一化尺寸
* 模型居中显示
* 灯光与展示场景

首页还包含一个独立的 3D Hero 装饰模型，用于增强首页视觉表现。

### 5. 点赞系统

登录用户可以对作品点赞或取消点赞。

个人中心提供：

```text
我的作品

我的点赞
```

作品详情还可以查询点赞用户。

点赞关系存储在 MySQL 的 `like_records` 表中，作品点赞数量同步维护在作品数据中。

### 6. 管理员后台

管理员后台包含：

* 作品审核
* 作品状态筛选
* 作品预览
* 删除作品
* 用户列表
* 用户角色调整
* 用户数量统计
* 作品数量统计
* 已通过作品数量
* 待审核作品数量

管理员接口通过 JWT 身份认证和管理员权限中间件进行保护。

### 7. AI 展览助手

首页集成 AI 虚拟展览助手。

AI 助手可以作为独立的前端组件运行，通过：

```text
POST /api/ai/chat
```

调用 OpenRouter 模型服务，用于回答与展览、作品和艺术信息相关的问题。

该功能属于可选能力，需要在后端环境变量中配置 OpenRouter API Key 与模型信息。

---

## 项目目录

```text
3d-exhibition-system/
│
├─ public/
│  ├─ backgrounds/          # 页面背景资源
│  ├─ category-gifs/        # 作品分类图标
│  ├─ dividers/             # 页面分隔装饰
│  ├─ header-backgrounds/    # 顶部导航背景
│  ├─ header-icons/          # 顶部导航图标
│  ├─ icons/                # 通用图标与 AI 助手图标
│  ├─ models/               # 首页 Hero 3D 模型
│  ├─ admin-icons/           # 管理员页面资源
│  ├─ gallery-icons/         # 作品库资源
│  ├─ login-icons/           # 登录页面资源
│  ├─ register-icons/       # 注册页面资源
│  └─ upload-icons/         # 上传页面资源
│
├─ src/
│  ├─ api/
│  │  └─ client.ts           # 前端 API 封装
│  │
│  ├─ components/
│  │  ├─ 3D/
│  │  │  ├─ Card3DPreview.tsx
│  │  │  ├─ HeroDecorModel.tsx
│  │  │  ├─ ModelViewer.tsx
│  │  │  ├─ Scene.tsx
│  │  │  └─ UploadModelPreview.tsx
│  │  ├─ AI/
│  │  │  └─ AIExhibitionAssistant.tsx
│  │  └─ UI/
│  │     ├─ Card.tsx
│  │     └─ Header.tsx
│  │
│  ├─ context/
│  │  └─ AuthContext.tsx      # 登录状态与用户信息
│  │
│  ├─ pages/
│  │  ├─ Home.tsx
│  │  ├─ Gallery.tsx
│  │  ├─ Viewer.tsx
│  │  ├─ Upload.tsx
│  │  ├─ Login.tsx
│  │  ├─ Register.tsx
│  │  ├─ Profile.tsx
│  │  ├─ Admin.tsx
│  │  └─ AdminPreview.tsx
│  │
│  ├─ store/
│  │  └─ appStore.ts          # 全局筛选与页面状态
│  │
│  ├─ types/
│  │  └─ index.ts             # TypeScript 类型定义
│  │
│  ├─ App.tsx                 # 路由与全局布局
│  ├─ index.css               # 全局样式
│  └─ main.tsx                # 应用入口
│
├─ server/
│  ├─ middleware/
│  │  └─ auth.js              # JWT 与管理员权限中间件
│  ├─ routes/
│  │  ├─ auth.js              # 用户认证接口
│  │  ├─ exhibits.js          # 作品与点赞接口
│  │  ├─ admin.js             # 管理员接口
│  │  └─ ai.js                # AI 接口
│  ├─ db.js                   # MySQL 数据库连接与数据操作
│  ├─ index.js                # Express 服务入口
│  ├─ package.json
│  └─ .env                    # 本地环境变量，不应提交到仓库
│
├─ uploads/                   # 上传文件目录（运行后生成）
│  ├─ avatars/
│  ├─ models/
│  └─ thumbnails/
│
├─ index.html
├─ package.json
├─ vite.config.ts
├─ tsconfig.json
├─ tailwind.config.js
├─ postcss.config.js
└─ README.md
```

---

## 本地运行

### 环境要求

建议使用：

* Node.js 18+
* npm 9+
* MySQL 8.0+
* 支持 WebGL 的现代浏览器

Chrome、Edge 等 Chromium 浏览器通常具有较好的 WebGL 兼容性。

### 1. 安装前端依赖

在项目根目录执行：

```bash
npm install
```

### 2. 安装后端依赖

```bash
cd server
npm install
cd ..
```

### 3. 准备 MySQL 数据库

首先确保本地 MySQL 服务已经启动，并准备好项目使用的数据库。

项目默认数据库名称为：

```text
mart_community_3d
```

数据库连接信息通过后端环境变量配置。

### 4. 配置环境变量

在：

```text
server/.env
```

配置 MySQL 数据库连接信息：

```env
PORT=3001

MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=mart_community_3d
```

如果使用 AI 展览助手，还需要配置：

```env
OPENROUTER_API_KEY=your_api_key
OPENROUTER_MODEL=openrouter/free
```

其中：

* `PORT`：后端服务端口，默认 `3001`
* `MYSQL_HOST`：MySQL 服务地址
* `MYSQL_PORT`：MySQL 服务端口，默认 `3306`
* `MYSQL_USER`：MySQL 用户名
* `MYSQL_PASSWORD`：MySQL 密码
* `MYSQL_DATABASE`：项目使用的数据库名称
* `OPENROUTER_API_KEY`：OpenRouter API Key
* `OPENROUTER_MODEL`：OpenRouter 使用的模型

> 不要把真实数据库密码、API Key 等敏感信息写入 Git 仓库。项目已经通过 `.gitignore` 忽略 `.env` 文件。

### 5. 启动后端

打开一个终端：

```bash
cd server
npm run start
```

后端默认运行在：

```text
http://localhost:3001
```

健康检查：

```text
http://localhost:3001/api/health
```

正常情况下会返回类似：

```json
{
  "status": "ok",
  "time": "2026-01-01T00:00:00.000Z"
}
```

### 6. 启动前端

再打开一个终端，在项目根目录执行：

```bash
npm run dev
```

Vite 默认地址：

```text
http://localhost:5173
```

Vite 已配置 `/api` 与 `/uploads` 代理到后端 `http://localhost:3001`，因此前端无需直接写后端地址。

---

## 生产构建

项目根目录执行：

```bash
npm run build
```

构建流程会：

1. 使用 TypeScript 进行类型检查
2. 使用 Vite 构建前端
3. 生成前端生产构建文件

构建完成后会生成：

```text
dist/
```

启动生产模式：

```bash
npm run start
```

当 `dist/` 存在时，Express 会同时托管前端静态资源和 API。

---

## API 设计

### 用户认证

```text
POST /api/auth/register

POST /api/auth/login

GET  /api/auth/me

PUT  /api/auth/avatar
```

### 作品

```text
GET    /api/exhibits

GET    /api/exhibits/:id

GET    /api/exhibits/mine

GET    /api/exhibits/likes/mine

POST   /api/exhibits

PUT    /api/exhibits/:id

DELETE /api/exhibits/:id
```

### 点赞

```text
GET  /api/exhibits/:id/like

POST /api/exhibits/:id/like

GET  /api/exhibits/:id/likers
```

### 管理员

```text
GET    /api/admin/exhibits

GET    /api/admin/exhibits/:id/preview

PUT    /api/admin/exhibits/:id/status

DELETE /api/admin/exhibits/:id

GET    /api/admin/users

PUT    /api/admin/users/:id/role

GET    /api/admin/stats
```

### AI

```text
POST /api/ai/chat
```

### 服务健康检查

```text
GET /api/health
```

---

## 数据存储

项目当前采用 **MySQL** 作为核心业务数据的持久化方案。

Node.js 后端通过 `mysql2` 连接 MySQL，并由 `server/db.js` 统一处理数据库连接以及用户、作品、点赞等数据操作。

当前核心数据主要包括：

```text
users
exhibits
like_records
```

其中：

* `users`：用户、角色、头像、注册信息等
* `exhibits`：作品、作者、分类、模型地址、缩略图、审核状态、点赞数等
* `like_records`：用户与作品之间的点赞关系

数据关系可以概括为：

```text
users
  │
  ├─────── 用户上传 ───────► exhibits
  │                              │
  │                              │
  └─────── 点赞关系 ───────► like_records
```

上传的实际文件不直接存储在 MySQL 中，而是保存于：

```text
uploads/

├─ avatars/

├─ models/

└─ thumbnails/
```

数据库中主要保存用户、作品以及相关业务关系和文件访问地址等信息。

---

## 权限模型

项目目前包含两种主要用户角色：

```text
user

admin
```

### 普通用户

可以：

* 注册与登录
* 浏览审核通过的作品
* 上传作品
* 管理自己的作品
* 点赞作品
* 查看自己的点赞作品
* 修改个人头像

### 管理员

在普通用户能力基础上，可以：

* 进入管理员后台
* 查看所有作品
* 审核作品
* 预览待审核作品
* 删除作品
* 管理用户角色
* 查看系统统计数据

管理员 API 使用 JWT 身份认证与管理员权限中间件进行保护。

---

## 3D 模型处理流程

用户上传模型后，服务端根据文件字段将文件保存到对应目录：

```text
3D 模型

   ↓

Multer

   ↓

uploads/models/

   ↓

数据库保存 model_url

   ↓

前端 useGLTF()

   ↓

Three.js / React Three Fiber

   ↓

在线 3D 展示
```

作品卡片中的 3D 预览和作品详情中的完整模型查看分别由不同组件负责：

```text
Card3DPreview.tsx

→ 作品卡片悬停预览

ModelViewer.tsx

→ 作品详情页完整 3D 查看
```

---

## 首页视觉系统

首页 `Home.tsx` 主要由以下几个层次组成：

```text
页面背景 GIF
      ↓
半透明暗色遮罩
      ↓
Three.js Hero 场景
      ↓
首页标题与操作按钮
      ↓
精选作品
      ↓
作品分类
      ↓
页脚
```

Hero 场景通过 `HeroDecorModel.tsx` 加载：

```text
public/models/hero-decor.glb
```

首页同时使用 GIF 背景、分隔装饰、分类图标和导航图标形成统一的视觉风格。

---

## AI 助手说明

AI 助手前端组件位于：

```text
src/components/AI/AIExhibitionAssistant.tsx
```

后端接口位于：

```text
server/routes/ai.js
```

目前 AI 服务基于 OpenRouter。

AI 功能需要满足：

```text
有效的 OPENROUTER_API_KEY

+

可用的 OPENROUTER_MODEL

+

能够访问 OpenRouter API
```

免费模型可能存在速率限制、服务拥堵或模型供应变化，因此 AI 功能应视为平台的增强功能，而不是核心作品浏览功能。

---

## 常见问题

### 页面可以打开，但作品列表为空

先检查后端是否启动，并访问：

```text
http://localhost:3001/api/health
```

然后检查：

1. MySQL 服务是否正常启动
2. `server/.env` 中的数据库连接信息是否正确
3. `MYSQL_DATABASE` 是否配置为项目实际使用的数据库
4. MySQL 中是否存在 `exhibits` 表以及作品数据
5. 浏览器 Network 中 `/api/exhibits` 请求是否正常返回

### MySQL 无法连接

检查：

1. MySQL 服务是否已经启动
2. `MYSQL_HOST` 是否正确
3. `MYSQL_PORT` 是否正确
4. `MYSQL_USER` 是否正确
5. `MYSQL_PASSWORD` 是否正确
6. `MYSQL_DATABASE` 是否存在
7. MySQL 用户是否具有对应数据库的访问权限

如果后端启动时报数据库连接错误，可以优先查看后端终端输出。

### 3D 模型无法加载

检查：

1. 模型文件是否实际存在于 `uploads/models/`
2. 浏览器 Network 中模型请求是否返回 `200`
3. 模型格式是否属于当前支持范围
4. 浏览器是否启用了 WebGL

### AI 助手无法回复

检查：

1. `server/.env` 是否存在
2. `OPENROUTER_API_KEY` 是否配置正确
3. `OPENROUTER_MODEL` 是否可用
4. 后端终端是否出现 OpenRouter 错误
5. 浏览器 Network 中 `/api/ai/chat` 是否返回正常响应

### 上传后作品没有出现在作品库

作品上传后首先进入审核流程。

需要管理员在：

```text
/admin
```

中将作品状态修改为：

```text
approved
```

普通用户作品库只展示审核通过的作品。

---

## 安全注意事项

本项目定位为学习、课程设计或作品展示项目，当前数据存储与权限设计仍属于轻量级方案，不建议直接用于生产环境。

上线部署前建议至少完成：

* 移除代码中的默认管理员密码
* 所有密钥放入服务器环境变量
* 不提交 `.env`
* 更换生产环境 JWT Secret
* 设置安全的 MySQL 用户和密码
* 限制数据库用户的权限范围
* 增加上传文件内容校验
* 增加更严格的文件访问权限
* 对 API 增加请求频率限制
* 增强管理员操作审计日志
* 定期备份 MySQL 数据库

---

## 开发命令

### 前端

```bash
npm run dev

npm run build

npm run start

npm run preview

npm run lint
```

### 后端

```bash
cd server

npm run start

npm run dev
```

---

## 项目特点

本项目将 **Web 前端、3D 可视化、用户系统、内容审核、MySQL 数据库和 AI 交互** 融合在同一个应用中，形成完整的作品展示闭环：

```text
注册 / 登录

     ↓

上传 3D 作品

     ↓

管理员审核

     ↓

作品进入展览

     ↓

3D 在线预览

     ↓

点赞 / 个人中心

     ↓

AI 展览助手
```

相比普通的图片作品展示页面，本项目的核心特色在于使用 Three.js 构建真实的 Web 3D 浏览体验，并通过用户、作品、审核、点赞、MySQL 数据持久化与 AI 助手等模块形成完整的虚拟展览系统。

---

## 项目状态

当前项目已完成基础的 3D 展示、用户认证、MySQL 数据持久化、作品上传、管理员审核、点赞、个人中心和 AI 助手等核心功能，适合作为：

* Web 3D 虚拟展览课程项目
* 个人前端 / 全栈项目作品集
* 3D 模型在线展示平台原型
* React + Three.js 综合实践项目
