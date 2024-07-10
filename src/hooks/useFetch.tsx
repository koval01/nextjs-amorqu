import { useState, useEffect, useCallback } from 'react';
import ApiService, { ProfileDetails, ProfilePicture } from '@/api';
import ErrorSnackbar from '@/components/ErrorSnackbar';

interface ApiServiceProps {
    getProfileDetails: () => Promise<ProfileDetails>;
    getProfileById: (id: string) => Promise<ProfileDetails | undefined>;
    getProfileInterests: () => Promise<string[]>;
    getInterestsByProfileId: (id: string) => Promise<string[]>;
    getProfilePictures: () => Promise<ProfilePicture[]>;
    getPicturesByProfileId: (id: string) => Promise<ProfilePicture[]>;
}

interface FetchDataConfig<T> {
    fetchFunctions: { [K in keyof T]: (apiService: ApiServiceProps) => Promise<T[K]> };
}

export function useFetchData<T>(initData: string | undefined, config: FetchDataConfig<T>) {
    const [data, setData] = useState<Partial<T>>({});
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [hasFetchError, setHasFetchError] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useState<React.JSX.Element | null>(null);

    const showErrorSnackbar = (message: string) => {
        if (!snackbar) {
            setSnackbar(<ErrorSnackbar text={message} onClose={() => setSnackbar(null)} />);
        }
    };

    const fetchData = async (apiService: ApiServiceProps) => {
        try {
            const results = await Promise.all(
                Object.entries(config.fetchFunctions).map(async ([key, fetchFunction]) => {
                    const result = await (fetchFunction as (apiService: ApiServiceProps) => Promise<any>)(apiService);
                    return { [key]: result };
                })
            );

            const newData = results.reduce((acc, result) => ({ ...acc, ...result }), {} as Partial<T>);
            setData(newData as Partial<T>);
            setHasFetchError(false);
        } catch (error) {
            console.error('Error during data fetching', error);
            setHasFetchError(true);
        }
    };

    const initiateFetch = useCallback(async () => {
        if (!initData) return;
        setIsFetching(true);
        const apiService = await ApiService.create(initData);
        await fetchData(apiService);
        setIsFetching(false);
    }, [initData]);

    useEffect(() => {
        initiateFetch();
    }, [initiateFetch]);

    useEffect(() => {
        let retryInterval: NodeJS.Timeout | undefined;

        if (hasFetchError) {
            showErrorSnackbar("Error connecting to the server");
            retryInterval = setInterval(() => {
                initiateFetch();
            }, 3000);
        } else if (retryInterval) {
            clearInterval(retryInterval);
        }

        return () => {
            if (retryInterval) clearInterval(retryInterval);
        };
    }, [hasFetchError, initiateFetch]);

    return {
        data,
        isFetching,
        hasFetchError,
        snackbar,
        onRefresh: initiateFetch,
    };
}
