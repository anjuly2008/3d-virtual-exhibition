import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, LogIn } from 'lucide-react';

import { useAppStore } from '@/store/appStore';
import { useAuth } from '@/context/AuthContext';


// ============================================================
// Header 顶部导航栏组件
// ============================================================

export default function Header() {

  // ----------------------------------------------------------
  // 1. 基础状态
  // ----------------------------------------------------------

  // 移动端菜单是否打开
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 搜索框当前输入的内容
  const [searchInput, setSearchInput] = useState('');

  // React Router 页面跳转
  const navigate = useNavigate();

  // Zustand：设置全局搜索关键词
  const { setSearchQuery } = useAppStore();

  // 当前登录用户 + 退出登录方法
  const { user, logout } = useAuth();


  // ----------------------------------------------------------
  // 2. Header 背景 GIF
  //    每次刷新页面随机选择一个
  // ----------------------------------------------------------

  const headerBackgrounds = [
    '/header-backgrounds/1.gif',
    '/header-backgrounds/2.gif',
    '/header-backgrounds/3.gif',
  ];

  const [headerBackground] = useState(() => {
    const randomIndex = Math.floor(
      Math.random() * headerBackgrounds.length
    );

    return headerBackgrounds[randomIndex];
  });


  // ----------------------------------------------------------
  // 3. Home 图标 GIF
  //    每次刷新随机选择 11~13.gif
  // ----------------------------------------------------------

  const homeIcons = [
    '/header-icons/11.gif',
    '/header-icons/12.gif',
    '/header-icons/13.gif',
  ];

  const [homeIcon] = useState(() => {
    const randomIndex = Math.floor(
      Math.random() * homeIcons.length
    );

    return homeIcons[randomIndex];
  });


  // ----------------------------------------------------------
  // 4. Gallery 图标 GIF
  //    每次刷新随机选择 14~16.gif
  // ----------------------------------------------------------

  const galleryIcons = [
    '/header-icons/14.gif',
    '/header-icons/15.gif',
    '/header-icons/16.gif',
  ];

  const [galleryIcon] = useState(() => {
    const randomIndex = Math.floor(
      Math.random() * galleryIcons.length
    );

    return galleryIcons[randomIndex];
  });


  // ----------------------------------------------------------
  // 5. 搜索功能
  // ----------------------------------------------------------

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // 保存搜索关键词
    setSearchQuery(searchInput);

    // 跳转到作品库
    navigate('/gallery');
  };


  // ----------------------------------------------------------
  // 6. 退出登录
  // ----------------------------------------------------------

  const handleLogout = () => {
    logout();

    // 退出后返回首页
    navigate('/');
  };


  // ==========================================================
  // 7. 页面结构
  // ==========================================================

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50
                 bg-slate-950/50 backdrop-blur-md
                 border-b border-slate-700 overflow-hidden"
      style={{
        // 随机显示一个 Header 星空 GIF
        backgroundImage: `url(${headerBackground})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '50px auto',
      }}
    >

      {/* ======================================================
          8. Header 内容主体
          ====================================================== */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ----------------------------------------------------
            8.1 顶部导航主行
            ---------------------------------------------------- */}

        <div className="flex items-center justify-between min-h-12 py-3">


          {/* ==================================================
              9. 左侧：Logo + 系统名称
              ================================================== */}

          <div className="flex items-center gap-3">

            {/* Logo GIF */}
            <div className="w-10 h-10 flex items-center justify-center">
              <img
                src="/header-icons/5.gif"
                alt="3D Showcase System"
                className="w-10 h-10 object-contain"
              />
            </div>

            {/* 系统名称 */}
            <Link
              to="/"
              className="text-xl font-bold text-gradient"
            >
              3D Showcase System
            </Link>

          </div>


          {/* ==================================================
              10. 中间：Home + Gallery
              仅桌面端显示
              ================================================== */}

          <nav className="hidden md:flex items-center gap-8">

            {/* ---------------- Home ---------------- */}

            <Link
              to="/"
              className="group flex items-center gap-2
                         text-slate-300 hover:text-white
                         transition-colors"
            >
              <img
                src={homeIcon}
                alt="Home"
                className="w-6 h-6 object-contain
                           transition-all duration-300
                           group-hover:scale-110
                           group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
              />

              <span className="group-hover:text-accent-400 transition-colors">
                Home
              </span>
            </Link>


            {/* ---------------- Gallery ---------------- */}

            <Link
              to="/gallery"
              className="group flex items-center gap-2
                         text-slate-300 hover:text-white
                         transition-colors"
            >
              <img
                src={galleryIcon}
                alt="Gallery"
                className="w-6 h-6 object-contain
                           transition-all duration-300
                           group-hover:scale-110
                           group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
              />

              <span className="group-hover:text-accent-400 transition-colors">
                Gallery
              </span>
            </Link>

          </nav>


          {/* ==================================================
              11. 右侧：搜索 + 用户区域
              仅桌面端显示
              ================================================== */}

          <div className="hidden md:flex items-center gap-2">

            {/* ------------------------------------------------
                11.1 搜索框
                ------------------------------------------------ */}

            <form
              onSubmit={handleSearch}
              className="relative"
            >
              <Search
                className="absolute left-3 top-1/2
                           -translate-y-1/2
                           w-4 h-4 text-slate-400"
              />

              <input
                type="text"
                placeholder="搜索作品..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-64 pl-10 pr-4 py-2
                           bg-slate-800
                           border border-slate-600
                           rounded-lg
                           text-sm text-white
                           placeholder-slate-400
                           focus:outline-none
                           focus:border-accent-500
                           transition-colors"
              />
            </form>


            {/* ------------------------------------------------
                11.2 用户已登录
                ------------------------------------------------ */}

            {user ? (
              <>

                {/* ============================================
                    Upload Work
                    ============================================ */}

                <Link
                  to="/upload"
                  className="group flex items-center gap-2
                             px-2 py-2
                             text-slate-300 hover:text-white
                             transition-colors"
                >
                  <img
                    src="/header-icons/17.gif"
                    alt="Upload Work"
                    className="w-6 h-6 object-contain
                               transition-all duration-300
                               group-hover:scale-110
                               group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
                  />

                  <span
                    className="group-hover:text-accent-400
                               transition-colors
                               whitespace-nowrap"
                  >
                    Upload Work
                  </span>
                </Link>


                {/* ============================================
                    Admin 管理后台入口

                    注意：
                    只有 role === 'admin' 时才显示
                    ============================================ */}

                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="group flex items-center gap-2
                               px-2 py-2
                               text-slate-300 hover:text-white
                               transition-colors"
                  >
                    <img
                      src="/header-icons/18.gif"
                      alt="Admin"
                      className="w-6 h-6 object-contain
                                 transition-all duration-300
                                 group-hover:scale-110
                                 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
                    />

                    <span
                      className="group-hover:text-accent-400
                                 transition-colors
                                 whitespace-nowrap"
                    >
                      Admin
                    </span>
                  </Link>
                )}


                {/* ============================================
                    用户头像 + 用户名
                    ============================================ */}

                <div className="flex items-center gap-2">

                  {/* 当前头像
                      暂时使用用户名首字母 */}

                  <div
                    className="w-8 h-8 rounded-full
                               bg-gradient-accent
                               flex items-center justify-center"
                  >
                    <span className="text-xs font-medium text-white">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* 用户名 */}
                  <span className="text-sm text-slate-300">
                    {user.username}
                  </span>

                </div>


                {/* ============================================
                    Logout
                    ============================================ */}

                <button
                  onClick={handleLogout}
                  className="group flex items-center gap-2
                             px-2 py-2
                             text-slate-300 hover:text-white
                             transition-colors"
                >
                  <img
                    src="/header-icons/20.gif"
                    alt="Logout"
                    className="w-6 h-6 object-contain
                               transition-all duration-300
                               group-hover:scale-110
                               group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
                  />

                  <span
                    className="group-hover:text-accent-400
                               transition-colors
                               whitespace-nowrap"
                  >
                    Logout
                  </span>
                </button>

              </>

            ) : (

              /* ------------------------------------------------
                 11.3 用户未登录
                 ------------------------------------------------ */

              <Link
                to="/login"
                className="flex items-center gap-2
                           px-4 py-2
                           bg-gradient-accent
                           rounded-lg
                           text-white
                           font-medium
                           hover:opacity-90
                           transition-opacity"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>

            )}

          </div>


          {/* ==================================================
              12. 移动端菜单按钮
              ================================================== */}

          <button
            className="md:hidden p-2
                       text-slate-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

        </div>


        {/* ======================================================
            13. 移动端展开菜单
            ====================================================== */}

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-700">

            <nav className="flex flex-col gap-2">

              {/* ---------------- Home ---------------- */}

              <Link
                to="/"
                className="px-4 py-2
                           text-slate-300
                           hover:text-white
                           hover:bg-slate-800
                           rounded-lg
                           transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>


              {/* ---------------- Gallery ---------------- */}

              <Link
                to="/gallery"
                className="px-4 py-2
                           text-slate-300
                           hover:text-white
                           hover:bg-slate-800
                           rounded-lg
                           transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                作品库 / Gallery
              </Link>


              {/* ---------------- 登录状态 ---------------- */}

              {user ? (
                <>

                  {/* Upload Work */}

                  <Link
                    to="/upload"
                    className="px-4 py-2
                               bg-gradient-accent
                               rounded-lg
                               text-white
                               font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Upload Work
                  </Link>


                  {/* Admin Panel */}

                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="px-4 py-2
                                 bg-purple-600
                                 rounded-lg
                                 text-white
                                 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}


                  {/* Logout */}

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="group flex items-center gap-2
                               px-4 py-2
                               text-slate-300 hover:text-white
                               transition-colors
                               text-left"
                  >
                    <img
                      src="/header-icons/20.gif"
                      alt="Logout"
                      className="w-6 h-6 object-contain
                                 transition-all duration-300
                                 group-hover:scale-110
                                 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
                    />

                    <span className="group-hover:text-accent-400 transition-colors">
                      Logout
                    </span>
                  </button>

                </>

              ) : (

                /* ---------------- 未登录 ---------------- */

                <Link
                  to="/login"
                  className="px-4 py-2
                             bg-gradient-accent
                             rounded-lg
                             text-white
                             font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>

              )}

            </nav>

          </div>
        )}

      </div>

    </header>
  );
}