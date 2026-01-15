import type { Auth, SignupResponse, LoginResponse } from '@/models/auth.model';
import https from './https';

const authAPI = {
  async signup(data: Auth) {
    const response = await https.post<Auth, SignupResponse>('/auth/signup', data);
    return response;
  },
  async login(data: Pick<Auth, 'email' | 'password'>) {
    const response = await https.post<Pick<Auth, 'email' | 'password'>, LoginResponse>(
      '/auth/login',
      data,
    );
    return response;
  },
};

export default authAPI;
