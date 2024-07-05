import { ProfileDetails, Interest } from "@/api";

import { Icon28CompassOutline, Icon28GhostOutline, Icon28ListAddOutline, Icon28MagicHatOutline, Icon28MasksOutline, Icon28WriteOutline } from "@vkontakte/icons";
import { CellButton, Group } from "@vkontakte/vkui";

import Skeleton from "./skeleton";

import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

interface LocalizationProps {
    t: TFunction<"translation", undefined>
}
interface FirstBlockProps extends LocalizationProps {
    profile: ProfileDetails | null;
}
interface SecondBlockProps extends LocalizationProps {
    interests: Interest[] | null;
}
interface MainProps {
    profile: ProfileDetails | null;
    interests: Interest[] | null;
}

const FirstBlock = ({ profile, t }: FirstBlockProps) => (
    <>
        <CellButton
            indicator={profile?.displayName}
            before={<Icon28MasksOutline />}
            onClick={() => { }}
        >
            {t("Display name")}
        </CellButton>
        <CellButton
            indicator={profile?.description}
            before={<Icon28ListAddOutline />}
            onClick={() => { }}
        >
            {t("Bio")}
        </CellButton>
        <CellButton
            indicator={profile?.visible ? `${t("Visible")} 😋` : `${t("Hidden")} 😎`}
            before={<Icon28GhostOutline />}
            onClick={() => { }}
        >
            {t("Visible")}
        </CellButton>
        <CellButton
            indicator={[profile?.country, profile?.city].join(", ")}
            before={<Icon28CompassOutline />}
            onClick={() => { }}
        >
            {t("Location")}
        </CellButton>
        <CellButton
            indicator={profile?.personality}
            before={<Icon28MagicHatOutline />}
            onClick={() => { }}
        >
            {t("Personality")}
        </CellButton>
    </>
)

const SecondBlock = ({ interests, t }: SecondBlockProps) => (
    <>
        <CellButton
            indicator={interests?.length}
            before={<Icon28WriteOutline />}
            onClick={() => { }}
        >
            {t("Interests")}
        </CellButton>
    </>
);

const Main = ({ profile, interests }: MainProps) => {
    const { t } = useTranslation();

    return (
        <Group>
            <Group mode="plain">
                {!profile ? <Skeleton count={5} /> : <FirstBlock profile={profile} t={t} />}
            </Group>
            <Group mode="plain">
                {!interests ? <Skeleton count={1} /> : <SecondBlock interests={interests} t={t} />}
            </Group>
        </Group>
    );
}

export default Main;
