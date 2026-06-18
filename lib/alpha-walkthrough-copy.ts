export const alphaWalkthroughCopy = {
  title: "Alpha tester walkthrough",
  subtitle:
    "A short, low-pressure tour for first-time testers. NSN is a Sydney/North Shore prototype, and some features are demo-only.",
  closeLabel: "Close alpha tester walkthrough",
  previousLabel: "Previous walkthrough step",
  nextLabel: "Next walkthrough step",
  finishLabel: "Finish walkthrough",
  prototypeNoteTitle: "Prototype note",
  prototypeNoteCopy:
    "Account deletion, identity checks, report review, notification delivery, and meetup check-in reminders are not production systems yet. No real account action is taken in this alpha walkthrough.",
} as const;

export const alphaProofOfConceptIntro = {
  title: "Why NSN exists",
  statement:
    "NSN is a social connection point, not a social network, dating app, therapy service, or support replacement.",
  copy:
    "It helps people take part in small, meaningful real-world experiences where connection can grow naturally. The alpha is exploring lower-pressure alternatives for people who may feel outside traditional social pathways, including people who moved cities or countries, people rebuilding socially, people out of relationships, people looking for community, people who feel lonely, or people who never found the right friendship group.",
} as const;

export const alphaProofOfConceptComparisonCards = [
  {
    platformType: "Social media",
    goodAt:
      "Sharing updates, discovering culture, staying aware of people and places, and keeping lightweight contact with wider circles.",
    mayStruggleWith:
      "It can still ask people to present themselves well, be visible, attract reactions, or turn connection into performance.",
    nsnGap:
      "NSN lowers the pressure to perform. It focuses on small real-world participation where belonging can come from showing up, not from popularity or status.",
  },
  {
    platformType: "Dating apps",
    goodAt:
      "Helping people signal romantic interest, explore attraction, and meet with clearer dating intent.",
    mayStruggleWith:
      "People who want friendship, community, or a gentle social rhythm may not want every interaction to carry romantic pressure.",
    nsnGap:
      "NSN is not designed around attractiveness, matching, or romantic outcomes. It creates space for shared activities and clearer social expectations.",
  },
  {
    platformType: "Messaging apps",
    goodAt:
      "Keeping existing relationships alive through direct chats, group threads, and quick coordination.",
    mayStruggleWith:
      "They usually work best once a connection already exists, and starting from nothing can still feel awkward or exposed.",
    nsnGap:
      "NSN gives people a real-world starting point first: a small group, a shared plan, arrival notes, and a reason to participate without forcing instant closeness.",
  },
  {
    platformType: "Professional networking platforms",
    goodAt:
      "Career visibility, professional discovery, reputation building, and work-related introductions.",
    mayStruggleWith:
      "People may still feel they need to lead with achievement, credentials, confidence, or a useful professional identity.",
    nsnGap:
      "NSN encourages belonging through ordinary participation, not achievement. The point is to join a calm social experience, not prove value.",
  },
  {
    platformType: "Large meetup/event platforms",
    goodAt:
      "Helping people find public events, interest groups, talks, workshops, and larger gatherings.",
    mayStruggleWith:
      "Large events can feel too open-ended, crowded, high-energy, or socially unclear for someone trying to rebuild confidence.",
    nsnGap:
      "NSN explores smaller groups, clear expectations, comfort information, and shared activities that make joining feel more approachable.",
  },
  {
    platformType: "Support/community programs",
    goodAt:
      "Offering care, guidance, peer support, structured programs, and help during specific life challenges.",
    mayStruggleWith:
      "Some people are not looking for formal support. They may simply need more gentle ways to be around others in everyday life.",
    nsnGap:
      "NSN does not replace therapy, friends, or support services. It offers another connection point: low-pressure social participation in the real world.",
  },
  {
    platformType: "NSN",
    goodAt:
      "Creating small, human-led social experiences with shared activities, clear expectations, comfort cues, and room to participate at a natural pace.",
    mayStruggleWith:
      "The alpha still needs to learn who hosts, how hosting feels manageable, and how much structure helps without making the experience rigid.",
    nsnGap:
      "NSN is exploring alternatives people can try together. Community Hosts guide the room without needing to be the centre of attention.",
  },
] as const;

export const alphaProofOfConceptExplorationQuestions = [
  {
    title: "Who initiates social groups?",
    copy:
      "We are exploring how new groups begin: from member suggestions, Community Hosts, local patterns, or a mix of all three.",
  },
  {
    title: "How do we support Community Hosts?",
    copy:
      "Community Hosts create and guide small social experiences without needing to be the centre of attention. The alpha should make hosting feel approachable.",
  },
  {
    title: "How can AI assist hosts without replacing initiative?",
    copy:
      "AI can help draft event ideas, descriptions, suggested venues, group sizes, arrival notes, comfort information, and conversation prompts. The host should review and approve the event before it appears.",
  },
  {
    title: "How do we keep the experience human-led?",
    copy:
      "AI should not generate empty artificial events by itself. AI assists participation and hosting. People create the community.",
  },
  {
    title: "How do we balance structure with spontaneity?",
    copy:
      "Clear expectations can reduce anxiety, while enough openness lets a meetup feel natural rather than scripted.",
  },
  {
    title: "How do we make hosting approachable?",
    copy:
      "We are testing small group sizes, simple arrival notes, clear roles, and lightweight prompts so hosting feels like guiding a shared experience, not performing.",
  },
] as const;

export const alphaWalkthroughSteps = [
  {
    title: "Start gently",
    eyebrow: "Prototype",
    copy: "NSN is a Sydney/North Shore alpha for trying low-pressure meetup ideas. Nothing here joins a real public meetup yet.",
    actionLabel: "Open Home",
    route: "/(tabs)",
    icon: "low-pressure",
  },
  {
    title: "Browse one meetup",
    eyebrow: "Demo meetups",
    copy: "Look for a calm activity like coffee, a walk, or a quiet indoor plan. Focus on whether the wording feels clear and low-pressure.",
    actionLabel: "Browse meetups",
    route: "/(tabs)/meetups",
    icon: "calendar",
  },
  {
    title: "Check comfort controls",
    eyebrow: "Saved locally",
    copy: "Review Profile for privacy, comfort, local area, and prototype detail labels. These settings stay local in the alpha.",
    actionLabel: "Open Profile",
    route: "/(tabs)/profile",
    icon: "person.fill",
  },
  {
    title: "Preview privacy",
    eyebrow: "Local visibility",
    copy: "Try profile preview, blur, and comfort modes. The goal is to understand what would be shown before sharing more.",
    actionLabel: "Open settings",
    route: "/(tabs)/settings",
    icon: "visibility",
  },
  {
    title: "Prepare for a meetup",
    eyebrow: "Readiness flow",
    copy: "Open an event, set a local RSVP state, and scan the readiness and soft-exit cards. No real booking, host message, or live support is connected.",
    actionLabel: "Open event",
    route: "/event/movie-night-watch-chat",
    icon: "calendar",
  },
  {
    title: "Share feedback simply",
    eyebrow: "No pressure",
    copy: "You can skip chats, use tester shortcuts, or leave a flow anytime. Feedback can be short and specific: what felt clear, heavy, or unfinished.",
    actionLabel: "Finish walkthrough",
    route: "/(tabs)",
    icon: "checkmark",
  },
] as const;
