import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, Image, FileText, Check, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/api/client';
import UploadModelPreview from '@/components/3D/UploadModelPreview';

export default function Upload() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Architecture',
    modelFile: null as File | null,
    thumbnailFile: null as File | null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = ['Architecture', 'Product Design', 'Game Assets', 'Art', 'Education'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = '请输入作品标题 / Please enter work title';
    if (!formData.description.trim()) newErrors.description = '请输入作品描述';
    if (!formData.modelFile) newErrors.modelFile = '请上传3D模型文件 / Please upload 3D model file';
    
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
      if (formData.modelFile) fd.append('model', formData.modelFile);
      if (formData.thumbnailFile) fd.append('thumbnail', formData.thumbnailFile);

      await api.exhibits.create(fd);
      setStep(3);
      setTimeout(() => navigate('/gallery'), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '上传失败 / Upload failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-16 bg-slate-900 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <UploadIcon className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">需要登录 / Login Required</h2>
          <p className="text-slate-400 mb-6">请先登录账号后再上传作品 / Please login first to upload</p>
          <button onClick={() => navigate('/login')} className="px-6 py-3 bg-gradient-accent rounded-lg text-white font-medium hover:opacity-90 transition-opacity">
            前往登录 / Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${step >= s ? 'bg-gradient-accent text-white' : 'bg-slate-800 text-slate-500'}`}>
                {step > s ? <Check className="w-5 h-5" /> : s}
              </div>
              {s < 3 && <div className={`w-12 md:w-24 h-1 mx-2 rounded-full ${step > s ? 'bg-gradient-accent' : 'bg-slate-700'}`} />}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 rounded-lg p-3 mb-4 text-sm">{error}</div>
        )}

        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="bg-slate-800/50 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">基本信息 / Basic Info</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">作品标题 / Work Title *</label>
                <input type="text" value={formData.title} onChange={(e) => { setFormData({ ...formData, title: e.target.value }); const next = { ...errors }; delete next.title; setErrors(next); }}
                  className={`w-full px-4 py-3 bg-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-accent-500 border ${errors.title ? 'border-red-500' : 'border-transparent'}`}
                  placeholder="输入作品标题 / Enter work title" />
                {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">分类 / Select Category *</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700 rounded-lg text-white focus:outline-none focus:border-accent-500 border border-transparent">
                  {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">作品描述 / Work Description *</label>
                <textarea value={formData.description} onChange={(e) => { setFormData({ ...formData, description: e.target.value }); const next = { ...errors }; delete next.description; setErrors(next); }}
                  rows={4}
                  className={`w-full px-4 py-3 bg-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-accent-500 border resize-none ${errors.description ? 'border-red-500' : 'border-transparent'}`}
                  placeholder="描述你的作品... / Describe your work..." />
                {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
              </div>
            </div>
            <button type="submit" className="mt-8 w-full py-3 bg-gradient-accent rounded-lg text-white font-medium hover:opacity-90 transition-opacity">下一步 / Next</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="bg-slate-800/50 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">上传文件 / Upload Files</h2>
            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-300 mb-2">3D预览 / 3D Preview</label>
              <div className="h-64 bg-slate-900 rounded-xl border border-dashed border-slate-600">
              <UploadModelPreview modelFile={formData.modelFile} />
              {/*<UploadModelPreview />*/}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">3D模型文件 / 3D Model File *</label>
              <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${formData.modelFile ? 'border-accent-500 bg-accent-500/10' : errors.modelFile ? 'border-red-500 bg-red-500/10' : 'border-slate-600 hover:border-slate-500'}`}
                onClick={() => document.getElementById('model-upload')?.click()}>
                <input id="model-upload" type="file" accept=".glb,.gltf,.obj,.fbx,.stl" className="hidden"
                  onChange={(e) => { const file = e.target.files?.[0]; if (file) { setFormData({ ...formData, modelFile: file }); const next = { ...errors }; delete next.modelFile; setErrors(next); } }} />
                {formData.modelFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="w-8 h-8 text-accent-400" />
                    <span className="text-white">{formData.modelFile.name}</span>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, modelFile: null }); }} className="text-slate-400 hover:text-red-400"><X className="w-5 h-5" /></button>
                  </div>
                ) : (
                  <div>
                    <UploadIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-300 mb-1">点击或拖拽上传3D模型文件</p>
                    <p className="text-sm text-slate-500">支持 .glb, .gltf, .obj, .fbx, .stl 格式 / Supports .glb, .gltf, .obj, .fbx, .stl formats</p>
                  </div>
                )}
              </div>
              {errors.modelFile && <p className="text-red-400 text-sm mt-2">{errors.modelFile}</p>}
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">缩略图（可选）/ Thumbnail Image (Optional)</label>
              <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${formData.thumbnailFile ? 'border-accent-500 bg-accent-500/10' : 'border-slate-600 hover:border-slate-500'}`}
                onClick={() => document.getElementById('thumbnail-upload')?.click()}>
                <input id="thumbnail-upload" type="file" accept="image/*" className="hidden"
                  onChange={(e) => { const file = e.target.files?.[0]; if (file) { setFormData({ ...formData, thumbnailFile: file }); } }} />
                {formData.thumbnailFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <Image className="w-8 h-8 text-accent-400" />
                    <span className="text-white">{formData.thumbnailFile.name}</span>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, thumbnailFile: null }); }} className="text-slate-400 hover:text-red-400"><X className="w-5 h-5" /></button>
                  </div>
                ) : (
                  <div>
                    <Image className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-300 mb-1">点击或拖拽上传缩略图</p>
                    <p className="text-sm text-slate-500">支持 JPG, PNG, GIF 格式 / Supports JPG, PNG, GIF formats</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 bg-slate-700 rounded-lg text-white font-medium hover:bg-slate-600 transition-colors">上一步 / Previous</button>
              <button type="submit" disabled={loading} className="flex-1 py-3 bg-gradient-accent rounded-lg text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50">{loading ? '上传中... / Submitting...' : '提交作品 / Submit Work'}</button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="bg-slate-800/50 rounded-2xl p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">提交成功！/ Submitted Successfully!</h2>
            <p className="text-slate-400">您的作品已提交审核，审核通过后将在作品库中展示 / Your work has been submitted for review and will be displayed in the gallery upon approval</p>
          </div>
        )}
      </div>
    </div>
  );
}