import { useState, type FormEvent, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload as UploadIcon,
  Image,
  FileText,
  Check,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/api/client';
import UploadModelPreview from '@/components/3D/UploadModelPreview';

const baseUrl = import.meta.env.BASE_URL;

function PageContainer({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative z-10 mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </div>
  );
}

export default function Upload() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Character',
    tags: [] as string[],
    usage: [] as string[],
    modelFile: null as File | null,
    thumbnailFile: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categoryOpen, setCategoryOpen] = useState(false);

  const categories = [
    'Character',
    'Architecture',
    'Vehicle',
    'Prop',
    'Environment',
  ];

  const availableTags = [
    'Low Poly',
    'Sci-Fi',
    'Fantasy',
    'Cartoon',
    'Realistic',
    'Animated',
    'Game Ready',
  ];

  const usages = ['Game', 'Education', 'Exhibition', 'Design'];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = '请输入作品标题 / Please enter work title';
    }

    if (!formData.description.trim()) {
      newErrors.description =
        '请输入作品描述 / Please enter work description';
    }

    if (!formData.modelFile) {
      newErrors.modelFile =
        '请上传3D模型文件 / Please upload 3D model file';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const fd = new FormData();

      fd.append('title', formData.title);
      fd.append('description', formData.description);
      fd.append('category', formData.category);
      fd.append('tags', JSON.stringify(formData.tags));
      fd.append('usage', JSON.stringify(formData.usage));

      if (formData.modelFile) {
        fd.append('model', formData.modelFile);
      }

      if (formData.thumbnailFile) {
        fd.append('thumbnail', formData.thumbnailFile);
      }

      await api.exhibits.create(fd);

      setStep(3);
      setTimeout(() => navigate('/gallery'), 2000);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : '上传失败 / Upload failed',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen pt-[72px]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${baseUrl}backgrounds/1.jpg)`,
          backgroundRepeat: 'repeat',
          backgroundAttachment: 'fixed',
        }}
      />

      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {!user ? (
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="glass-card p-8 text-center max-w-md mx-4">
            <div className="flex items-center justify-center mx-auto mb-4">
              <img
                src={`${baseUrl}icons/26.gif`}
                alt=""
                className="w-12 h-12 object-contain"
              />
            </div>

            <h2 className="text-xl font-semibold text-white mb-2">
              需要登录 / Login Required
            </h2>

            <p className="text-slate-300 mb-6">
              请先登录账号后再上传作品 / Please login first to upload
            </p>

            <button
              onClick={() => navigate('/login')}
              className="glass-btn"
            >
              前往登录 / Go to Login
            </button>
          </div>
        </div>
      ) : (
        <PageContainer className="max-w-4xl py-12">
          <div className="flex items-center justify-center gap-4 mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center">
                  <img
                    src={
                      s === 1
                        ? `${baseUrl}upload-icons/45.gif`
                        : s === 2
                          ? `${baseUrl}upload-icons/46.gif`
                          : `${baseUrl}upload-icons/47.gif`
                    }
                    alt={`Step ${s}`}
                    className={`w-10 h-10 object-contain transition-all duration-300 ${
                      step === s
                        ? 'scale-110 drop-shadow-[0_0_10px_rgba(180,220,255,0.9)]'
                        : ''
                    }`}
                  />
                </div>

                {s < 3 && (
                  <div className="w-12 md:w-24 h-1 mx-2 rounded-full bg-[rgba(210,230,248,0.18)] backdrop-blur-sm border border-white/30 shadow-[inset_0_0_12px_rgba(255,255,255,0.08),0_0_12px_rgba(180,220,255,0.18)]" />
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 rounded-lg p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          {step === 1 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep(2);
              }}
              className="glass-card p-6 md:p-8"
            >
              <div className="mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  <span>基本信息</span>
                  <br />
                  <span className="text-xs text-slate-500">
                    Basic Info
                  </span>
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    作品标题 / Work Title *
                  </label>

                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        title: e.target.value,
                      });

                      const next = { ...errors };
                      delete next.title;
                      setErrors(next);
                    }}
                    className={`glass-input px-4 py-3 placeholder-slate-400 ${
                      errors.title ? 'border-red-500' : ''
                    }`}
                    placeholder="输入作品标题 / Enter work title"
                  />

                  {errors.title && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.title}
                    </p>
                  )}
                </div>

                <div className="relative z-30">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    分类 / Select Category *
                  </label>

                  <button
                    type="button"
                    onClick={() => setCategoryOpen(!categoryOpen)}
                    className="glass-input px-4 py-3 text-left flex items-center justify-between"
                  >
                    <span>{formData.category}</span>

                    <span
                      className={`transition-transform duration-300 ${
                        categoryOpen ? 'rotate-180' : ''
                      }`}
                    >
                      ▼
                    </span>
                  </button>

                  {categoryOpen && (
                    <div
                      className="absolute left-0 right-0 top-full mt-2 rounded-lg overflow-hidden z-50 border border-white/35"
                      style={{
                        background: `
                          radial-gradient(circle at 15% 20%, rgba(255,255,255,0.10) 0, transparent 8%),
                          radial-gradient(circle at 85% 25%, rgba(220,245,255,0.10) 0, transparent 8%),
                          radial-gradient(circle at 30% 80%, rgba(255,255,255,0.08) 0, transparent 7%),
                          rgba(180,220,245,0.22)
                        `,
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        boxShadow: `
                          inset 0 0 20px rgba(255,255,255,0.06),
                          0 0 18px rgba(180,220,255,0.15)
                        `,
                      }}
                    >
                      {categories.map((cat) => {
                        const selected = formData.category === cat;

                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                category: cat,
                              });
                              setCategoryOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left text-white transition-all duration-200 border-b border-white/10 last:border-b-0 ${
                              selected
                                ? 'bg-[rgba(60,140,220,0.45)] shadow-[inset_0_0_14px_rgba(180,220,255,0.25),0_0_12px_rgba(100,180,255,0.25)]'
                                : 'hover:bg-[rgba(210,230,248,0.22)] hover:shadow-[inset_0_0_12px_rgba(255,255,255,0.06)]'
                            }`}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    标签 / Tags
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => {
                      const selected = formData.tags.includes(tag);

                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              tags: selected
                                ? prev.tags.filter((item) => item !== tag)
                                : [...prev.tags, tag],
                            }));
                          }}
                          className={`glass-btn ${
                            selected ? 'is-active' : ''
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    用途 / Usage
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {usages.map((item) => {
                      const selected = formData.usage.includes(item);

                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              usage: selected
                                ? prev.usage.filter(
                                    (value) => value !== item,
                                  )
                                : [...prev.usage, item],
                            }));
                          }}
                          className={`glass-btn ${
                            selected ? 'is-active' : ''
                          }`}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    作品描述 / Work Description *
                  </label>

                  <textarea
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      });

                      const next = { ...errors };
                      delete next.description;
                      setErrors(next);
                    }}
                    rows={4}
                    className={`glass-input px-4 py-3 placeholder-slate-400 resize-none ${
                      errors.description ? 'border-red-500' : ''
                    }`}
                    placeholder="描述你的作品... / Describe your work..."
                  />

                  {errors.description && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="glass-btn mt-8 w-full py-3 text-white font-medium"
              >
                下一步 / Next
              </button>
            </form>
          )}

          {step === 2 && (
            <form
              onSubmit={handleSubmit}
              className="glass-card p-6 md:p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                上传文件 / Upload Files
              </h2>

              <div className="mb-8">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  3D预览 / 3D Preview
                </label>

                <div className="h-64 bg-slate-900 rounded-xl border border-dashed border-slate-600">
                  <UploadModelPreview modelFile={formData.modelFile} />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  3D模型文件 / 3D Model File *
                </label>

                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                    formData.modelFile
                      ? 'border-accent-500 bg-accent-500/10'
                      : errors.modelFile
                        ? 'border-red-500 bg-red-500/10'
                        : 'border-slate-600 hover:border-slate-500'
                  }`}
                  onClick={() =>
                    document.getElementById('model-upload')?.click()
                  }
                >
                  <input
                    id="model-upload"
                    type="file"
                    accept=".glb,.gltf,.obj,.fbx,.stl"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (file) {
                        setFormData({
                          ...formData,
                          modelFile: file,
                        });

                        const next = { ...errors };
                        delete next.modelFile;
                        setErrors(next);
                      }
                    }}
                  />

                  {formData.modelFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText className="w-8 h-8 text-accent-400" />

                      <span className="text-white">
                        {formData.modelFile.name}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();

                          setFormData({
                            ...formData,
                            modelFile: null,
                          });
                        }}
                        className="text-slate-400 hover:text-red-400"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <UploadIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />

                      <p className="text-slate-300 mb-1">
                        点击或拖拽上传3D模型文件
                      </p>

                      <p className="text-sm text-slate-500">
                        支持 .glb, .gltf, .obj, .fbx, .stl 格式 /
                        Supports .glb, .gltf, .obj, .fbx, .stl formats
                      </p>
                    </div>
                  )}
                </div>

                {errors.modelFile && (
                  <p className="text-red-400 text-sm mt-2">
                    {errors.modelFile}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  缩略图（可选）/ Thumbnail Image (Optional)
                </label>

                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                    formData.thumbnailFile
                      ? 'border-accent-500 bg-accent-500/10'
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                  onClick={() =>
                    document.getElementById('thumbnail-upload')?.click()
                  }
                >
                  <input
                    id="thumbnail-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (file) {
                        setFormData({
                          ...formData,
                          thumbnailFile: file,
                        });
                      }
                    }}
                  />

                  {formData.thumbnailFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <Image className="w-8 h-8 text-accent-400" />

                      <span className="text-white">
                        {formData.thumbnailFile.name}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();

                          setFormData({
                            ...formData,
                            thumbnailFile: null,
                          });
                        }}
                        className="text-slate-400 hover:text-red-400"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Image className="w-12 h-12 text-slate-400 mx-auto mb-3" />

                      <p className="text-slate-300 mb-1">
                        点击或拖拽上传缩略图
                      </p>

                      <p className="text-sm text-slate-500">
                        支持 JPG, PNG, GIF 格式 / Supports JPG, PNG, GIF formats
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="glass-btn flex-1 py-3 text-white font-medium"
                >
                  上一步 / Previous
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="glass-btn flex-1 py-3 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? '上传中... / Submitting...'
                    : '提交作品 / Submit Work'}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="glass-card p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-400" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">
                提交成功 / Submitted Successfully!
              </h2>

              <p className="text-slate-400">
                您的作品已提交审核，审核通过后将在作品库中展示 /
                Your work has been submitted for review and will be displayed
                in the gallery upon approval
              </p>
            </div>
          )}
        </PageContainer>
      )}
    </div>
  );
}