'use client';

import { useCallback, useEffect, useState } from 'react';

import ApiService, { Interest, ProfileDetails, ProfilePicture } from '@/api';
import { useLaunchParams } from '@tma.js/sdk-react';

import { Group, PullToRefresh } from "@vkontakte/vkui";
import ErrorSnackbar from '@/components/ErrorSnackbar';

import Main from '@/components/profile/main';
import Details from '@/components/profile/details';
import Gallery from '@/components/profile/gallery';

export default function Porfile() {
    const initData = useLaunchParams().initDataRaw;

    const [snackbar, setSnackbar] = useState<React.JSX.Element | null>(null);

    const showErrorSnackbar = (text: string) => {
        if (snackbar) return;
        setSnackbar(<ErrorSnackbar text={text} onClose={() => setSnackbar(null)} />);
    };

    const [profile, setProfile] = useState<ProfileDetails | null>(null);
    const [interests, setInterest] = useState<Interest[] | null>(null);
    const [pictures, setPictures] = useState<ProfilePicture[] | null>(null);

    const [fetching, setFetching] = useState<boolean>(false);
    const [fetchError, setFetchError] = useState<boolean>(false);

    const fetchProfileData = async () => {
        if (!initData) return;

        const apiService = await ApiService.create(initData);

        try {
            setProfile(await apiService.getProfileDetails());
            setInterest(await apiService.getProfileInterests());
            setPictures(await apiService.getProfilePictures());
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
                <Group>
                    <Main profile={profile} />
                    <Details profile={profile} interests={interests} />
                </Group>
                <Gallery pictures={pictures} profile={profile} />
            </PullToRefresh>
            {snackbar}
        </>
    );
}
