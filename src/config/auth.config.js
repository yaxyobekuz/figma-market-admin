export const ACCESS_TOKEN_KEY = 'fm_admin_access_token';

export const getStoredAccessToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const saveAccessToken = (token) => {
  if (typeof window === 'undefined') return null;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  return token;
};

export const clearAccessToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};