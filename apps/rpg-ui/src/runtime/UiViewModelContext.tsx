import { createContext, useContext, type ReactNode } from 'react';
import type { UiViewModel } from './uiViewModel';

const UiViewModelContext = createContext<UiViewModel | null>(null);

type UiViewModelProviderProps = {
  value: UiViewModel;
  children: ReactNode;
};

export function UiViewModelProvider({ value, children }: UiViewModelProviderProps) {
  return <UiViewModelContext.Provider value={value}>{children}</UiViewModelContext.Provider>;
}

export function useUiViewModel() {
  const context = useContext(UiViewModelContext);

  if (!context) {
    throw new Error('UI view model context is not available. Wrap the UI in UiViewModelProvider.');
  }

  return context;
}
