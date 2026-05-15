# SoftHello Feature Map

> Future/global context only: North Shore Nights (NSN) remains the active identity for this repository and Sydney/North Shore pilot.

This map separates SoftHello ideas into MVP, post-MVP, and future work so v1.1 stays buildable.

For actual NSN prototype coverage, use [`current-state.md`](current-state.md). This file is a future/global feature boundary map, not the implementation source of truth.

## MVP

The MVP should focus on the smallest complete trust-first loop: onboard, discover, connect, join, chat, meet safely, and reflect privately.

| Feature | MVP Intent |
|---|---|
| 18+ onboarding | Confirm the product is only for adults before account creation continues. |
| Suburb/location | Keep discovery local without requiring a precise public address. |
| Intent selection | Let users choose friends, dating, both, or exploring. |
| Comfort profile | Capture low-pressure preferences such as small groups, text-first, and pacing. |
| Optional profile photo | Allow users to start without feeling exposed. |
| Profile blur | Default to privacy and let users control visibility. |
| Local event discovery | Make events the first concrete path into the product. |
| Event details | Show enough context to reduce uncertainty before joining. |
| Intro/group chat | Support intentional text-first communication. |
| Hello/request action | Let users initiate gently without swipe pressure. |
| Basic verification state | Show whether a user is contact verified or real-person verified, without claiming real verification until a provider/backend exists. |
| Meeting safety rule | Explain that in-person meetings require a verified trust state; production enforcement depends on real verification and backend rules. |
| Block user | Instant, private safety control. |
| Report concern | Structured feedback that can feed moderation once a real review workflow exists. |
| Post-event feedback | Private reflection and safety signal after a meetup. |
| Availability signals | Optional guidance such as available now, taking it slow, or busy but open later. |

## Post-MVP

These features fit SoftHello but should not block v1.1 unless a specific launch requirement depends on them.

| Feature | Why Post-MVP |
|---|---|
| Trust Circles and groups | Useful for safer introductions, but the MVP can start with event groups. |
| Full progressive reveal stages | The concept is core, but v1.1 can start with blurred/visible and consent messaging. |
| Richer verification flow | Live selfie or ID checks require provider and backend decisions. |
| Calm music player | Strong wellbeing feature, but not required for the first social loop. |
| Mini-games | Good icebreaker layer, but secondary to safety and core event flows. |
| Buddy mode or guide request | Valuable for first meetups, but requires staffing or matching rules. |
| Guided tutorials | Helpful once MVP screens stabilize. |
| Saved comfort places | Useful for repeated safe venue selection after event basics work. |
| Conversation starter cards | Low-cost enhancement for chats and meetups. |
| Host templates | Speeds up event creation after the event model is stable. |
| Daily motivational messages | Optional comfort feature shown when users open the app, with a setting to turn it on or off. |
| App animation toggle | Let users enable or disable decorative app animations separately from core accessibility reduce-motion support. |
| Personality compatibility matching | Useful once comfort, intent, pacing, and meetup preference data exist; should avoid ranking people or creating pressure to perform. |
| Zodiac and personality prompts | Can support playful self-expression if optional, private-by-default, and never treated as a hard compatibility score. |
| Gentle RSVP states | Let people express coming, interested, deciding later, or needing encouragement without making uncertainty feel like failure. |
| Meetup comfort roles | Optional labels such as quiet joiner, happy to chat, host helper, or first-time attendee can reduce ambiguity before meeting. |
| Pre-meetup readiness checklist | Helps users confirm the location, host, plan, safety options, and exit path before they commit emotionally to attending. |
| Event troubleshooting tools | Help participants coordinate around work, study, and timetable constraints after the basic event flow is stable. |
| Lightweight transport guidance | Reduce arrival anxiety with nearby stops, estimated travel time, suggested arrival windows, meeting-point context, and links out to map apps. |
| Mutual 1-1 chat consent | Lets members opt into direct pre-meetup chats without assuming everyone wants private messages. |
| Mutual profile photo reveal | Extends profile blur with a two-sided consent step when both members are ready. |
| Post-meetup contact preferences | Unlock phone or video call options only after meeting, then let each person choose how or whether to stay in contact. |
| Post-meetup chat lifecycle controls | Let users archive or hide chats, delete with 30-day recovery, and manage whether the connection continues. |
| Soft Exit | Give users a calm way to leave a meetup, chat, or connection with optional preset wording and no public drama. |
| AI companion | Nice-to-have comfort layer for meetup preparation, reflection, and planning support after the core social and safety loop proves itself. |

## Future

These belong in later product strategy after the MVP proves the core loop.

| Feature | Future Direction |
|---|---|
| Trust and reputation systems | Must avoid public scoring and should be designed carefully. |
| Guided conflict resolution | Requires moderation policy, content design, and support workflows. |
| Enhanced moderation tooling | Depends on production data, reports, and operator needs. |
| Deeper group interactions | Useful once groups prove meaningful in real use. |
| Improved verification methods | Depends on compliance, vendors, and risk model. |
| Advanced matching | Should remain comfort-first and avoid performance-based mechanics. |
| Large public communities | Out of scope until safety and moderation are mature. |
| Group planning votes | Needs careful research because voting may help choose times or venues, but can also create pressure, majority-rule discomfort, or visible rejection. |

## Current Prototype Coverage

The current implementation snapshot lives in [`current-state.md`](current-state.md). In short, NSN already has a local alpha prototype for onboarding, Home discovery, event details, meetup/chat previews, profile visibility, comfort preferences, saved-local event states, and settings.

The current prototype does not yet have production auth, real backend RSVP persistence, live chat, real verification, production moderation, backend trust enforcement, emergency escalation, or SoftHello global launch branding.
