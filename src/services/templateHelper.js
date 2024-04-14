import { DateTime } from 'luxon';

export const toDateFormat = 'yyyy-MM-dd HH:mm:ssZZZ';
export const fromDateFormat = 'HH:mm:ss';

export function getTimestampToGetDiff(timeToGetDiff, dayToGetDiff, now, targetTimeZone) {
  try {
    let targetTime = now;
    if (timeToGetDiff) {
      targetTime = DateTime.fromFormat(`${timeToGetDiff}:00`, 'HH:mm:ss', { zone: targetTimeZone });
    }

    console.log('targetTime-1', targetTime.toFormat(toDateFormat));
    if (dayToGetDiff) {
      targetTime = targetTime.plus({ days: dayToGetDiff });
    }
    console.log('targetTime-2', targetTime.toFormat(toDateFormat));

    if (targetTime >= now) {
      targetTime = targetTime.plus({ days: -1 });
    }

    return targetTime.toMillis();
  } catch(err) {
    console.log(err);
    return new Date().valueOf();
  }
}

export function getTimeMinutes(time) {
  const splitedTime = time.split(':');
  const hours = parseInt(splitedTime[0]);
  const minutes = parseInt(splitedTime[1]);

  return hours * 60 + minutes;
}

export function getTimeZone(country) {
  if (country === 'by') {
    const tz = 'Europe/Minsk';
    return tz;
  }

  const tz = 'Europe/Warsaw';
  return tz;
}

export const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function prepareContentToRender(subscription, now, time) {
  const date = now.toFormat('dd.MM.yyyy');

  const connect = {
    records: [],
    name: subscription.name || getSubscriptionName(subscription.interval),
    color: subscription.color || getSubscriptionColor(subscription.interval),
    time: subscription.now || time,
    date,
    dateTime: now.toFormat('dd.MM.yyyy, HH:mm'),
    chatId: subscription.userId,
    platform: subscription.platform,
    chanel: subscription.chanel,
    previousDateTime: DateTime.fromMillis(subscription.targetTimestampToGetDiff, { zone: getTimeZone(subscription.country) }).toFormat('dd.MM.yyyy, HH:mm'),
    country: subscription.country,
    tag: '#' + subscription.name.replaceAll(' ', '_').replaceAll('|', '').replaceAll('-', ''),
    tags: subscription.tags,
    description: subscription.description,
    doNotPostIfNoChanges: subscription.doNotPostIfNoChanges
  };

  subscription.keys?.forEach(key => {
    try {
      const LAST_VALUE = subscription.lastCurrencies[key]?.value?.toFixed(4);
      const splitedLastValue = LAST_VALUE.split('.');
      const PREVIOUS_VALUE = subscription.diffCurrencies[key]?.value?.toFixed(4) || subscription.lastCurrencies[key]?.value?.toFixed(4);
      const splitedPreviousValue = PREVIOUS_VALUE.split('.');

      let DIFF = (LAST_VALUE - PREVIOUS_VALUE);
      const isDiffGreatNull = DIFF >= 0;
      DIFF = DIFF.toFixed(4);
      DIFF = isDiffGreatNull ? '+' + DIFF : DIFF;
      const DIFF_STYLE = isDiffGreatNull ? 'diff-up' : 'diff-down';
      let delimiterDiff = DIFF.split('').findIndex(item => item !== '0' && item !== '.' && item !== '-' && item !== '+');
      if (delimiterDiff < 0) {
        delimiterDiff = DIFF.length;
      }

      const record = {
        TIME: subscription.now,
        KEY: key,
        BANK: subscription.lastCurrencies[key].bank,
        CURRENCY: subscription.lastCurrencies[key].currency,
        CURRENCY_BASE: subscription.lastCurrencies[key].currencyBase,
        OPERATION: subscription.lastCurrencies[key].operation,
        LAST_VALUE,
        LAST_VALUE_S: `${splitedLastValue[0]}.${splitedLastValue[1][0]}${splitedLastValue[1][1]}`,
        LAST_VALUE_E: `${splitedLastValue[1][2]}${splitedLastValue[1][3]}`,
        PREVIOUS_VALUE,
        PREVIOUS_VALUE_S: `${splitedPreviousValue[0]}.${splitedPreviousValue[1][0]}${splitedPreviousValue[1][1]}`,
        PREVIOUS_VALUE_E: `${splitedPreviousValue[1][2]}${splitedPreviousValue[1][3]}`,
        PREVIOUS_TIME: subscription.diffCurrencies[key].date,
        DIFF,
        DIFF_S: DIFF.slice(0, delimiterDiff),
        DIFF_E: DIFF.slice(delimiterDiff, 7),
        DIFF_STYLE,
        NAME: subscription.lastCurrencies[key].name,
        COLOR: subscription.lastCurrencies[key].bankColor,
        ARROW_CLASS: getArrowClass(subscription.lastCurrencies[key].operation)
      };

      connect.records.push(record);
    } catch (err) {
      console.log('KEY PROCESS ERROR:', key)
      console.log(err);
    }
  });

  return connect;
}

function getSubscriptionColor(interval) {
  switch (interval) {
    case 'every-1-hours':
      return '#A459D1';
    case 'every-2-hours':
      return '#F99B7D';
    case 'every-4-hours':
      return '#088395';
    case 'every-6-hours':
      return '#5C469C';
    case 'every-12-hours':
      return '#19A7CE';
    case 'every-24-hours':
      return '#E55807';
    default:
      return '#088395';
  }
}

function getSubscriptionName(interval) {
  switch (interval) {
    case 'every-4-hours':
      return '4 Hour Updates';
    case 'every-24-hours':
      return '24 Hour Updates';
    default:
      return 'Updates';
  }
}

function getArrowClass(operation) {
  let oClass = 'arrow-center';

  if (operation?.toLowerCase() === 'buy' ) {
    oClass = 'arrow-right';
  } else if (operation?.toLowerCase() === 'sell' ) {
    oClass = 'arrow-left';
  }

  return oClass;
}
