const API_BASE = 'http://localhost:5000/api';

function getHeaders(token?: string) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth
  async login(username: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Đăng nhập thất bại');
    }
    return res.json();
  },

  // Criteria
  async getCriteria(token: string) {
    const res = await fetch(`${API_BASE}/criteria`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Lỗi lấy danh sách tiêu chí');
    return res.json();
  },

  async updateCriterion(token: string, id: string, data: any) {
    const res = await fetch(`${API_BASE}/criteria/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Lỗi cập nhật tiêu chí');
    }
    return res.json();
  },

  async createCriterion(token: string, data: any) {
    const res = await fetch(`${API_BASE}/criteria`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Lỗi tạo tiêu chí mới');
    }
    return res.json();
  },

  async deleteCriterion(token: string, id: string) {
    const res = await fetch(`${API_BASE}/criteria/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Lỗi xóa tiêu chí');
    return res.json();
  },

  // Categories
  async getCategories(token: string) {
    const res = await fetch(`${API_BASE}/criteria/categories`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Lỗi lấy danh mục tiêu chí');
    const list = await res.json();
    return list.map((c: any) => c.name);
  },

  async createCategory(token: string, name: string) {
    const res = await fetch(`${API_BASE}/criteria/categories`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Lỗi tạo danh mục mới');
    }
    return res.json();
  },

  async updateCategory(token: string, oldName: string, newName: string) {
    const res = await fetch(`${API_BASE}/criteria/categories/${encodeURIComponent(oldName)}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ name: newName }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Lỗi cập nhật tên danh mục');
    }
    return res.json();
  },

  async deleteCategory(token: string, name: string) {
    const res = await fetch(`${API_BASE}/criteria/categories/${encodeURIComponent(name)}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Lỗi xóa danh mục');
    }
    return res.json();
  },

  // Periods
  async getPeriods(token: string) {
    const res = await fetch(`${API_BASE}/periods`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Lỗi lấy danh sách đợt báo cáo');
    return res.json();
  },

  // Submissions
  async getSubmissions(token: string, filters?: { periodId?: string; formCode?: string; unitCode?: string }) {
    const query = new URLSearchParams(filters as any).toString();
    const res = await fetch(`${API_BASE}/submissions?${query}`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Lỗi lấy danh sách báo cáo');
    return res.json();
  },

  async saveSubmission(token: string, payload: { periodId: string; formCode: string; unitCode: string; data: any; status?: string }) {
    const res = await fetch(`${API_BASE}/submissions`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Lỗi lưu thông tin báo cáo');
    }
    return res.json();
  }
};
