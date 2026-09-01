import { useState } from 'react';
// React 自带的 Hook，用来保存组件内部的数据

import { Link, useNavigate } from 'react-router-dom';
// useNavigate：React Router 提供的函数，用代码控制页面跳转
// Link：React Router 提供的组件，用来实现页面跳转

import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
// 从 lucide-react 图标库中导入图标

import { useAuth } from '@/context/AuthContext';
// 导入我们自己项目里的 useAuth，用来获取用户登录状态和登录函数


export default function Login() {
  // 定义 Login React 组件

  const navigate = useNavigate();
  // 创建一个跳转工具，可以通过 navigate('/路径') 跳转页面

  const { user, login } = useAuth();
  // 从 AuthContext 中获取：
  // user：当前登录用户
  // login：登录函数


  const [showPassword, setShowPassword] = useState(false);
  // 控制密码显示或隐藏
  // false：隐藏密码
  // true：显示密码

  const [email, setEmail] = useState('');
  // 保存用户输入的邮箱

  const [password, setPassword] = useState('');
  // 保存用户输入的密码

  const [error, setError] = useState('');
  // 保存错误信息

  const [loading, setLoading] = useState(false);
  // 控制是否正在登录
  // false：没有登录请求
  // true：正在登录


  const handleSubmit = async (e: React.FormEvent) => {
    // 定义 handleSubmit 函数
    // e 是事件对象
    // React.FormEvent 是 React 的表单事件类型

    e.preventDefault();
    // 阻止浏览器默认的表单提交行为，避免页面刷新

    setError('');
    // 清除之前的错误信息

    setLoading(true);
    // 设置为正在登录

    try {
      await login(email, password);
      // login() 来自 AuthContext.tsx
      // AuthContext 中的 login() 会继续调用 api.auth.login()
      // 最终通过 fetch() 请求后端

      navigate('/');
      // 登录成功后跳转到首页
    } catch (err: unknown) {
      // 如果登录过程中发生错误，就会进入这里

      setError(
        err instanceof Error ? err.message : '登录失败'
      );
      // 如果 err 是 Error 对象，就显示它的 message
      // 否则显示“登录失败”
    } finally {
      setLoading(false);
      // 不管登录成功还是失败，最后都结束 loading 状态
    }
  };


  if (user) {
    // 如果 user 存在，说明用户已经登录

    return (
      <div className="min-h-screen pt-16 bg-slate-900 flex items-center justify-center">
        {/* 最小高度 = 整个屏幕高度
            bg-slate-900 = 深灰色背景
            flex = 开启 Flex 布局
            items-center = 垂直居中
            justify-center = 水平居中 */}

        <div className="text-center p-8">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">👤</span>
          </div>

          {/* div 是 HTML 中的容器标签，可以理解成一个“盒子”
              这里用来划分页面区域 */}

          <h2 className="text-xl font-semibold text-white mb-2">
            已登录
            <br />
            <span className="text-xs text-slate-500">
              Logged In
            </span>
          </h2>

          <p className="text-slate-400 mb-6">
            欢迎回来，{user.username}
            <br />
            <span className="text-xs text-slate-500">
              Welcome back, {user.username}
            </span>
          </p>

          {/* {user.username}：
              JSX 中的 {} 可以写 JavaScript
              这里表示把 user.username 的值显示出来 */}

          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-accent rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
          >
            {/* 点击这个按钮时：
                onClick 被触发
                ↓
                执行 () => navigate('/')
                ↓
                跳转到 '/' 首页 */}

            返回首页
            <br />

            <span className="text-xs text-slate-500">
              Back to Home
            </span>

            {/* br = 换行
                span = 包裹一小段内容，可以单独设置样式 */}
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen pt-16 bg-slate-900">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-accent flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">
            欢迎回来
            <br />
            <span className="text-xs text-slate-500">
              Welcome Back
            </span>
          </h1>

          <p className="text-slate-400">
            请登录您的账号
            <br />
            <span className="text-xs text-slate-500">
              Login to your account
            </span>
          </p>
        </div>


        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        {/* 如果 error 有内容，就显示错误框
            如果 error 是空字符串，就不显示
            这里利用了 && 的条件渲染写法 */}


        <form
          onSubmit={handleSubmit}
          className="bg-slate-800/50 rounded-2xl p-6 md:p-8"
        >
          {/* form 是 HTML 中的表单标签，用来收集用户输入
              当用户提交表单时，会执行 handleSubmit */}

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              邮箱
              <br />
              <span className="text-xs text-slate-500">
                Email
              </span>
            </label>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-accent-500 transition-colors border border-transparent"
                placeholder="输入邮箱地址"
                required
              />

              {/* onChange：
                  当输入框内容发生变化时执行

                  e：
                  React 自动传入的事件对象

                  e.target：
                  触发事件的 input 元素

                  e.target.value：
                  当前输入框里的文字

                  setEmail(e.target.value)：
                  把输入框里的文字保存到 email 状态 */}
            </div>
          </div>


          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              密码
              <br />
              <span className="text-xs text-slate-500">
                Password
              </span>
            </label>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-accent-500 transition-colors border border-transparent"
                placeholder="输入密码"
                required
              />

              {/* type={showPassword ? 'text' : 'password'}
                  如果 showPassword 为 true：
                    type = text，密码显示

                  如果 showPassword 为 false：
                    type = password，密码隐藏 */}

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {/* type="button"：
                    这是普通按钮，不提交 form

                    为什么？
                    因为这个按钮只负责切换密码显示/隐藏 */}

                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}

                {/* 三元表达式：

                    条件 ? A : B

                    如果 showPassword = true
                    → 显示 EyeOff

                    如果 showPassword = false
                    → 显示 Eye */}
              </button>
            </div>
          </div>


          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-accent rounded-lg text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? (
              <>
                登录中...
                <br />
                <span className="text-xs text-slate-500">
                  Logging in...
                </span>
              </>
            ) : (
              <>
                登录
                <br />
                <span className="text-xs text-slate-500">
                  Login
                </span>
              </>
            )}

            {/* type="submit"：
                HTML 自带功能
                点击后会提交当前 form

                form 上有：
                onSubmit={handleSubmit}

                所以：
                点击按钮
                ↓
                提交 form
                ↓
                触发 handleSubmit()

                disabled={loading}：
                当 loading = true 时，按钮被禁用
                防止登录过程中重复点击 */}

          </button>
        </form>


        <div className="mt-6 text-center">
          <p className="text-slate-400">
            还没有账号？
            <br />

            <span className="text-xs text-slate-500">
              Don't have an account?
            </span>

            {' '}

            <Link
              to="/register"
              className="ml-2 text-accent-400 hover:text-accent-300 font-medium transition-colors"
            >
              立即注册
              <br />

              <span className="text-xs text-slate-500">
                Register
              </span>

              {/* Link：
                  React Router 提供的页面跳转组件

                  to="/register"：
                  点击后跳转到 /register */}

            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}