'use client';

import { ProfileDetails, UpdateProfileProps } from '@/api';
import { useLaunchParams } from '@tma.js/sdk-react';

import Main from "@/components/settings/main"

import { PullToRefresh } from "@vkontakte/vkui";

import { useFetchData } from '@/hooks/useFetch';

export default function Settings() {
    const initData = useLaunchParams().initDataRaw;

    const {
        data: { profile, interests },
        isFetching,
        hasFetchError,
        snackbar,
        onRefresh,
        updateData,
    } = useFetchData<{
        profile: ProfileDetails;
        interests: string[];
    }>(initData, {
        fetchFunctions: {
            profile: async (apiService) => await apiService.getProfileDetails(),
            interests: async (apiService) => await apiService.getProfileInterests(),
        },
        updateFunctions: {
            profile: async (apiService, data) => await apiService.updateProfile(data as Partial<UpdateProfileProps>),
            interests: async (apiService, data) => await apiService.updateProfileInterests(data as string[]),
        },
    });

    return (
        <>
            <PullToRefresh onRefresh={onRefresh} isFetching={isFetching}>
                <Main
                    profile={profile}
                    interests={interests}
                    onUpdateProfileData={(data) => updateData('profile', data)}
                    onUpdateInterestsData={(data) => updateData('interests', data)}
                />
            </PullToRefresh>
            {snackbar}
        </>
    );
}
