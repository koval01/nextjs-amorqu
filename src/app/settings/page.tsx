'use client';

import { useCallback, useEffect, useState } from 'react';

import ApiService, { ProfileDetails, UpdateProfileProps } from '@/api';
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
    const [interests, setInterest] = useState<string[] | null>(null);

    const [fetching, setFetching] = useState<boolean>(false);
    const [fetchError, setFetchError] = useState<boolean>(false);

    const apiServiceInit = async (): Promise<ApiService | undefined> => {
        if (!initData) return;
        return await ApiService.create(initData);
    }

    const fetchProfileData = async () => {
        const apiService = await apiServiceInit();
        if (!apiService) return;

        try {
            setProfile(await apiService.getProfileDetails());
            setInterest(await apiService.getProfileInterests());
            setFetchError(false);
        } catch (error) {
            console.error('Error during data fetching', error);
            setFetchError(true);
        }
    };

    const onUpdateProfileData = async (profile: Partial<UpdateProfileProps>) => {
        const apiService = await apiServiceInit();
        if (!apiService) return;

        try {
            const result = await apiService.updateProfile(profile);
            const r = JSON.stringify(result) !== JSON.stringify(profile);
            setFetchError(r);
            return r;
        } catch (error) {
            console.error('Error during data updating', error);
            setFetchError(true);
        } finally {
            if (!fetchError) await fetchWait();
        }
    }

    const fetch = () => {
        setFetching(true);
        fetchProfileData().then(() => setFetching(false));
    };

    const fetchWait = async () => {
        setFetching(true);
        await fetchProfileData();
        setFetching(false);
    }

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
                <Main profile={profile} interests={interests} onUpdateProfileData={onUpdateProfileData} />
                <Group
                    description={t("Settings description")}
                    mode="plain">
                </Group>
            </PullToRefresh>
            {snackbar}
        </>
    );
}
