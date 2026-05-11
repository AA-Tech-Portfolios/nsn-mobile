import { describe, expect, it } from "vitest";

import { searchNsnEvents, searchNsnSydneyLocalAreas } from "./nsn-search";
import { allEvents } from "./nsn-data";

describe("NSN local search", () => {
  it("does not show suburb suggestions before the user searches", () => {
    expect(searchNsnSydneyLocalAreas("")).toEqual([]);
  });

  it("prioritises Sydney and North Shore suburbs without broad interstate cities", () => {
    const results = searchNsnSydneyLocalAreas("chat", 8);

    expect(results.map((area) => area.label)).toContain("Chatswood");
    expect(results.map((area) => area.label)).not.toContain("Melbourne");
    expect(results.map((area) => area.label)).not.toContain("Perth");
    expect(results.map((area) => area.label)).not.toContain("Darwin");
  });

  it("finds common NSN suburbs by partial area name", () => {
    expect(searchNsnSydneyLocalAreas("macquarie")[0]?.label).toBe("Macquarie Park");
    expect(searchNsnSydneyLocalAreas("pennant")[0]?.label).toBe("Pennant Hills");
    expect(searchNsnSydneyLocalAreas("west pymble")[0]).toMatchObject({ label: "West Pymble", region: "North Shore" });
  });

  it("matches aliases and normalised punctuation", () => {
    expect(searchNsnSydneyLocalAreas("CBD")[0]).toMatchObject({ label: "Sydney CBD", resultType: "Region" });
    expect(searchNsnSydneyLocalAreas("City")[0]).toMatchObject({ label: "Sydney CBD" });
    expect(searchNsnSydneyLocalAreas("St. Ives")[0]).toMatchObject({ label: "St Ives", region: "North Shore" });
    expect(searchNsnSydneyLocalAreas("Parra")[0]).toMatchObject({ label: "Parramatta", region: "Western Sydney" });
  });

  it("surfaces localities from a searched Sydney region", () => {
    const innerWestResults = searchNsnSydneyLocalAreas("Inner West", 8);
    const northernBeachesResults = searchNsnSydneyLocalAreas("Northern Beaches", 8);

    expect(innerWestResults.map((area) => `${area.label} - ${area.region}`)).toEqual(
      expect.arrayContaining(["Newtown - Inner West", "Marrickville - Inner West"])
    );
    expect(northernBeachesResults.map((area) => `${area.label} - ${area.region}`)).toEqual(
      expect.arrayContaining(["Manly - Northern Beaches", "Dee Why - Northern Beaches"])
    );
  });

  it("matches meetup activities and venues", () => {
    expect(searchNsnEvents(allEvents, "coffee").map((event) => event.id)).toEqual(
      expect.arrayContaining(["coffee-lane-cove", "board-games-coffee"])
    );
    expect(searchNsnEvents(allEvents, "Chatswood").map((event) => event.id)).toEqual(
      expect.arrayContaining(["library-calm-study", "board-games-coffee"])
    );
  });
});
