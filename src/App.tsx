// App.tsx：负责决定用户访问哪个网址时显示哪个页�?
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';

import Header from '@/components/UI/Header';
import Home from '@/pages/Home';
import Gallery from '@/pages/Gallery';
import Viewer from '@/pages/Viewer';
import Upload from '@/pages/Upload';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Admin from '@/pages/Admin';


// ============================================================
// 页面分隔�?// 根据当前页面显示不同�?GIF
// ============================================================

function PageDivider() {
  const location = useLocation();

  let divider = null;

  if (location.pathname === '/'||'/gallery') {
    divider = '/dividers/21.gif';
  }
  if (!divider) {
    return null;
  }

  return (
    <div
      className="fixed top-[54px] left-0 right-0 z-[60] h-10 overflow-hidden pointer-events-none"
      style={{
        backgroundImage: `url(${divider})`,
        backgroundRepeat: 'repeat-x',
        backgroundSize: '300px auto',
        backgroundPosition: 'center',
      }}
    />
  );
}

// ============================================================
// App 主组�?// ============================================================

export default function App() {
  return (
    <AuthProvider>

      {/* 给整�?React 应用提供用户身份 / 登录状�?*/}

      <div className="min-h-screen bg-slate-900">

        {/* ----------------------------------------------------
            顶部导航�?            ---------------------------------------------------- */}

        <Header />


        {/* ----------------------------------------------------
            导航栏与页面之间的分隔线
            ---------------------------------------------------- */}

        <PageDivider />


        {/* ----------------------------------------------------
            页面路由
            ---------------------------------------------------- */}

        <Routes>

          {/* 首页 */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* 作品�?*/}
          <Route
            path="/gallery"
            element={<Gallery />}
          />

          {/* 3D 模型查看�?*/}
          <Route
            path="/viewer/:id"
            element={<Viewer />}
          />

          {/* 上传作品 */}
          <Route
            path="/upload"
            element={<Upload />}
          />

          {/* 登录 */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* 注册 */}
          <Route
            path="/register"
            element={<Register />}
          />

          {/* 管理员页�?*/}
          <Route
            path="/admin"
            element={<Admin />}
          />

        </Routes>

      </div>

    </AuthProvider>
  );
}
