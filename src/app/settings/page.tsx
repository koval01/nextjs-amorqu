'use client';

import { useCallback, useEffect, useState } from 'react';

import ApiService, { Interest, ProfileDetails } from '@/api';
import { useLaunchParams } from '@tma.js/sdk-react';
import { useTranslation } from 'react-i18next';

import { CellButton, Group, PullToRefresh } from "@vkontakte/vkui";
import ErrorSnackbar from '@/components/ErrorSnackbar';
import { Icon28CompassOutline, Icon28GhostOutline, Icon28ListAddOutline, Icon28MagicHatOutline, Icon28MasksOutline, Icon28WriteOutline } from '@vkontakte/icons';

export default function Settings() {
    const initData = useLaunchParams().initDataRaw;

    const [snackbar, setSnackbar] = useState<React.JSX.Element | null>(null);

    const showErrorSnackbar = (text: string) => {
        if (snackbar) return;
        setSnackbar(<ErrorSnackbar text={text} onClose={() => setSnackbar(null)} />);
    };

    const [profile, setProfile] = useState<ProfileDetails | null>(null);
    const [interests, setInterest] = useState<Interest[] | null>(null);

    const [fetching, setFetching] = useState<boolean>(false);
    const [fetchError, setFetchError] = useState<boolean>(false);

    const fetchProfileData = async () => {
        if (!initData) return;

        const apiService = await ApiService.create(initData);

        try {
            setProfile(await apiService.getProfileDetails());
            setInterest(await apiService.getProfileInterests());
            setFetchError(false); // Reset error state if successful
        } catch (error) {
            console.error('Error during data fetching', error);
            setFetchError(true); // Set error state if there's an error
        }
    };

    const fetch = () => {
        setFetching(true);
        fetchProfileData().then(() => setFetching(false));
    };

    useEffect(() => fetch(), []);
    const onRefresh = useCallback(() => fetch(), []);

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;

        if (fetchError) {
            showErrorSnackbar("Error connecting to the server"); // Show Snackbar with error
            interval = setInterval(() => {
                fetchProfileData();
            }, 3e3);
        } else if (interval) {
            clearInterval(interval); // Clear interval if there's no error
        }

        return () => {
            if (interval) clearInterval(interval); // Cleanup interval on component unmount
        };
    }, [fetchError]);

    const { t } = useTranslation();

    return (
        <>
            <PullToRefresh onRefresh={onRefresh} isFetching={fetching}>
                <Group>
                    <Group mode="plain">
                        <CellButton
                            indicator={profile?.displayName}
                            before={<Icon28MasksOutline />}
                            onClick={() => { }}
                        >
                            {t("Display name")}
                        </CellButton>
                        <CellButton
                            indicator={profile?.description}
                            before={<Icon28ListAddOutline />}
                            onClick={() => { }}
                        >
                            {t("Bio")}
                        </CellButton>
                        <CellButton
                            indicator={profile?.visible ? `${t("Visible")} 😋` : `${t("Hidden")} 😎`}
                            before={<Icon28GhostOutline />}
                            onClick={() => { }}
                        >
                            {t("Visible")}
                        </CellButton>
                        <CellButton
                            indicator={[profile?.country, profile?.city].join(", ")}
                            before={<Icon28CompassOutline />}
                            onClick={() => { }}
                        >
                            {t("Location")}
                        </CellButton>
                        <CellButton
                            indicator={profile?.personality}
                            before={<Icon28MagicHatOutline />}
                            onClick={() => { }}
                        >
                            {t("Personality")}
                        </CellButton>
                    </Group>
                    <Group mode="plain">
                        <CellButton
                            indicator={interests?.length}
                            before={<Icon28WriteOutline />}
                            onClick={() => { }}
                        >
                            {t("Interests")}
                        </CellButton>
                    </Group>
                </Group>

                <Group
                    description={t("Settings description")}
                    mode="plain"
                >
                </Group>
            </PullToRefresh>
            {snackbar}
        </>
    );
}
