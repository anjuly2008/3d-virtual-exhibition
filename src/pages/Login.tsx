import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen pt-16"
      style={{
        backgroundImage: "url('/backgrounds/4.gif')",
        backgroundRepeat: 'repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="page-overlay" />

      {user ? (
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="glass-card p-8 rounded-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <span className="text-2xl">👤</span>
            </div>

            <h2 className="text-xl font-semibold text-white mb-2">
              已登录
              <br />
              <span className="text-xs text-slate-300">Logged In</span>
            </h2>

            <p className="text-slate-200 mb-6">
              欢迎回来，{user.username}
              <br />
              <span className="text-xs text-slate-300">Welcome back, {user.username}</span>
            </p>

            <button onClick={() => navigate('/')} className="glass-btn">
              返回首页
              <br />
              <span className="text-xs">Back to Home</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="relative z-10 max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <div className="login-logo glass-card">
              <LogIn className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">
              欢迎回来
              <br />
              <span className="text-xs text-slate-200">Welcome Back</span>
            </h1>

            <p className="text-slate-100">
              请登录您的账号
              <br />
              <span className="text-xs text-slate-300">Login to your account</span>
            </p>
          </div>

          {error && (
            <div className="error-message mb-4 flex items-center gap-3">
              <img src="/icons/26.gif" alt="" className="w-10 h-10 object-contain flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 md:p-8 relative" style={{ overflow: 'visible' }}>
            <img
              src="/login-icons/40.gif"
              alt=""
              className="absolute z-50 pointer-events-none"
              style={{
                width: '160px',
                left: '-130px',
                top: '-120px',
              }}
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-white/90 mb-2">
                邮箱
                <br />
                <span className="text-xs text-slate-300">Email</span>
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70 z-10" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input pl-12 pr-4 placeholder-white/50"
                  placeholder="输入邮箱地址"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-white/90 mb-2">
                密码
                <br />
                <span className="text-xs text-slate-300">Password</span>
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70 z-10" />

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input pl-12 pr-14 placeholder-white/50"
                  placeholder="输入密码"
                  required
                />

                <button type="button" onClick={() => setShowPassword(!showPassword)} className="login-eye-btn">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="glass-btn w-full disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <>
                  登录中...
                  <br />
                  <span className="text-xs">Logging in...</span>
                </>
              ) : (
                <>
                  登录
                  <br />
                  <span className="text-xs">Login</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/80">
              还没有账号？
              <br />
              <span className="text-xs text-slate-300">Don't have an account?</span>
              <br />

              <Link to="/register" className="inline-block mt-2 text-white hover:text-blue-100 font-medium transition-colors">
                立即注册
                <br />
                <span className="text-xs text-slate-300">Register</span>
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}