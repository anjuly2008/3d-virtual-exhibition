import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye } from 'lucide-react';
import type { Exhibit } from '@/types';
import { api } from '@/api/client';
import Card3DPreview from '@/components/3D/Card3DPreview';

interface CardProps {
  exhibit: Exhibit;
}

export default function Card({ exhibit }: CardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(exhibit.likes);

  const thumbUrl = exhibit.thumbnail_url || `https://picsum.photos/seed/${exhibit.id}/800/450`;

  useEffect(() => {
    api.exhibits
      .getLike(String(exhibit.id))
      .then((data) => {
        setLiked(data.liked);
        setLikeCount(data.likes);
      })
      .catch(() => {});
  }, [exhibit.id]);

  const handleLike = async () => {
    try {
      const data = await api.exhibits.like(String(exhibit.id));

      setLiked(data.liked);
      setLikeCount(data.likes);
    } catch {}
  };

  return (
    <div
      className="glass-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={thumbUrl}
          alt={exhibit.title}
          className="w-full h-full object-cover transition-all duration-500 card-thumbnail"
        />

        <Card3DPreview modelUrl={exhibit.model_url} isHovered={isHovered} />

        <div className="absolute top-3 right-3 flex gap-2 z-20">
          <button onClick={handleLike} className="glass-icon-btn">
            <Heart
              className={`w-4 h-4 transition-all ${
                liked ? 'text-red-500 fill-red-500' : 'text-white'
              }`}
            />
          </button>
        </div>

        <div className="absolute bottom-3 left-3 z-20">
          <span className="glass-badge">{exhibit.category}</span>

          {exhibit.status === 'pending' && (
            <span className="glass-badge is-pending">
              <span>审核中</span>
              <br />
              <span className="text-xs text-slate-500">Pending Review</span>
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 transition-colors duration-300 card-title">
          {exhibit.title}
        </h3>

        <p className="text-sm text-slate-300 mb-3 line-clamp-2">{exhibit.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="glass-avatar">
              <span className="text-xs font-medium text-white">
                {exhibit.creator_name?.charAt(0) || 'U'}
              </span>
            </div>

            <span className="text-sm text-slate-200">{exhibit.creator_name || '未知'}</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-300">
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {likeCount}
            </span>
          </div>
        </div>

        <Link to={`/viewer/${exhibit.id}`} className="glass-btn w-full mt-4">
          <Eye className="w-4 h-4" />

          <span>
            <span>查看3D模型</span>
            <br />
            <span className="text-xs text-slate-500">View 3D Model</span>
          </span>
        </Link>
      </div>
    </div>
  );
}