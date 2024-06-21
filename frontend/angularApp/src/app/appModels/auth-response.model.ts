export interface AuthResponse {
  status: number;
  message: string;
  token?: string;
  expiresIn?: number;
}
