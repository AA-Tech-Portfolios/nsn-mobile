import { describe, expect, it } from "vitest";

import { searchNsnEvents, searchNsnSydneyLocalAreas } from "./nsn-search";
import { allEvents } from "./nsn-data";

describe("NSN local search", () => {
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
