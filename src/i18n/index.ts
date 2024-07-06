import { countries } from "./countries";
import { cities } from "./cities";
import { menu } from "./menu";

export const i18nStrings = {
    "en": {
        "translation": {
            "Settings description": "You can always delete all the data you give us by submitting a profile deletion request or through technical support.",
            "Display name subhead": "This is the name that all users will see, we recommend using your own name or an alias for example.",
        }
    },
    "ru": {
        "translation": {
            "Edit": "Редактировать",
            "Visible": "Видимый",
            "This user is verified": "Этот пользователь подтвержден",
            "Hidden": "Невидимка",
            "Personality": "Личность",
            "Interests": "Интересы",
            "Users's image": "Фотография пользователя",
            "Users's gallery": "Галерея пользователя",
            "Recently joined": "Недавно присоединились",
            "people are nearby": "люди рядом",
            "probably": "вероятно",
            "nothing": "ничего",
            "here": "здесь",
            "now": "сейчас",
            "Display name": "Отображаемое имя",
            ...countries["ru"].translation,
            ...cities["ru"].translation,
            ...menu["ru"].translation,
            "Settings description": "Все данные которые вы нам передаете вы всегда можете удалить отправив запрос на удаление профиля или через техническую поддержку.",
            "Display name subhead": "Это имя которое будут видеть все пользователи, рекомендуем использовать собственное имя или к примеру псевдоним.",
        }
    },
    "uk": {
        "translation": {
            "Edit": "Редагувати",
            "Visible": "Видимий",
            "This user is verified": "Цей користувач підтверджений",
            "Hidden": "Невидимка",
            "Personality": "Особистість",
            "Interests": "Інтереси",
            "Users's image": "Фотографія користувача",
            "Users's gallery": "Галерея користувача",
            "Recently joined": "Нещодавно приєдналися",
            "people are nearby": "люди поруч",
            "probably": "ймовірно",
            "nothing": "нічого",
            "here": "тут",
            "now": "зараз",
            "Display name": "Відображуване ім'я",
            ...countries["uk"].translation,
            ...cities["uk"].translation,
            ...menu["uk"].translation,
            "Settings description": "Всі дані які ви нам передаєте ви завжди можете видалити відправивши запит на видалення профілю або через технічну підтримку.",
            "Display name subhead": "Це ім'я, яке бачитимуть усі користувачі, рекомендуємо використовувати власне ім'я або, наприклад, псевдонім.",
        }
    }
}
