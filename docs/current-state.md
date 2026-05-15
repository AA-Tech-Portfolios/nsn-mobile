# Current State

This document is the single source of truth for what the repository currently represents. Roadmaps and SoftHello planning docs can describe future possibilities; this file should stay grounded in the app as it exists now.

## Current Prototype Scope

North Shore Nights (NSN) is the active app identity: a Sydney/North Shore alpha prototype for calm, low-pressure, small-group meetups. The prototype is intended for controlled testing, UX review, and product learning.

SoftHello remains future/global context only. It should guide long-term product direction, but NSN is the current local pilot.

## Working Features

- Five-stage local onboarding: welcome, about you, meeting comfort, privacy visibility, and review.
- Local adult age validation and preferred age range safeguards.
- Home discovery for Sydney/North Shore meetup cards, with Day/Night mode, local context, weather-aware copy, category filters, search, layout density controls, and prototype map/list views.
- Event detail screens with event metadata, expectations, meeting point, weather/indoor context, media comfort labels, first-meetup support prompts, local join state, saved places, pin/hide options, and post-event feedback prompts.
- Meetups, Chats, Notifications, Profile, Settings & Privacy, and User Preferences screens.
- Profile visibility controls including blur photo, blur level, private profile, local area display, name display, age/preferred age/gender display, interests, comfort preferences, and preview modes.
- Local preference areas for transportation, location, food and beverage, hobbies/interests, contact preference, saved places, notification style, accessibility, language, regional formats, appearance, and account pause/delete demo states.
- Soft Exit, block/report-shaped controls, saved places, event sharing/pinning/hiding, arrival-update style states, and private reflection/post-event feedback logic in prototype form.
- NSN visual identity with optional SoftHello theme exploration.

## Mocked / Local-Only Systems

- **Authentication:** OAuth/server scaffolding exists, but the main app experience is still prototype-oriented. Real account lifecycle, password flows, production sessions, and account deletion are not complete production systems.
- **Verification and trust state:** contact and real-person verification are derived from local profile fields or demo inputs. No real verification provider, ID review, selfie review, compliance process, or backend trust enforcement is connected.
- **Moderation and reports:** block/report flows and structured report objects exist as local prototype logic. There is no production moderation queue, operator workflow, evidence handling, or escalation service.
- **Safety escalation:** safety copy, meeting safety gates, check-in ideas, and emergency-adjacent concepts are prototype or roadmap items. They need safety, legal, abuse-prevention, and regional review before real use.
- **Progressive reveal:** profile blur and visibility controls exist. Full staged reveal, mutual reveal consent, and backend-enforced visibility rules are not production systems yet.
- **RSVP and meetup membership:** join/leave and meetup states are saved locally for prototype behaviour. There is no authoritative backend RSVP store, waitlist, host approval, attendance audit, or attendee messaging system.
- **Location, weather, maps, and routing:** the prototype uses local data, selected local areas, fallback lookup logic, and visual map/mock routing elements. Real map tiles, route planning, live weather feeds, and transport handoff need later integration.
- **Notifications:** notification preferences are present, but production push notification delivery and safety-critical notification behaviour are not complete.
- **Localization:** many language and regional settings exist, but translations should not be treated as complete until reviewed by native speakers or community reviewers.

## Not Implemented Yet

- Production-ready auth and account management.
- Real backend persistence for profiles, RSVPs, reports, chat, verification, trust state, and meetup attendance.
- Real moderation tooling, operator review, appeal handling, or secure evidence workflows.
- Real verification provider integration.
- Production emergency tools, trusted-contact escalation, or live safety response.
- Live group chat backed by a server.
- Public event creation by regular users with moderation and abuse controls.
- Real map, transport, weather, and locality APIs with attribution and reliability guarantees.
- SoftHello global launch branding, copy, and region-neutral settings.
- Public beta or production launch readiness.

## Current Tech Stack

- Expo and React Native.
- Expo Router.
- TypeScript.
- PNPM.
- React Query and tRPC client/server scaffolding.
- Express server scaffold.
- Drizzle ORM scaffold.
- AsyncStorage for local prototype state.
- Vitest for selected logic tests.

## Current Alpha Limitations

- Data may be local to the device/browser and can be reset.
- Some buttons intentionally show demo, coming-soon, or saved-locally behaviour.
- Safety, trust, moderation, and verification surfaces are not a substitute for real-world safety operations.
- NSN should not be used for unsupervised real meetups until the alpha organiser confirms the test conditions separately.
- Translation, accessibility, and regional behaviour need further review on real devices and with real users.
- The prototype has been iterated primarily for product exploration and alpha readiness, not production hardening.

## Platforms Tested

Current validation has focused on TypeScript checks, local Expo/web startup, screenshots, and manual prototype review. iOS, Android, and web should each receive explicit manual QA before broader alpha testing.

## Current Active Identity vs Future Direction

- **Current active identity:** North Shore Nights, a Sydney/North Shore local alpha prototype.
- **Future/global direction:** SoftHello, the broader product and brand direction for low-pressure, privacy-aware social connection.

See also: [`nsn-alpha-readiness.md`](nsn-alpha-readiness.md), [`brand-systems.md`](brand-systems.md), [`softhello-feature-map.md`](softhello-feature-map.md), and [`../todo.md`](../todo.md).
