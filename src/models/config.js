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

let settings = localStorage.getItem('settings') || '{}';
settings = JSON.parse(settings);

export default {
  IS_DEV_MODE,
  SERVER_URL,
  TELEGRAM_USER,
  ADMIN_USER: '208067133',
  DEFAULT_COUNTRY: settings.defaultCountry || 'pl',
  TIME_LIMIT_GREEN: 150,
  TIME_LIMIT_YELLOW: 650,
  COUNTRIES: ['pl', 'by'],
  FREE_KEYS_PER_SUBSCRIPTION_LIMIT: 4
}