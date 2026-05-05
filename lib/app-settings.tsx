import { createContext, useContext, useState } from "react";

type AppSettings = {
  isNightMode: boolean;
  setIsNightMode: (value: boolean) => void;
};

const AppSettingsContext = createContext<AppSettings | null>(null);

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [isNightMode, setIsNightMode] = useState(false);

  return (
    <AppSettingsContext.Provider value={{ isNightMode, setIsNightMode }}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);

  if (!context) {
    throw new Error("useAppSettings must be used inside AppSettingsProvider");
  }

  return context;
}