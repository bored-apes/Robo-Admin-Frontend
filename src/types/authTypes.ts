export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
}

export interface ProfileResponse {
  data: LoginResponse;
}
