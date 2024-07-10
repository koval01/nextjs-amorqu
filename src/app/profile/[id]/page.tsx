'use client';

export const runtime = 'edge';

import { ProfileDetails, ProfilePicture } from '@/api';
import { useFetchData } from '@/hooks/useFetch';
import { useLaunchParams } from '@tma.js/sdk-react';

import { Group, PullToRefresh } from "@vkontakte/vkui";

import Main from '@/components/profile/main';
import Details from '@/components/profile/details';
import Gallery from '@/components/profile/gallery';

export default function OtherProfile({ params }: { params: { id: string } }) {
    const initData = useLaunchParams().initDataRaw;

    const {
        data: { profile, interests, pictures },
        isFetching,
        hasFetchError,
        snackbar,
        onRefresh,
    } = useFetchData<{
        profile: ProfileDetails | undefined;
        interests: string[];
        pictures: ProfilePicture[]
    }>(initData, {
        fetchFunctions: {
            profile: async (apiService) => await apiService.getProfileById(params.id),
            interests: async (apiService) => await apiService.getInterestsByProfileId(params.id),
            pictures: async (apiService) => await apiService.getPicturesByProfileId(params.id),
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
