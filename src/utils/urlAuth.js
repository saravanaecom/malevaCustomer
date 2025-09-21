// URL-based authentication utility
export const extractCredentialsFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    username: urlParams.get('username') || urlParams.get('user'),
    password: urlParams.get('password') || urlParams.get('pwd'),
    token: urlParams.get('token'),
    autoLogin: urlParams.get('autoLogin') === 'true'
  };
};

export const shouldAutoLogin = () => {
  // Auto-login for dashboard URL without credentials
  return window.location.pathname === '/dashboard';
};

export const getDefaultCredentials = () => {
  return {
    username: 'hawak',
    password: '123456'
  };
};

export const clearUrlParams = () => {
  const url = new URL(window.location);
  url.search = '';
  window.history.replaceState({}, document.title, url);
};