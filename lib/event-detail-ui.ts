import { nsnColors } from "./nsn-data";

export const getEventVibeLabel = () => "Meetup vibe";

export const getEventDetailSelectedPalette = (isDay: boolean) =>
  isDay
    ? {
        backgroundColor: "#3B5D93",
        borderColor: "#355582",
        textColor: "#FFFFFF",
      }
    : {
        backgroundColor: nsnColors.selectedChip,
        borderColor: nsnColors.selectedChipBorder,
        textColor: nsnColors.selectedChipText,
      };

export const getEventDetailHeroImageResizeMode = (): "cover" => "cover";

export const getEventDetailHeroImageOutlinePalette = () => ({
  borderColor: "rgba(2,8,20,0.72)",
  overlayColor: "rgba(2,8,20,0.08)",
});

export const getEventDetailHeroImageViewerCopy = (eventTitle: string) => ({
  closeLabel: "Return to event",
  openHint: "Shows the event photo larger. Use close to return to the event details.",
  openLabel: `Open full image for ${eventTitle}`,
  title: "Event image",
});

export const getEventDetailHumanMomentPalette = (isDay: boolean) =>
  isDay
    ? {
        backgroundColor: "#F3F9FF",
        borderColor: "#B7D3EA",
      }
    : {
        backgroundColor: "#101F34",
        borderColor: "rgba(168, 183, 218, 0.38)",
      };

export const getEventDetailActionHoverPalette = (isDay: boolean) =>
  isDay
    ? {
        backgroundColor: "#FFF6DA",
        borderColor: "#B88A2D",
      }
    : {
        backgroundColor: "rgba(199,176,122,0.18)",
        borderColor: "rgba(199,176,122,0.86)",
      };
