const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const getToken = () => localStorage.getItem('token');

const request = async (path, options = {}) => {
  const token = getToken();
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    const message = errorPayload.message || 'Request failed.';
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: (path) => request(path, { method: 'DELETE' }),
  postForm: (path, body) => request(path, { method: 'POST', body }),
  putForm: (path, body) => request(path, { method: 'PUT', body }),
};

export const uploads = {
  uploadImage: async (file) => {
    const data = new FormData();
    data.append('file', file);
    return api.postForm('/api/uploads', data);
  },
};

export const auth = {
  login: (payload) => api.post('/api/auth/login', payload),
  signup: (payload) => api.post('/api/auth/signup', payload),
};

export const getCurrentUser = () => {
  const raw = localStorage.getItem('user');
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
};

export const isAdminUser = () => getCurrentUser()?.role === 'admin';
