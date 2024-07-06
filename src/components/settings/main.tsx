import { Dispatch, SetStateAction, useState } from "react";

import { ProfileDetails, Interest, UpdateProfileProps } from "@/api";

import { 
    Icon28CompassOutline, 
    Icon28GhostOutline, 
    Icon28ListAddOutline,
    Icon28MagicHatOutline, 
    Icon28MasksOutline, 
    Icon28WriteOutline, 
    Icon36ChevronRightOutline 
} from "@vkontakte/icons";
import { CellButton, SimpleCell, Group, EllipsisText } from "@vkontakte/vkui";

import Skeleton from "./skeleton";

import { VisibilitySwitch } from "./switchs";
import { ModalBio, ModalDisplayName } from "./modals";

import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

interface LocalizationProps {
    t: TFunction<"translation", undefined>
}
interface OnUpdateProfileProps {
    onUpdateProfileData: (profile: Partial<UpdateProfileProps>) => Promise<boolean | undefined>;
}
interface SetPopoutProps {
    setPopout: Dispatch<SetStateAction<JSX.Element | null>>;
}
interface FirstBlockProps extends LocalizationProps, OnUpdateProfileProps, SetPopoutProps {
    profile: ProfileDetails | null;
}
interface SecondBlockProps extends LocalizationProps, SetPopoutProps {
    interests: Interest[] | null;
}
interface MainProps extends OnUpdateProfileProps {
    profile: ProfileDetails | null;
    interests: Interest[] | null;
}

const FirstBlock = ({ profile, t, onUpdateProfileData, setPopout }: FirstBlockProps) => {
    const onUpdateProfile = async (profile: Partial<UpdateProfileProps>, setWait: Dispatch<SetStateAction<boolean>>) => {
        setWait(true);
        const r = await onUpdateProfileData(profile);
        setWait(false);
        return r;
    }

    return (
        <>
            <CellButton
                indicator={<EllipsisText className="max-w-52">{profile?.displayName}</EllipsisText>}
                before={<Icon28MasksOutline />}
                after={<Icon36ChevronRightOutline />}
                onClick={() => setPopout(
                    <ModalDisplayName
                        profile={profile}
                        setPopout={setPopout}
                        onUpdate={onUpdateProfile} />
                )}
            >
                {t("Display name")}
            </CellButton>
            <CellButton
                indicator={<EllipsisText className="max-w-52">{profile?.description}</EllipsisText>}
                before={<Icon28ListAddOutline />}
                after={<Icon36ChevronRightOutline />}
                onClick={() => setPopout(
                    <ModalBio
                        profile={profile}
                        setPopout={setPopout}
                        onUpdate={onUpdateProfile} />
                )}
            >
                {t("Bio")}
            </CellButton>
            <SimpleCell
                indicator={profile?.visible ? `${t("Visible")} 😋` : `${t("Hidden")} 😎`}
                before={<Icon28GhostOutline />}
                after={<VisibilitySwitch profile={profile} onUpdate={onUpdateProfile} />}
            >
                {t("Visible")}
            </SimpleCell>
            <CellButton
                indicator={<EllipsisText className="max-w-52">{[profile?.country, profile?.city].join(", ")}</EllipsisText>}
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

const SecondBlock = ({ interests, t, setPopout }: SecondBlockProps) => (
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

    const [popout, setPopout] = useState<React.JSX.Element | null>(null);

    return (
        <>
            <Group>
                <Group mode="plain">
                    {!profile ?
                        <Skeleton count={5} /> :
                        <FirstBlock
                            profile={profile}
                            t={t}
                            onUpdateProfileData={onUpdateProfileData}
                            setPopout={setPopout} />
                    }
                </Group>
                <Group mode="plain">
                    {!interests ?
                        <Skeleton count={1} /> :
                        <SecondBlock
                            interests={interests}
                            t={t}
                            setPopout={setPopout} />
                    }
                </Group>
            </Group>
            {popout}
        </>
    );
}

export default Main;
