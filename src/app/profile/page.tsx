'use client';

import { ProfileDetails, ProfilePicture } from '@/api';
import { useFetchData } from '@/hooks/useFetch';
import { useLaunchParams } from '@telegram-apps/sdk-react';

import { Group, PullToRefresh } from "@vkontakte/vkui";

import Main from '@/components/profile/main';
import Details from '@/components/profile/details';
import Gallery from '@/components/profile/gallery';

export default function Porfile() {
    const initData = useLaunchParams().initDataRaw;

    const {
        data: { profile, interests, pictures },
        isFetching,
        hasFetchError,
        snackbar,
        onRefresh,
    } = useFetchData<{
        profile: ProfileDetails;
        interests: string[];
        pictures: ProfilePicture[]
    }>(initData, {
        fetchFunctions: {
            profile: async (apiService) => await apiService.getProfileDetails(),
            interests: async (apiService) => await apiService.getProfileInterests(),
            pictures: async (apiService) => await apiService.getProfilePictures(),
        },
    });

    return (
        <>
            <PullToRefresh onRefresh={onRefresh} isFetching={isFetching}>
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
