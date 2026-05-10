import { describe, expect, it, vi } from "vitest";
import { appPalettes } from "./app-settings";
import {
  createSettingsToggleSections,
  selectSettingsPalette,
  toggleSettingsDropdown,
  type AccessibilityCopySource,
  type SettingsControlActions,
  type SettingsControlState,
  type SettingsCopySource,
} from "./settings-controls";

const copy: SettingsCopySource = {
  blurProfilePhoto: "Blur profile photo",
  blurProfilePhotoCopy: "Keep your photo softened.",
  privateProfile: "Private profile",
  privateProfileCopy: "Only confirmed plans can see your profile.",
  showFirstNameOnly: "Show first name only",
  showFirstNameOnlyCopy: "Hide your surname.",
  sameAgeGroupsOnly: "Same age groups only",
  sameAgeGroupsOnlyCopy: "Prefer people near your age.",
  revealAfterRsvp: "Reveal after RSVP",
  revealAfterRsvpCopy: "Show details after RSVP.",
  friendsOfFriendsOnly: "Friends of friends only",
  friendsOfFriendsOnlyCopy: "Limit discovery.",
  meetupReminders: "Meetup reminders",
  meetupRemindersCopy: "Notify before meetups.",
  weatherAlerts: "Weather alerts",
  weatherAlertsCopy: "Warn about weather changes.",
  chatNotifications: "Chat notifications",
  chatNotificationsCopy: "Notify for chat updates.",
  quietNotifications: "Quiet notifications",
  quietNotificationsCopy: "Reduce notification volume.",
  useApproximateLocation: "Approximate location",
  useApproximateLocationCopy: "Use a nearby area.",
  showDistanceInMeetups: "Show distance",
  showDistanceInMeetupsCopy: "Show distance in meetups.",
  allowMessageRequests: "Message requests",
  allowMessageRequestsCopy: "Allow new requests.",
  safetyCheckIns: "Safety check-ins",
  safetyCheckInsCopy: "Enable safety prompts.",
  batterySaver: "Battery saver",
  batterySaverCopy: "Reduce motion and background refresh.",
};

const accessibilityCopy: AccessibilityCopySource = {
  largerText: "Larger text",
  largerTextCopy: "Increase text size.",
  highContrast: "High contrast",
  highContrastCopy: "Strengthen contrast.",
  reduceMotion: "Reduce motion",
  reduceMotionCopy: "Reduce movement.",
  screenReaderHints: "Screen reader hints",
  screenReaderHintsCopy: "Add assistive hints.",
};

const state: SettingsControlState = {
  blurProfilePhoto: true,
  privateProfile: false,
  showFirstNameOnly: true,
  sameAgeGroupsOnly: false,
  revealAfterRsvp: true,
  friendsOfFriendsOnly: false,
  meetupReminders: true,
  weatherAlerts: true,
  chatNotifications: true,
  quietNotifications: false,
  useApproximateLocation: true,
  showDistanceInMeetups: true,
  allowMessageRequests: false,
  safetyCheckIns: true,
  batterySaver: false,
  largerText: false,
  highContrast: false,
  reduceMotion: false,
  screenReaderHints: true,
};

function createActions() {
  return {
    setBlurProfilePhoto: vi.fn(),
    setPrivateProfile: vi.fn(),
    setShowFirstNameOnly: vi.fn(),
    setSameAgeGroupsOnly: vi.fn(),
    setRevealAfterRsvp: vi.fn(),
    setFriendsOfFriendsOnly: vi.fn(),
    setMeetupReminders: vi.fn(),
    setWeatherAlerts: vi.fn(),
    setChatNotifications: vi.fn(),
    setQuietNotifications: vi.fn(),
    setUseApproximateLocation: vi.fn(),
    setShowDistanceInMeetups: vi.fn(),
    setAllowMessageRequests: vi.fn(),
    setSafetyCheckIns: vi.fn(),
    setBatterySaver: vi.fn(),
    setLargerText: vi.fn(),
    setHighContrast: vi.fn(),
    setReduceMotion: vi.fn(),
    setScreenReaderHints: vi.fn(),
  } satisfies SettingsControlActions;
}

describe("settings controls", () => {
  it("wires every Settings & Privacy switch to the intended setting action", () => {
    const actions = createActions();
    const sections = createSettingsToggleSections({
      copy,
      englishCopy: copy,
      accessibilityCopy,
      state,
      actions,
    });
    const rows = [
      ...sections.privacyRows,
      ...sections.notificationRows,
      ...sections.locationRows,
      ...sections.safetyRows,
      ...sections.performanceRows,
      ...sections.accessibilityRows,
    ];

    expect(rows.map((row) => row.key)).toEqual([
      "blurProfilePhoto",
      "privateProfile",
      "showFirstNameOnly",
      "sameAgeGroupsOnly",
      "revealAfterRsvp",
      "friendsOfFriendsOnly",
      "meetupReminders",
      "weatherAlerts",
      "chatNotifications",
      "quietNotifications",
      "useApproximateLocation",
      "showDistanceInMeetups",
      "allowMessageRequests",
      "safetyCheckIns",
      "batterySaver",
      "largerText",
      "highContrast",
      "reduceMotion",
      "screenReaderHints",
    ]);

    for (const row of rows) {
      row.onValueChange(!row.value);
    }

    expect(actions.setBlurProfilePhoto).toHaveBeenCalledWith(false);
    expect(actions.setPrivateProfile).toHaveBeenCalledWith(true);
    expect(actions.setShowFirstNameOnly).toHaveBeenCalledWith(false);
    expect(actions.setSameAgeGroupsOnly).toHaveBeenCalledWith(true);
    expect(actions.setRevealAfterRsvp).toHaveBeenCalledWith(false);
    expect(actions.setFriendsOfFriendsOnly).toHaveBeenCalledWith(true);
    expect(actions.setMeetupReminders).toHaveBeenCalledWith(false);
    expect(actions.setWeatherAlerts).toHaveBeenCalledWith(false);
    expect(actions.setChatNotifications).toHaveBeenCalledWith(false);
    expect(actions.setQuietNotifications).toHaveBeenCalledWith(true);
    expect(actions.setUseApproximateLocation).toHaveBeenCalledWith(false);
    expect(actions.setShowDistanceInMeetups).toHaveBeenCalledWith(false);
    expect(actions.setAllowMessageRequests).toHaveBeenCalledWith(true);
    expect(actions.setSafetyCheckIns).toHaveBeenCalledWith(false);
    expect(actions.setBatterySaver).toHaveBeenCalledWith(true);
    expect(actions.setLargerText).toHaveBeenCalledWith(true);
    expect(actions.setHighContrast).toHaveBeenCalledWith(true);
    expect(actions.setReduceMotion).toHaveBeenCalledWith(true);
    expect(actions.setScreenReaderHints).toHaveBeenCalledWith(false);
  });

  it("opens a requested dropdown and closes it when the same button is pressed again", () => {
    expect(toggleSettingsDropdown(null, "palette")).toBe("palette");
    expect(toggleSettingsDropdown("palette", "palette")).toBeNull();
    expect(toggleSettingsDropdown("palette", "app")).toBe("app");
    expect(toggleSettingsDropdown("app", "translation")).toBe("translation");
  });

  it("selects a palette and closes the palette menu", () => {
    const setAppPalette = vi.fn();
    const selectedPalette = appPalettes[1]!;

    const nextDropdown = selectSettingsPalette(selectedPalette, setAppPalette);

    expect(setAppPalette).toHaveBeenCalledWith(selectedPalette);
    expect(nextDropdown).toBeNull();
  });
});
