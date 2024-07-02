'use client';

import { Group, Header, Panel, PanelHeader, SimpleCell, SplitCol, SplitLayout } from "@vkontakte/vkui";

export default function Home() {
    return (
        <SplitLayout header={<PanelHeader delimiter="none" />}>
            <SplitCol autoSpaced>
                <Panel>
                    <PanelHeader>Profile</PanelHeader>
                    <Group header={<Header mode="secondary">Page</Header>}>
                        <SimpleCell>Hello</SimpleCell>
                        <SimpleCell>Profile</SimpleCell>
                    </Group>
                </Panel>
            </SplitCol>
        </SplitLayout>
    );
}
