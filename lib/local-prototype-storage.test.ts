import AsyncStorage from "@react-native-async-storage/async-storage";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { clearUserInfo, removeSessionToken } from "./_core/auth";
import {
  clearAllLocalPrototypeData,
  localPrototypeStorageKeys,
  NSN_CREATED_EVENTS_STORAGE_KEY,
  saveCreatedPrototypeEvents,
  SOFTHELLO_ONBOARDING_STORAGE_KEY,
} from "./local-prototype-storage";

vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    multiRemove: vi.fn(async () => undefined),
    setItem: vi.fn(async () => undefined),
  },
}));

vi.mock("./_core/auth", () => ({
  clearUserInfo: vi.fn(async () => undefined),
  removeSessionToken: vi.fn(async () => undefined),
}));

describe("local prototype storage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("clears local NSN and SoftHello prototype keys plus local session helpers", async () => {
    expect(localPrototypeStorageKeys).toEqual([
      SOFTHELLO_ONBOARDING_STORAGE_KEY,
      NSN_CREATED_EVENTS_STORAGE_KEY,
    ]);

    await clearAllLocalPrototypeData();

    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
      "softhello.onboarding.v1",
      "nsn.created-events.v1",
    ]);
    expect(removeSessionToken).toHaveBeenCalled();
    expect(clearUserInfo).toHaveBeenCalled();
  });

  it("exposes created events only after the local storage write finishes", async () => {
    let finishWrite: (() => void) | undefined;
    vi.mocked(AsyncStorage.setItem).mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          finishWrite = resolve;
        }),
    );
    const exposeEvents = vi.fn();
    const createdEvents = [{ id: "created-board-games", title: "Board games" }];

    const savePromise = saveCreatedPrototypeEvents(createdEvents, exposeEvents);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      NSN_CREATED_EVENTS_STORAGE_KEY,
      JSON.stringify(createdEvents),
    );
    expect(exposeEvents).not.toHaveBeenCalled();

    finishWrite?.();
    await savePromise;

    expect(exposeEvents).toHaveBeenCalledWith(createdEvents);
  });
});
