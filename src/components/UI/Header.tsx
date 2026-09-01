import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Upload, Home, Image, LogIn, LogOut, Shield } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();
  const { setSearchQuery } = useAppStore();
  const { user, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    navigate('/gallery');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center">
              <Image className="w-6 h-6 text-white" />
            </div>
            <Link to="/" className="text-xl font-bold text-gradient">
              3D展示系统 / 3D Showcase System
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
              <Home className="w-4 h-4" /><span>首页 / Home</span>
            </Link>
            <Link to="/gallery" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
              <Image className="w-4 h-4" /><span>作品库 / Gallery</span>
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索作品..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-accent-500 transition-colors"
              />
            </form>

            {user ? (
              <>
                <Link to="/upload" className="flex items-center gap-2 px-4 py-2 bg-gradient-accent rounded-lg text-white font-medium hover:opacity-90 transition-opacity">
                  <Upload className="w-4 h-4" /><span>上传作品 / Upload Work</span>
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors">
                    <Shield className="w-4 h-4" /><span>管理 / Admin</span>
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-accent flex items-center justify-center">
                    <span className="text-xs font-medium text-white">{user.username.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-sm text-slate-300">{user.username}</span>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium transition-colors">
                  <LogOut className="w-4 h-4" /><span>退出 / Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 bg-gradient-accent rounded-lg text-white font-medium hover:opacity-90 transition-opacity">
                <LogIn className="w-4 h-4" /><span>登录 / Login</span>
              </Link>
            )}
          </div>

          <button className="md:hidden p-2 text-slate-300 hover:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-700">
            <nav className="flex flex-col gap-2">
              <Link to="/" className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>首页 / Home</Link>
              <Link to="/gallery" className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>作品库 / Gallery</Link>
              {user ? (
                <>
                  <Link to="/upload" className="px-4 py-2 bg-gradient-accent rounded-lg text-white font-medium" onClick={() => setIsMenuOpen(false)}>上传作品 / Upload Work</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="px-4 py-2 bg-purple-600 rounded-lg text-white font-medium" onClick={() => setIsMenuOpen(false)}>管理后台 / Admin Panel</Link>
                  )}
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-left">退出登录 / Logout</button>
                </>
              ) : (
                <Link to="/login" className="px-4 py-2 bg-gradient-accent rounded-lg text-white font-medium" onClick={() => setIsMenuOpen(false)}>登录 / Login</Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}