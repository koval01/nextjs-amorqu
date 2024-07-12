import cyrillicToTranslit from "cyrillic-to-translit-js"

export const translit = (input: string | null | undefined, lang: string | undefined) => {
    return lang === "en" ? input : cyrillicToTranslit({ preset: lang as "uk" | "ru" }).reverse(input || "")
}
