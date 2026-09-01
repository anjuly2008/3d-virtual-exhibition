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
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">注册账号<br /><span className="text-xs text-slate-500">Create New Account</span></h2>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">用户名<br /><span className="text-xs text-slate-500">Username</span></label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-cyan-500 focus:outline-none"
              placeholder="请输入用户名"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">邮箱<br /><span className="text-xs text-slate-500">Email</span></label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-cyan-500 focus:outline-none"
              placeholder="请输入邮箱"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">密码<br /><span className="text-xs text-slate-500">Password</span></label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-cyan-500 focus:outline-none"
              placeholder="至少6位密码"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? <>注册中...<br /><span className="text-xs text-slate-500">Registering...</span></> : <>注册<br /><span className="text-xs text-slate-500">Register</span></>}
          </button>
        </form>

        <p className="text-slate-400 text-sm text-center mt-4">
          已有账号？<br /><span className="text-xs text-slate-500">Already have an account?</span>
          {' '}
          <Link to="/login" className="text-cyan-400 hover:underline">立即登录<br /><span className="text-xs text-slate-500">Go to Login</span></Link>
        </p>
      </div>
    </div>
  );
}