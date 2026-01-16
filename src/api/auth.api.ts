import https from './https';
import type {
  SignupDto,
  UserResponseDto,
  LoginDto,
  LoginResponseDto,
  AuthControllerRefreshBody,
  RefreshResponseDto,
} from '@/models/generated';

const authAPI = {
  async signup(data: SignupDto) {
    const response = await https.post<SignupDto, UserResponseDto>('/auth/signup', data);
    return response;
  },
  async login(data: LoginDto) {
    const response = await https.post<LoginDto, LoginResponseDto>('/auth/login', data);
    return response;
  },
  async refresh(data: AuthControllerRefreshBody) {
    const response = await https.post<AuthControllerRefreshBody, RefreshResponseDto>(
      '/auth/refresh',
      data,
    );
    return response;
  },
};

export default authAPI;
