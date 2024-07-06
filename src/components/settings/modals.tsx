import { Dispatch, SetStateAction, useState } from "react";

import Modal from "./modal";
import { ProfileDetails, UpdateProfileProps } from "@/api";

import { FormItem, Input } from "@vkontakte/vkui";

interface ModalDisplayNameProps {
    profile: ProfileDetails | null;
    setPopout: (value: SetStateAction<JSX.Element | null>) => void;
    onUpdate: (profile: Partial<UpdateProfileProps>, setWait: Dispatch<SetStateAction<boolean>>) => Promise<void>;
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value.trim())}
                        disabled={wait}
                    />
                </FormItem>
            }
            onClose={() => setPopout(null)}
            onUpdate={() => onUpdate({ displayName: displayName }, setWait).then(() => setPopout(null))}
            disabled={wait}
        />
    )
}
