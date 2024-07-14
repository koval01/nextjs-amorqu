'use client';

import type { PropsWithChildren } from 'react';

import { Panel, PanelHeader, SplitCol, SplitLayout } from '@vkontakte/vkui';

import { useTranslation } from 'react-i18next';

export default function RootLayout({ children }: PropsWithChildren) {
    const { t } = useTranslation();

    return (
        <SplitLayout header={<PanelHeader delimiter="none" className="hidden md:block" />}>
            <SplitCol autoSpaced>
                <Panel className="max-w-[920px] m-auto">
                    <PanelHeader>{t("Profile")}</PanelHeader>
                    { children }
                </Panel>
            </SplitCol>
        </SplitLayout>
    );
}
