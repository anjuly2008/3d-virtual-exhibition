// App.tsx：负责决定用户访问哪个网址时显示哪个页面

import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';

import Header from '@/components/UI/Header';
import Home from '@/pages/Home';
import Gallery from '@/pages/Gallery';
import Viewer from '@/pages/Viewer';
import Upload from '@/pages/Upload';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Admin from '@/pages/Admin';

export default function App() {
  return (
    <AuthProvider>
      {/* 给整个 React 应用提供用户身份/登录状态 */}

      <div className="min-h-screen bg-slate-900">
        {/* 整个页面至少占满屏幕高度，背景为深灰蓝 */}

        <Header />
        {/* 顶部导航栏 */}

        <Routes>
          {/* React Router：开始定义网页路径 */}

          <Route path="/" element={<Home />} />
          {/* 访问 / 时显示 Home */}

          <Route path="/gallery" element={<Gallery />} />
          {/* 访问 /gallery 时显示 Gallery */}

          <Route path="/viewer/:id" element={<Viewer />} />
          {/* :id 是动态路由参数 */}

          <Route path="/upload" element={<Upload />} />
          {/* 上传页面 */}

          <Route path="/login" element={<Login />} />
          {/* 登录页面 */}

          <Route path="/register" element={<Register />} />
          {/* 注册页面 */}

          <Route path="/admin" element={<Admin />} />
          {/* 管理员页面 */}
        </Routes>
      </div>
    </AuthProvider>
  );
}