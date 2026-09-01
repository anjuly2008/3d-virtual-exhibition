// React 真正启动的地方
// 把 React 应用挂载到 index.html 里面的 root 节点
// 并给整个应用提供一些全局能力

import { StrictMode } from 'react';
// React 自带组件
// 主要用于开发阶段帮助发现一些潜在问题

import { createRoot } from 'react-dom/client';
// 创建一个 React 根节点
// 从这里开始，这块区域交给 React 管理

import { BrowserRouter } from 'react-router-dom';
// 开启网页路由功能

import './index.css';
// 导入全局 CSS

// import 可以导入：
// 函数
// 组件
// CSS 等

import App from './App';
// 加载 App 组件
// App 就是你的整个 React 应用


createRoot(document.getElementById('root')!).render(
  // document.getElementById('root')
  // 找到 index.html 中 id="root" 的元素
  // ! 是 TypeScript 的非空断言
  // 意思是告诉 TypeScript：我确定这里能找到 root

  <StrictMode>
    {/* StrictMode：开发阶段帮助发现潜在问题 */}

    <BrowserRouter>
      {/* BrowserRouter：开启 React Router 路由功能 */}

      <App />
      {/* App 使用了 React Router，
          所以必须放在 BrowserRouter 里面 */}

    </BrowserRouter>
  </StrictMode>,
);