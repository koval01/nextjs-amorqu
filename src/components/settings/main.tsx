import { useState } from "react";

import { ProfileDetails, Interest, UpdateProfileProps } from "@/api";

import { Icon28CompassOutline, Icon28GhostOutline, Icon28ListAddOutline, Icon28MagicHatOutline, Icon28MasksOutline, Icon28WriteOutline, Icon36ChevronRightOutline } from "@vkontakte/icons";
import { CellButton, SimpleCell, Group, Switch } from "@vkontakte/vkui";

import Skeleton from "./skeleton";
import Modal from "./modal";

import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

interface LocalizationProps {
    t: TFunction<"translation", undefined>
}
interface OnUpdateProfileProps {
    onUpdateProfileData: (profile: Partial<UpdateProfileProps>) => Promise<void>;
}
interface OnOpenModalProps {
    onOpenModal: () => void;
}
interface FirstBlockProps extends LocalizationProps, OnUpdateProfileProps, OnOpenModalProps {
    profile: ProfileDetails | null;
}
interface SecondBlockProps extends LocalizationProps, OnOpenModalProps {
    interests: Interest[] | null;
}
interface MainProps extends OnUpdateProfileProps {
    profile: ProfileDetails | null;
    interests: Interest[] | null;
}

const FirstBlock = ({ profile, t, onUpdateProfileData, onOpenModal }: FirstBlockProps) => {
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
                onClick={() => onOpenModal()}
            >
                {t("Display name")}
            </CellButton>
            <CellButton
                indicator={profile?.description}
                before={<Icon28ListAddOutline />}
                after={<Icon36ChevronRightOutline />}
                onClick={() => onOpenModal()}
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
                onClick={() => onOpenModal()}
            >
                {t("Location")}
            </CellButton>
            <CellButton
                indicator={profile?.personality}
                before={<Icon28MagicHatOutline />}
                after={<Icon36ChevronRightOutline />}
                onClick={() => onOpenModal()}
            >
                {t("Personality")}
            </CellButton>
        </>
    )
}

const SecondBlock = ({ interests, t, onOpenModal }: SecondBlockProps) => (
    <>
        <CellButton
            indicator={interests?.length}
            before={<Icon28WriteOutline />}
            after={<Icon36ChevronRightOutline />}
            onClick={() => onOpenModal()}
        >
            {t("Interests")}
        </CellButton>
    </>
);

const Main = ({ profile, interests, onUpdateProfileData }: MainProps) => {
    const { t } = useTranslation();

    const [popout, setPopout] = useState<React.JSX.Element | null>(null);

    const onOpenModal = () => setPopout(<Modal onClose={() => setPopout(null)} />);

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
                            onOpenModal={onOpenModal} />
                    }
                </Group>
                <Group mode="plain">
                    {!interests ? 
                        <Skeleton count={1} /> : 
                        <SecondBlock 
                            interests={interests} 
                            t={t} 
                            onOpenModal={onOpenModal} />
                    }
                </Group>
            </Group>
            {popout}
        </>
    );
}

export default Main;
