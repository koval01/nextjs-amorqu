import { ProfileDetails, ProfileNear } from "@/api";

import i18next, { TFunction } from "i18next";
import { translit } from "./translit";

const formatLocation = (
    profile: ProfileDetails | ProfileNear,
    t: TFunction<"translation", undefined>
): string => {
    const locArray = [
        t(profile?.country),
        translit(profile?.city, i18next.language)
    ]
    if (!locArray.every(item => item !== ""))
        return "";

    return locArray.join(", ")
};

export default formatLocation;
