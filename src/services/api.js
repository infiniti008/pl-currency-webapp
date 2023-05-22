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

    return lastCurrencies;
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

export async function getActiveSubscriptions(id) {
  const CACHE_KEY = 'getActiveSubscriptions';

  if (isCacheCanBeUsed) {
    console.log('CACHE USED FOR: ' + CACHE_KEY);
    return cache[CACHE_KEY];
  }

  const pointsNames = await getPointsList();

  let records = [];

  // ForEach per points
  for(const point in pointsNames) {
    const querySnapshot = await getDocs(collection(db, point));

    // Get data for each point
    for(let i = 0; i < querySnapshot.docs.length; i++) {
      const doc = querySnapshot.docs[i];
      const date = doc.id;
      const data = doc.data();

      // Get chat Ids
      for(const chatId in data) {
        if(chatId == id) {
          const newRecord = {
            point,
            date,
            pointName: pointsNames[point],
            recorId: point + '-' + date
          };
          records.push(Object.assign({}, recordModel, newRecord));
        }
      };
    };
  };

  cache[CACHE_KEY] = records;
  isCacheCanBeUsed = true;

  try {
    const userInfo = await getUserInfo();
    if (!userInfo.id) {
      await setUserInfo();
    }
  } catch (error) {
    console.log(error);
  }

  return records;
}

async function setUserInfo() {
  const IS_DEV_MODE = window.location.search.indexOf('isDevMode=true') !== -1;
  const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || '';
  let TELEGRAM_USER = '';

  if (userId) {
    TELEGRAM_USER = userId.toString();
  }

  if (IS_DEV_MODE) {
    TELEGRAM_USER='208067133';
  }

  const userInfoRef = doc(db, 'users', TELEGRAM_USER);

  try {
    await setDoc(
      userInfoRef, 
      window.Telegram?.WebApp?.initDataUnsafe?.user || {}
    );
  } catch (error) {
    console.log(error);
  }
}

async function getUserInfo() {
  const CACHE_KEY = 'getUserInfo';

  if (cache[CACHE_KEY]) {
    console.log('CACHE USED FOR: ' + CACHE_KEY);
    return cache[CACHE_KEY];
  }

  const IS_DEV_MODE = window.location.search.indexOf('isDevMode=true') !== -1;
  const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || '';
  let TELEGRAM_USER = '';

  if (userId) {
    TELEGRAM_USER = userId.toString();
  }

  if (IS_DEV_MODE) {
    TELEGRAM_USER='208067133';
  }

  let userInfo = {};

  try {
    const userInfoRef = doc(db, "users", TELEGRAM_USER);
    const userInfoSnap = await getDoc(userInfoRef);
    userInfo = userInfoSnap.data() || {};
    cache[CACHE_KEY] = userInfo;
  } catch (error) {
    console.error(error);
  }
  
  return userInfo;
}