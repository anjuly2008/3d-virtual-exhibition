import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Upload } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { useAppStore } from '@/store/appStore';
import { api } from '@/api/client';
import type { Exhibit } from '@/types';
import Card from '@/components/UI/Card';
import HeroDecorModel from '@/components/3D/HeroDecorModel';

const baseUrl = import.meta.env.BASE_URL;

const categories = [
  {
    name: 'Character',
    icon: `${baseUrl}category-gifs/6.gif`,
  },
  {
    name: 'Architecture',
    icon: `${baseUrl}category-gifs/7.gif`,
  },
  {
    name: 'Vehicle',
    icon: `${baseUrl}category-gifs/8.gif`,
  },
  {
    name: 'Prop',
    icon: `${baseUrl}category-gifs/9.gif`,
  },
  {
    name: 'Environment',
    icon: `${baseUrl}category-gifs/10.gif`,
  },
];

function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}

function Section({ children }: { children: ReactNode }) {
  return (
    <section className="relative z-10 py-20">
      {children}
    </section>
  );
}

function Divider({
  image,
  backgroundSize,
}: {
  image: string;
  backgroundSize?: string;
}) {
  return (
    <div className="relative z-10 w-full py-4">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('${image}')`,
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'center',
          ...(backgroundSize ? { backgroundSize } : {}),
        }}
      />
    </div>
  );
}

export default function Home() {
  const { selectCategory } = useAppStore();
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);

  useEffect(() => {
    api.exhibits
      .list({ limit: '6' })
      .then((data) => setExhibits(data.exhibits))
      .catch(() => {});
  }, []);

  const featuredExhibits = exhibits.slice(0, 3);

  return (
    <div className="relative min-h-screen pt-[72px]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${baseUrl}backgrounds/4.gif)`,
          backgroundRepeat: 'repeat',
          backgroundAttachment: 'fixed',
        }}
      />

      <div className="absolute inset-0 z-0 bg-black/20 pointer-events-none" />

      <section
        className="relative z-10 overflow-hidden"
        style={{ height: 'calc(100vh - 72px)' }}
      >
        <div className="absolute inset-0 z-20">
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

        <PageContainer>
          <div className="absolute inset-0 py-18 text-center">
            <h1 className="pt-10 mb-40 flex flex-col items-center">
              <a
                href="https://www.glitter-graphics.com/myspace/text_generator.php"
                target="_blank"
                rel="noreferrer"
                className="flex items-center"
              >
                <img
                  src="https://text.glitter-graphics.net/blush_noise/v.gif"
                  alt="v"
                />
                <img
                  src="https://text.glitter-graphics.net/blush_noise/i.gif"
                  alt="i"
                />
                <img
                  src="https://text.glitter-graphics.net/blush_noise/r.gif"
                  alt="r"
                />
                <img
                  src="https://text.glitter-graphics.net/blush_noise/t.gif"
                  alt="t"
                />
                <img
                  src="https://text.glitter-graphics.net/blush_noise/u.gif"
                  alt="u"
                />
                <img
                  src="https://text.glitter-graphics.net/blush_noise/a.gif"
                  alt="a"
                />
                <img
                  src="https://text.glitter-graphics.net/blush_noise/l.gif"
                  alt="l"
                />

                <span className="inline-block w-5" />

                <img
                  src="https://text.glitter-graphics.net/blush_noise/w.gif"
                  alt="w"
                />
                <img
                  src="https://text.glitter-graphics.net/blush_noise/o.gif"
                  alt="o"
                />
                <img
                  src="https://text.glitter-graphics.net/blush_noise/r.gif"
                  alt="r"
                />
                <img
                  src="https://text.glitter-graphics.net/blush_noise/d.gif"
                  alt="d"
                />
              </a>

              <span className="mt-4 text-2xl sm:text-3xl font-bold text-white">
                3D虚拟世界
              </span>
            </h1>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/gallery" className="glass-btn">
                <span>
                  浏览作品库
                  <span className="text-xs text-slate-500">
                    / Browse Gallery
                  </span>
                </span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link to="/upload" className="glass-btn">
                <span>
                  上传作品
                  <span className="text-xs text-slate-500">
                    / Upload Work
                  </span>
                </span>
                <Upload className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </PageContainer>
      </section>

      <Divider
        image={`${baseUrl}dividers/48.gif`}
        backgroundSize="5% auto"
      />

      <Section>
        <PageContainer>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              精选作品
              <br />
              <span className="text-sm text-slate-400">
                Featured Works
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredExhibits.map((exhibit) => (
              <Card key={exhibit.id} exhibit={exhibit} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/gallery" className="glass-btn">
              <span>
                查看更多作品
                <span className="text-xs text-slate-500">
                  / View More Works
                </span>
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </PageContainer>
      </Section>

      <Divider image={`${baseUrl}dividers/49.gif`} />

      <Section>
        <PageContainer>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              作品分类
              <br />
              <span className="text-sm text-slate-400">
                Categories
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                to="/gallery"
                className="group p-6"
                onClick={() => selectCategory(category.name)}
              >
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-20 h-20 object-contain mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
                />

                <h3 className="text-white font-medium text-center group-hover:text-accent-400 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </PageContainer>
      </Section>

      <Divider image={`${baseUrl}dividers/51.gif`} />

      <footer className="relative z-10 py-12">
        <PageContainer>
          <div className="text-center">
            <p className="text-slate-400">
              © 2024 3D展示系统 - 虚拟仿真作品展示平台
              <br />
              <span className="text-xs text-slate-500">
                © 2024 3D Exhibition System - Virtual Simulation Showcase
                Platform
              </span>
            </p>
          </div>
        </PageContainer>
      </footer>
    </div>
  );
}