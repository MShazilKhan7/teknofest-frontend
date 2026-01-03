import type { Authentication, SignInRequest, SignUpRequest } from '../types/auth';
import api from './api';

export const AuthAPI = {
  getProfile: () => api.get<Authentication>('/auth/profile/').then((res) => res.data),

  login: async (data: SignInRequest) =>
    api.post<Authentication>('/auth/login/', data).then((res) => res.data),

  register: async (data: SignUpRequest) =>
    api.post<Authentication>('/auth/signup/', data).then((res) => res.data),

  refreshToken: async (): Promise<{ access: string }> =>
    api.post<{ access: string }>('/auth/refresh-token/').then((res) => res.data),

  verifyToken: async (): Promise<any> => api.get('/auth/verify-token/').then((res) => res.data),
};

export default AuthAPI;
