import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(username, email, password);
      navigate('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-[calc(100vh-80px)] relative flex items-center justify-center px-4"
      style={{
        backgroundImage: "url('/backgrounds/4.gif')",
        backgroundRepeat: 'repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="page-overlay" />

      <div className="relative z-10 w-full max-w-md pt-24 pb-12">
        <div className="glass-card rounded-2xl p-6 md:p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              注册账号
              <br />
              <span className="text-xs text-slate-200">
                Create New Account
              </span>
            </h2>
          </div>

          {error && (
            <div className="error-message mb-4 flex items-center gap-3">
              <img
                src="/icons/26.gif"
                alt=""
                className="w-10 h-10 object-contain flex-shrink-0"
              />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                用户名
                <br />
                <span className="text-xs text-slate-300">Username</span>
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="glass-input px-4 py-3 placeholder-white/50"
                placeholder="请输入用户名"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                邮箱
                <br />
                <span className="text-xs text-slate-300">Email</span>
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input px-4 py-3 placeholder-white/50"
                placeholder="请输入邮箱"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                密码
                <br />
                <span className="text-xs text-slate-300">Password</span>
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input px-4 py-3 placeholder-white/50"
                placeholder="至少6位密码"
                required
                minLength={6}
              />
            </div>

            <div className="relative">
              <img
                src="/register-icons/41.gif"
                alt=""
                className="absolute -top-6 -left-3 w-16 z-20 pointer-events-none"
              />

              <button
                type="submit"
                disabled={loading}
                className="glass-btn w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    注册中...
                    <br />
                    <span className="text-xs">Registering...</span>
                  </>
                ) : (
                  <>
                    注册
                    <br />
                    <span className="text-xs">Register</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/80">
              已有账号？
              <br />
              <span className="text-xs text-slate-300">
                Already have an account?
              </span>
              <br />

              <Link
                to="/login"
                className="inline-block mt-2 text-white hover:text-blue-100 font-medium transition-colors"
              >
                立即登录
                <br />
                <span className="text-xs text-slate-300">Go to Login</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}