import { useEffect, useState } from "react";
import { useRouter } from "next-nprogress-bar";

import { initBackButton } from '@tma.js/sdk-react';


const BackButtonTelegram = () => {
    const router = useRouter();
    const [canGoBack, setCanGoBack] = useState<boolean>(false);
    const [backButton] = initBackButton();

    useEffect(() => {
        if (window.history.length > 1) 
            setCanGoBack(true);
    }, []);

    useEffect(() => {
        if (canGoBack) backButton.show();
        else backButton.hide();
    }, [canGoBack])

    const handleBack = () => {
        if (canGoBack) router.back();
    };

    backButton.on('click', () => handleBack());

    return null;
};

export default BackButtonTelegram;
