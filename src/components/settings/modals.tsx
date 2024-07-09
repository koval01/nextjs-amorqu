import { Dispatch, SetStateAction, useState } from "react";

import Modal from "./modal";

import { Interest, ProfileDetails, UpdateProfileProps } from "@/api";
import { cleanDisplayName } from "@/helpers/string";

import personalities from "@/defined/personalities";

import { FormItem, Input, Select, Textarea } from "@vkontakte/vkui";

import { useTranslation } from "react-i18next";

interface ProfileProp {
    profile: ProfileDetails | null;
}
interface InterestsProp {
    interests: Interest[] | null
}
interface BaseModalProps {
    setPopout: (value: SetStateAction<JSX.Element | null>) => void;
    onUpdate: (profile: Partial<UpdateProfileProps>, setWait: Dispatch<SetStateAction<boolean>>) => Promise<boolean | undefined>;
}
interface ModalDisplayNameProps extends ProfileProp, BaseModalProps {}
interface ModalBioProps extends ProfileProp, BaseModalProps {};
interface ModalPersonalityProps extends ProfileProp, BaseModalProps { };
interface _ModalInterestsProps extends InterestsProp, BaseModalProps {};
type ModalInterestsProps = Omit<_ModalInterestsProps, keyof { onUpdate: any }>

export const ModalDisplayName = ({ profile, setPopout, onUpdate }: ModalDisplayNameProps) => {
    const [wait, setWait] = useState<boolean>(false);
    const [displayName, setDisplayName] = useState<string>(profile?.displayName || "");

    return (
        <Modal
            header={"Display name"}
            subheader={"Display name subhead"}
            content={
                <FormItem>
                    <Input
                        type="text"
                        defaultValue={profile?.displayName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDisplayName(
                            cleanDisplayName(e.target.value)
                        )}
                        value={displayName}
                        disabled={wait}
                    />
                </FormItem>
            }
            onClose={() => setPopout(null)}
            onUpdate={() => onUpdate({ displayName: displayName.trim() }, setWait).then((r) => r === false && setPopout(null))}
            disabled={wait}
        />
    )
}

export const ModalBio = ({ profile, setPopout, onUpdate }: ModalBioProps) => {
    const { t } = useTranslation();
    
    const [wait, setWait] = useState<boolean>(false);
    const [bio, setBio] = useState<string>(profile?.description || "");

    return (
        <Modal
            header={"Bio"}
            subheader={"Bio subhead"}
            content={
                <FormItem>
                    <Textarea
                        placeholder={t("Bio placeholder")}
                        defaultValue={profile?.description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
                        disabled={wait}
                        rows={8}
                        style={{ height: "auto" }}
                    />
                </FormItem>
            }
            onClose={() => setPopout(null)}
            onUpdate={() => onUpdate({ description: bio }, setWait).then((r) => r === false && setPopout(null))}
            disabled={wait}
        />
    )
}

export const ModalInterests = ({ interests, setPopout }: ModalInterestsProps) => {
    const [wait, setWait] = useState<boolean>(false);
    const [interestsState, setInterestsState] = useState<Interest[] | null>(interests);

    return (
        <Modal
            header={"Interests"}
            subheader={"Interests subhead"}
            content={
                <FormItem>
                    
                </FormItem>
            }
            onClose={() => setPopout(null)}
            disabled={wait}
        />
    )
}

export const ModalPersonality = ({ profile, setPopout, onUpdate }: ModalPersonalityProps) => {
    const { t } = useTranslation();
    
    const [wait, setWait] = useState<boolean>(false);
    const [personality, setPersonality] = useState<string>(profile?.personality || "");

    return (
        <Modal
            header={"Personality"}
            subheader={"Personality subhead"}
            content={
                <FormItem>
                    <Select
                        id="select-id"
                        placeholder={t("Not selected")}
                        options={personalities.map((personality, index) => ({
                            index: index,
                            label: `${t(personality)} (${personality})`,
                            value: personality
                        }))}
                        defaultValue={profile?.personality}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPersonality(e.target.value)}
                        disabled={wait}
                    />
                </FormItem>
            }
            onClose={() => setPopout(null)}
            onUpdate={() => onUpdate({ personality: personality }, setWait).then((r) => r === false && setPopout(null))}
            disabled={wait}
        />
    )
}
