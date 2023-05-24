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

export async function getKeys(configBaseName) {
  const keysCollection = await client.db(configBaseName).collection('keys');
  const keys = await keysCollection.find({}).toArray();
  return keys;
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
    const configBaseName = process.env[country + '_configBaseName'];

    const keyObjects = await getKeys(configBaseName);

    const requestsArray = [];

    keyObjects.forEach(key => {
      requestsArray.push(getLastValue(currencyBaseName, key));
    });

    const lastValues = await Promise.all(requestsArray);
    const user = await getUserInfo(userId);

    const lastWithFavorites = lastValues.map(value => {
      if (user['favorites_' + country]?.some(item => value._id.equals(item))) {
        value.isFavorite = true;
      } else {
        value.isFavorite = false;
      }
      return value;
    });

    return { 
      data: lastWithFavorites,
      settings: {
        isStartWithFavorite: user.settings.isStartWithFavorite
      }
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
    const newUser = await client.db('users').createCollection('u_' + userId);
    await newUser.insertOne({ userId });

    return newUser;
  } catch(err) {
    console.log(err);
  }
}

export async function getSettings(userId) {
  try {
    const user = await getUserInfo(userId);
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
    const user = await client.db('users').collection('u_' + userId);
    const lastMessageTime = user.settings?.lastMessageTime || new Date().valueOf();
    const now = new Date().valueOf();
    // TODO - From config
    const timeLimit = 1000 * 60 * 20;

    if (lastMessageTime - now < timeLimit ) {
      const nextAttemptTime = lastMessageTime + (1000 * 60 * 60 * 24) + 1000 * 100;
      return { message: `Next attempt not earlier than: |${nextAttemptTime}`, status: false };
    } else {
      return { message: 'Your message has been saved!', status: true };
    }
    // user.updateOne({}, {$set: { settings }});
  } catch (err) {
    console.log(err);
  }
}