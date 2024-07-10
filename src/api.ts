import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import parseQueryString from "@/helpers/query";

interface AuthResponse {
    token: string;
}

interface ProfileStatusResponse {
    profile: string | null;
}

export interface ProfilePicture {
    id: string;
    url: string;
    createdAt: number;
}

export interface ProfileDetails {
    id: string;
    displayName: string;
    telegram: number;
    role: string;
    verified: boolean;
    description: string;
    visible: boolean;
    avatar: string | null;
    createdAt: number;
    city: string;
    country: string;
    personality: string;
}

export interface ProfileNear {
    id: string;
    displayName: string;
    city: string;
    country: string;
    avatar: string | null;
    metadata: {
        distance: number | null;
    }
}

export interface UpdateProfileProps {
    visible: boolean;
    displayName: string;
    description: string;
    city: string;
    country: string;
    personality: string
}

export interface SetProfileAvatarProps {
    picture: {
        id: string;
        url: string
    }
}

export interface UploadProfilePictureProps {
    id: string;
    url: string
}

interface ApiResponse<T> {
    status: string;
    data: T;
}

class ApiError extends Error {
    code: number;

    constructor(message: string, code: number) {
        super(message);
        this.code = code;
    }
}

class ApiService {
    private apiClient: AxiosInstance;
    private token: string | null = null;
    private readonly AUTH_ERROR_CODE = 3;
    private readonly initData: string;

    private constructor(initData: string) {
        const baseURL = process.env.NEXT_PUBLIC_API_HOST;

        if (!baseURL) {
            throw new Error('API base URL is not defined in the environment variables');
        }

        this.apiClient = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
                'X-Front-App-Name': "Amorqu Next.JS"
            },
        });

        this.initData = initData;

        const storedToken = sessionStorage.getItem('bearerToken');
        if (storedToken) {
            this.token = storedToken;
        }
    }

    public static async create(initData: string): Promise<ApiService> {
        const service = new ApiService(initData);
        await service.initialize();
        return service;
    }

    private async initialize(): Promise<void> {
        try {
            await this.ensureAuthenticated();
            await this.ensureInitialization();
        } catch (e) {
            console.error("Failed to initialize API module");
        }
    }

    private async ensureInitialization(): Promise<void> {
        const profileStatus = await this.getProfileStatus();
        if (!profileStatus.profile) {
            const initDataJSON = parseQueryString(this.initData);
            const displayName = JSON.parse(initDataJSON?.user).first_name;
            await this.initProfile(displayName);
        }
    }

    private validateResponse<T>(response: AxiosResponse<ApiResponse<T>>, expectedStatus = 'ok'): T {
        if (response.status !== 200) {
            throw new Error(`Unexpected status code: ${response.status}`);
        }
        if (response.data.status !== expectedStatus) {
            throw new Error(`Unexpected response status: ${response.data.status}`);
        }
        return response.data.data;
    }

    private async authenticate(): Promise<string> {
        const response = await this.apiClient.post<ApiResponse<AuthResponse>>(
            '/telegram/authenticate', { initData: this.initData });

        const token = this.validateResponse(response).token;
        this.token = token;
        sessionStorage.setItem('bearerToken', token);
        return token;
    }

    private async ensureAuthenticated(): Promise<void> {
        if (!this.token) {
            await this.authenticate();
        }
    }

    private isAxiosError(error: unknown): error is {
        message: string; response: { data: { code: number } }
    } {
        return (
            axios.isAxiosError(error) &&
            error.response !== undefined &&
            typeof error.response.data === 'object' &&
            'code' in error.response.data
        );
    }

    private async request<T>(config: AxiosRequestConfig, retry = true): Promise<T> {
        await this.ensureAuthenticated();
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${this.token}`,
        };

        try {
            const response = await this.apiClient.request<ApiResponse<T>>(config);
            return this.validateResponse(response);
        } catch (error) {
            if (
                retry &&
                this.isAxiosError(error) &&
                error.response.data.code === this.AUTH_ERROR_CODE
            ) {
                this.token = null;
                sessionStorage.removeItem('bearerToken');
                await this.ensureAuthenticated();
                return this.request(config, false);
            }
            if (this.isAxiosError(error))
                throw new ApiError(error.message, error.response.data.code);
            throw error;
        }
    }

    public getProfileStatus(): Promise<ProfileStatusResponse> {
        return this.request<ProfileStatusResponse>({
            method: 'GET',
            url: '/profile/status',
        });
    }

    public getProfilePictures(): Promise<ProfilePicture[]> {
        return this.request<ProfilePicture[]>({
            method: 'GET',
            url: '/profile/me/picture',
        });
    }

    public getProfileDetails(): Promise<ProfileDetails> {
        return this.request<ProfileDetails>({
            method: 'GET',
            url: '/profile/me',
        });
    }

    public getProfilesNear(): Promise<ProfileNear[]> {
        return this.request<ProfileNear[]>({
            method: 'GET',
            url: '/profile/near',
        });
    }

    public getProfileInterests(): Promise<string[]> {
        return this.request<string[]>({
            method: 'GET',
            url: '/profile/me/interest',
        });
    }

    public async initProfile(displayName: string): Promise<boolean> {
        try {
            await this.request<void>({
                method: 'POST',
                url: '/profile/init',
                data: { displayName },
            });
            return true;
        } catch {
            return false;
        }
    }

    public setProfileAvatar(from: 'telegram' | 'picture', pictureId?: string): Promise<SetProfileAvatarProps> {
        return this.request<SetProfileAvatarProps>({
            method: 'POST',
            url: '/profile/me/avatar',
            data: { from, pictureId },
        });
    }

    public async updateProfile(info: Partial<UpdateProfileProps>): Promise<ApiResponse<UpdateProfileProps>> {
        return await this.request<ApiResponse<UpdateProfileProps>>({
            method: 'PUT',
            url: '/profile/me',
            data: info,
        });
    }

    public deleteProfileAvatar(): Promise<void> {
        return this.request<void>({
            method: 'DELETE',
            url: '/profile/me/avatar',
        });
    }

    public uploadProfilePicture(file: File): Promise<UploadProfilePictureProps | 'invalid format'> {
        const formData = new FormData();
        formData.append('picture', file);

        return this.request<UploadProfilePictureProps>({
            method: 'POST',
            url: '/profile/me/picture',
            headers: { 'Content-Type': 'multipart/form-data' },
            data: formData,
        }).catch(error => {
            if (this.isAxiosError(error) && error.response.data.code === 6) {
                return 'invalid format';
            }
            throw error;
        });
    }

    public deleteProfilePicture(pictureId: string): Promise<void> {
        return this.request<void>({
            method: 'DELETE',
            url: `/profile/me/picture/${pictureId}`,
        });
    }

    public createProfileInterest(interest: string): Promise<string> {
        return this.request<string>({
            method: 'POST',
            url: '/profile/me/interest',
            data: { interest },
        });
    }

    public deleteProfileInterest(interestId: string): Promise<void> {
        return this.request<void>({
            method: 'DELETE',
            url: `/profile/me/interest/${interestId}`,
        });
    }

    public searchCities(country: string, city: string): Promise<string[]> {
        return this.request<string[]>({
            method: 'GET',
            url: '/utils/geo/cities',
            params: { country, city },
        });
    }

    public searchCountries(country: string): Promise<string[]> {
        return this.request<string[]>({
            method: 'GET',
            url: '/utils/geo/countries',
            params: { country },
        });
    }

    public validateLocation(country: string, city: string): Promise<boolean> {
        return this.request<boolean>({
            method: 'GET',
            url: '/utils/geo/validate',
            params: { country, city },
        });
    }

    public getProfileById(id: string): Promise<ProfileDetails | undefined> {
        return this.request<ProfileDetails>({
            method: 'GET',
            url: `/profile/${id}`,
        }).catch(error => {
            if (this.isAxiosError(error) && error.response.data.code === 4) {
                return void 0;
            }
            throw error;
        });
    }

    public getPicturesByProfileId(id: string): Promise<ProfilePicture[]> {
        return this.request<ProfilePicture[]>({
            method: 'GET',
            url: `/profile/${id}/picture`,
        });
    }

    public getInterestsByProfileId(id: string): Promise<string[]> {
        return this.request<string[]>({
            method: 'GET',
            url: `/profile/${id}/interest`,
        });
    }

    public getShareCode(): Promise<string> {
        return this.request<{ code: string }>({
            method: 'GET',
            url: '/profile/me/share',
        }).then(response => response.code);
    }

    public getProfileIdByShareCode(code: string): Promise<string | null> {
        return this.request<{ id: string }>({
            method: 'GET',
            url: '/profile/share',
            params: { code },
        }).then(response => response.id)
            .catch(error => {
                if (
                    this.isAxiosError(error) &&
                    (error.response.data.code === 4 || error.response.data.code === 1)
                )
                    return null;

                throw error;
            });
    }

    public deleteProfile(): Promise<void> {
        return this.request<void>({
            method: 'DELETE',
            url: '/profile/me',
        });
    }
}

export default ApiService;
