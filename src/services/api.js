import axios from 'axios';

import CONFIG from '../models/config.js';

const { SERVER_URL, TELEGRAM_USER, IS_DEV_MODE } = CONFIG;

export async function getConfig() {
  try {
    const response = await axios.get(`${SERVER_URL}/api/config/${TELEGRAM_USER}`);
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getLastCurrencies(country) {
  try {
    const response = await axios.get(`${SERVER_URL}/api/last/${country}/${TELEGRAM_USER}`);
    const lastCurrencies = response.data.data;
    const settings = response.data.settings;

    return { lastCurrencies, settings };
  } catch (err) {
    console.log(err);
  }
}

export async function getLastCurrenciesForRender(country) {
  try {
    const response = await axios.get(`${SERVER_URL}/api/last/${country}`);
    const lastCurrencies = response.data.data;
    const settings = response.data.settings;

    return { lastCurrencies, settings };
  } catch (err) {
    console.log(err);
  }
}

export async function saveFavorites(favorites, country) {
  try {
    const response = await axios.post(`${SERVER_URL}/api/favorites/${country}/${TELEGRAM_USER}`, {
      favorites
    });
    
    return response;
  } catch (err) {
    console.log(err);
  }
}

export async function getUserSettings() {
  try {
    const response = await axios.get(`${SERVER_URL}/api/settings/${TELEGRAM_USER}`);
    
    return response?.data?.data || {};

  } catch (err) {
    console.log(err);
  }
}

export async function saveSettings(settings) {
  try {
    const response = await axios.post(`${SERVER_URL}/api/settings/${TELEGRAM_USER}`, {
      settings
    });
    
    return response;
  } catch (err) {
    console.log(err);
  }
}

export async function sendMessage(message) {
  try {
    const response = await axios.post(`${SERVER_URL}/api/message/${TELEGRAM_USER}`, {
      message
    });
    
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getSubscriptionSettings() {
  try {
    const response = await axios.get(`${SERVER_URL}/api/subscription/settings`);
    
    return response?.data?.data || {};
  } catch(err) {
    console.log(err);
  }
}

export async function setSubscription(subscription) {
  const mode = IS_DEV_MODE ? 'dev' : 'prod';
  try {
    const response = await axios.post(`${SERVER_URL}/api/subscription/${mode}`, {
      subscription
    });
    
    return response?.data || {};
  } catch(err) {
    console.log(err);
  }
}

export async function putSubscription(subscription, subscriptionId) {
  const mode = IS_DEV_MODE ? 'dev' : 'prod';
  try {
    const response = await axios.put(`${SERVER_URL}/api/subscription/${TELEGRAM_USER}/${subscriptionId}/${mode}`, {
      subscription
    });
    
    return response?.data || {};
  } catch(err) {
    console.log(err);
  }
}

export async function getSubscriptions () {
  const mode = IS_DEV_MODE ? 'dev' : 'prod';
  try {
    const response = await axios.get(`${SERVER_URL}/api/subscription/${TELEGRAM_USER}/${mode}`);
    
    return response?.data?.data || {};
  } catch(err) {
    console.log(err);
  }
}

export async function deleteSubscription(subscriptionId) {
  const mode = IS_DEV_MODE ? 'dev' : 'prod';
  try {
    const response = await axios.delete(`${SERVER_URL}/api/subscription/${TELEGRAM_USER}/${subscriptionId}/${mode}`);
    
    return response?.data?.data || {};
  } catch(err) {
    console.log(err);
  }
}

export async function getStatistic() {
  try {
    const response = await axios.get(`${SERVER_URL}/api/statistic`);
    
    return response?.data || {};
  } catch(err) {
    console.log(err);
  }
}

export async function getSubscriptionById(id) {
  try {
    const response = await axios.get(`${SERVER_URL}/api/render/subscription/${id}`, {
      headers: {
        'X-MODE': IS_DEV_MODE ? 'dev' : 'prod'
      }
    });
    
    return response?.data || {};
  } catch(err) {
    console.log(err);
  }
}

export async function getRenderSettings() {
  try {
    const mode = IS_DEV_MODE ? 'dev' : 'prod';
    const response = await axios.get(`${SERVER_URL}/api/render-settings/${mode}`, {
      headers: {
        'x-mode': mode
      }
    });
    
    return response?.data.data || {};
  } catch(err) {
    console.log(err);
  }
}

export async function getDiffCurrencies(country, keys, timestamp) {
  try {
    const response = await axios.post(`${SERVER_URL}/api/render/currencies/diff`, {
      country,
      keys,
      timestamp
    });

    return response?.data || {};
  } catch (err) {
    console.log(err);
  }
}

export async function getFeedItems(offset, limit) {
  try {
    const mode = IS_DEV_MODE ? 'dev' : 'prod';
    const response = await axios.get(`${SERVER_URL}/api/feed/${offset}/${limit}`, {
      headers: {
        'x-mode': mode,
      }
    });

    return response?.data || {};
  } catch (err) {
    console.log(err);
  }
}