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
      isRequired: false,
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
      isRequired: false,
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
    "timeToGetDiff": {
      name: "Время для получения предыдущих курсов",
      inputType: "time",
      valueType: "string",
      editable: true,
      isInline: true
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
    "tags": {
      name: "Тэги",
      inputType: "text",
      valueType: "string",
      editable: true,
      isRequired: false,
      isInline: true
    },
    "backgroundImagePath": {
      name: "Картинка для фона",
      inputType: "text",
      valueType: "string",
      editable: true,
      isRequired: false,
      isInline: true
    },
    "duration": {
      name: "Продолжительность фрейма",
      inputType: "text",
      valueType: "string",
      editable: true,
      isRequired: false,
      isInline: true
    },
  },
  model: {
    "index": "",
    "country": "",
    "keys": [],
    "time": "09:00",
    "name": "",
    "template": "",
    "color": "#000000",
    "timeToGetDiff": "",
    "tags": "",
    "dayToGetDiff": "",
    "backgroundImagePath": "",
    "duration": 1000
  }
}