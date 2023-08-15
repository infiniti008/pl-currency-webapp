export default {
  descriptor: {
    "country": {
      name: "Страна",
      inputType: "select",
      valueType: "string",
      editable: true,
      optionsVariable: 'countries',
      isInline: true
    },
    "keys": {
      name: "Ключи",
      inputType: "text",
      valueType: "string[]",
      editable: true,
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
    },
    "name": {
      name: "Название (Заголовок)",
      inputType: "text",
      valueType: "string",
      editable: true,
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
    },
    "chanel": {
      name: "Канал для публикации (только для телеграма)",
      inputType: "select",
      valueType: "string",
      editable: true,
      optionsVariable: 'chanels',
      isInline: true,
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
      editable: true,
    },
    "doNotPostIfNoChanges": {
      name: "Нужно постить если нет никаких изменений?",
      inputType: "checkbox",
      valueType: "boolean",
      editable: true,
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
    "color": "#000000",
    "platform": "",
    "chanel": "",
    "timeToGetDiff": "",
    "weekAvailability": "*******",
    "doNotPostIfNoChanges": false
  }
}