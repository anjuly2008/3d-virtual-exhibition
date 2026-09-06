// React 真正启动的地�?// �?React 应用挂载�?index.html 里面�?root 节点
// 并给整个应用提供一些全局能力

import { StrictMode } from 'react';
// React 自带组件
// 主要用于开发阶段帮助发现一些潜在问�?
import { createRoot } from 'react-dom/client';
// 创建一�?React 根节�?// 从这里开始，这块区域交给 React 管理

import { BrowserRouter } from 'react-router-dom';
// 开启网页路由功�?
import './index.css';
// 导入全局 CSS

// import 可以导入�?// 函数
// 组件
// CSS �?
import App from './App';
// 加载 App 组件
// App 就是你的整个 React 应用


createRoot(document.getElementById('root')!).render(
  // document.getElementById('root')
  // 找到 index.html �?id="root" 的元�?  // ! �?TypeScript 的非空断言
  // 意思是告诉 TypeScript：我确定这里能找�?root

  <StrictMode>
    {/* StrictMode：开发阶段帮助发现潜在问�?*/}

    <BrowserRouter>
      {/* BrowserRouter：开�?React Router 路由功能 */}

      <App />
      {/* App 使用�?React Router�?          所以必须放�?BrowserRouter 里面 */}

    </BrowserRouter>
  </StrictMode>,
);
