import { createContext, useContext, useState } from "react";

export type TimezoneSetting = {
  id: string;
  label: string;
  city: string;
  country: string;
  timeZone: string;
  latitude: number;
  longitude: number;
};

export const timezoneOptions: TimezoneSetting[] = [
  {
    id: "sydney",
    label: "Sydney",
    city: "Sydney",
    country: "Australia",
    timeZone: "Australia/Sydney",
    latitude: -33.75,
    longitude: 151.15,
  },
  {
    id: "perth",
    label: "Perth",
    city: "Perth",
    country: "Australia",
    timeZone: "Australia/Perth",
    latitude: -31.95,
    longitude: 115.86,
  },
  {
    id: "tokyo",
    label: "Tokyo",
    city: "Tokyo",
    country: "Japan",
    timeZone: "Asia/Tokyo",
    latitude: 35.68,
    longitude: 139.76,
  },
  {
    id: "london",
    label: "London",
    city: "London",
    country: "United Kingdom",
    timeZone: "Europe/London",
    latitude: 51.51,
    longitude: -0.13,
  },
  {
    id: "new-york",
    label: "New York",
    city: "New York",
    country: "United States",
    timeZone: "America/New_York",
    latitude: 40.71,
    longitude: -74.01,
  },
  {
    id: "los-angeles",
    label: "Los Angeles",
    city: "Los Angeles",
    country: "United States",
    timeZone: "America/Los_Angeles",
    latitude: 34.05,
    longitude: -118.24,
  },
];

type AppSettings = {
  isNightMode: boolean;
  setIsNightMode: (value: boolean) => void;
  timezone: TimezoneSetting;
  setTimezone: (value: TimezoneSetting) => void;
};

const AppSettingsContext = createContext<AppSettings | null>(null);

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [isNightMode, setIsNightMode] = useState(false);
  const [timezone, setTimezone] = useState<TimezoneSetting>(timezoneOptions[0]);

  return (
    <AppSettingsContext.Provider value={{ isNightMode, setIsNightMode, timezone, setTimezone }}>
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
