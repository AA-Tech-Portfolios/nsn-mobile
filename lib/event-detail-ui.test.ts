import { describe, expect, it } from "vitest";

import {
  getEventDetailActionHoverPalette,
  getEventDetailHeroImageOutlinePalette,
  getEventDetailHeroImageViewerCopy,
  getEventDetailHeroImageResizeMode,
  getEventDetailHumanMomentPalette,
  getEventDetailSelectedPalette,
  getEventVibeLabel,
} from "./event-detail-ui";

describe("event detail UI helpers", () => {
  it("uses a neutral vibe label across daytime and evening meetups", () => {
    expect(getEventVibeLabel()).toBe("Meetup vibe");
  });

  it("keeps selected controls readable in both light and dark themes", () => {
    expect(getEventDetailSelectedPalette(true)).toEqual({
      backgroundColor: "#3B5D93",
      borderColor: "#355582",
      textColor: "#FFFFFF",
    });
    expect(getEventDetailSelectedPalette(false)).toEqual({
      backgroundColor: "#214B95",
      borderColor: "#8FAFD1",
      textColor: "#FFFFFF",
    });
  });

  it("uses a proportional cover hero after the banner is expanded downward", () => {
    expect(getEventDetailHeroImageResizeMode()).toBe("cover");
  });

  it("keeps hero background photos framed with a dark inner outline", () => {
    expect(getEventDetailHeroImageOutlinePalette()).toEqual({
      borderColor: "rgba(2,8,20,0.72)",
      overlayColor: "rgba(2,8,20,0.08)",
    });
  });

  it("labels the full hero image viewer as a returnable event preview", () => {
    expect(getEventDetailHeroImageViewerCopy("Movie Night — Watch + Chat")).toEqual({
      closeLabel: "Return to event",
      openHint: "Shows the event photo larger. Use close to return to the event details.",
      openLabel: "Open full image for Movie Night — Watch + Chat",
      title: "Event image",
    });
  });

  it("keeps human moment cards readable in light mode", () => {
    expect(getEventDetailHumanMomentPalette(true)).toEqual({
      backgroundColor: "#F3F9FF",
      borderColor: "#B7D3EA",
    });
    expect(getEventDetailHumanMomentPalette(false)).toEqual({
      backgroundColor: "#101F34",
      borderColor: "rgba(168, 183, 218, 0.38)",
    });
  });

  it("gives interactive date and map rows a visible golden hover target", () => {
    expect(getEventDetailActionHoverPalette(false)).toEqual({
      backgroundColor: "rgba(199,176,122,0.18)",
      borderColor: "rgba(199,176,122,0.86)",
    });
    expect(getEventDetailActionHoverPalette(true)).toEqual({
      backgroundColor: "#FFF6DA",
      borderColor: "#B88A2D",
    });
  });
});
