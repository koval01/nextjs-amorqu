import { useRouter } from "next-nprogress-bar";

import { initBackButton } from '@tma.js/sdk-react';


const BackButtonTelegram = () => {
    const router = useRouter();
    const [backButton] = initBackButton();

    backButton.show();
    backButton.on('click', () => router.back());

    return null;
};

export default BackButtonTelegram;
