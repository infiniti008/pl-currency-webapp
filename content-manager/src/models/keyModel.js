export default {
  descriptor: {
    "key": {
      name: "Ключ",
      inputType: "text",
      valueType: "string",
      editable: true,
      isInline: true,
      isRequired: true
    },
    "name": {
      name: "Название",
      inputType: "text",
      valueType: "string",
      editable: true,
      isInline: true,
      isRequired: true
    },
    "country": {
      name: "Страна",
      inputType: "select",
      valueType: "string",
      editable: true,
      optionsVariable: 'countries',
      isInline: true,
      isRequired: true
    },
    "bank": {
      name: "Банк",
      inputType: "text",
      valueType: "string",
      editable: true,
      isInline: true,
      isRequired: true
    },
    "currency": {
      name: "Валюта",
      inputType: "text",
      valueType: "string",
      editable: true,
      isInline: true,
      isRequired: true
    },
    "currencyBase": {
      name: "Базовая валюта",
      inputType: "text",
      valueType: "string",
      editable: true,
      isInline: true,
      isRequired: true
    },
    "operation": {
      name: "Операция",
      inputType: "select",
      valueType: "string",
      editable: true,
      optionsVariable: 'operations',
      isInline: true,
      isRequired: true
    },
    "bankColor": {
      name: "Цвет банка: {COLOR}",
      inputType: "color",
      valueType: "string",
      editable: true,
      isInline: true,
      isRequired: true
    },
    "isDeprecated": {
      name: "Устарело",
      inputType: "checkbox",
      valueType: "boolean",
      editable: true,
      isInline: true,
    }
  },
  model: {
    _id: "",
    key: "",
    name: "",
    country: "",
    bank: "",
    currency: "",
    currencyBase: "",
    operation: "",
    bankColor: "",
    isDeprecated: false
  }
}