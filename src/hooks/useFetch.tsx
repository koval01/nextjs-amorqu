import { useState, useEffect, useCallback } from 'react';

import ApiService, {
    ProfileDetails,
    ProfileNear,
    ProfilePicture,
    UpdateProfileProps
} from '@/api';

import ErrorSnackbar from '@/components/ErrorSnackbar';

interface ApiServiceProps {
    getProfileDetails: () => Promise<ProfileDetails>;
    getProfileById: (id: string) => Promise<ProfileDetails | undefined>;
    getProfilesNear: () => Promise<ProfileNear[] | undefined>;
    getProfileInterests: () => Promise<string[]>;
    getInterestsByProfileId: (id: string) => Promise<string[]>;
    getProfilePictures: () => Promise<ProfilePicture[]>;
    getPicturesByProfileId: (id: string) => Promise<ProfilePicture[]>;
    updateProfile: (info: Partial<UpdateProfileProps>) => Promise<Partial<UpdateProfileProps>>;
    updateProfileInterests: (interests: string[]) => Promise<string[]>;
}

interface FetchDataConfig<T> {
    fetchFunctions: { [K in keyof T]: (apiService: ApiServiceProps) => Promise<T[K]> };
    updateFunctions?: { [K in keyof Partial<T>]: (apiService: ApiServiceProps, data: Partial<T[K]>) => Promise<Partial<T[K]>> };
}

export function useFetchData<T>(initData: string | undefined, config: FetchDataConfig<T>) {
    const [data, setData] = useState<Partial<T>>({});
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [hasFetchError, setHasFetchError] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useState<React.JSX.Element | null>(null);

    const showErrorSnackbar = (message: string) => {
        if (!snackbar)
            setSnackbar(<ErrorSnackbar text={message} onClose={() => setSnackbar(null)} />);
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

    const updateData = async <K extends keyof Partial<T>>(key: K, newData: Partial<T[K]>): Promise<boolean> => {
        if (!config.updateFunctions || !config.updateFunctions[key]) return false;
        const apiService = await ApiService.create(initData!);
        try {
            const existingData = data[key];
            const updatedData = await config.updateFunctions[key](apiService, newData);

            setData((prevData) => ({
                ...prevData,
                [key]: Array.isArray(updatedData) ? updatedData : { ...existingData, ...updatedData },
            }));
            return true;
        } catch (error) {
            console.error('Error during data updating', error);
            setHasFetchError(true);
            return false;
        }
    };

    useEffect(() => {
        initiateFetch();
    }, [initiateFetch]);

    useEffect(() => {
        let retryInterval: NodeJS.Timeout | undefined;

        if (hasFetchError) {
            showErrorSnackbar("Error connecting to the server");
            retryInterval = setInterval(() => initiateFetch(), 3e3);
        } else if (retryInterval)
            clearInterval(retryInterval);

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
        updateData,
    };
}
