'use client';

import { useCallback, useEffect, useState } from 'react';

import ApiService, { ProfileNear } from '@/api';
import { useLaunchParams } from '@tma.js/sdk-react';

import { PullToRefresh } from "@vkontakte/vkui";
import ErrorSnackbar from '@/components/ErrorSnackbar';

import Recently from '@/components/people/recently';
import Nearby from '@/components/people/nearby';
import { useFetchData } from '@/hooks/useFetch';

export default function People() {
    const initData = useLaunchParams().initDataRaw;

    const {
        data: { profiles },
        isFetching,
        hasFetchError,
        snackbar,
        onRefresh,
    } = useFetchData<{
        profiles: ProfileNear[] | undefined;
    }>(initData, {
        fetchFunctions: {
            profiles: async (apiService) => await apiService.getProfilesNear(),
        },
    });

    return (
        <>
            <PullToRefresh onRefresh={onRefresh} isFetching={isFetching}>
                <Recently profiles={profiles} />
                <Nearby profiles={profiles} />
            </PullToRefresh>
            {snackbar}
        </>
    );
}
