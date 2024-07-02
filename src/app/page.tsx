'use client';

import { Group, Header, Panel, PanelHeader, SimpleCell, SplitCol, SplitLayout, View } from "@vkontakte/vkui";

export default function Home() {
  return (
    <SplitLayout header={<PanelHeader delimiter="none" />}>
      <SplitCol autoSpaced>
        <View activePanel="main">
          <Panel id="main">
            <PanelHeader>VKUI</PanelHeader>
            <Group header={<Header mode="secondary">Items</Header>}>
              <SimpleCell>Hello</SimpleCell>
              <SimpleCell>World</SimpleCell>
            </Group>
          </Panel>
        </View>
      </SplitCol>
    </SplitLayout>
  );
}
