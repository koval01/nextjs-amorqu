'use client';

import { Group, Header, Panel, PanelHeader, SimpleCell, SplitCol, SplitLayout } from "@vkontakte/vkui";
import { Link } from "@/components/Link"

export default function Home() {
  return (
    <SplitLayout header={<PanelHeader delimiter="none" />}>
      <SplitCol autoSpaced>
        <Panel>
          <PanelHeader>Amorqu</PanelHeader>
          <Group header={<Header mode="secondary">Items</Header>}>
            <SimpleCell>Hello</SimpleCell>
            <SimpleCell>World</SimpleCell>
            <SimpleCell>
              <Link href="/profile">Profile</Link>
            </SimpleCell>
          </Group>
        </Panel>
      </SplitCol>
    </SplitLayout>
  );
}
