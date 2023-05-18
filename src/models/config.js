const IS_DEV_MODE = window.location.search.indexOf('isDevMode=true') !== -1;
let SERVER_URL = '';
let TELEGRAM_USER = '';

const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || '';

if (userId) {
  TELEGRAM_USER = userId.toString();
}

if (IS_DEV_MODE) {
  TELEGRAM_USER = '208067133';
}

if (IS_DEV_MODE) {
  SERVER_URL = 'http://localhost:3000'
}

export default {
  IS_DEV_MODE,
  SERVER_URL,
  TELEGRAM_USER
}