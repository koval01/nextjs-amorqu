import { Dispatch, SetStateAction, useState } from "react";

import Modal from "./modal";

import { ProfileDetails, UpdateProfileProps } from "@/api";
import { cleanDisplayName } from "@/helpers/string";

import { FormItem, Input, Textarea } from "@vkontakte/vkui";

import { useTranslation } from "react-i18next";

interface ModalDisplayNameProps {
    profile: ProfileDetails | null;
    setPopout: (value: SetStateAction<JSX.Element | null>) => void;
    onUpdate: (profile: Partial<UpdateProfileProps>, setWait: Dispatch<SetStateAction<boolean>>) => Promise<boolean | undefined>;
}

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

export const ModalBio = ({ profile, setPopout, onUpdate }: ModalDisplayNameProps) => {
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
