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
    "time": {
      name: "Время публикации (кратно 5 минутам)",
      inputType: "time",
      valueType: "string",
      editable: true,
      isInline: true,
      isRequired: true
    },
    "name": {
      name: "Название (Заголовок)",
      inputType: "text",
      valueType: "string",
      editable: true,
      isRequired: true,
      isInline: true,
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
    }
  },
  model: {
    "_id": "",
    "platform": "subscriptions-stories",
    "country": "",
    "keys": [],
    "time": "09:00",
    "userId": "",
    "name": "",
    "template": "",
    "color": "#000000",
    "timeToGetDiff": "",
    "weekAvailability": "*******",
    "doNotPostIfNoChanges": false,
    "dayToGetDiff": "",
    "shouldPostToFeed": true,
  }
}