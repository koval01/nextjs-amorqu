import { cityReplaces } from "@/defined/cityReplaces";
import cyrillicToTranslit from "cyrillic-to-translit-js"

const replaceWordsWithCase = (str: string): string => {
    const isUpperCase = (word: string): boolean => word === word.toUpperCase();
    const isFirstLetterUpperCase = (word: string): boolean => word.charAt(0) === word.charAt(0).toUpperCase();

    const replaceWord = (word: string, replacement: string): string => {
        if (isUpperCase(word)) {
            return replacement.toUpperCase();
        } else if (isFirstLetterUpperCase(word)) {
            return replacement.charAt(0).toUpperCase() + replacement.slice(1).toLowerCase();
        } else {
            return replacement.toLowerCase();
        }
    };

    return str.replace(/\b\w+\b/g, (word: string): string => {
        const lowerCaseWord = word.toLowerCase();
        return cityReplaces[lowerCaseWord] ? replaceWord(word, cityReplaces[lowerCaseWord]) : word;
    });
}

export const translit = (input: string | null | undefined, lang: string | undefined) => {
    return lang === "en" ?
        input :
        cyrillicToTranslit({ preset: lang as "uk" | "ru" })
            .reverse(replaceWordsWithCase(input || ""))
}
