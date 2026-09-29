import React from 'react';
import type { SafeMode } from './layout';

const SafeModeContext = React.createContext<SafeMode>('standard');

export const SafeModeProvider: React.FC<{
  value: SafeMode;
  children: React.ReactNode;
}> = ({ value, children }) => (
  <SafeModeContext.Provider value={value}>{children}</SafeModeContext.Provider>
);

export const useSafeMode = () => React.useContext(SafeModeContext);
