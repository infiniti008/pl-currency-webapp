// import { transportNames, pointsNames, recordModel } from '../models/base';
// import db from '../plugins/firestore';

import axios from 'axios';


const cache = {};
let isCacheCanBeUsed = false;
import CONFIG from '../models/config.js';

const { SERVER_URL, TELEGRAM_USER } = CONFIG;


// Mock cahce to avoid additional readings
// cache.getPointsList = pointsNames;
// cache.getTransportList = transportNames;

export async function getPointsList() {
  const CACHE_KEY = 'getPointsList';

  if(cache[CACHE_KEY]) {
    console.log('CACHE USED FOR: ' + CACHE_KEY);
    return cache[CACHE_KEY];
  }

  // Get list of available points
  const statusRef = doc(db, "status", "points");
  const statusSnap = await getDoc(statusRef);
  const pointsNames = statusSnap.data() || {};

  cache[CACHE_KEY] = pointsNames;
  console.log('pointsNames', JSON.stringify(pointsNames))
  return pointsNames;
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
    
    // return {isStartWithFavorite: true};
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