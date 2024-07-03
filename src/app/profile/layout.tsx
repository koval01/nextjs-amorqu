'use client';

import type { PropsWithChildren } from 'react';

import { Panel, PanelHeader, SplitCol, SplitLayout } from '@vkontakte/vkui';
import { useTranslation } from 'react-i18next';

export default function RootLayout({ children }: PropsWithChildren) {
    const { t } = useTranslation();
    
    return (
        <SplitLayout header={<PanelHeader delimiter="none" />}>
            <SplitCol autoSpaced>
                <Panel>
                    <PanelHeader>{t("Profile")}</PanelHeader>
                    { children }
                </Panel>
            </SplitCol>
        </SplitLayout>
    );
}
