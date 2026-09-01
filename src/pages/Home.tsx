import { useEffect, useState } from 'react';
// 导入 React 的两个 Hook：
// useState：保存组件中的状态数据
// useEffect：在组件渲染后执行额外操作

import { Link } from 'react-router-dom';
// Link：React Router 提供的页面跳转组件

import { ArrowRight, Sparkles, Star, Award } from 'lucide-react';
// 从 lucide-react 图标库中导入图标

import { useAppStore } from '@/store/appStore';
// 导入项目中的全局状态管理

import { api } from '@/api/client';
// 导入前端 API 请求工具，用来调用后端接口

import type { Exhibit } from '@/types';
// 导入 Exhibit 类型，用来告诉 TypeScript 作品对象应该长什么样

import Card from '@/components/UI/Card';
// 导入自定义的 Card 组件，用来显示作品卡片

import Hero3DScene from '@/components/3D/Hero3DScene';
// 导入首页中的 3D 场景组件


// 模拟分类数据
const mockCats = [
  {
    id: '1',
    name: 'Architecture',
    icon: 'Building2',
    color: '#3b82f6'
  },
  {
    id: '2',
    name: 'Product Design',
    icon: 'Box',
    color: '#10b981'
  },
  {
    id: '3',
    name: 'Game Assets',
    icon: 'Gamepad2',
    color: '#f59e0b'
  },
  {
    id: '4',
    name: 'Art',
    icon: 'Palette',
    color: '#ec4899'
  },
  {
    id: '5',
    name: 'Education',
    icon: 'GraduationCap',
    color: '#8b5cf6'
  },
];


export default function Home() {
  // 定义 Home React 页面组件

  const { selectCategory } = useAppStore();
  // 从全局状态中获取 selectCategory 函数
  // 用来记录用户选择了哪个作品分类

  const [exhibits, setExhibits] = useState<Exhibit[]>([]);
  // 创建一个叫 exhibits 的 React 状态
  // exhibits：当前保存的作品数据
  // setExhibits：修改作品数据的方法
  // Exhibit[]：表示 exhibits 是一个 Exhibit 类型的数组
  // []：表示刚开始没有作品


  useEffect(() => {
    // 页面第一次加载后执行
    // 因为下面的依赖数组是 []，所以只执行一次

    api.exhibits.list({ limit: '6' })
      // 调用前端 API 的 exhibits.list()
      // 请求后端获取作品列表
      // { limit: '6' } 表示希望获取 6 个作品

      .then((data) => setExhibits(data.exhibits))
      // 后端返回数据后：
      // data 是后端返回的数据
      // data.exhibits 是作品数组
      // setExhibits() 把作品数组保存到 exhibits 状态

      .catch(() => {});
      // 如果请求失败，目前什么都不处理

  }, []);
  // [] 是依赖数组
  // 表示这个 useEffect 不依赖其他变量
  // 因此 Home 第一次加载时执行一次


  const featuredExhibits = exhibits.slice(0, 3);
  // 从 exhibits 数组中取出前 3 个作品
  // 作为首页“精选作品”


  return (
    <div className="min-h-screen pt-16">
      {/* 整个 Home 页面的最外层容器
          min-h-screen：最小高度为整个屏幕
          pt-16：顶部内边距 */}

      <section
        className="relative overflow-hidden"
        style={{ minHeight: '85vh' }}
      >
        {/* 首页顶部 Hero 区域
            relative：相对定位
            overflow-hidden：超出区域的内容隐藏
            minHeight：最小高度为视口高度的 85% */}

        <div className="absolute inset-0 bg-gradient-to-br from-primary-800 via-slate-900 to-accent-900" />
        {/* 首页背景渐变 */}

        <div className="absolute inset-0 opacity-30">
          {/* 背景装饰层 */}

          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-pulse"
          />

          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          />
        </div>


        <Hero3DScene />
        {/* 首页中的 3D 场景组件 */}


        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* 首页文字内容区域 */}

          <div className="text-center">

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500/20 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-accent-400" />

              <span className="text-sm text-accent-300 font-medium">
                虚拟仿真作品展示平台
                <br />

                <span className="text-xs text-slate-400">
                  Virtual Simulation Showcase Platform
                </span>
              </span>
            </div>


            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6">
              <span className="text-white">
                探索
              </span>

              <span className="text-gradient">
                3D虚拟世界
              </span>

              <br />

              <span className="text-sm text-slate-400">
                Explore 3D Virtual World
              </span>
            </h1>


            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
              汇集顶尖虚拟仿真作品，体验沉浸式3D展示。无需安装专业软件，即可在线浏览和交互各类精彩的虚拟作品。
              <br />

              <span className="text-sm text-slate-400">
                A collection of top virtual simulation works, experience immersive 3D display. Browse and interact with exciting virtual works online without installing professional software.
              </span>
            </p>


            <div className="flex flex-col sm:flex-row gap-4 justify-center">

              <Link
                to="/gallery"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-accent rounded-xl text-white font-semibold hover:opacity-90 transition-all glow-effect"
              >
                <span>
                  浏览作品库
                  <span className="text-xs text-slate-500">
                    / Browse Gallery
                  </span>
                </span>

                <ArrowRight className="w-5 h-5" />
              </Link>

              {/* 点击“浏览作品库”：
                  Link 的 to="/gallery"
                  ↓
                  React Router 跳转到 /gallery
                  ↓
                  App.tsx 中的 Gallery 页面被加载 */}


              <Link
                to="/upload"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-semibold transition-colors"
              >
                <span>
                  上传作品
                  <span className="text-xs text-slate-500">
                    / Upload Work
                  </span>
                </span>
              </Link>

              {/* 点击“上传作品”：
                  Link 的 to="/upload"
                  ↓
                  React Router 跳转到 /upload
                  ↓
                  App.tsx 中的 Upload 页面被加载 */}

            </div>
          </div>
        </div>


        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent" />
        {/* Hero 区域底部的渐变遮罩 */}

      </section>


      <section className="py-20 bg-slate-900">
        {/* 精选作品区域 */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              精选作品
              <br />

              <span className="text-sm text-slate-400">
                Featured Works
              </span>
            </h2>

            <p className="text-slate-400">
              来自顶尖创作者的优秀虚拟仿真作品
              <br />

              <span className="text-xs text-slate-500">
                Outstanding virtual simulation works from top creators
              </span>
            </p>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 创建作品卡片网格 */}

            {featuredExhibits.map((exhibit) => (
              <Card
                key={exhibit.id}
                exhibit={exhibit}
              />
            ))}

            {/* map：
                遍历 featuredExhibits 数组
                每个作品生成一个 Card 组件

                key：
                React 用来区分不同作品

                exhibit={exhibit}：
                把当前作品数据传给 Card 组件 */}

          </div>


          <div className="text-center mt-12">

            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 font-medium transition-colors"
            >
              <span>
                查看更多作品
                <span className="text-xs text-slate-500">
                  / View More Works
                </span>
              </span>

              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* 点击“查看更多作品”
                ↓
                Link 的 to="/gallery"
                ↓
                跳转到 Gallery 页面 */}

          </div>

        </div>
      </section>


      <section className="py-20 bg-slate-800/50">
        {/* 作品分类区域 */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              作品分类
              <br />

              <span className="text-sm text-slate-400">
                Categories
              </span>
            </h2>

            <p className="text-slate-400">
              按类别浏览不同类型的虚拟作品
              <br />

              <span className="text-xs text-slate-500">
                Browse different types of virtual works by category
              </span>
            </p>

          </div>


          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">

            {mockCats.map((category) => (
              <Link
                key={category.id}
                to="/gallery"
                className="group p-6 bg-slate-800 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all card-hover"
                onClick={() => selectCategory(category.name)}
              >

                {/* 点击某个分类：
                    先执行 onClick
                    ↓
                    selectCategory(category.name)
                    ↓
                    保存用户选择的分类
                    ↓
                    Link 再跳转到 /gallery */}

                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto"
                  style={{
                    backgroundColor: `${category.color}20`
                  }}
                >
                  {/* 根据当前分类的 color 动态设置背景颜色 */}

                  <span className="text-2xl">
                    🎨
                  </span>

                </div>


                <h3 className="text-white font-medium text-center group-hover:text-accent-400 transition-colors">
                  {category.name}
                </h3>

                {/* {category.name}：
                    JSX 中通过 {} 插入 JavaScript 数据
                    显示当前分类名称 */}

              </Link>
            ))}

          </div>
        </div>
      </section>


      <section className="py-20 bg-gradient-to-r from-primary-800/50 to-accent-900/50">
        {/* 项目特点区域 */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid md:grid-cols-3 gap-8">

            <div className="text-center p-6">

              <div className="w-16 h-16 rounded-full bg-accent-500/20 flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-accent-400" />
              </div>

              <h3 className="text-xl font-semibold text-white mb-2">
                高质量作品
                <br />

                <span className="text-sm text-slate-400">
                  High Quality Works
                </span>
              </h3>

              <p className="text-slate-400">
                精选来自全球创作者的优秀虚拟仿真作品
                <br />

                <span className="text-xs text-slate-500">
                  Curated outstanding virtual simulation works from creators worldwide
                </span>
              </p>

            </div>


            <div className="text-center p-6">

              <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary-400" />
              </div>

              <h3 className="text-xl font-semibold text-white mb-2">
                专业评审
                <br />

                <span className="text-sm text-slate-400">
                  Professional Review
                </span>
              </h3>

              <p className="text-slate-400">
                由行业专家组成的评审团队严格把关
                <br />

                <span className="text-xs text-slate-500">
                  Rigorously reviewed by industry expert panels
                </span>
              </p>

            </div>


            <div className="text-center p-6">

              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>

              <h3 className="text-xl font-semibold text-white mb-2">
                沉浸式体验
                <br />

                <span className="text-sm text-slate-400">
                  Immersive Experience
                </span>
              </h3>

              <p className="text-slate-400">
                基于WebGL技术，提供流畅的3D交互体验
                <br />

                <span className="text-xs text-slate-500">
                  Powered by WebGL technology, delivering smooth 3D interactive experiences
                </span>
              </p>

            </div>

          </div>
        </div>
      </section>


      <footer className="bg-slate-900 border-t border-slate-700 py-12">
        {/* 页面底部 Footer */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center">

            <p className="text-slate-400">
              © 2024 3D展示系统 - 虚拟仿真作品展示平台
              <br />

              <span className="text-xs text-slate-500">
                © 2024 3D Exhibition System - Virtual Simulation Showcase Platform
              </span>
            </p>

          </div>
        </div>
      </footer>

    </div>
  );
}