import { useState, type ReactNode, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useAuth } from '@/context/AuthContext';

function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();
  const { setSearchQuery } = useAppStore();
  const { user, logout } = useAuth();

  const baseUrl = import.meta.env.BASE_URL;

  const headerBackgrounds = [
    `${baseUrl}header-backgrounds/1.gif`,
    `${baseUrl}header-backgrounds/2.gif`,
    `${baseUrl}header-backgrounds/3.gif`,
  ];

  const [headerBackground] = useState(
    () =>
      headerBackgrounds[
        Math.floor(Math.random() * headerBackgrounds.length)
      ],
  );

  const homeIcons = [
    `${baseUrl}header-icons/11.gif`,
    `${baseUrl}header-icons/12.gif`,
    `${baseUrl}header-icons/13.gif`,
  ];

  const [homeIcon] = useState(
    () => homeIcons[Math.floor(Math.random() * homeIcons.length)],
  );

  const galleryIcons = [
    `${baseUrl}header-icons/14.gif`,
    `${baseUrl}header-icons/15.gif`,
    `${baseUrl}header-icons/16.gif`,
  ];

  const [galleryIcon] = useState(
    () => galleryIcons[Math.floor(Math.random() * galleryIcons.length)],
  );

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    navigate('/gallery');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 bg-blue-500/25 overflow-hidden bg-[rgba(180,220,255,0.18)] backdrop-blur-md"
      style={{
        backgroundImage: `url(${headerBackground})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '50px auto',
      }}
    >
      <PageContainer>
        <div className="flex items-center justify-between min-h-12 py-3">

          {/* Logo */}
          <Link
            to="/"
            className="group flex items-center gap-3 text-xl font-bold text-[rgba(210,230,248,0.95)] transition-all duration-300"
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <img
                src={`${baseUrl}header-icons/5.gif`}
                alt="3D Showcase System"
                className="w-10 h-10 object-contain transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(180,220,255,0.6)]"
              />
            </div>

            <span className="group-hover:text-white group-hover:drop-shadow-[0_0_12px_rgba(180,220,255,0.9)] transition-all duration-300">
              3D Showcase System
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-8">

            {/* Home */}
            <Link
              to="/"
              className="group flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              <img
                src={homeIcon}
                alt="Home"
                className="w-6 h-6 object-contain transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
              />

              <span className="group-hover:text-accent-400 transition-colors">
                Home
              </span>
            </Link>

            {/* Gallery */}
            <Link
              to="/gallery"
              className="group flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              <img
                src={galleryIcon}
                alt="Gallery"
                className="w-6 h-6 object-contain transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
              />

              <span className="group-hover:text-accent-400 transition-colors">
                Gallery
              </span>
            </Link>
          </nav>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-2">

            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />

              <input
                type="text"
                placeholder="搜索作品..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="glass-input w-64 pl-10 pr-4 py-2 text-sm placeholder-white/50"
              />
            </form>

            {user ? (
              <>
                {/* Upload */}
                <Link
                  to="/upload"
                  className="group flex items-center gap-2 px-2 py-2 text-slate-300 hover:text-white transition-colors"
                >
                  <img
                    src={`${baseUrl}header-icons/17.gif`}
                    alt="Upload Work"
                    className="w-6 h-6 object-contain transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
                  />

                  <span className="group-hover:text-accent-400 transition-colors whitespace-nowrap">
                    Upload Work
                  </span>
                </Link>

                {/* Admin */}
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="group flex items-center gap-2 px-2 py-2 text-slate-300 hover:text-white transition-colors"
                  >
                    <img
                      src={`${baseUrl}header-icons/18.gif`}
                      alt="Admin"
                      className="w-6 h-6 object-contain transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
                    />

                    <span className="group-hover:text-accent-400 transition-colors whitespace-nowrap">
                      Admin
                    </span>
                  </Link>
                )}

                {/* User */}
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="group flex items-center gap-2"
                >
                  <div className="glass-avatar overflow-hidden">
                    <img
                      src={user.avatar_url || `${baseUrl}icons/26.gif`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                    {user.username}
                  </span>
                </button>

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="group flex items-center gap-2 px-2 py-2 text-slate-300 hover:text-white transition-colors"
                >
                  <img
                    src={`${baseUrl}header-icons/20.gif`}
                    alt="Logout"
                    className="w-6 h-6 object-contain transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
                  />

                  <span className="group-hover:text-accent-400 transition-colors whitespace-nowrap">
                    Logout
                  </span>
                </button>
              </>
            ) : (
              /* Not logged in */
              <Link
                to="/login"
                className="group flex items-center gap-2 px-2 py-2"
              >
                <div className="glass-avatar" />

                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                  未登录
                </span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 text-slate-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-700">
            <nav className="flex flex-col gap-2">

              <Link
                to="/"
                className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>

              <Link
                to="/gallery"
                className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                作品库 / Gallery
              </Link>

              {user ? (
                <>
                  <Link
                    to="/upload"
                    className="glass-btn w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Upload Work
                  </Link>

                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="glass-btn w-full"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      navigate('/profile');
                      setIsMenuOpen(false);
                    }}
                    className="group flex items-center gap-2 px-4 py-2 text-left text-slate-300 hover:text-white transition-colors"
                  >
                    <div className="glass-avatar overflow-hidden">
                      <img
                        src={user.avatar_url || `${baseUrl}icons/26.gif`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <span className="group-hover:text-accent-400 transition-colors">
                      {user.username}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="group flex items-center gap-2 px-4 py-2 text-left text-slate-300 hover:text-white transition-colors"
                  >
                    <img
                      src={`${baseUrl}header-icons/20.gif`}
                      alt="Logout"
                      className="w-6 h-6 object-contain transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
                    />

                    <span className="group-hover:text-accent-400 transition-colors">
                      Logout
                    </span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="group flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="glass-avatar" />

                  <span className="group-hover:text-accent-400 transition-colors">
                    未登录
                  </span>
                </Link>
              )}
            </nav>
          </div>
        )}
      </PageContainer>
    </header>
  );
}