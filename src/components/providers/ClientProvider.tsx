"use client";

import { FC, PropsWithChildren } from "react";
import { I18nProvider } from "react-aria";
import { ProgressProvider } from "@bprogress/next/app";
import { localeToAria } from "@/common/i18n";
import { localeSelector } from "@/stores/preferences/selectors";
import { useAppSelector } from "@/stores/hooks";
import ReduxProvider from "./ReduxProvider";
import RootProvider from "./RootProvider";
import { PreferencesProvider } from "./PreferencesProvider";

function I18nBridge({ children }: PropsWithChildren) {
  const locale = useAppSelector(localeSelector);
  return <I18nProvider locale={localeToAria(locale)}>{children}</I18nProvider>;
}

export const ClientProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ReduxProvider>
      <PreferencesProvider>
        <I18nBridge>
          <ProgressProvider
            height="2px"
            color="var(--foreground)"
            options={{ showSpinner: false }}
            shallowRouting
          >
            <RootProvider>{children}</RootProvider>
          </ProgressProvider>
        </I18nBridge>
      </PreferencesProvider>
    </ReduxProvider>
  );
};
