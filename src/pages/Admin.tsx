import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Image, CheckCircle, Clock, XCircle, Trash2, Eye } from 'lucide-react';
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

  const baseUrl = import.meta.env.BASE_URL;

  const loadExhibits = () => {
    const params: Record<string, string> = {};

    if (exhibitFilter) {
      params.status = exhibitFilter;
    }

    api.admin
      .exhibits(params)
      .then((data) => setExhibits(data.exhibits))
      .catch(() => {});
  };

  const loadUsers = () => {
    api.admin
      .users()
      .then((data) => setUsers(data.users))
      .catch(() => {});
  };

  const loadStats = () => {
    api.admin
      .stats()
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

    if (tab === 'exhibits') {
      loadExhibits();
    } else if (tab === 'users') {
      loadUsers();
    } else {
      loadStats();
    }
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
    if (!window.confirm('确定要删除这个作品吗？')) {
      return;
    }

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
      <div
        className="relative min-h-screen pt-16 flex items-center justify-center"
        style={{
          backgroundImage: `url(${baseUrl}backgrounds/4.gif)`,
          backgroundRepeat: 'repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 z-0 bg-black/20 pointer-events-none" />

        <div className="relative z-10 glass-card w-16 h-16 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen pt-[72px]"
      style={{
        backgroundImage: `url(${baseUrl}backgrounds/4.gif)`,
        backgroundRepeat: 'repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 z-0 bg-black/20 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <img
            src={`${baseUrl}admin-icons/30.gif`}
            alt="Admin"
            className="w-10 h-10 object-contain"
          />

          <h1 className="text-3xl font-bold text-white">
            管理员后台
            <br />
            <span className="text-xs text-slate-300">Admin Dashboard</span>
          </h1>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {(['exhibits', 'users', 'stats'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`glass-btn relative ${tab === t ? 'is-active' : ''}`}
            >
              {tab === t && (
                <img
                  src={`${baseUrl}admin-icons/36.gif`}
                  alt=""
                  className="absolute -top-5 -left-1 w-10 h-7 object-contain pointer-events-none"
                />
              )}

              {t === 'exhibits' && (
                <>
                  <Image className="w-4 h-4 inline mr-1" />
                  作品审核
                  <br />
                  <span className="text-xs">Work Review</span>
                </>
              )}

              {t === 'users' && (
                <>
                  <Users className="w-4 h-4 inline mr-1" />
                  用户管理
                  <br />
                  <span className="text-xs">User Management</span>
                </>
              )}

              {t === 'stats' && (
                <>
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  数据统计
                  <br />
                  <span className="text-xs">Statistics</span>
                </>
              )}
            </button>
          ))}
        </div>

        {tab === 'exhibits' && (
          <div>
            <div className="flex flex-wrap gap-2 mb-6">
              {['', 'pending', 'approved', 'rejected'].map((s) => (
                <button
                  key={s}
                  onClick={() => setExhibitFilter(s)}
                  className={`glass-btn relative ${exhibitFilter === s ? 'is-active' : ''}`}
                >
                  {exhibitFilter === s && (
                    <img
                      src={`${baseUrl}admin-icons/39.gif`}
                      alt=""
                      className="absolute -top-5 -right-1 w-10 h-7 object-contain pointer-events-none"
                    />
                  )}

                  {s === '' ? (
                    <>
                      全部
                      <br />
                      <span className="text-xs">All</span>
                    </>
                  ) : s === 'pending' ? (
                    <>
                      待审核
                      <br />
                      <span className="text-xs">Pending</span>
                    </>
                  ) : s === 'approved' ? (
                    <>
                      已通过
                      <br />
                      <span className="text-xs">Approved</span>
                    </>
                  ) : (
                    <>
                      已拒绝
                      <br />
                      <span className="text-xs">Rejected</span>
                    </>
                  )}
                </button>
              ))}
            </div>

            <div className="glass-card rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-white/80 font-medium">
                      作品
                      <br />
                      <span className="text-xs text-slate-300">Work</span>
                    </th>

                    <th className="text-left p-4 text-white/80 font-medium">
                      作者
                      <br />
                      <span className="text-xs text-slate-300">Author</span>
                    </th>

                    <th className="text-left p-4 text-white/80 font-medium">
                      分类
                      <br />
                      <span className="text-xs text-slate-300">Category</span>
                    </th>

                    <th className="text-center p-4 text-white/80 font-medium">
                      预览
                      <br />
                      <span className="text-xs text-slate-300">Preview</span>
                    </th>

                    <th className="text-left p-4 text-white/80 font-medium">
                      状态
                      <br />
                      <span className="text-xs text-slate-300">Status</span>
                    </th>

                    <th className="text-left p-4 text-white/80 font-medium">
                      时间
                      <br />
                      <span className="text-xs text-slate-300">Date</span>
                    </th>

                    <th className="text-right p-4 text-white/80 font-medium">
                      操作
                      <br />
                      <span className="text-xs text-slate-300">Actions</span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {exhibits.map((e) => (
                    <tr
                      key={e.id}
                      className="border-b border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <td className="p-4 text-white font-medium">{e.title}</td>

                      <td className="p-4 text-slate-200">{e.creator_name}</td>

                      <td className="p-4">
                        <span className="glass-badge">{e.category}</span>
                      </td>

                      <td className="p-4 text-center">
                        <button
                          type="button"
                          className="glass-btn px-3 py-1"
                          onClick={() =>
                            window.open(`/admin-preview/${e.id}`, '_blank')
                          }
                        >
                          <Eye className="w-4 h-4 inline mr-1" />
                          预览
                          <br />
                          <span className="text-xs">Preview</span>
                        </button>
                      </td>

                      <td className="p-4">
                        {e.status === 'pending' && (
                          <span className="flex items-center gap-1 text-yellow-300">
                            <Clock className="w-3 h-3" />
                            待审核
                            <br />
                            <span className="text-xs text-slate-300">
                              Pending
                            </span>
                          </span>
                        )}

                        {e.status === 'approved' && (
                          <span className="flex items-center gap-1 text-green-300">
                            <CheckCircle className="w-3 h-3" />
                            已通过
                            <br />
                            <span className="text-xs text-slate-300">
                              Approved
                            </span>
                          </span>
                        )}

                        {e.status === 'rejected' && (
                          <span className="flex items-center gap-1 text-red-300">
                            <XCircle className="w-3 h-3" />
                            已拒绝
                            <br />
                            <span className="text-xs text-slate-300">
                              Rejected
                            </span>
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-slate-200">
                        {new Date(e.created_at).toLocaleDateString('zh-CN')}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {e.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(e.id)}
                                className="glass-btn px-3 py-1"
                              >
                                通过
                                <br />
                                <span className="text-xs">Approve</span>
                              </button>

                              <button
                                onClick={() => handleReject(e.id)}
                                className="glass-btn px-3 py-1"
                              >
                                拒绝
                                <br />
                                <span className="text-xs">Reject</span>
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => handleDeleteExhibit(e.id)}
                            className="glass-btn p-1.5"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {exhibits.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="p-8 text-center text-slate-200"
                      >
                        暂无作品数据
                        <br />
                        <span className="text-xs text-slate-300">
                          No works yet
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'users' && (
          <div className="glass-card rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-white/80 font-medium">
                    用户名
                    <br />
                    <span className="text-xs text-slate-300">Username</span>
                  </th>

                  <th className="text-left p-4 text-white/80 font-medium">
                    邮箱
                    <br />
                    <span className="text-xs text-slate-300">Email</span>
                  </th>

                  <th className="text-left p-4 text-white/80 font-medium">
                    角色
                    <br />
                    <span className="text-xs text-slate-300">Role</span>
                  </th>

                  <th className="text-left p-4 text-white/80 font-medium">
                    注册时间
                    <br />
                    <span className="text-xs text-slate-300">Registered</span>
                  </th>

                  <th className="text-right p-4 text-white/80 font-medium">
                    操作
                    <br />
                    <span className="text-xs text-slate-300">Actions</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <td className="p-4 text-white font-medium">
                      {u.username}
                    </td>

                    <td className="p-4 text-slate-200">{u.email}</td>

                    <td className="p-4">
                      <span className="glass-badge">
                        {u.role === 'admin' ? (
                          <>
                            管理员
                            <br />
                            <span className="text-xs">Admin</span>
                          </>
                        ) : (
                          <>
                            普通用户
                            <br />
                            <span className="text-xs">User</span>
                          </>
                        )}
                      </span>
                    </td>

                    <td className="p-4 text-slate-200">
                      {new Date(u.created_at).toLocaleDateString('zh-CN')}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleRole(u.id, u.role)}
                        className="glass-btn px-3 py-1"
                      >
                        {u.role === 'admin' ? (
                          <>
                            降为普通用户
                            <br />
                            <span className="text-xs">Demote to User</span>
                          </>
                        ) : (
                          <>
                            提升为管理员
                            <br />
                            <span className="text-xs">Promote to Admin</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-slate-200"
                    >
                      暂无用户数据
                      <br />
                      <span className="text-xs text-slate-300">
                        No users yet
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'stats' && stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="glass-card rounded-xl p-6 text-center">
              <img
                src={`${baseUrl}admin-icons/31.gif`}
                alt=""
                className="w-10 h-10 object-contain mx-auto mb-3"
              />

              <div className="text-3xl font-bold text-white">
                {stats.totalUsers}
              </div>

              <div className="text-sm text-slate-200 mt-1">
                注册用户
                <br />
                <span className="text-xs text-slate-300">
                  Registered Users
                </span>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 text-center">
              <img
                src={`${baseUrl}admin-icons/33.gif`}
                alt=""
                className="w-10 h-10 object-contain mx-auto mb-3"
              />

              <div className="text-3xl font-bold text-white">
                {stats.totalExhibits}
              </div>

              <div className="text-sm text-slate-200 mt-1">
                作品总数
                <br />
                <span className="text-xs text-slate-300">Total Works</span>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 text-center">
              <img
                src={`${baseUrl}admin-icons/34.gif`}
                alt=""
                className="w-10 h-10 object-contain mx-auto mb-3"
              />

              <div className="text-3xl font-bold text-white">
                {stats.approvedExhibits}
              </div>

              <div className="text-sm text-slate-200 mt-1">
                已通过作品
                <br />
                <span className="text-xs text-slate-300">
                  Approved Works
                </span>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 text-center">
              <img
                src={`${baseUrl}admin-icons/35.gif`}
                alt=""
                className="w-10 h-10 object-contain mx-auto mb-3"
              />

              <div className="text-3xl font-bold text-white">
                {stats.pendingExhibits}
              </div>

              <div className="text-sm text-slate-200 mt-1">
                待审核作品
                <br />
                <span className="text-xs text-slate-300">
                  Pending Works
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}