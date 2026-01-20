export interface JwtPayload {
  sub: string; // user id
  email: string;
  rol: string;
  tipo: string;
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    nombre: string;
    tipo: string;
    rol: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface ValidateTokenResponse {
  valid: boolean;
  user?: {
    id: string;
    email: string;
    rol: string;
    tipo: string;
  };
  error?: string;
}
