import { describe, expect, it } from "vitest";

import {
  getPersonalityPresenceSelectedCount,
  normalizePersonalityPresencePromptResponses,
  normalizePersonalityPresenceChoice,
  normalizePersonalityPresenceList,
  personalityPresenceAccessoriesOptions,
  personalityPresenceComfortAroundOptions,
  personalityPresenceFacialHairOptions,
  personalityPresenceGroomingOptions,
  personalityPresenceHairCueOptions,
  personalityPresenceHairOptions,
  personalityPresencePersonalStyleOptions,
  personalityPresencePresentationOptions,
  personalityPresencePromptOptions,
  personalityPresenceSocialStyleOptions,
  personalityPresenceVoicePresenceOptions,
} from "./personality-presence";

describe("personality and presence preferences", () => {
  it("keeps appearance fields optional and bounded to soft descriptors", () => {
    expect(normalizePersonalityPresenceChoice(null, personalityPresenceHairOptions)).toBeNull();
    expect(normalizePersonalityPresenceChoice("Dark", personalityPresenceHairOptions)).toBe("Dark");
    expect(normalizePersonalityPresenceChoice("Exact height" as never, personalityPresenceHairOptions)).toBeNull();
    expect(personalityPresenceHairOptions).toContain("Prefer not to say");
  });

  it("deduplicates multi-select social and comfort preferences", () => {
    expect(
      normalizePersonalityPresenceList(
        ["More introverted", "More introverted", "Rank me highly" as never],
        personalityPresenceSocialStyleOptions
      )
    ).toEqual(["More introverted"]);
    expect(normalizePersonalityPresenceList(["Good listeners"], personalityPresenceComfortAroundOptions)).toEqual(["Good listeners"]);
    expect(normalizePersonalityPresenceList(["Smart casual", "Smart casual"], personalityPresencePersonalStyleOptions)).toEqual(["Smart casual"]);
  });

  it("keeps presentation optional, separate, and bounded to respectful descriptors", () => {
    expect(personalityPresencePresentationOptions).toEqual([
      "Masculine-presenting",
      "Feminine-presenting",
      "Soft/neutral presentation",
      "Mixed presentation",
      "Androgynous",
      "Varies by setting",
      "Prefer not to say",
    ]);
    expect(normalizePersonalityPresenceChoice("Androgynous", personalityPresencePresentationOptions)).toBe("Androgynous");
    expect(normalizePersonalityPresenceChoice("More masculine personality" as never, personalityPresencePresentationOptions)).toBeNull();
    expect(normalizePersonalityPresenceChoice("Attractiveness ranking" as never, personalityPresencePresentationOptions)).toBeNull();
  });

  it("keeps expanded presence and expression chips privacy-safe and non-ranking", () => {
    expect(personalityPresenceHairCueOptions).toEqual([
      "Bald / shaved head",
      "Very short hair",
      "Medium-length hair",
      "Long hair",
      "Curly/wavy hair",
      "Straight hair",
      "Dark hair",
      "Brown hair",
      "Blonde hair",
      "Grey/silver hair",
      "Dyed/colourful hair",
      "Thinning/receding hair",
      "Wears head coverings sometimes",
      "Varies",
      "Prefer not to say",
    ]);
    expect(personalityPresenceFacialHairOptions).toEqual([
      "Clean-shaven",
      "Light stubble",
      "Beard",
      "Moustache",
      "Varies",
      "Cannot / don't grow facial hair",
      "Not applicable",
      "Prefer not to say",
    ]);
    expect(personalityPresenceAccessoriesOptions).toEqual([
      "Rings",
      "Necklaces",
      "Bracelets",
      "Beads",
      "Watches",
      "Earrings",
      "Piercings",
      "Cultural jewellery",
      "Minimal accessories",
      "Sentimental items",
      "Depends on the day",
      "Prefer not to say",
    ]);
    expect(personalityPresenceGroomingOptions).toEqual([
      "No makeup usually",
      "Light makeup",
      "Creative makeup",
      "Makeup for special occasions",
      "Groomed/simple",
      "Natural look",
      "Depends on the setting",
      "Not applicable",
      "Prefer not to say",
    ]);
    expect(personalityPresenceVoicePresenceOptions).toEqual([
      "Quiet voice",
      "Calm voice",
      "Warm/friendly tone",
      "Expressive when comfortable",
      "Soft-spoken",
      "Talkative once comfortable",
      "Prefer text first",
      "Prefer not to say",
    ]);
    expect(normalizePersonalityPresenceList(["Rings", "Luxury watch" as never], personalityPresenceAccessoriesOptions)).toEqual(["Rings"]);
    expect(normalizePersonalityPresenceList(["Calm voice", "Voice recording" as never], personalityPresenceVoicePresenceOptions)).toEqual(["Calm voice"]);
    expect(normalizePersonalityPresenceChoice("Usually clean-shaven" as never, personalityPresenceFacialHairOptions)).toBeNull();
    expect(normalizePersonalityPresenceList(["Short hair" as never], personalityPresenceHairCueOptions)).toEqual([]);
  });

  it("counts only user-provided preference values, not privacy visibility", () => {
    expect(
      getPersonalityPresenceSelectedCount({
        hair: "Prefer not to say",
        hairCues: ["Very short hair", "Curly/wavy hair"],
        eyes: null,
        facialHair: null,
        style: "Casual",
        presentation: "Soft/neutral presentation",
        personalStyles: ["Smart casual"],
        accessories: ["Rings", "Sentimental items"],
        grooming: ["Natural look"],
        voicePresence: ["Prefer text first"],
        socialStyles: ["Quiet at first, warmer later"],
        connectionPreferences: [],
        comfortableAround: ["Kind and patient", "Good listeners"],
      })
    ).toBe(13);
  });

  it("keeps gentle prompts optional, playful, and low-pressure", () => {
    expect(personalityPresencePromptOptions.map((option) => option.prompt)).toEqual([
      "If you had a harmless superpower, what would it be?",
      "What fictional world would you quietly live in?",
      "What kind of weather feels comforting to you?",
      "What helps you recharge socially?",
      "What snack or drink instantly improves your mood?",
      "What small thing makes a meetup feel welcoming?",
      "What helps you warm up at a meetup?",
      "What hobby or activity would you love to try one day?",
      "What kind of places help you feel relaxed?",
      "If you could instantly learn one skill, what would it be?",
    ]);
    expect(personalityPresencePromptOptions.map((option) => option.prompt).join(" ")).not.toMatch(/truth|lies|rank|score|popular|attractive|compatibility/i);
    expect(personalityPresencePromptOptions.map((option) => option.prompt).join(" ")).toContain(
      "What helps you warm up at a meetup?",
    );
    expect(personalityPresencePromptOptions.flatMap((option) => option.options)).toEqual(
      expect.arrayContaining([
        "I prefer listening first",
        "I may need a few minutes to settle in",
        "Happy to chat if someone starts",
        "I enjoy smaller groups",
        "I like knowing the plan before arriving",
      ]),
    );
    expect(personalityPresencePromptOptions[0].options).toEqual([
      "Teleportation",
      "Healing",
      "Flying",
      "Talking to animals",
      "Pause time",
      "Endless energy",
      "Calm stressful situations",
      "Understand every language",
      "Invisibility",
      "Other...",
    ]);
    expect(personalityPresencePromptOptions.every((option) => option.options.includes("Other..."))).toBe(true);
  });

  it("normalizes chip-first local prompt responses without keeping empty or unknown prompts", () => {
    expect(
      normalizePersonalityPresencePromptResponses([
        { promptId: "comforting-weather", option: "Rainy evenings" },
        { promptId: "party-test" as never, option: "Win the room" },
        { promptId: "recharge-socially", option: "" },
        { promptId: "comforting-weather", option: "A cool change by the water" },
        {
          promptId: "instant-skill",
          option: "Other...",
          customResponse: "  A very long answer that should be kept light, short, and preview-friendly rather than turning into a biography or a social performance test for anyone reading it.  ",
        },
        { promptId: "harmless-superpower", response: "Gentle teleporting from the old text model" } as never,
      ])
    ).toEqual([
      { promptId: "comforting-weather", option: "Other...", customResponse: "A cool change by the water" },
      { promptId: "instant-skill", option: "Other...", customResponse: "A very long answer that should be kept light, short, and preview-friendly rather than turning into a biography or a" },
      { promptId: "harmless-superpower", option: "Other...", customResponse: "Gentle teleporting from the old text model" },
    ]);
  });
});
