import { useRouter } from "next-nprogress-bar";

import { initSettingsButton } from '@tma.js/sdk-react';

export const SettingsButtonTelegram = () => {
    const router = useRouter();
    const [settingsButton] = initSettingsButton();

    settingsButton.show();
    settingsButton.on('click', () => router.push("/settings"));

    return null;
};
