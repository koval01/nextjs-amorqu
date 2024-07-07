'use client';

import { type PropsWithChildren, useEffect } from 'react';
import {
  SDKProvider,
  useLaunchParams,
  useMiniApp,
  useThemeParams,
  useViewport,
  bindMiniAppCSSVars,
  bindThemeParamsCSSVars,
  bindViewportCSSVars,
} from '@tma.js/sdk-react';

import {
  AdaptivityProvider,
  ConfigProvider,
  AppRoot
} from '@vkontakte/vkui';

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { i18nStrings } from "@/i18n";

import '@/app.css';
import '@/tailwind.css';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ErrorPage } from '@/components/ErrorPage';
import { useTelegramMock } from '@/hooks/useTelegramMock';
import { useDidMount } from '@/hooks/useDidMount';

const i18nHook = i18n.use(initReactI18next);

i18nHook.init({
  resources: i18nStrings,
  fallbackLng: "en",

  interpolation: {
    escapeValue: false
  }
});

function App(props: PropsWithChildren) {
  const lp = useLaunchParams();
  const miniApp = useMiniApp();
  const themeParams = useThemeParams();
  const viewport = useViewport();

  useEffect(() => { 
    i18nHook.changeLanguage(lp.initData?.user?.languageCode) 
  }, [lp]);

  useEffect(() => {
    return bindMiniAppCSSVars(miniApp, themeParams);
  }, [miniApp, themeParams]);

  useEffect(() => {
    return bindThemeParamsCSSVars(themeParams);
  }, [themeParams]);

  useEffect(() => {
    return viewport && bindViewportCSSVars(viewport);
  }, [viewport]);

  return (
    <ConfigProvider
      appearance={miniApp.isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'android'}
    >
      <AdaptivityProvider>
        <AppRoot>
          <div className="select-none">
            {props.children}
          </div>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
}

function RootInner({ children }: PropsWithChildren) {
  // Mock Telegram environment in development mode if needed.
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTelegramMock();
  }

  const debug = useLaunchParams().startParam === 'debug';

  // Enable debug mode to see all the methods sent and events received.
  useEffect(() => {
    if (debug) {
      import('eruda').then((lib) => lib.default.init());
    }
  }, [debug]);

  return (
    <SDKProvider acceptCustomStyles debug={debug}>
      <App>
        <ProgressBar color={"#2688eb"} startPosition={.2} options={{ showSpinner: false }} />
        {children}
      </App>
    </SDKProvider>
  );
}

export function Root(props: PropsWithChildren) {
  // Unfortunately, Telegram Mini Apps does not allow us to use all features of the Server Side
  // Rendering. That's why we are showing loader on the server side.
  const didMount = useDidMount();

  return didMount ? (
    <ErrorBoundary fallback={ErrorPage}>
      <RootInner {...props} />
    </ErrorBoundary>
  ) : null;
}