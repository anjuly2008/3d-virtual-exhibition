import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

import { useAppStore } from '@/store/appStore';
import { api } from '@/api/client';

import type { Exhibit } from '@/types';

import Card from '@/components/UI/Card';


// ============================================================
// 1. Hero 背景图片
//    每次刷新 Home 页面时随机选择一张
// ============================================================

const homeBackgrounds = [
  '/home-backgrounds/1.png',
  '/home-backgrounds/2.jpg',
  '/home-backgrounds/3.jpg',
  '/home-backgrounds/4.jpg',
  '/home-backgrounds/5.jpg',
];


// ============================================================
// 2. 作品分类数据
// ============================================================

const mockCats = [
  {
    id: '1',
    name: 'Architecture',
    icon: 'Building2',
    color: '#3b82f6',
  },
  {
    id: '2',
    name: 'Product Design',
    icon: 'Box',
    color: '#10b981',
  },
  {
    id: '3',
    name: 'Game Assets',
    icon: 'Gamepad2',
    color: '#f59e0b',
  },
  {
    id: '4',
    name: 'Art',
    icon: 'Palette',
    color: '#ec4899',
  },
  {
    id: '5',
    name: 'Education',
    icon: 'GraduationCap',
    color: '#8b5cf6',
  },
];


// ============================================================
// Home 首页组件
// ============================================================

export default function Home() {

  // ----------------------------------------------------------
  // 3. 全局状态
  // ----------------------------------------------------------

  // 获取作品分类选择方法
  const { selectCategory } = useAppStore();


  // ----------------------------------------------------------
  // 4. Hero 背景
  //    Home 创建时随机选择一张背景图片
  // ----------------------------------------------------------

  const [background] = useState(() => {
    const randomIndex = Math.floor(
      Math.random() * homeBackgrounds.length
    );

    return homeBackgrounds[randomIndex];
  });


  // ----------------------------------------------------------
  // 5. 作品数据
  // ----------------------------------------------------------

  // 保存从后端获取的作品列表
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);


  // ----------------------------------------------------------
  // 6. 获取作品数据
  // ----------------------------------------------------------

  useEffect(() => {

    // Home 第一次加载时请求作品列表
    api.exhibits
      .list({ limit: '6' })

      // 请求成功
      .then((data) => {
        setExhibits(data.exhibits);
      })

      // 请求失败
      .catch(() => {
        // 当前暂时不处理错误
      });

  }, []);


  // ----------------------------------------------------------
  // 7. 精选作品
  //    从获取到的作品中取前 3 个
  // ----------------------------------------------------------

  const featuredExhibits = exhibits.slice(0, 3);


  // ============================================================
  // 8. 页面结构
  // ============================================================

  return (

    <div
      className="min-h-screen pt-15"
      style={{
        // Hero 之外的页面背景
        backgroundImage: "url('/home-backgrounds/4.gif')",

        // GIF 平铺
        backgroundRepeat: 'repeat',

        // 页面滚动时背景保持固定
        backgroundAttachment: 'fixed',
      }}
    >


      {/* ========================================================
          9. Hero 首屏区域
          ======================================================== */}

      <section
        className="relative overflow-hidden"
        style={{
          minHeight: '99vh',
        }}
      >

        {/* ------------------------------------------------------
            9.1 Hero 随机背景
            ------------------------------------------------------ */}

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${background})`,
          }}
        />


        {/* ------------------------------------------------------
            9.2 Hero 深色遮罩
            ------------------------------------------------------ */}

        <div className="absolute inset-0 bg-slate-950/45" />


        {/* ------------------------------------------------------
            9.3 Hero 主要内容
            ------------------------------------------------------ */}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

          <div className="text-center">


            {/* --------------------------------------------------
                9.3.1 平台介绍标签
                -------------------------------------------------- */}

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


            {/* --------------------------------------------------
                9.3.2 Hero 标题
                -------------------------------------------------- */}

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-40">

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


            {/* --------------------------------------------------
                9.3.3 Hero 按钮
                -------------------------------------------------- */}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">


              {/* 浏览作品库 */}

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


              {/* 上传作品 */}

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

            </div>

          </div>

        </div>


        {/* ------------------------------------------------------
            9.4 Hero 底部渐变
            ------------------------------------------------------ */}

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent" />

      </section>



      {/* ========================================================
          10. 精选作品区域
          ======================================================== */}

      <section className="py-20 bg-slate-900/70">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


          {/* ----------------------------------------------------
              10.1 标题
              ---------------------------------------------------- */}

          <div className="text-center mb-12">

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">

              精选作品

              <br />

              <span className="text-sm text-slate-400">
                Featured Works
              </span>

            </h2>

          </div>


          {/* ----------------------------------------------------
              10.2 精选作品卡片
              ---------------------------------------------------- */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {featuredExhibits.map((exhibit) => (

              <Card
                key={exhibit.id}
                exhibit={exhibit}
              />

            ))}

          </div>


          {/* ----------------------------------------------------
              10.3 查看更多作品
              ---------------------------------------------------- */}

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

          </div>

        </div>

      </section>



      {/* ========================================================
          11. 作品分类区域
          ======================================================== */}

      <section className="py-20 bg-slate-800/50">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


          {/* ----------------------------------------------------
              11.1 分类标题
              ---------------------------------------------------- */}

          <div className="text-center mb-12">

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">

              作品分类

              <br />

              <span className="text-sm text-slate-400">
                Categories
              </span>

            </h2>

          </div>


          {/* ----------------------------------------------------
              11.2 分类列表
              ---------------------------------------------------- */}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">

            {mockCats.map((category, index) => (
              <Link
                key={category.id}
                to="/gallery"
                className="group p-6"
                onClick={() => selectCategory(category.name)}
              >
                <img
                  src={`/category-gifs/${index + 6}.gif`}
                  alt={category.name}
                  className="w-20 h-20 object-contain mx-auto mb-4
                            transition-all duration-300
                            group-hover:scale-110
                            group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
                />

                <h3 className="text-white font-medium text-center group-hover:text-accent-400 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}

          </div>

        </div>

      </section>



      {/* ========================================================
          12. Footer
          ======================================================== */}

      <footer className="bg-slate-900/75 border-t border-slate-700 py-12">

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