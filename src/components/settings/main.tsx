import { useState } from "react";

import { ProfileDetails, Interest, UpdateProfileProps } from "@/api";

import { Icon28CompassOutline, Icon28GhostOutline, Icon28ListAddOutline, Icon28MagicHatOutline, Icon28MasksOutline, Icon28WriteOutline, Icon36ChevronRightOutline } from "@vkontakte/icons";
import { CellButton, SimpleCell, Group, Switch } from "@vkontakte/vkui";

import Skeleton from "./skeleton";

import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

interface LocalizationProps {
    t: TFunction<"translation", undefined>
}
interface OnUpdateProfileProps {
    onUpdateProfileData: (profile: Partial<UpdateProfileProps>) => Promise<void>;
}
interface FirstBlockProps extends LocalizationProps, OnUpdateProfileProps {
    profile: ProfileDetails | null;
}
interface SecondBlockProps extends LocalizationProps {
    interests: Interest[] | null;
}
interface MainProps extends OnUpdateProfileProps {
    profile: ProfileDetails | null;
    interests: Interest[] | null;
}

const FirstBlock = ({ profile, t, onUpdateProfileData }: FirstBlockProps) => {
    const [wait, setWait] = useState<boolean>(false);

    const onUpdate = async (e: any) => {
        setWait(true);
        await onUpdateProfileData({ visible: e.target.checked });
        setWait(false);
    }

    return (
        <>
            <CellButton
                indicator={profile?.displayName}
                before={<Icon28MasksOutline />}
                after={<Icon36ChevronRightOutline />}
                onClick={() => { }}
            >
                {t("Display name")}
            </CellButton>
            <CellButton
                indicator={profile?.description}
                before={<Icon28ListAddOutline />}
                after={<Icon36ChevronRightOutline />}
                onClick={() => { }}
            >
                {t("Bio")}
            </CellButton>
            <SimpleCell
                indicator={profile?.visible ? `${t("Visible")} 😋` : `${t("Hidden")} 😎`}
                before={<Icon28GhostOutline />}
                after={<Switch defaultChecked={profile?.visible} onChange={(e: any) => onUpdate(e)} disabled={wait} />}
            >
                {t("Visible")}
            </SimpleCell>
            <CellButton
                indicator={[profile?.country, profile?.city].join(", ")}
                before={<Icon28CompassOutline />}
                after={<Icon36ChevronRightOutline />}
                onClick={() => { }}
            >
                {t("Location")}
            </CellButton>
            <CellButton
                indicator={profile?.personality}
                before={<Icon28MagicHatOutline />}
                after={<Icon36ChevronRightOutline />}
                onClick={() => { }}
            >
                {t("Personality")}
            </CellButton>
        </>
    )
}

const SecondBlock = ({ interests, t }: SecondBlockProps) => (
    <>
        <CellButton
            indicator={interests?.length}
            before={<Icon28WriteOutline />}
            after={<Icon36ChevronRightOutline />}
            onClick={() => { }}
        >
            {t("Interests")}
        </CellButton>
    </>
);

const Main = ({ profile, interests, onUpdateProfileData }: MainProps) => {
    const { t } = useTranslation();

    return (
        <Group>
            <Group mode="plain">
                {!profile ? <Skeleton count={5} /> : <FirstBlock profile={profile} t={t} onUpdateProfileData={onUpdateProfileData} />}
            </Group>
            <Group mode="plain">
                {!interests ? <Skeleton count={1} /> : <SecondBlock interests={interests} t={t} />}
            </Group>
        </Group>
    );
}

export default Main;
