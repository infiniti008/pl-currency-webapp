export default {
  descriptor: {
    "platform": {
      name: "Платформа для постинга",
      inputType: "select",
      valueType: "string",
      editable: true,
      optionsVariable: 'platforms',
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
    "weekAvailability": {
      name: "Доступность по дням недели",
      inputType: "week",
      valueType: "string",
      editable: true
    },
    "shouldPostToFeed": {
      name: "Нужно постить в Feed?",
      inputType: "checkbox",
      valueType: "boolean",
      editable: true,
      isInline: true
    },
    "frames": [],
    "titleTags_youtube": {
      name: "Тэги в заголовке для YouTube",
      inputType: "text",
      valueType: "string",
      editable: true,
      isRequired: false,
      isInline: true
    },
    "titleTags_instagram": {
      name: "Тэги в заголовке для Instagram",
      inputType: "text",
      valueType: "string",
      editable: true,
      isRequired: false,
      isInline: true
    },
    "titleTags_tiktok": {
      name: "Тэги в заголовке для TikTok",
      inputType: "text",
      valueType: "string",
      editable: true,
      isRequired: false,
      isInline: true
    },
    "titleTextTemplate": {
      name: "Темплейт заголовка",
      inputType: "text",
      valueType: "string",
      editable: true,
      isRequired: true,
      isInline: true
    },
    "tags": {
      name: "Тэги",
      inputType: "text",
      valueType: "string",
      editable: true,
      isRequired: true,
      isInline: true
    },
    "description": {
      name: "Описание",
      inputType: "textArea",
      valueType: "string[]",
      arraySplitSeparator: "\n",
      editable: true,
      isRequired: true,
    },
    "shouldPostYoutube": {
      name: "Нужно постить в Youtube?",
      inputType: "checkbox",
      valueType: "boolean",
      editable: true,
      isInline: true
    },
    "shouldPostInstagram": {
      name: "Нужно постить в Instagram?",
      inputType: "checkbox",
      valueType: "boolean",
      editable: true,
      isInline: true
    },
    "shouldPostTiktok": {
      name: "Нужно постить в TikTok?",
      inputType: "checkbox",
      valueType: "boolean",
      editable: true,
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
    "width": {
      name: "Ширина Фрейма",
      inputType: "text",
      valueType: "string",
      editable: true,
      isRequired: true,
      isInline: true
    },
    "height": {
      name: "Высота Фрейма",
      inputType: "text",
      valueType: "string",
      editable: true,
      isRequired: true,
      isInline: true
    },
    "pathToAudio": {
      name: "Путь к аудио файлу",
      inputType: "text",
      valueType: "string",
      editable: true,
      isRequired: false,
      isInline: true
    },
  },
  model: {
    "_id": "",
    "platform": "subscriptions-video",
    "country": "",
    "titleTextTemplate": "",
    "time": "09:00",
    "template": "SubscriptionsVideoGeneralV1",
    "weekAvailability": "*******",
    "shouldPostToFeed": true,
    "shouldPostYoutube": true,
    "shouldPostInstagram": true,
    "shouldPostTiktok": true,
    "frames": [],
    "titleTags_youtube": "#shorts",
    "titleTags_instagram": "#reels",
    "titleTags_tiktok": "#tiktok",
    "tags": "",
    "description": [],
    "width": "1080",
    "height": "1920",
    "pathToAudio": "",
  }
}