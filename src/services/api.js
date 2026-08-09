import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = {
  login: async (email, password, role) => {
    const response = await API.post('/auth/login', { email, password, role });
    return response.data;
  },
  register: async (data) => {
    const response = await API.post('/auth/register', data);
    return response.data;
  }
};

export const queueApi = {
  getDepartments: async () => {
    const response = await API.get('/departments');
    return response.data.departments;
  },

  getDoctors: async (departmentId) => {
    const response = await API.get('/doctors', { params: { departmentId } });
    return response.data.doctors;
  },

  generateToken: async (data) => {
    const response = await API.post('/queue/token', data);
    return response.data;
  },

  getCurrentQueue: async () => {
    const response = await API.get('/queue/current');
    return response.data.data;
  },

  getTokenDetails: async (token) => {
    const response = await API.get(`/queue/${token}`);
    return response.data.data;
  },

  getDoctorQueue: async (doctorId) => {
    const response = await API.get(`/queue/doctor/${doctorId}`);
    return response.data.data;
  },

  callNextPatient: async (doctorId, token) => {
    const endpoint = token ? `/queue/${token}/call` : '/queue/next/call';
    const response = await API.put(endpoint, { doctorId });
    return response.data;
  },

  completePatient: async (token) => {
    const response = await API.put(`/queue/${token}/complete`);
    return response.data;
  },

  skipPatient: async (token, reason) => {
    const response = await API.put(`/queue/${token}/skip`, { reason });
    return response.data;
  },

  holdPatient: async (token, reason) => {
    const response = await API.put(`/queue/${token}/hold`, { reason });
    return response.data;
  },

  getPatientHistory: async (patientId) => {
    const response = await API.get(`/queue/patient/${patientId}`);
    return response.data.data;
  }
};

export const adminApi = {
  getDashboardStats: async () => {
    const response = await API.get('/admin/dashboard');
    return response.data.data;
  }
};
