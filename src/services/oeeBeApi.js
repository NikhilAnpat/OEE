import httpClient from './httpClient';

function unwrapError(err) {
  return err?.response?.data?.error || err?.message || 'Request failed';
}

export const authApi = {
  async login({ email, password }) {
    try {
      const { data } = await httpClient.post('/api/auth/login', { email, password });
      return data;
    } catch (err) {
      throw new Error(unwrapError(err));
    }
  },
  async me() {
    try {
      const { data } = await httpClient.get('/api/auth/me');
      return data;
    } catch (err) {
      throw new Error(unwrapError(err));
    }
  },
};

export const usersApi = {
  async list() {
    try {
      const { data } = await httpClient.get('/api/users');
      return data;
    } catch (err) {
      throw new Error(unwrapError(err));
    }
  },
  async create(payload) {
    try {
      const { data } = await httpClient.post('/api/users', payload);
      return data;
    } catch (err) {
      throw new Error(unwrapError(err));
    }
  },
  async update(id, payload) {
    try {
      const { data } = await httpClient.put(`/api/users/${id}`, payload);
      return data;
    } catch (err) {
      throw new Error(unwrapError(err));
    }
  },
  async remove(id) {
    try {
      await httpClient.delete(`/api/users/${id}`);
      return true;
    } catch (err) {
      throw new Error(unwrapError(err));
    }
  },
};

export const permissionsApi = {
  async list() {
    try {
      const { data } = await httpClient.get('/api/permissions');
      return data;
    } catch (err) {
      throw new Error(unwrapError(err));
    }
  },
  async getByUserId(userId) {
    try {
      const { data } = await httpClient.get(`/api/permissions/${userId}`);
      return data;
    } catch (err) {
      throw new Error(unwrapError(err));
    }
  },
  async updateByUserId(userId, payload) {
    try {
      const { data } = await httpClient.put(`/api/permissions/${userId}`, payload);
      return data;
    } catch (err) {
      throw new Error(unwrapError(err));
    }
  },
  async resetDefaults(userId, role) {
    try {
      const { data } = await httpClient.post(`/api/permissions/${userId}/reset-defaults`, { role });
      return data;
    } catch (err) {
      throw new Error(unwrapError(err));
    }
  },
};

export const alertRulesApi = {
  async list() {
    try {
      const { data } = await httpClient.get('/api/alerts/rules');
      return data;
    } catch (err) {
      throw new Error(unwrapError(err));
    }
  },
  async create(payload) {
    try {
      const { data } = await httpClient.post('/api/alerts/rules', payload);
      return data;
    } catch (err) {
      throw new Error(unwrapError(err));
    }
  },
  async update(id, payload) {
    try {
      const { data } = await httpClient.put(`/api/alerts/rules/${id}`, payload);
      return data;
    } catch (err) {
      throw new Error(unwrapError(err));
    }
  },
  async remove(id) {
    try {
      await httpClient.delete(`/api/alerts/rules/${id}`);
      return true;
    } catch (err) {
      throw new Error(unwrapError(err));
    }
  },
};

export const alertsApi = {
  async list({ page = 1, limit = 10, start, end } = {}) {
    try {
      const params = { page, limit };
      if (start) params.start = start;
      if (end) params.end = end;
      const { data } = await httpClient.get('/api/alerts', { params });
      return data;
    } catch (err) {
      throw new Error(unwrapError(err));
    }
  },
};

export const eventRecordsApi = {
  async list({ meterId, start, end, page = 1, limit = 10 } = {}) {
    try {
      const params = { page, limit };
      if (meterId) params.meterId = meterId;
      if (start) params.start = start;
      if (end) params.end = end;
      const { data } = await httpClient.get('/api/events/records', { params });
      return data;
    } catch (err) {
      throw new Error(unwrapError(err));
    }
  },
};

export const energyReadingsApi = {
  async list({ deviceId, start, end, limit = 5000 } = {}) {
    try {
      const params = { limit };
      if (deviceId) params.deviceId = deviceId;
      if (start) params.start = start;
      if (end) params.end = end;
      const { data } = await httpClient.get('/api/energy/readings', { params });
      return data;
    } catch (err) {
      throw new Error(unwrapError(err));
    }
  },
  async kpi({ deviceId, start, end, costPerKwh } = {}) {
    try {
      const params = {};
      if (deviceId) params.deviceId = deviceId;
      if (start) params.start = start;
      if (end) params.end = end;
      if (costPerKwh !== undefined) params.costPerKwh = costPerKwh;
      const { data } = await httpClient.get('/api/energy/readings/kpi', { params });
      return data;
    } catch (err) {
      throw new Error(unwrapError(err));
    }
  },
};
