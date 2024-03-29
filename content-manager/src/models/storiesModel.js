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
      name: "Базовое время (ни на что не влияет)",
      inputType: "time",
      valueType: "string",
      editable: false,
      isInline: true
    },
    "userId": {
      name: "Айди пользователя (только для бота в телеграме)",
      inputType: "text",
      valueType: "string",
      editable: false,
    },
    "times": {
      name: "Времена для постинга",
      inputType: "times",
      valueType: "string[]",
      editable: true,
      isRequired: true
    },
    "name": {
      name: "Название (Заголовок)",
      inputType: "text",
      valueType: "string",
      editable: true,
      isRequired: true
    },
    "template": {
      name: "Темплейт",
      inputType: "select",
      valueType: "string",
      optionsVariable: 'templates',
      editable: true,
      isRequired: true,
      isInline: true,
      enabledIf: 'object.shouldUseRenderV2 === true'
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
      name: "Канал для публикации (только для телеграма)",
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
    "shouldUseRenderV2": {
      name: "Нужно ли использовать новый рендер?",
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
    }
  },
  model: {
    "_id": "",
    "country": "",
    "keys": [],
    "interval": "",
    "time": "",
    "userId": "",
    "times": [],
    "name": "",
    "template": "",
    "color": "#000000",
    "platform": "",
    "chanel": "",
    "timeToGetDiff": "",
    "weekAvailability": "*******",
    "doNotPostIfNoChanges": false,
    "shouldUseRenderV2": false,
    "dayToGetDiff": ""
  }
}