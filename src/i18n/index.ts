import { countries } from "./countries";
import { cities } from "./cities";
import { menu } from "./menu";
import { personalities } from "./personalities";

export const i18nStrings = {
    "en": {
        "translation": {
            ...personalities["en"].translation,
            "Settings description": "You can always delete all the data you give us by submitting a profile deletion request or through technical support.",
            "Display name subhead": "This is the name that all users will see, we recommend using your own name or an alias for example.",
            "Bio subhead": "Tell about yourself, don't be shy",
            "Bio placeholder": "I am a 20-year-old full-stack developer from Germany. I love anime and computer games, and I'm a fan of the bratishkinoff streamer.",
            "Interests subhead": "Enter a list of your interests, they will be used to find people similar to your interests.",
            "Personality subhead": "Specify your personality type, it is also taken into account by the recommendation algorithm.",
        }
    },
    "ru": {
        "translation": {
            ...personalities["ru"].translation,
            ...countries["ru"].translation,
            ...cities["ru"].translation,
            ...menu["ru"].translation,
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
            "Bio": "Биография",
            "Unknown": "Неизвестно",
            "Settings description": "Все данные которые вы нам передаете вы всегда можете удалить отправив запрос на удаление профиля или через техническую поддержку.",
            "Display name subhead": "Это имя которое будут видеть все пользователи, рекомендуем использовать собственное имя или к примеру псевдоним.",
            "Bio subhead": "Расскажите о себе, не стесняйтесь",
            "Bio placeholder": "Я 20-летний full-stack разработчик из Германии. Я люблю аниме и компьютерные игры, а также являюсь поклонником стримера bratishkinoff.",
            "Interests subhead": "Укажите список ваших интересов, они будут использоваться для поиска похожих по вашим интересам людей.",
            "Personality subhead": "Укажите свой тип личности, он также учитывается алгоритмом рекомендаций."
        }
    },
    "uk": {
        "translation": {
            ...personalities["uk"].translation,
            ...countries["uk"].translation,
            ...cities["uk"].translation,
            ...menu["uk"].translation,
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
            "Bio": "Біографія",
            "Unknown": "Невідомо",
            "Settings description": "Всі дані які ви нам передаєте ви завжди можете видалити відправивши запит на видалення профілю або через технічну підтримку.",
            "Display name subhead": "Це ім'я, яке бачитимуть усі користувачі, рекомендуємо використовувати власне ім'я або, наприклад, псевдонім.",
            "Bio subhead": "Розкажіть про себе, не соромтеся",
            "Bio placeholder": "Я 20-річний full-stack розробник з Німеччини. Я люблю аніме та комп'ютерні ігри, а також є фанатом стрімера bratishkinoff.",
            "Interests subhead": "Вкажіть список ваших інтересів, вони будуть використовуватися для пошуку схожих за вашими інтересами людей.",
            "Personality subhead": "Вкажіть свій тип особистості, він також враховується алгоритмом рекомендацій."
        }
    }
}
