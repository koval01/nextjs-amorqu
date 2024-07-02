'use client';

import { useEffect, useState } from 'react';

import ApiService, { ProfileDetails } from '@/api';
import { useLaunchParams } from '@tma.js/sdk-react';

import Image from "next/image";
import { Group, Header, Panel, PanelHeader, SimpleCell, SplitCol, SplitLayout } from "@vkontakte/vkui";

export default function Home() {
    const initData = useLaunchParams().initDataRaw;

    const [profile, setProfile] = useState<ProfileDetails | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const apiService = await ApiService.create(initData || "");
            setProfile(await apiService.getProfileDetails());
        };

        fetchData();
    }, []);

    return (
        <SplitLayout header={<PanelHeader delimiter="none" />}>
            <SplitCol autoSpaced>
                <Panel>
                    <PanelHeader>Profile</PanelHeader>
                    <Group header={<Header mode="secondary">Profile</Header>}>
                        <SimpleCell>Hello</SimpleCell>
                        <SimpleCell>{profile?.displayName}</SimpleCell>
                    </Group>
                    <Group>
                        <Image src={profile?.avatar || ""} height={96} width={96} alt="Profile photo" />
                    </Group>
                </Panel>
            </SplitCol>
        </SplitLayout>
    );
}
