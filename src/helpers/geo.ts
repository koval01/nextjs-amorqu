import { ProfileDetails, ProfileNear } from "@/api";

import { TFunction } from "i18next";

const formatLocation = (
    profile: ProfileDetails | ProfileNear,
    t: TFunction<"translation", undefined>
): string => {
    const locArray = [
        t(profile?.city),
        t(profile?.country)
    ]
    if (!locArray.every(item => item !== ""))
        return "";

    return locArray.join(", ")
};

export default formatLocation;
