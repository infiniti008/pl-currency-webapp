import { MongoClient, ObjectId } from 'mongodb';

let client = null;

async function connect() {
  try {
    client = new MongoClient(process.env.baseUrl);
    await client.connect();
    console.log('Connected to base');
  } catch(error) {
    console.error(error);
  }
}

export async function closeConnection() {
  await client.close();
  console.log('Connection to base closed');
}

export async function initBase() {
  await connect();
}

export async function getKeys(country) {
  try {
    const configBaseName = process.env['configBaseName'];
    const keysCollection = await client.db(configBaseName).collection('keys_' + country);
    const keys = await keysCollection.find({ isDeprecated: { $ne: true} }).toArray();
    return keys;
  } catch(err) {
    console.log(err);
    return [];
  }
}

export async function getAppSettings() {
  try {
    const configBaseName = process.env['configBaseName'];
    let appSettings = await client.db(configBaseName).collection('settings');
    appSettings = await appSettings.find({}).toArray();
    return appSettings?.[0];
  } catch(err) {
    console.log(err);
    return {};
  }
}

export async function getLastValue(baseName, keyObject) {
  try {
    const collection = await client.db(baseName).collection(keyObject.key);
    const val = await collection
      .find()
      .sort({ timestamp: -1 })
      .limit(1)
      .toArray();

    return {
      ...val[0],
      ...keyObject
    };
  } catch (err) {
    console.log(err);
  }
}

export async function getUserInfo(userId) {
  try {
    let user = await client.db('users').collection('u_' + userId);

    if (!user) {
      user = await createUser(userId, country);
    }

    let val = await user.find().toArray();

    if (val.length === 0) {
      user = await createUser(userId);

      val = await user.find().toArray();
    }

    return val[0];
  } catch(err) {
    console.log(err);
  }
}

export async function getLastCurrencies(country, userId) {
  try {
    const currencyBaseName = process.env[country + '_currencyBaseName'];
    const keyObjects = await getKeys(country);

    const requestsArray = [];

    keyObjects.forEach(key => {
      requestsArray.push(getLastValue(currencyBaseName, key));
    });

    const lastValues = await Promise.all(requestsArray);
    const user = await getUserInfo(userId);

    const lastWithFavorites = lastValues.map(value => {
      if (user['favorites_' + country]?.includes(value.key)) {
        value.isFavorite = true;
      } else {
        value.isFavorite = false;
      }
      return value;
    });

    return { 
      data: lastWithFavorites
    };
  } catch (err) {
    console.log(err);
  }
}

export async function updateFavorites (favorites, country, userId) {
  try {
    const user = await client.db('users').collection('u_' + userId);
    user.updateOne({}, {$set: { ['favorites_' + country]: favorites}});
  } catch (err) {
    console.log(err);
  }
}

export async function createUser(userId) {
  try {
    if (userId) {
      const newUser = await client.db('users').createCollection('u_' + userId);
      await newUser.insertOne({ userId, isPremium: false });

      return newUser;
    }

    return {};
  } catch(err) {
    console.log(err);
  }
}

export async function getUserSettings(userId, isExtended) {
  try {
    const user = await getUserInfo(userId);
    if (isExtended && user.settings) {
      user.settings.isPremium = user.isPremium;
    }
    return user.settings || {};
  } catch(err) {
    console.log(err);
  }
}

export async function updateSettings(settings, userId) {
  try {
    const user = await client.db('users').collection('u_' + userId);
    user.updateOne({}, {$set: { settings }});
  } catch (err) {
    console.log(err);
  }
}

export async function saveMessage(message, userId) {
  try {
    const messages = await client.db('currency_app').collection('messages');
    const appSettings = await getAppSettings();

    const query = { userId };
    const options = {
      // sort matched documents in descending order by rating
      sort: { time: -1 },
      // Include only the `title` and `imdb` fields in the returned document
      projection: { time: 1 },
    };
    const unAnsweredMessagesByUser = await messages.find({userId, isAnswered: false}, {}).toArray();
    const userUnAnsweredMessagesQty = unAnsweredMessagesByUser.length;
    const lastMessageByUser = await messages.findOne(query, options);
    const messagesPeriodLimitInHours = appSettings.messagesPeriodLimitInHours;
    const maxUnAnsweredMessages = appSettings.maxUnAnsweredMessages;

    const lastMessageTime = lastMessageByUser?.time || 0 ;
    const now = new Date().valueOf();
    const timeLimit = (1000 * 60 * 60 * messagesPeriodLimitInHours) + (1000 * 100);

    if (userUnAnsweredMessagesQty >= maxUnAnsweredMessages) {
      return { message: `You got limit of ${maxUnAnsweredMessages} unanswered messages!`, status: false };
    } else if (now - lastMessageTime < timeLimit) {
      const nextAttemptTime = lastMessageTime + timeLimit;
      return { message: `Next attempt not earlier than: |${nextAttemptTime}`, status: false };
    } else {
      const result = await messages.insertOne({
        message,
        time: now,
        timeString: new Date(now).toLocaleString(),
        userId,
        answer: '',
        answerTime: null,
        isAnswered: false
      });

      if (result.insertedId) {
        return { message: 'Your message has been saved!', status: true };
      } else {
        return { message: `Please try again later`, status: false };
      }
    }
  } catch (err) {
    console.log(err);
    return { message: `Please try again later`, status: false };
  }
}

export async function getSubscriptionSettings() {
  try {
    const appSettings = await getAppSettings();

    const getKeysArr = [];
    appSettings.countries.forEach(country => getKeysArr.push(getKeys(country)));

    const allKeys = (await Promise.all(getKeysArr)).reduce((acc, keysRespons) => {
      return [...acc, ...keysRespons];
    }, []);

    return {
      keys: allKeys
    };
  } catch (err) {
    console.log(err);
  }
}

export async function saveSubscription(subscription) {
  try {
    if (subscription.userId.includes('@')) {
      return { message: 'Wrong Chat ID. Please try again later', status: false };
    }
    const subscriptions = await client.db('currency_app').collection('subscriptions-users');
    const appSettings = await getAppSettings();
    const userInfo = await getUserInfo(subscription.userId);

    const isFreeUser = !userInfo.isPremium ?? true;
    const isInervalPremium = !appSettings.freeIntervals.includes(subscription.interval);
    const isTimesLimitGot = subscription.times.length > 6;

    if (isFreeUser && isInervalPremium) {
      return { message: 'Wrong intervals. Please try again later', status: false };
    }

    if (isFreeUser && isTimesLimitGot) {
      return { message: 'Wrong times. Please try again later', status: false };
    }

    const query = { userId: subscription.userId };
    const options = {
      // sort matched documents in descending order by rating
      sort: { time: -1 },
      // Include only the `title` and `imdb` fields in the returned document
      projection: { time: 1 },
    };
    const subscriotionsByUser = await subscriptions.count(query, options);
    const maxFreeSubscriptions = appSettings.maxFreeSubscriptions;
    const isLimitSubscriptionsGot = subscriotionsByUser >= maxFreeSubscriptions;
    
    if (isFreeUser && isLimitSubscriptionsGot) {
      return { message: 'You have reached your subscription limit', status: false };
    }

    const limitFreeKeysInOneSubscription = appSettings.limitFreeKeysInOneSubscription;
    const isLimitfreeKeysGot = subscription.keys.length > limitFreeKeysInOneSubscription;

    if (isFreeUser && isLimitfreeKeysGot) {
      return { message: 'You have reached your keys per one subscription limit', status: false };
    }

    const result = await subscriptions.insertOne(subscription);

    if (result.acknowledged) {
      return { message: 'Your subscription has been saved!', status: true };
    } else {
      return { message: 'Fault to save subscription. Please try again later', status: false };
    }
  } catch(err) {
    console.log(err);
    return { message: 'Server Error. Please try again later', status: false };
  }
}

export async function getSubscriptions(userId) {
  try {
    const subscriptions = await client.db('currency_app').collection('subscriptions-users');
    const subscriptionsByUser = await subscriptions.find({ userId }, {}).toArray();
    const subscriptionSettings = await getSubscriptionSettings();
    return {
      subscriptions: subscriptionsByUser,
      settings: subscriptionSettings
    };
  } catch(err) {
    console.log(err);
    return { subscriptions: [] };
  }
}

export async function deleteSubscriptions(userId, subscriptionId) {
  try {
    const subscriptions = await client.db('currency_app').collection('subscriptions-users');
    const thisSubscription = await subscriptions.findOne({ _id: new ObjectId(subscriptionId) });
    let result = {};

    if (thisSubscription && thisSubscription.userId === userId) {
      result = await subscriptions.deleteOne({ _id: new ObjectId(subscriptionId) });
    }

    if (result.acknowledged) {
      return { message: 'Subscription has been successfully deleted', status: true };
    }

    return { message: 'Please try again later', status: false };
  } catch(err) {
    console.log(err);
    return { message: 'Please try again later', status: false };
  }
}

export async function updateSubscription(subscription, subscriptionId, userId) {
  try {
    const subscriptions = await client.db('currency_app').collection('subscriptions-users');
    const thisSubscription = await subscriptions.findOne({ _id: new ObjectId(subscriptionId) });
    let result = {};

    if (thisSubscription && thisSubscription.userId === userId) {
      result = await subscriptions.replaceOne({ _id: new ObjectId(subscriptionId) }, subscription);
    }

    if (result.acknowledged) {
      return { message: 'Subscription has been successfully updated', status: true };
    }

    return { message: 'Please try again later', status: false };
  } catch(err) {
    console.log(err);
    return { message: 'Please try again later', status: false };
  }
}

export async function getStatistic() {
  try {
    const users = await client.db('users');
    const usersStats = await users.stats();
    const usersCount = usersStats.collections

    const subscriptionsCount = await client.db('currency_app').collection('subscriptions-users').count();

    return {
      usersCount,
      subscriptionsCount
    };
  } catch (err) {
    console.log(err);
  }
}

export async function addKofiResponse(kofiData) {
  try {
    const dataCollection = await client.db('currency_app').collection('kofi-donations');
    const result = await dataCollection.insertOne(kofiData);

  } catch(err) {
    console.log(err);
  }
}

export async function getAllSubscriptions(mode) {
  const baseName = mode === 'dev' ? 'currency_app_test' : 'currency_app'
  try {
    const subscriptionsStoriesCollection = await client.db(baseName).collection('subscriptions-stories');
    const subscriptionsStories = await subscriptionsStoriesCollection.find({}).toArray();

    const subscriptionsVideoCollection = await client.db(baseName).collection('subscriptions-video');
    const subscriptionsVideo = await subscriptionsVideoCollection.find({}).toArray();

    return {
      subscriptionsStories,
      subscriptionsVideo
    };
  } catch(err) {
    console.log(err);
  }
}

export async function addToContentManager(mode, data) {
  const baseName = mode === 'dev' ? 'currency_app_test' : 'currency_app'
  try {
    const managerCollection = await client.db(baseName).collection('content-manager');
    const result = await managerCollection.insertOne(data);

    return true;
  } catch(err) {
    console.log(err);
    return false;
  }
}

export async function getRenderSettings(mode) {
  const baseName = mode === 'dev' ? 'currency_app_test' : 'config_app';
  const collectionName = 'render_settings';
  try {
    const managerCollection = await client.db(baseName).collection(collectionName);
    const result = await managerCollection.findOne();

    return result;
  } catch(err) {
    console.log(err);
    return false;
  }
}

export async function setRenderSettings(mode, settings) {
  const baseName = mode === 'dev' ? 'currency_app_test' : 'config_app';
  const collectionName = 'render_settings';
  try {
    const managerCollection = await client.db(baseName).collection(collectionName);
    const result = await managerCollection.updateOne({}, {$set: settings});

    return true;
  } catch(err) {
    console.log(err);
    return false;
  }
}

export async function updateSubscriptionFromManager(mode, subscriptionId, subscription) {
  try {
    const baseName = mode === 'dev' ? 'currency_app_test' : 'config_app';
    const collectionName = subscription.platform;

    const collection = await client.db(baseName).collection(collectionName);
    collection.updateOne({ _id: new ObjectId(subscriptionId) }, {$set: subscription });
    return true;
  } catch(err) {
    console.log(err)
    return false;
  }
}

export async function createSubscriptionFromManager(mode, subscription) {
  try {
    const baseName = mode === 'dev' ? 'currency_app_test' : 'config_app';
    const collectionName = subscription.platform;

    const collection = await client.db(baseName).collection(collectionName);
    collection.insertOne(subscription);
    return true;
  } catch(err) {
    console.log(err)
    return false;
  }
}

export async function deleteSubscriptionFromManager(mode, subscriptionId, platform) {
  try {
    const baseName = mode === 'dev' ? 'currency_app_test' : 'config_app';
    const collectionName = platform;

    const collection = await client.db(baseName).collection(collectionName);
    collection.deleteOne({ _id: new ObjectId(subscriptionId) });
    return true;
  } catch(err) {
    console.log(err)
    return false;
  }
}


export async function getKeyData(data) {
  try {
    const baseName = 'currency_' + data.country;
    const collectionName = data.key;

    const collection = await client.db(baseName).collection(collectionName);
    const values = await collection.find({ timestamp: { $gt: data.startTimeStamp, $lt: data.endTimeStamp} }).toArray()

    return values;
  } catch(err) {
    console.log(err)
    return false;
  }
}

export async function setChartView(mode, chartsView) {
  try {
    const baseName = mode === 'dev' ? 'currency_app_test' : 'currency_app';
    const collectionName = 'chart-views';

    const collection = await client.db(baseName).collection(collectionName);
    const filter = { chartsViewName: { $eq: chartsView.chartsViewName } };
    
    await collection.deleteOne(filter)

    const result = await collection.insertOne(chartsView)

    return true;
  } catch(err) {
    console.log(err)
    return false;
  }
}

export async function getChartView(mode, name) {
  try {
    const baseName = mode === 'dev' ? 'currency_app_test' : 'currency_app';
    const collectionName = 'chart-views';

    const collection = await client.db(baseName).collection(collectionName);
    if (name === 'all') {
      const result = await collection.find({}, { projection: { chartsViewName: 1, _id: 0 } }).toArray()

      return result;
    } else {
      const filter = { chartsViewName: { $eq: name } };
      const result = await collection.findOne(filter)

      return result;
    }
  } catch(err) {
    console.log(err)
    return false;
  }
}

export async function removeChartView(mode, chartsViewName) {
  try {
    const baseName = mode === 'dev' ? 'currency_app_test' : 'currency_app';
    const collectionName = 'chart-views';

    const collection = await client.db(baseName).collection(collectionName);
    const filter = { chartsViewName: { $eq: chartsViewName } };
    
    await collection.deleteOne(filter)

    return true;
  } catch(err) {
    console.log(err)
    return false;
  }
}

removeChartView