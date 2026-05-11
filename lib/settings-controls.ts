import type { AppPalette } from "./app-settings";

export type SettingsCopySource = {
  blurProfilePhoto: string;
  blurProfilePhotoCopy: string;
  privateProfile: string;
  privateProfileCopy: string;
  showFirstNameOnly: string;
  showFirstNameOnlyCopy: string;
  sameAgeGroupsOnly: string;
  sameAgeGroupsOnlyCopy: string;
  revealAfterRsvp: string;
  revealAfterRsvpCopy: string;
  friendsOfFriendsOnly: string;
  friendsOfFriendsOnlyCopy: string;
  meetupReminders?: string;
  meetupRemindersCopy?: string;
  weatherAlerts?: string;
  weatherAlertsCopy?: string;
  chatNotifications?: string;
  chatNotificationsCopy?: string;
  quietNotifications?: string;
  quietNotificationsCopy?: string;
  notificationSnoozed?: string;
  notificationSnoozedCopy?: string;
  useApproximateLocation?: string;
  useApproximateLocationCopy?: string;
  showDistanceInMeetups?: string;
  showDistanceInMeetupsCopy?: string;
  allowMessageRequests?: string;
  allowMessageRequestsCopy?: string;
  safetyCheckIns?: string;
  safetyCheckInsCopy?: string;
  batterySaver?: string;
  batterySaverCopy?: string;
  lowLightMode?: string;
  lowLightModeCopy?: string;
};

export type AccessibilityCopySource = {
  largerText: string;
  largerTextCopy: string;
  highContrast: string;
  highContrastCopy: string;
  reduceMotion: string;
  reduceMotionCopy: string;
  screenReaderHints: string;
  screenReaderHintsCopy: string;
};

export type SettingsControlState = {
  blurProfilePhoto: boolean;
  privateProfile: boolean;
  showFirstNameOnly: boolean;
  sameAgeGroupsOnly: boolean;
  revealAfterRsvp: boolean;
  friendsOfFriendsOnly: boolean;
  meetupReminders: boolean;
  weatherAlerts: boolean;
  chatNotifications: boolean;
  quietNotifications: boolean;
  notificationSnoozed: boolean;
  useApproximateLocation: boolean;
  showDistanceInMeetups: boolean;
  allowMessageRequests: boolean;
  safetyCheckIns: boolean;
  batterySaver: boolean;
  lowLightMode: boolean;
  largerText: boolean;
  highContrast: boolean;
  reduceMotion: boolean;
  screenReaderHints: boolean;
};

export type SettingsControlActions = {
  setBlurProfilePhoto: (value: boolean) => void;
  setPrivateProfile: (value: boolean) => void;
  setShowFirstNameOnly: (value: boolean) => void;
  setSameAgeGroupsOnly: (value: boolean) => void;
  setRevealAfterRsvp: (value: boolean) => void;
  setFriendsOfFriendsOnly: (value: boolean) => void;
  setMeetupReminders: (value: boolean) => void;
  setWeatherAlerts: (value: boolean) => void;
  setChatNotifications: (value: boolean) => void;
  setQuietNotifications: (value: boolean) => void;
  setNotificationSnoozed: (value: boolean) => void;
  setUseApproximateLocation: (value: boolean) => void;
  setShowDistanceInMeetups: (value: boolean) => void;
  setAllowMessageRequests: (value: boolean) => void;
  setSafetyCheckIns: (value: boolean) => void;
  setBatterySaver: (value: boolean) => void;
  setLowLightMode: (value: boolean) => void;
  setLargerText: (value: boolean) => void;
  setHighContrast: (value: boolean) => void;
  setReduceMotion: (value: boolean) => void;
  setScreenReaderHints: (value: boolean) => void;
};

export type SettingsToggleRow = {
  key: keyof SettingsControlState;
  label: string;
  copy: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export type SettingsToggleSections = {
  privacyRows: SettingsToggleRow[];
  notificationRows: SettingsToggleRow[];
  locationRows: SettingsToggleRow[];
  safetyRows: SettingsToggleRow[];
  performanceRows: SettingsToggleRow[];
  accessibilityRows: SettingsToggleRow[];
};

export function createSettingsToggleSections({
  copy,
  englishCopy,
  accessibilityCopy,
  state,
  actions,
}: {
  copy: SettingsCopySource;
  englishCopy: SettingsCopySource;
  accessibilityCopy: AccessibilityCopySource;
  state: SettingsControlState;
  actions: SettingsControlActions;
}): SettingsToggleSections {
  return {
    privacyRows: [
      {
        key: "blurProfilePhoto",
        label: copy.blurProfilePhoto,
        copy: copy.blurProfilePhotoCopy,
        value: state.blurProfilePhoto,
        onValueChange: actions.setBlurProfilePhoto,
      },
      {
        key: "privateProfile",
        label: copy.privateProfile,
        copy: copy.privateProfileCopy,
        value: state.privateProfile,
        onValueChange: actions.setPrivateProfile,
      },
      {
        key: "showFirstNameOnly",
        label: copy.showFirstNameOnly,
        copy: copy.showFirstNameOnlyCopy,
        value: state.showFirstNameOnly,
        onValueChange: actions.setShowFirstNameOnly,
      },
      {
        key: "sameAgeGroupsOnly",
        label: copy.sameAgeGroupsOnly,
        copy: copy.sameAgeGroupsOnlyCopy,
        value: state.sameAgeGroupsOnly,
        onValueChange: actions.setSameAgeGroupsOnly,
      },
      {
        key: "revealAfterRsvp",
        label: copy.revealAfterRsvp,
        copy: copy.revealAfterRsvpCopy,
        value: state.revealAfterRsvp,
        onValueChange: actions.setRevealAfterRsvp,
      },
      {
        key: "friendsOfFriendsOnly",
        label: copy.friendsOfFriendsOnly,
        copy: copy.friendsOfFriendsOnlyCopy,
        value: state.friendsOfFriendsOnly,
        onValueChange: actions.setFriendsOfFriendsOnly,
      },
    ],
    notificationRows: [
      {
        key: "meetupReminders",
        label: copy.meetupReminders ?? englishCopy.meetupReminders ?? "",
        copy: copy.meetupRemindersCopy ?? englishCopy.meetupRemindersCopy ?? "",
        value: state.meetupReminders,
        onValueChange: actions.setMeetupReminders,
      },
      {
        key: "weatherAlerts",
        label: copy.weatherAlerts ?? englishCopy.weatherAlerts ?? "",
        copy: copy.weatherAlertsCopy ?? englishCopy.weatherAlertsCopy ?? "",
        value: state.weatherAlerts,
        onValueChange: actions.setWeatherAlerts,
      },
      {
        key: "chatNotifications",
        label: copy.chatNotifications ?? englishCopy.chatNotifications ?? "",
        copy: copy.chatNotificationsCopy ?? englishCopy.chatNotificationsCopy ?? "",
        value: state.chatNotifications,
        onValueChange: actions.setChatNotifications,
      },
      {
        key: "quietNotifications",
        label: copy.quietNotifications ?? englishCopy.quietNotifications ?? "",
        copy: copy.quietNotificationsCopy ?? englishCopy.quietNotificationsCopy ?? "",
        value: state.quietNotifications,
        onValueChange: actions.setQuietNotifications,
      },
      {
        key: "notificationSnoozed",
        label: copy.notificationSnoozed ?? englishCopy.notificationSnoozed ?? "",
        copy: copy.notificationSnoozedCopy ?? englishCopy.notificationSnoozedCopy ?? "",
        value: state.notificationSnoozed,
        onValueChange: actions.setNotificationSnoozed,
      },
    ],
    locationRows: [
      {
        key: "useApproximateLocation",
        label: copy.useApproximateLocation ?? englishCopy.useApproximateLocation ?? "",
        copy: copy.useApproximateLocationCopy ?? englishCopy.useApproximateLocationCopy ?? "",
        value: state.useApproximateLocation,
        onValueChange: actions.setUseApproximateLocation,
      },
      {
        key: "showDistanceInMeetups",
        label: copy.showDistanceInMeetups ?? englishCopy.showDistanceInMeetups ?? "",
        copy: copy.showDistanceInMeetupsCopy ?? englishCopy.showDistanceInMeetupsCopy ?? "",
        value: state.showDistanceInMeetups,
        onValueChange: actions.setShowDistanceInMeetups,
      },
    ],
    safetyRows: [
      {
        key: "allowMessageRequests",
        label: copy.allowMessageRequests ?? englishCopy.allowMessageRequests ?? "",
        copy: copy.allowMessageRequestsCopy ?? englishCopy.allowMessageRequestsCopy ?? "",
        value: state.allowMessageRequests,
        onValueChange: actions.setAllowMessageRequests,
      },
      {
        key: "safetyCheckIns",
        label: copy.safetyCheckIns ?? englishCopy.safetyCheckIns ?? "",
        copy: copy.safetyCheckInsCopy ?? englishCopy.safetyCheckInsCopy ?? "",
        value: state.safetyCheckIns,
        onValueChange: actions.setSafetyCheckIns,
      },
    ],
    performanceRows: [
      {
        key: "batterySaver",
        label: copy.batterySaver ?? englishCopy.batterySaver ?? "",
        copy: copy.batterySaverCopy ?? englishCopy.batterySaverCopy ?? "",
        value: state.batterySaver,
        onValueChange: actions.setBatterySaver,
      },
      {
        key: "lowLightMode",
        label: copy.lowLightMode ?? englishCopy.lowLightMode ?? "",
        copy: copy.lowLightModeCopy ?? englishCopy.lowLightModeCopy ?? "",
        value: state.lowLightMode,
        onValueChange: actions.setLowLightMode,
      },
    ],
    accessibilityRows: [
      {
        key: "largerText",
        label: accessibilityCopy.largerText,
        copy: accessibilityCopy.largerTextCopy,
        value: state.largerText,
        onValueChange: actions.setLargerText,
      },
      {
        key: "highContrast",
        label: accessibilityCopy.highContrast,
        copy: accessibilityCopy.highContrastCopy,
        value: state.highContrast,
        onValueChange: actions.setHighContrast,
      },
      {
        key: "reduceMotion",
        label: accessibilityCopy.reduceMotion,
        copy: accessibilityCopy.reduceMotionCopy,
        value: state.reduceMotion,
        onValueChange: actions.setReduceMotion,
      },
      {
        key: "screenReaderHints",
        label: accessibilityCopy.screenReaderHints,
        copy: accessibilityCopy.screenReaderHintsCopy,
        value: state.screenReaderHints,
        onValueChange: actions.setScreenReaderHints,
      },
    ],
  };
}

export type SettingsDropdownName = "app" | "translation" | "palette";

export function toggleSettingsDropdown(current: SettingsDropdownName | null, target: SettingsDropdownName) {
  return current === target ? null : target;
}

export function selectSettingsPalette(palette: AppPalette, setAppPalette: (value: AppPalette) => void) {
  setAppPalette(palette);
  return null;
}
