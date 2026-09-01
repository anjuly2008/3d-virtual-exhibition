import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Image, CheckCircle, Clock, XCircle, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/api/client';

interface AdminExhibit {
  id: number;
  title: string;
  creator_name: string;
  category: string;
  status: string;
  created_at: string;
}

interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

interface Stats {
  totalUsers: number;
  totalExhibits: number;
  approvedExhibits: number;
  pendingExhibits: number;
}

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'exhibits' | 'users' | 'stats'>('exhibits');
  const [exhibits, setExhibits] = useState<AdminExhibit[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [exhibitFilter, setExhibitFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const loadExhibits = () => {
    const params: Record<string, string> = {};
    if (exhibitFilter) params.status = exhibitFilter;
    api.admin.exhibits(params)
      .then((data) => setExhibits(data.exhibits))
      .catch(() => {});
  };

  const loadUsers = () => {
    api.admin.users()
      .then((data) => setUsers(data.users))
      .catch(() => {});
  };

  const loadStats = () => {
    api.admin.stats()
      .then((data) => setStats(data))
      .catch(() => {});
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    setLoading(false);
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    if (tab === 'exhibits') loadExhibits();
    else if (tab === 'users') loadUsers();
    else loadStats();
  }, [tab, exhibitFilter, user]);

  const handleApprove = async (id: number) => {
    await api.admin.updateExhibitStatus(String(id), 'approved');
    loadExhibits();
  };

  const handleReject = async (id: number) => {
    await api.admin.updateExhibitStatus(String(id), 'rejected');
    loadExhibits();
  };

  const handleDeleteExhibit = async (id: number) => {
    if (!window.confirm('确定要删除这个作品吗？')) return;
    await api.admin.deleteExhibit(String(id));
    loadExhibits();
  };

  const handleToggleRole = async (userId: number, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    await api.admin.updateUserRole(userId, newRole);
    loadUsers();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-16 bg-slate-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold text-white">管理员后台<br /><span className="text-xs text-slate-500">Admin Dashboard</span></h1>
        </div>

        <div className="flex gap-2 mb-8">
          {(['exhibits', 'users', 'stats'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                tab === t ? 'bg-gradient-accent text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {t === 'exhibits' && <><Image className="w-4 h-4 inline mr-1" />作品审核<br /><span className="text-xs text-slate-500">Work Review</span></>}
              {t === 'users' && <><Users className="w-4 h-4 inline mr-1" />用户管理<br /><span className="text-xs text-slate-500">User Management</span></>}
              {t === 'stats' && <><CheckCircle className="w-4 h-4 inline mr-1" />数据统计<br /><span className="text-xs text-slate-500">Statistics</span></>}
            </button>
          ))}
        </div>

        {tab === 'exhibits' && (
          <div>
            <div className="flex gap-2 mb-6">
              {['', 'pending', 'approved', 'rejected'].map((s) => (
                <button
                  key={s}
                  onClick={() => setExhibitFilter(s)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    exhibitFilter === s ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {s === '' ? <>全部<br /><span className="text-xs text-slate-500">All</span></> : s === 'pending' ? <>待审核<br /><span className="text-xs text-slate-500">Pending</span></> : s === 'approved' ? <>已通过<br /><span className="text-xs text-slate-500">Approved</span></> : <>已拒绝<br /><span className="text-xs text-slate-500">Rejected</span></>}
                </button>
              ))}
            </div>

            <div className="bg-slate-800/50 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left p-4 text-slate-300 font-medium">作品<br /><span className="text-xs text-slate-500">Work</span></th>
                    <th className="text-left p-4 text-slate-300 font-medium">作者<br /><span className="text-xs text-slate-500">Author</span></th>
                    <th className="text-left p-4 text-slate-300 font-medium">分类<br /><span className="text-xs text-slate-500">Category</span></th>
                    <th className="text-left p-4 text-slate-300 font-medium">状态<br /><span className="text-xs text-slate-500">Status</span></th>
                    <th className="text-left p-4 text-slate-300 font-medium">时间<br /><span className="text-xs text-slate-500">Date</span></th>
                    <th className="text-right p-4 text-slate-300 font-medium">操作<br /><span className="text-xs text-slate-500">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {exhibits.map((e) => (
                    <tr key={e.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                      <td className="p-4 text-white font-medium">{e.title}</td>
                      <td className="p-4 text-slate-300">{e.creator_name}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-slate-700 text-slate-300">{e.category}</span>
                      </td>
                      <td className="p-4">
                        {e.status === 'pending' && <span className="flex items-center gap-1 text-yellow-400"><Clock className="w-3 h-3" />待审核<br /><span className="text-xs text-slate-500">Pending</span></span>}
                        {e.status === 'approved' && <span className="flex items-center gap-1 text-green-400"><CheckCircle className="w-3 h-3" />已通过<br /><span className="text-xs text-slate-500">Approved</span></span>}
                        {e.status === 'rejected' && <span className="flex items-center gap-1 text-red-400"><XCircle className="w-3 h-3" />已拒绝<br /><span className="text-xs text-slate-500">Rejected</span></span>}
                      </td>
                      <td className="p-4 text-slate-400">{new Date(e.created_at).toLocaleDateString('zh-CN')}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {e.status === 'pending' && (
                            <>
                              <button onClick={() => handleApprove(e.id)} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors">通过<br /><span className="text-xs text-slate-500">Approve</span></button>
                              <button onClick={() => handleReject(e.id)} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-colors">拒绝<br /><span className="text-xs text-slate-500">Reject</span></button>
                            </>
                          )}
                          <button onClick={() => handleDeleteExhibit(e.id)} className="p-1.5 text-slate-400 hover:text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {exhibits.length === 0 && (
                    <tr><td colSpan={6} className="p-8 text-center text-slate-400">暂无作品数据<br /><span className="text-xs text-slate-500">No works yet</span></td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'users' && (
          <div className="bg-slate-800/50 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-4 text-slate-300 font-medium">用户名<br /><span className="text-xs text-slate-500">Username</span></th>
                  <th className="text-left p-4 text-slate-300 font-medium">邮箱<br /><span className="text-xs text-slate-500">Email</span></th>
                  <th className="text-left p-4 text-slate-300 font-medium">角色<br /><span className="text-xs text-slate-500">Role</span></th>
                  <th className="text-left p-4 text-slate-300 font-medium">注册时间<br /><span className="text-xs text-slate-500">Registered</span></th>
                  <th className="text-right p-4 text-slate-300 font-medium">操作<br /><span className="text-xs text-slate-500">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 text-white font-medium">{u.username}</td>
                    <td className="p-4 text-slate-300">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${u.role === 'admin' ? 'bg-purple-600 text-purple-100' : 'bg-slate-700 text-slate-300'}`}>
                        {u.role === 'admin' ? <>管理员<br /><span className="text-xs text-slate-500">Admin</span></> : <>普通用户<br /><span className="text-xs text-slate-500">User</span></>}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{new Date(u.created_at).toLocaleDateString('zh-CN')}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleRole(u.id, u.role)}
                        className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded-lg transition-colors"
                      >
                        {u.role === 'admin' ? <>降为普通用户<br /><span className="text-xs text-slate-500">Demote to User</span></> : <>提升为管理员<br /><span className="text-xs text-slate-500">Promote to Admin</span></>}
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-400">暂无用户数据<br /><span className="text-xs text-slate-500">No users yet</span></td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'stats' && stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-slate-800/50 rounded-xl p-6 text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white">{stats.totalUsers}</div>
              <div className="text-sm text-slate-400 mt-1">注册用户<br /><span className="text-xs text-slate-500">Registered Users</span></div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-6 text-center">
              <Image className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white">{stats.totalExhibits}</div>
              <div className="text-sm text-slate-400 mt-1">作品总数<br /><span className="text-xs text-slate-500">Total Works</span></div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-6 text-center">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white">{stats.approvedExhibits}</div>
              <div className="text-sm text-slate-400 mt-1">已通过作品<br /><span className="text-xs text-slate-500">Approved Works</span></div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-6 text-center">
              <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white">{stats.pendingExhibits}</div>
              <div className="text-sm text-slate-400 mt-1">待审核作品<br /><span className="text-xs text-slate-500">Pending Works</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}