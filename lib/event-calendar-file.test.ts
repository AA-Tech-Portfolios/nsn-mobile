import { describe, expect, it } from "vitest";

import { buildEventCalendarFile, getEventCalendarSaveCopy } from "./event-calendar-file";

describe("event calendar file", () => {
  it("builds a local calendar file with event title, venue, and prototype disclaimer", () => {
    const calendarFile = buildEventCalendarFile({
      title: "Movie Night — Watch + Chat",
      venue: "Macquarie Centre Event Cinemas",
      dateLabel: "Saturday, 24 May · 7:00pm",
      timeLabel: "7:00pm",
      description: "Watch first, optional chat after if it feels right.",
      fallbackNow: new Date("2026-06-17T10:00:00+10:00"),
    });

    expect(calendarFile.filename).toBe("movie-night-watch-chat.ics");
    expect(calendarFile.mimeType).toBe("text/calendar;charset=utf-8");
    expect(calendarFile.content).toContain("SUMMARY:Movie Night - Watch + Chat");
    expect(calendarFile.content).toContain("LOCATION:Macquarie Centre Event Cinemas");
    expect(calendarFile.content).toContain("DESCRIPTION:Watch first\\, optional chat after if it feels right. Prototype only");
    expect(calendarFile.content).toContain("DTSTART:20260524T190000");
    expect(calendarFile.content).toContain("DTEND:20260524T210000");
  });

  it("uses calm confirmation copy before saving to the local calendar", () => {
    expect(getEventCalendarSaveCopy("Picnic — Easy Hangout")).toEqual({
      title: "Save to local calendar?",
      body: "NSN can create a local calendar file for Picnic — Easy Hangout. This does not reserve a spot, message anyone, or connect live host tracking.",
      saveLabel: "Save",
      cancelLabel: "Cancel",
    });
  });
});
