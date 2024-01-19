export default {
  descriptor: {
    "pl_daily_changes_videoTitleFilePath": {
      name: "Путь к титульной картинке: Итоги Дня в Польше",
      inputType: "text",
      valueType: "string",
      editable: true,
    },
    "by_daily_changes_videoTitleFilePath": {
      name: "Путь к титульной картинке: Итоги Дня в Беларуси",
      inputType: "text",
      valueType: "string",
      editable: true,
    },
    "pl_weekly_changes_videoTitleFilePath": {
      name: "Путь к титульной картинке: Итоги Недели в Польше",
      inputType: "text",
      valueType: "string",
      editable: true,
    },
    "by_weekly_changes_videoTitleFilePath": {
      name: "Путь к титульной картинке: Итоги Недели в Беларуси",
      inputType: "text",
      valueType: "string",
      editable: true,
    },
    "telegram_user_render_template": {
      name: "Темплейт для рендеринга для юзеров в ТГ",
      inputType: "text",
      valueType: "string",
      editable: true,
    },
    "video_shouldRender": {
      name: "Видео: Нужно генерировать?",
      inputType: "checkbox",
      valueType: "boolean",
      editable: true,
    },
    "video_shouldSend_instagram": {
      name: "Видео: Нужно отправлять в Инстаграм?",
      inputType: "checkbox",
      valueType: "boolean",
      editable: true,
    },
    "video_shouldSend_tiktok": {
      name: "Видео: Нужно отправлять в Тик Ток?",
      inputType: "checkbox",
      valueType: "boolean",
      editable: true,
    },
    "video_shouldSend_youtube": {
      name: "Видео: Нужно отправлять в Ютуб?",
      inputType: "checkbox",
      valueType: "boolean",
      editable: true,
    },
    "video_titleDuration": {
      name: "Видео: Продолжительность титульной картинки (с)",
      inputType: "text",
      valueType: "number",
      editable: true,
    },
    "image_shouldRender": {
      name: "Изображение: Нужно генерировать?",
      inputType: "checkbox",
      valueType: "boolean",
      editable: true,
    },
    "image_shouldSend_telegram": {
      name: "Изображение: Нужно отправлять в Телеграм?",
      inputType: "checkbox",
      valueType: "boolean",
      editable: true,
    },
    "image_shouldSend_stories": {
      name: "Изображение: Нужно отправлять в Сторис?",
      inputType: "checkbox",
      valueType: "boolean",
      editable: true,
    },
    "skipFilterByDay": {
      name: "Пропустить фильтр по доступности в течении недели?",
      inputType: "checkbox",
      valueType: "boolean",
      editable: true,
    },
    "templates": {
      name: "Темплейты (separeted by ',')",
      inputType: "text",
      valueType: "string[]",
      editable: true,
    },
    "cookies_tiktok_pl": {
      name: "",
      inputType: "checkbox",
      editable: false,
    },
    "cookies_tiktok_by": {
      name: "",
      inputType: "checkbox",
      editable: false,
    }
  },
  model :{
    "_id": "",
    "pl_daily_changes_videoTitleFilePath": "",
    "by_daily_changes_videoTitleFilePath": "",
    "pl_weekly_changes_videoTitleFilePath": "",
    "by_weekly_changes_videoTitleFilePath": "",
    "telegram_user_render_template": "",
    "video_shouldRender": false,
    "video_shouldSend_instagram": false,
    "video_shouldSend_tiktok": false,
    "video_shouldSend_youtube": false,
    "video_titleDuration": 0.5,
    "image_shouldRender": false,
    "image_shouldSend_telegram": false,
    "image_shouldSend_stories": false,
    "skipFilterByDay": false,
    "templates": [],
    "cookies_tiktok_pl": [],
    "cookies_tiktok_by": []
  }
}