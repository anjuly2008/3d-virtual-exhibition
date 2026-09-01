const API_BASE = '/api';//api管理前端对后端 API 的调用
//在authToken里面保存当前登录用户的 token。

let authToken: string | null = localStorage.getItem('token');//localStorage浏览器提供的一个本地存储空间。

export function setToken(token: string | null) {//设置当前用户的 token
  authToken = token;
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}

export function getToken() {//把当前保存的 token 拿出来。
  return authToken;
}

async function request(path: string, options: RequestInit = {}) {//地址, 请求配置
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),//这是一个“字符串 → 字符串”的对象，...把另一个对象里面的属性展开到当前对象里
  };//TypeScript，你就把 options.headers 当成一个字符串到字符串的对象来处理。
  if (authToken) {
    headers['Authorization'] = 'Bearer ' + authToken;//Authorization（身份认证）+Bearer (认证方式)
  }

  const isFormData = options.body instanceof FormData;//options.body这次 HTTP 请求准备发送的数据。
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';//告诉服务器，我这次发送的数据是什么格式
  }

  const res = await fetch(API_BASE + path, { ...options, headers });//const API_BASE = '/api';
  //等待服务器把响应返回，然后把响应对象保存到 res。
  if (res.status === 401) {
    setToken(null);
    throw new Error('请先登录 / Please login first');
  }

  const data = await res.json();//把服务器返回的 JSON 数据解析成 JavaScript 对象。
  if (!res.ok) {
    throw new Error(data.error || '请求失败 / Request failed');
  }
  return data;
}

export const api = {
  auth: {
    register: (username: string, email: string, password: string) =>
      request('/auth/register', { method: 'POST', body: JSON.stringify({ username, email, password }) }),
    login: (email: string, password: string) =>//对应后端router.post('/login')
      request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    me: () => request('/auth/me'),
  },
  exhibits: {
    list: (params: Record<string, string> = {}) => {//parametic参数  这个函数接收一个参数
      //TypeScript类型
      const qs = new URLSearchParams(params).toString();//把对象转换成 URL 参数 toString变成字符串
      return request('/exhibits' + (qs ? '?' + qs : ''));
    },
    get: (id: string) => request('/exhibits/' + id),
    create: (formData: FormData) =>
      request('/exhibits', { method: 'POST', body: formData }),
    update: (id: string, data: Record<string, string>) =>
      request('/exhibits/' + id, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request('/exhibits/' + id, { method: 'DELETE' }),
    like: (id: string) =>
      request('/exhibits/' + id + '/like', { method: 'POST' }),
  },
  admin: {
    exhibits: (params: Record<string, string> = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request('/admin/exhibits' + (qs ? '?' + qs : ''));
    },
    updateExhibitStatus: (id: string, status: string) =>
      request('/admin/exhibits/' + id + '/status', { method: 'PUT', body: JSON.stringify({ status }) }),
    deleteExhibit: (id: string) =>
      request('/admin/exhibits/' + id, { method: 'DELETE' }),
    users: () => request('/admin/users'),
    updateUserRole: (id: number, role: string) =>
      request('/admin/users/' + id + '/role', { method: 'PUT', body: JSON.stringify({ role }) }),
    stats: () => request('/admin/stats'),
  },
};