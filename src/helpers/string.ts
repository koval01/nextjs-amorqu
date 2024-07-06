export const capitalizeFirstLetter = (input: string): string => {
    return input
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');;
}

export const cleanDisplayName = (input: string): string => {
    const allowedCharacters = /[a-zA-Zа-яА-ЯёЁіїєґІЇЄҐ0-9\s]/g;
    const cleaned = input.match(allowedCharacters)?.join('') || '';
    return capitalizeFirstLetter(cleaned);
}
