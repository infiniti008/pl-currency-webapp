import axios from 'axios';

import CONFIG from '../models/config.js';

const { SERVER_URL, TELEGRAM_USER } = CONFIG;

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
  try {
    const response = await axios.post(`${SERVER_URL}/api/subscription/${TELEGRAM_USER}`, {
      subscription
    });
    
    return response?.data || {};
  } catch(err) {
    console.log(err);
  }
}

export async function putSubscription(subscription, subscriptionId) {
  try {
    const response = await axios.put(`${SERVER_URL}/api/subscription/${TELEGRAM_USER}/${subscriptionId}`, {
      subscription
    });
    
    return response?.data || {};
  } catch(err) {
    console.log(err);
  }
}

export async function getSubscriptions () {
  try {
    const response = await axios.get(`${SERVER_URL}/api/subscription/${TELEGRAM_USER}`);
    
    return response?.data?.data || {};
  } catch(err) {
    console.log(err);
  }
}

export async function deleteSubscription(subscriptionId) {
  try {
    const response = await axios.delete(`${SERVER_URL}/api/subscription/${TELEGRAM_USER}/${subscriptionId}`);
    
    return response?.data?.data || {};
  } catch(err) {
    console.log(err);
  }
}