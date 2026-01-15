export interface Auth {
  email: string;
  password: string;
  name: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface SignupResponse {
  message: string;
  error: string;
  statusCode: number;
}
