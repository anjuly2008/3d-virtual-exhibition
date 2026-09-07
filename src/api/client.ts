const API_BASE = '/api';

let authToken: string | null = localStorage.getItem('token');

export function setToken(token: string | null) {
  authToken = token;

  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}

export function getToken() {
  return authToken;
}

async function request(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  if (authToken) {
    headers['Authorization'] = 'Bearer ' + authToken;
  }

  const isFormData = options.body instanceof FormData;

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(API_BASE + path, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    setToken(null);
    throw new Error('请先登录 / Please login first');
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || '请求失败 / Request failed');
  }

  return data;
}

export const api = {
  auth: {
    register: (username: string, email: string, password: string) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      }),

    login: (email: string, password: string) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    me: () => request('/auth/me'),
    updateAvatar: (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);

      return request('/auth/avatar', {
        method: 'PUT',
        body: formData,
      });
    },
  },

  exhibits: {
    list: (params: Record<string, string> = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request('/exhibits' + (qs ? '?' + qs : ''));
    },

    mine: () => request('/exhibits/mine'),

    likes: () => request('/exhibits/likes/mine'),

    get: (id: string) =>
      request('/exhibits/' + id),

    create: (formData: FormData) =>
      request('/exhibits', {
        method: 'POST',
        body: formData,
      }),

    update: (id: string, data: Record<string, string>) =>
      request('/exhibits/' + id, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      request('/exhibits/' + id, {
        method: 'DELETE',
      }),

    getLike: (id: string) =>
      request('/exhibits/' + id + '/like'),

    like: (id: string) =>
      request('/exhibits/' + id + '/like', {
        method: 'POST',
      }),
  },

  admin: {
    exhibits: (params: Record<string, string> = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request('/admin/exhibits' + (qs ? '?' + qs : ''));
    },

    updateExhibitStatus: (id: string, status: string) =>
      request('/admin/exhibits/' + id + '/status', {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }),

    deleteExhibit: (id: string) =>
      request('/admin/exhibits/' + id, {
        method: 'DELETE',
      }),

    users: () =>
      request('/admin/users'),

    updateUserRole: (id: number, role: string) =>
      request('/admin/users/' + id + '/role', {
        method: 'PUT',
        body: JSON.stringify({ role }),
      }),

    stats: () =>
      request('/admin/stats'),
  },
};