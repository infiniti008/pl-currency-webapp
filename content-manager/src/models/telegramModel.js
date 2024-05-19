export default {
  descriptor: {
    "country": {
      name: "Страна",
      inputType: "select",
      valueType: "string",
      editable: true,
      optionsVariable: 'countries',
      isInline: true,
      isRequired: true
    },
    "keys": {
      name: "Ключи",
      inputType: "keys",
      valueType: "string[]",
      editable: true,
      isRequired: true,
      enabledIf: 'object.country'
    },
    "interval": {
      name: "Интервал паблишенга (для создания времен паблишенга в WebApp)",
      inputType: "text",
      valueType: "string",
      editable: false,
    },
    "time": {
      name: "Время публикации (кратно 5 минутам)",
      inputType: "time",
      valueType: "string",
      editable: true,
      isInline: true
    },
    "name": {
      name: "Название (Заголовок)",
      inputType: "text",
      valueType: "string",
      editable: true,
      isRequired: true,
      isInline: true
    },
    "template": {
      name: "Темплейт",
      inputType: "select",
      valueType: "string",
      optionsVariable: 'templates',
      editable: true,
      isRequired: true,
      isInline: true
    },
    "color": {
      name: "Основной цвет: {COLOR}",
      inputType: "color",
      valueType: "string",
      editable: true,
      isInline: true
    },
    "platform": {
      name: "Платформа для постинга",
      inputType: "select",
      valueType: "string",
      editable: true,
      optionsVariable: 'platforms',
      isInline: true,
      isRequired: true
    },
    "chanel": {
      name: "Канал для публикации",
      inputType: "select",
      valueType: "string",
      editable: true,
      optionsVariable: 'chanels',
      isInline: true,
      enabledIf: 'object.platform === "subscriptions-telegram"'
    },
    "timeToGetDiff": {
      name: "Время для получения предыдущих курсов",
      inputType: "time",
      valueType: "string",
      editable: true,
      isInline: true
    },
    "weekAvailability": {
      name: "Доступность по дням недели",
      inputType: "week",
      valueType: "string",
      editable: true
    },
    "doNotPostIfNoChanges": {
      name: "Нужно постить если нет никаких изменений?",
      inputType: "checkbox",
      valueType: "boolean",
      editable: true,
      isInline: true
    },
    "dayToGetDiff": {
      name: "Сколько дней назад брать разницу",
      inputType: "text",
      valueType: "number",
      editable: true,
      isRequired: false,
      isInline: true
    },
    "shouldPostToFeed": {
      name: "Нужно постить в ленту?",
      inputType: "checkbox",
      valueType: "boolean",
      editable: true,
      isInline: true
    },
    "caption": {
      name: "Подпись",
      inputType: "text",
      valueType: "string",
      editable: true,
      isRequired: true
    },
    "delay": {
      name: "Delay to take snapshot (min 4000)",
      inputType: "text",
      valueType: "string",
      editable: true,
      isRequired: false
    },
    "url": {
      name: "URL to iFrame",
      inputType: "text",
      valueType: "string",
      editable: true,
      isRequired: false
    },
    "imageWidth": {
      name: "Image Width",
      inputType: "text",
      valueType: "string",
      editable: true,
      isRequired: false
    },
    "imageHeight": {
      name: "Image Height",
      inputType: "text",
      valueType: "string",
      editable: true,
      isRequired: false
    },
  },
  model: {
    "_id": "",
    "platform": "subscriptions-telegram",
    "country": "",
    "keys": [],
    "time": "",
    "name": "",
    "template": "",
    "color": "#000000",
    "chanel": "",
    "timeToGetDiff": "",
    "weekAvailability": "*******",
    "doNotPostIfNoChanges": false,
    "dayToGetDiff": "",
    "shouldPostToFeed": false,
    "caption": "",
    "delay": "0",
    "url": "",
    "imageWidth": "0",
    "imageHeight": "0",
  }
}