import { MongoClient } from 'mongodb';

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
      ...keyObject,
      ...val[0]
    };
  } catch (err) {
    console.log(err);
  }
}

export async function initBase() {
  await connect();
}

export async function getLastCurrencies(country) {
  try {
    const currencyBaseName = process.env[country + '_currencyBaseName'];
    const configBaseName = process.env[country + '_configBaseName'];

    const keyObjects = await getKeys(configBaseName);

    const requestsArray = [];

    keyObjects.forEach(key => {
      requestsArray.push(getLastValue(currencyBaseName, key));
    });

    const lastValues = await Promise.all(requestsArray);

    return lastValues;
  } catch (err) {
    console.log(err);
  }
}