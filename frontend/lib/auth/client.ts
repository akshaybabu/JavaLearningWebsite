export interface AuthenticatedUser {
  id: number;
  fullName: string;
  username: string;
  email: string;
  role: string;
}

export interface AuthSuccessResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthenticatedUser;
}

export interface RegisterPayload {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  usernameOrEmail: string;
  password: string;
}

export interface ApiErrorPayload {
  status?: number;
  error?: string;
  message?: string;
  path?: string;
  validationErrors?: Record<string, string>;
}

export class AuthApiError extends Error {
  status: number;
  validationErrors?: Record<string, string>;

  constructor(message: string, status: number, validationErrors?: Record<string, string>) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
    this.validationErrors = validationErrors;
  }
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";
export const TOKEN_KEY = "jf-auth-token";
export const USER_KEY = "jf-auth-user";

async function postJson<TResponse, TPayload>(path: string, payload: TPayload): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const raw = await response.text();
  const data = raw ? JSON.parse(raw) : null;

  if (!response.ok) {
    const errorData = (data ?? {}) as ApiErrorPayload;
    throw new AuthApiError(
      errorData.message || "Authentication request failed.",
      response.status,
      errorData.validationErrors,
    );
  }

  return data as TResponse;
}

export async function registerUser(payload: RegisterPayload): Promise<AuthSuccessResponse> {
  return postJson<AuthSuccessResponse, RegisterPayload>("/v1/auth/register", payload);
}

export async function loginUser(payload: LoginPayload): Promise<AuthSuccessResponse> {
  return postJson<AuthSuccessResponse, LoginPayload>("/v1/auth/login", payload);
}

export function persistAuthSession(session: AuthSuccessResponse) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(TOKEN_KEY, session.accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(session.user));
}

export function clearAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredAuthUser(): AuthenticatedUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUser = localStorage.getItem(USER_KEY);
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as AuthenticatedUser;
  } catch {
    return null;
  }
}
