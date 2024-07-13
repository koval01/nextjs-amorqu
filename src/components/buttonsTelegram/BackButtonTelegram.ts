import { useEffect, useState } from "react";
import { useRouter } from "next-nprogress-bar";
import { usePathname, useSearchParams } from 'next/navigation';

import { initBackButton } from '@tma.js/sdk-react';

export const BackButtonTelegram = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [canGoBack, setCanGoBack] = useState<boolean>(false);
    const [backButton] = initBackButton();

    useEffect(() => setCanGoBack(window.location.pathname !== "/"), [pathname, searchParams]);

    useEffect(() => {
        if (canGoBack) backButton.show();
        else backButton.hide();
    }, [canGoBack, backButton])

    const handleBack = () => {
        if (canGoBack) router.back();
    };

    backButton.on('click', () => handleBack());

    return null;
};
