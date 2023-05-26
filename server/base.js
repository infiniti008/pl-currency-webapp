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
    const messages = await client.db('currency_app').collection('messages');

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
    const messagesPeriodLimitInHours = process.env.messagesPeriodLimitInHours;
    const maxUnAnsweredMessages = process.env.maxUnAnsweredMessages;

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