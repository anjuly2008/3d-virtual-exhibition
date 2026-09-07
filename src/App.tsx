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
import Profile from '@/pages/Profile';

function PageDivider() {
  const divider = '/dividers/21.gif';

  return (
    <div
      className="fixed top-[56px] left-0 right-0 z-40 h-10 overflow-hidden pointer-events-none"
      style={{
        backgroundImage: `url(${divider})`,
        backgroundRepeat: 'repeat-x',
        backgroundSize: '300px auto',
        backgroundPosition: 'center',
      }}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-900">
        <Header />
        <PageDivider />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/viewer/:id" element={<Viewer />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}