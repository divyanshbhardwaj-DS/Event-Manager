const BASE = '';

async function request(path, options = {}) {
  const token = localStorage.getItem('admin_token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(BASE + path, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || 'Something went wrong. Please try again.');
    err.status = res.status;
    err.errors = data.errors;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  listEvents: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/api/events${q ? `?${q}` : ''}`);
  },
  getEvent: (id) => request(`/api/events/${id}`),
  register: (id, payload) =>
    request(`/api/events/${id}/register`, { method: 'POST', body: JSON.stringify(payload) }),
  createEvent: (payload) => request('/api/events', { method: 'POST', body: JSON.stringify(payload) }),
  updateEvent: (id, payload) => request(`/api/events/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteEvent: (id) => request(`/api/events/${id}`, { method: 'DELETE' }),
  adminLogin: (payload) => request('/api/admin/login', { method: 'POST', body: JSON.stringify(payload) }),
  dashboard: () => request('/api/admin/dashboard'),
  registrations: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/api/admin/registrations${q ? `?${q}` : ''}`);
  },
  eventRegistrations: (id) => request(`/api/events/${id}/registrations`),
};

export const CATEGORIES = ['Technical', 'Cultural', 'Sports', 'Workshop', 'Competition', 'Seminar', 'Social', 'Other'];
