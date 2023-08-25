import axios from 'axios';
import CONFIG from '../models/config.js';

const { SERVER_URL, IS_DEV_MODE } = CONFIG;

export function getRows() {
  const rows = []
  const startTime = 480
  const rowsInterval = 5
  const endTime = 1325

  for(let time = startTime; time < endTime; time = time + rowsInterval) {
    let hours = parseInt(time / 60)
    let minutes = time - (hours * 60)

    const timeString = addZero(hours) + ':' + addZero(minutes)

    rows.push({
      index: 'row-' + timeString,
      time: timeString,
      days: [
        {
          index: 'row-' + timeString + '-' + '00',
          dayName: 'mon',
          dayIndex: 0,
          subscriptions: []
        },
        {
          index: 'row-' + timeString + '-' + '01',
          dayName: 'tue',
          dayIndex: 1,
          subscriptions: []
        },
        {
          index: 'row-' + timeString + '-' + '02',
          dayName: 'wen',
          dayIndex: 2,
          subscriptions: []
        },
        {
          index: 'row-' + timeString + '-' + '03',
          dayName: 'thu',
          dayIndex: 3,
          subscriptions: []
        },
        {
          index: 'row-' + timeString + '-' + '04',
          dayName: 'fri',
          dayIndex: 4,
          subscriptions: []
        },
        {
          index: 'row-' + timeString + '-' + '05',
          dayName: 'sut',
          dayIndex: 5,
          subscriptions: []
        },
        {
          index: 'row-' + timeString + '-' + '06',
          dayName: 'sun',
          dayIndex: 6,
          subscriptions: []
        }
      ]
    });
  }
  return rows;
}

export async function getSubscriptions() {
  try {
    const mode = IS_DEV_MODE ? 'dev' : 'prod'
    const response = await axios.get(`${SERVER_URL}/api/subscriptions-all/${mode}`);
    return prepareSubscriptionsResponse(response.data.data)
  } catch (err) {
    console.log(err)
  }
}

export async function getGenerateImage({ subscription, time, selectedDate }) {
  try {
    const mode = IS_DEV_MODE ? 'dev' : 'prod'
    const date = getDateToGenerateImage(time, selectedDate, subscription.country);

    const clonedSubscription = JSON.parse(JSON.stringify(subscription));
    delete clonedSubscription._id;
    clonedSubscription.DATE_TO_GET_NOW = date;
    clonedSubscription.MANAGER_FILE_NAME = new Date().toLocaleString('ru-RU').replace(', ', '-') + '-content-manager'

    const response = await axios.post(`${SERVER_URL}/api/subscription-generate-image/${mode}`, clonedSubscription);
    let filePath = '/files' + response.data.fileName
    if (IS_DEV_MODE) {
      filePath = 'http://localhost:3000' + filePath
    }
    return filePath;
  } catch (err) {
    console.log(err)
  }
}

export async function getAppSettings() {
  try {
    const response = await axios.get(`${SERVER_URL}/api/app/settings`)   
    return response.data;
  } catch (err) {
    console.log(err)
  }
}

export async function getRenderSettings() {
  try {
    const mode = IS_DEV_MODE ? 'dev' : 'prod'

    const response = await axios.get(`${SERVER_URL}/api/render-settings/${mode}`)   
    return response.data.data;
  } catch (err) {
    console.log(err)
  }
}

export async function saveRenderSettings(settings) {
  try {
    const mode = IS_DEV_MODE ? 'dev' : 'prod'

    delete settings._id
    const response = await axios.post(`${SERVER_URL}/api/render-settings/${mode}`, settings)   
    return response.data;
  } catch (err) {
    console.log(err)
    return {status: false};
  }
}

export async function saveSubscription(subscription) {
  try {
    const mode = IS_DEV_MODE ? 'dev' : 'prod'
    const subscriptionId = subscription._id
    const subscriptionToSend = {...subscription}
    delete subscriptionToSend._id

    const response = await axios.patch(`${SERVER_URL}/api/manage-subscription/${mode}/${subscriptionId}`, subscriptionToSend)
    return response.data;
  } catch (err) {
    console.log(err)
    return {status: false};
  }
}

export async function createSubscription(subscription) {
  try {
    const mode = IS_DEV_MODE ? 'dev' : 'prod'
    const subscriptionToSend = {...subscription}
    delete subscriptionToSend._id

    const response = await axios.post(`${SERVER_URL}/api/manage-subscription/${mode}`, subscriptionToSend)
    return response.data;
  } catch (err) {
    console.log(err)
    return {status: false};
  }
}

export async function deleteSubscription(subscription) {
  try {
    const mode = IS_DEV_MODE ? 'dev' : 'prod'
    const subscriptionId = subscription._id
    const platform = subscription.platform

    const response = await axios.delete(`${SERVER_URL}/api/manage-subscription/${mode}/${subscriptionId}/${platform}`, )
    return response.data;
  } catch(err) {
    console.log(err)
    return {status: false}
  }
}

function addZero(number) {
  if (number < 10) {
    return '0' + number; 
  }

  return number.toString();
}

function prepareSubscriptionsResponse(data) {
  const rows = getRows();

  rows.forEach(row => {
    const rowTime = row.time

    row.days.forEach(day => {
      const stories = data.subscriptionsStories.filter(subscription => {
        const fitByTime = subscription.times.includes(rowTime)

        let fitByDay = false
        if (fitByTime) {
          fitByDay = subscription.weekAvailability[day.dayIndex] === '*'
        }
        
        return fitByTime && fitByDay
      })

      if (stories.length > 0) {
        stories.forEach(story => {
          day.subscriptions.push(story);
        })
      }
    })
  })

  return rows;
}

function getDateToGenerateImage(time, selectedDate, country) {
  let timeZone = '+02:00'
  if (country === 'by') {
    timeZone = '+03:00';
  }

  let date = new Date()
  
  date = new Date(date.setSeconds('00'));
  date = new Date(date.setMilliseconds('00'));
  date = new Date(date.setDate(date.getDate() - 1));
  date = date.toISOString();
  date = date.replace(/T...../, 'T' + time);
  date = date.replace(/..........T/, selectedDate + 'T');
  date = date.replace('Z', timeZone);
  return date;
}

export async function getKeyData(data) {
  try {
    const response = await axios.post(`${SERVER_URL}/api/get-key-data`, data)
    if (response?.data?.data?.length) {
      const values = response?.data?.data;

      return values
    }
    return [];
  } catch (err) {
    console.log(err)
    return {status: false};
  }
}