import type { PropsWithChildren } from 'react';
import type { Metadata } from 'next';

import { Root } from '@/components/Root/Root';

import '@vkontakte/vkui/dist/vkui.css';
import 'normalize.css/normalize.css';

export const metadata: Metadata = {
  title: 'Amorqu',
  description: 'Amoqu - is dation application in Telegram',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html>
      <body>
        <Root>
          {children}
        </Root>
      </body>
    </html>
  );
}
