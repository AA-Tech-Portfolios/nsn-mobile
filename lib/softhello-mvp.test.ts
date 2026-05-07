import { describe, expect, it } from "vitest";

import { dayEvents } from "./nsn-data";
import {
  canMeetInPerson,
  blockUser,
  createSafetyReport,
  getMeetingSafetyCopy,
  getVerificationLevelLabel,
  hideEvent,
  joinEvent,
  leaveEvent,
  pinEvent,
  prioritizeEventsForComfort,
  removeSavedPlace,
  savePlace,
  savePostEventFeedback,
  unhideEvent,
  unpinEvent,
} from "./softhello-mvp";

describe("SoftHello MVP domain rules", () => {
  it("requires real person verification before in-person meetups", () => {
    expect(canMeetInPerson("Unverified")).toBe(false);
    expect(canMeetInPerson("Contact Verified")).toBe(false);
    expect(canMeetInPerson("Real Person Verified")).toBe(true);
  });

  it("localizes trust copy while falling back to English", () => {
    expect(getMeetingSafetyCopy("Contact Verified", "Yiddish")).toContain("באשטעטיגטן קאנטאקט");
    expect(getMeetingSafetyCopy("Contact Verified", "Unknown")).toBe(
      "Contact Verified users can chat, but in-person meetups require Real Person Verified status."
    );
    expect(getVerificationLevelLabel("Real Person Verified", "Yiddish")).toBe("אמתער מענטש באשטעטיגט");
    expect(getVerificationLevelLabel("Unverified", "Unknown")).toBe("Unverified");
  });

  it("tracks join and soft-exit membership state", () => {
    const joined = joinEvent("movie-night-watch-chat", [], "2026-05-07T00:00:00.000Z");
    expect(joined[0]).toMatchObject({ eventId: "movie-night-watch-chat", status: "joined" });

    const left = leaveEvent("movie-night-watch-chat", joined, "2026-05-07T01:00:00.000Z");
    expect(left).toHaveLength(1);
    expect(left[0]).toMatchObject({ eventId: "movie-night-watch-chat", status: "left" });
  });

  it("keeps block state private and idempotent", () => {
    expect(blockUser("maya", [])).toEqual(["maya"]);
    expect(blockUser("maya", ["maya"])).toEqual(["maya"]);
  });

  it("creates structured reports and replaces post-event feedback per event", () => {
    const report = createSafetyReport("movie-night-watch-chat", "james", "Safety concern", "2026-05-07T02:00:00.000Z");
    expect(report).toMatchObject({ eventId: "movie-night-watch-chat", reportedUserId: "james", reason: "Safety concern" });

    const first = savePostEventFeedback(
      { eventId: "movie-night-watch-chat", comfort: "Mixed", wouldMeetAgain: false, createdAt: "2026-05-07T03:00:00.000Z" },
      []
    );
    const second = savePostEventFeedback(
      { eventId: "movie-night-watch-chat", comfort: "Good", wouldMeetAgain: true, createdAt: "2026-05-07T04:00:00.000Z" },
      first
    );

    expect(second).toHaveLength(1);
    expect(second[0]).toMatchObject({ comfort: "Good", wouldMeetAgain: true });
  });

  it("prioritizes comfort matches without hiding other events", () => {
    const prioritized = prioritizeEventsForComfort(dayEvents, ["Indoor backup"]);

    expect(prioritized).toHaveLength(dayEvents.length);
    expect(prioritized[0].id).toBe("library-calm-study");
    expect(prioritized.map((event) => event.id)).toEqual(expect.arrayContaining(dayEvents.map((event) => event.id)));
  });

  it("saves places idempotently and removes them by id", () => {
    const place = {
      id: "event:library-calm-study:Chatswood Library",
      venue: "Chatswood Library",
      category: "Indoor",
      sourceEventId: "library-calm-study",
      sourceEventTitle: "Library Calm Study",
      weather: "Rain friendly",
      savedAt: "2026-05-07T05:00:00.000Z",
    };

    const saved = savePlace(place, []);
    const resaved = savePlace({ ...place, category: "Quiet", savedAt: "2026-05-07T06:00:00.000Z" }, saved);

    expect(resaved).toHaveLength(1);
    expect(resaved[0]).toMatchObject({ category: "Quiet", savedAt: "2026-05-07T05:00:00.000Z" });
    expect(removeSavedPlace(place.id, resaved)).toEqual([]);
  });

  it("pins and hides events idempotently", () => {
    expect(pinEvent("library-calm-study", [])).toEqual(["library-calm-study"]);
    expect(pinEvent("library-calm-study", ["library-calm-study"])).toEqual(["library-calm-study"]);
    expect(unpinEvent("library-calm-study", ["library-calm-study", "coffee-lane-cove"])).toEqual(["coffee-lane-cove"]);

    expect(hideEvent("library-calm-study", [])).toEqual(["library-calm-study"]);
    expect(hideEvent("library-calm-study", ["library-calm-study"])).toEqual(["library-calm-study"]);
    expect(unhideEvent("library-calm-study", ["library-calm-study", "coffee-lane-cove"])).toEqual(["coffee-lane-cove"]);
  });
});
