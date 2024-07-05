'use client';

import { useCallback, useEffect, useState } from 'react';

import ApiService, { Interest, ProfileDetails } from '@/api';
import { useLaunchParams } from '@tma.js/sdk-react';
import { useTranslation } from 'react-i18next';

import Main from "@/components/settings/main"

import { Group, PullToRefresh } from "@vkontakte/vkui";

import ErrorSnackbar from '@/components/ErrorSnackbar';

export default function Settings() {
    const { t } = useTranslation();
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

    return (
        <>
            <PullToRefresh onRefresh={onRefresh} isFetching={fetching}>
                <Main profile={profile} interests={interests} />
                <Group
                    description={t("Settings description")}
                    mode="plain">
                </Group>
            </PullToRefresh>
            {snackbar}
        </>
    );
}
