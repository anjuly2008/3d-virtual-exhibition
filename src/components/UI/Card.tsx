//显示一个作品卡片
//Gallery 有几个作品，就创建几个 Card
import { useState } from 'react';
//保存组件内部会变化的数据
import { Link } from 'react-router-dom';
//在 React 网站里进行页面跳转
import { Heart, Eye } from 'lucide-react';
import type { Exhibit } from '@/types';
//告诉 TypeScript：“一个作品应该长什么样。”
//告诉TSexhibit 应该是一个“作品对象” src\types\index.ts
import Card3DPreview from '@/components/3D/Card3DPreview';
//鼠标悬停时显示真实 .glb 的那个 3D 预览组件
//这就是 React 非常重要的 Props（组件传值）
interface CardProps {
  exhibit: Exhibit;
  onLike?: () => void;
}
//Card 可以接收一个“点击点赞时执行的函数”，但也可以不传
//Card 这个组件需要什么参数
export default function Card({ exhibit, onLike }: CardProps) {
  //解构赋值
  const [isHovered, setIsHovered] = useState(false);
  //当前鼠标有没有放在这张卡片上
  //Hook 必须写在 React 组件里面
  const thumbUrl = exhibit.thumbnail_url || 'https://picsum.photos/seed/' + exhibit.id + '/800/450';
{/*exhibit.thumbnail_url作品自己的缩略图地址，没有的话就用用默认图片*/}
  return (
    <div className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 card-hover"
    onMouseEnter={() => setIsHovered(true)}
    //当鼠标进入这个 Card 时
    onMouseLeave={() => setIsHovered(false)}>
      {/*一张作品卡片的大盒子*/}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={thumbUrl}
          alt={exhibit.title}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:opacity-0"/>{/*当鼠标悬停在整个 Card 上时，让图片透明*/}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent pointer-events-none" />

        
        <Card3DPreview modelUrl={exhibit.model_url}isHovered={isHovered}/>

        <div className="absolute top-3 right-3 flex gap-2 z-20">
          <button
            onClick={onLike}
            className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-red-500/80 transition-colors"
          >
            <Heart className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="absolute bottom-3 left-3 z-20">
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-accent-500/90 text-white">
            {exhibit.category}
          </span>
          {exhibit.status === 'pending' && (
            <span className="ml-2 px-3 py-1 text-xs font-medium rounded-full bg-yellow-500/90 text-white">
              <span>审核中</span><br /><span className="text-xs text-slate-500">Pending Review</span>
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-accent-400 transition-colors">
          {exhibit.title}
        </h3>
        <p className="text-sm text-slate-400 mb-3 line-clamp-2">
          {exhibit.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-accent flex items-center justify-center">
              <span className="text-xs font-medium text-white">
                {exhibit.creator_name?.charAt(0) || 'U'}
              </span>
            </div>
            <span className="text-sm text-slate-300">{exhibit.creator_name || '未知'}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {exhibit.likes}
            </span>
          </div>
        </div>

        <Link
          to={`/viewer/${exhibit.id}`}
          className="mt-4 flex items-center justify-center gap-2 w-full py-2 bg-gradient-accent rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
        >
          <Eye className="w-4 h-4" />
          <span><span>查看3D模型</span><br /><span className="text-xs text-slate-500">View 3D Model</span></span>
        </Link>
      </div>
    </div>
  );
}