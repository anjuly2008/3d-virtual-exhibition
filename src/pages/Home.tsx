import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Upload } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { useAppStore } from '@/store/appStore';
import { api } from '@/api/client';
import type { Exhibit } from '@/types';
import Card from '@/components/UI/Card';
import HeroDecorModel from '@/components/3D/HeroDecorModel';

const categories = ['Character', 'Architecture', 'Vehicle', 'Prop', 'Environment'];

export default function Home() {
  const { selectCategory } = useAppStore();
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);

  useEffect(() => {
    api.exhibits.list({ limit: '6' })
      .then((data) => setExhibits(data.exhibits))
      .catch(() => {});
  }, []);

  const featuredExhibits = exhibits.slice(0, 3);

  return (
    <div
      className="min-h-screen pt-15"
      style={{
        backgroundImage: "url('/home-backgrounds/4.gif')",
        backgroundRepeat: 'repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <section className="relative overflow-visible" style={{ minHeight: '99vh' }}>
        <div className="absolute inset-0 z-10 bg-black/20 pointer-events-none" />

        <div className="absolute inset-0 z-20 pointer-events-none">
          <Canvas
            camera={{ position: [0, 0, 8], fov: 45 }}
            gl={{ alpha: true, antialias: true }}
          >
            <ambientLight intensity={1.5} />
            <directionalLight position={[4, 5, 6]} intensity={2} />
            <pointLight position={[-3, 2, 3]} intensity={1.5} />
            <HeroDecorModel />
          </Canvas>
        </div>

        <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="pt-10 mb-40 flex flex-col items-center">
              <a
                href="https://www.glitter-graphics.com/myspace/text_generator.php"
                target="_blank"
                rel="noreferrer"
                className="flex items-center"
              >
                <img src="https://text.glitter-graphics.net/blush_noise/v.gif" alt="v" />
                <img src="https://text.glitter-graphics.net/blush_noise/i.gif" alt="i" />
                <img src="https://text.glitter-graphics.net/blush_noise/r.gif" alt="r" />
                <img src="https://text.glitter-graphics.net/blush_noise/t.gif" alt="t" />
                <img src="https://text.glitter-graphics.net/blush_noise/u.gif" alt="u" />
                <img src="https://text.glitter-graphics.net/blush_noise/a.gif" alt="a" />
                <img src="https://text.glitter-graphics.net/blush_noise/l.gif" alt="l" />
                <span className="inline-block w-5" />
                <img src="https://text.glitter-graphics.net/blush_noise/w.gif" alt="w" />
                <img src="https://text.glitter-graphics.net/blush_noise/o.gif" alt="o" />
                <img src="https://text.glitter-graphics.net/blush_noise/r.gif" alt="r" />
                <img src="https://text.glitter-graphics.net/blush_noise/d.gif" alt="d" />
              </a>

              <span className="mt-4 text-2xl sm:text-3xl font-bold text-white">
                3D虚拟世界
              </span>
            </h1>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/gallery" className="home-btn">
                <span>
                  浏览作品库
                  <span className="text-xs text-slate-500">/ Browse Gallery</span>
                </span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link to="/upload" className="home-btn">
                <span>
                  上传作品
                  <span className="text-xs text-slate-500">/ Upload Work</span>
                </span>
                <Upload className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="relative w-full py-4">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/dividers/48.gif')",
            backgroundRepeat: 'repeat-x',
            backgroundPosition: 'center',
            backgroundSize: '5% auto',
          }}
        />
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      </div>

      <section className="relative py-20">
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              精选作品
              <br />
              <span className="text-sm text-slate-400">Featured Works</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredExhibits.map((exhibit) => (
              <Card key={exhibit.id} exhibit={exhibit} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/gallery" className="home-btn">
              <span>
                查看更多作品
                <span className="text-xs text-slate-500">/ View More Works</span>
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <div className="relative w-full py-4">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/dividers/49.gif')",
            backgroundRepeat: 'repeat-x',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      </div>

      <section className="relative py-20">
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              作品分类
              <br />
              <span className="text-sm text-slate-400">Categories</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <Link
                key={category}
                to="/gallery"
                className="group p-6"
                onClick={() => selectCategory(category)}
              >
                <img
                  src={`/category-gifs/${index + 6}.gif`}
                  alt={category}
                  className="w-20 h-20 object-contain mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
                />
                <h3 className="text-white font-medium text-center group-hover:text-accent-400 transition-colors">
                  {category}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="relative w-full py-4">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/dividers/51.gif')",
            backgroundRepeat: 'repeat-x',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      </div>

      <footer className="relative py-12">
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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