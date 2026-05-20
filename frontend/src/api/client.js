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
    const rawText = await response.text().catch(() => '');
    let errorPayload = {};
    try {
      errorPayload = rawText ? JSON.parse(rawText) : {};
    } catch (e) {
      errorPayload = { message: rawText };
    }
    const message = errorPayload.message || 'Request failed.';
    try {
      console.error('[api] request failed]', {
        path,
        status: response.status,
        statusText: response.statusText,
        body: errorPayload,
      });
    } catch (e) {
      // ignore logging errors
    }
    const err = new Error(message);
    err.status = response.status;
    err.body = errorPayload;
    throw err;
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
  me: () => api.get('/api/auth/me'),
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
