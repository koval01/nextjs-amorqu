import { Dispatch, SetStateAction, useMemo, useState } from "react";

import Modal from "./modal";

import { ProfileDetails, UpdateProfileProps } from "@/api";
import { cleanDisplayName } from "@/helpers/string";

import personalities from "@/defined/personalities";
import interestsOptions from "@/defined/interests";

import { ChipsSelect, FormItem, Input, Select, Textarea } from "@vkontakte/vkui";

import { useTranslation } from "react-i18next";

interface ProfileProp {
    profile: ProfileDetails | null;
}
interface InterestsProp {
    interests: string[] | null
}
interface ProfileOnUpdateProp {
    onUpdate: (profile: Partial<UpdateProfileProps>, setWait: Dispatch<SetStateAction<boolean>>) => Promise<boolean | undefined>;
}
interface InterestsOnUpdateProp {
    onUpdate: (interests: string[], setWait: Dispatch<SetStateAction<boolean>>) => Promise<boolean | undefined>;
}
interface BaseModalProps {
    setPopout: (value: SetStateAction<JSX.Element | null>) => void;
}
interface ModalDisplayNameProps extends ProfileProp, BaseModalProps, ProfileOnUpdateProp {}
interface ModalBioProps extends ProfileProp, BaseModalProps, ProfileOnUpdateProp {};
interface ModalPersonalityProps extends ProfileProp, BaseModalProps, ProfileOnUpdateProp {};
interface ModalInterestsProps extends InterestsProp, BaseModalProps, InterestsOnUpdateProp {};

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

export const ModalInterests = ({ interests, setPopout, onUpdate }: ModalInterestsProps) => {
    const { t } = useTranslation();
    const [wait, setWait] = useState<boolean>(false);

    const getArray = (arr: string[] | null) => arr?.map((interest: string) => ({ value: interest, label: t(interest) }));

    const interestsCollection = useMemo(() => {
        if (!interests) return [];
        return getArray([...interests, ...interestsOptions]);
    }, [interests]);

    const [selectedInterests, setSelectedInterests] = useState<{ value: string; label: string; }[] | undefined>(() => getArray(interests));

    return (
        <Modal
            header={"Interests"}
            subheader={"Interests subhead"}
            content={
                <FormItem>
                    <ChipsSelect
                        id="interests"
                        value={selectedInterests}
                        onChange={setSelectedInterests}
                        options={interestsCollection}
                        placeholder={t("Nothing selected")}
                        creatable={t("Add interest")}
                        disabled={wait}
                    />
                </FormItem>
            }
            onClose={() => setPopout(null)}
            onUpdate={() => onUpdate(selectedInterests?.map(item => item.value) || [], setWait).then((r) => r === false && setPopout(null))}
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
