export default {
  descriptor: {
    "country": {
      name: "Страна (pl | by)",
      inputType: "text",
      valueType: "string",
      editable: true,
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
      inputType: "text",
      valueType: "string",
      editable: false,
    },
    "userId": {
      name: "Айди пользователя (только для бота в телеграме)",
      inputType: "text",
      valueType: "string",
      editable: false,
    },
    "times": {
      name: "Времена для постинга (будет одно время на несколько дней)",
      inputType: "text",
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
      name: "Основной цвет (#123321)",
      inputType: "text",
      valueType: "string",
      editable: true,
    },
    "platform": {
      name: "Платформа для постинга",
      inputType: "text",
      valueType: "string",
      editable: true,
    },
    "chanel": {
      name: "Канал для публикации (только для телеграма)",
      inputType: "text",
      valueType: "string",
      editable: true,
    },
    "timeToGetDiff": {
      name: "Время для получения предыдущих курсов (12:30)",
      inputType: "text",
      valueType: "string",
      editable: true,
    },
    "weekAvailability": {
      name: "Доступность по дням недели",
      inputType: "text",
      valueType: "string",
      editable: true,
    },
    "doNotPostIfNoChanges": {
      name: "Нужно постить если нет никаких изменений?",
      inputType: "checkbox",
      valueType: "boolean",
      editable: true,
    }
  },
  model: {
    "_id": "",
    "country": "",
    "keys": [""],
    "interval": "",
    "time": "",
    "userId": "",
    "times": [""],
    "name": "",
    "color": "",
    "platform": "",
    "chanel": "",
    "timeToGetDiff": "",
    "weekAvailability": "",
    "doNotPostIfNoChanges": false
  }
}