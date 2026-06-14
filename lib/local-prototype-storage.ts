import AsyncStorage from "@react-native-async-storage/async-storage";

export const SOFTHELLO_ONBOARDING_STORAGE_KEY = "softhello.onboarding.v1";
export const NSN_CREATED_EVENTS_STORAGE_KEY = "nsn.created-events.v1";

export const localPrototypeStorageKeys = [
  SOFTHELLO_ONBOARDING_STORAGE_KEY,
  NSN_CREATED_EVENTS_STORAGE_KEY,
] as const;

export async function clearAllLocalPrototypeData() {
  const { clearUserInfo, removeSessionToken } = await import("./_core/auth");

  await Promise.all([
    AsyncStorage.multiRemove([...localPrototypeStorageKeys]),
    removeSessionToken(),
    clearUserInfo(),
  ]);
}
