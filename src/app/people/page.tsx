'use client';

import { useCallback, useEffect, useState } from 'react';

import ApiService, { ProfileNear } from '@/api';
import { useLaunchParams } from '@tma.js/sdk-react';

import { PullToRefresh } from "@vkontakte/vkui";
import ErrorSnackbar from '@/components/ErrorSnackbar';

import Recently from '@/components/people/recently';
import Nearby from '@/components/people/nearby';

export default function People() {
    const initData = useLaunchParams().initDataRaw;

    const [snackbar, setSnackbar] = useState<React.JSX.Element | null>(null);

    const showErrorSnackbar = (text: string) => {
        if (snackbar) return;
        setSnackbar(<ErrorSnackbar text={text} onClose={() => setSnackbar(null)} />);
    };

    const [profiles, setProfiles] = useState<ProfileNear[] | null>(null);

    const [fetching, setFetching] = useState<boolean>(false);
    const [fetchError, setFetchError] = useState<boolean>(false);

    const fetchPeopleData = async () => {
        if (!initData) return;

        const apiService = await ApiService.create(initData);

        try {
            setProfiles(await apiService.getProfilesNear());
            setFetchError(false); // Reset error state if successful
        } catch (error) {
            console.error('Error during data fetching', error);
            setFetchError(true); // Set error state if there's an error
        }
    };

    const fetch = () => {
        setFetching(true);
        fetchPeopleData().then(() => setFetching(false));
    };

    useEffect(() => fetch(), []);
    const onRefresh = useCallback(() => fetch(), []);

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;

        if (fetchError) {
            showErrorSnackbar("Error connecting to the server"); // Show Snackbar with error
            interval = setInterval(() => {
                fetchPeopleData();
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
                <Recently profiles={profiles} />
                <Nearby profiles={profiles} />
            </PullToRefresh>
            {snackbar}
        </>
    );
}
