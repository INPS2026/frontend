'use client';

const TOKEN_STORAGE_KEY = 'school_tokens';

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export class TokenService {
  static get(): AuthTokens | null {
    if (typeof window === 'undefined') {
      return null;
    }
    const storedTokens = localStorage.getItem(TOKEN_STORAGE_KEY);
    return !storedTokens ? null : JSON.parse(storedTokens);
  }

  static set(tokens: AuthTokens) {
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
  }

  static getAccessToken() {
    return this.get()?.accessToken;
  }

  static getRefreshToken() {
    return this.get()?.refreshToken;
  }

  static clear() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}
