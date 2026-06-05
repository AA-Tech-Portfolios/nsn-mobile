# Project TODO

## Current Product Direction (2026 Alpha)

NSN is currently focused on a Sydney/North Shore alpha pilot for low-pressure, small-group social meetups. The alpha should prioritise calm onboarding, tester-friendly UX, progressive privacy controls, comfort settings, and broad local-area discovery without overpromising production safety, verification, backend trust, or real authentication. SoftHello remains the future/global product direction after the local pilot has been validated.

## Difficulty Labels

- 🟢 Easy: frontend-only polish, copy, layout, local state, screenshots, small UI fixes
- 🟡 Medium: multi-screen UX, local flows, reusable components, more involved state
- 🟠 Hard: backend/auth/database, verification, map APIs, production trust/safety systems
- 🔴 Future / Planning only: ideas that should stay as notes until alpha feedback or legal/privacy review

## Difficulty-Labelled Alpha Buckets

These labels are a prioritisation pass for the outstanding backlog. They do not approve backend/auth work, production trust systems, emergency tooling, payments, AI agents, or large navigation rewrites.

### 🟢 Easy Alpha Polish

- [x] 🟢 Regenerate checkpoint screenshots after the alpha UX cleanup, including Home, Meetups, Event Details, Chats, Profile, Settings & Privacy, and onboarding stages
- [x] 🟢 Review onboarding calmness and clarity so NSN reads as a local Sydney/North Shore alpha, not a production matching, safety, or verification system
- [x] 🟢 Review Settings & Privacy prototype wording so local-only, demo, coming-soon, saved-locally, and prototype verification copy feels clear without sounding alarming
- [ ] 🟢 Review text wrapping on mobile for titles, descriptions, location text, and important card copy
- [ ] 🟢 Review bottom-nav spacing so chat composers, scroll views, modals, and card lists sit above the tab bar/home indicator without excessive empty space
- [x] 🟢 Add empty-state timing messages for no active events, sleeping time, and quiet hours
- [x] 🟢 Add README screenshots or mockups for the home screen, profile privacy, event details, Settings & Privacy, and onboarding
- [x] 🟢 Refresh checkpoint screenshots for core tabs, Settings & Privacy, and onboarding stages after recent UI changes
- [ ] 🟢 Keep product language clear: NSN is the local Sydney/North Shore pilot, while SoftHello is the future/global direction

### 🟡 Medium Local UX Flows

- [x] 🟡 Add gentle local RSVP states: Going, Interested, Deciding later, Running late, Unable to make it, and Clear
- [ ] 🟡 Add a pre-meetup readiness flow covering expectations, location, host, plan, safety reminder, backup plan, and exit options
- [ ] 🟡 Add interactive tutorials for privacy, preview visibility, comfort modes, and key meetup flows
- [ ] 🟡 Add opt-out and group-change flows that reassure users it is okay to skip, leave, find a better-suited group, or create their own
- [ ] 🟡 Explore calmer top-level settings groups such as Profile, Preferences, Appearance & Layout, Safety & Support, and App Settings while keeping navigation lightweight, scannable, mobile-friendly, and desktop-friendly
- [ ] 🟡 Expand Profile display preferences so Home, Profile, and event-card layout controls share clearer naming and previews

### 🟠 Hard / Not Alpha Implementation Scope

- [ ] 🟠 Add 18+ compliance copy and safeguards beyond local age entry
- [ ] 🟠 Decide the real verification provider strategy and UX handoff before claiming production verification
- [ ] 🟠 Use `docs/database-auth-planning.md` to guide staged database/auth planning before replacing local prototype state or collecting live personal data
- [ ] 🟠 Add a real trust-state backend before treating verification or privacy gates as production systems
- [ ] 🟠 Continue suburb/locality refinement with an API-backed or maintained Australian locality dataset
- [ ] 🟠 Add real Sydney/OpenStreetMap integration with proper attribution and no paid map-key dependency
- [ ] 🟠 Add lightweight transportation and routing support with nearby stops, estimated travel time, suggested arrival windows, selected-event map focus, and links out to maps
- [ ] 🟠 Add profile photo crop, resize, filter, blur, and privacy-control tools after real upload/storage decisions are made

### 🔴 Future / Planning Only

- [ ] 🔴 Future optional concept: explore Care & Connections as a friendship-first layer for recurring, interest-based small community circles after alpha feedback
- [ ] 🔴 Future community culture concept: explore Gentle Belonging and Cupcake Moments in `docs/community-support-vision.md`
- [ ] 🔴 Future event detail display planning only: explore a Quick view / Detailed view toggle after section state, accessibility expectations, and tester feedback are clearer
- [ ] 🔴 Future Guides & Tips preferences, planning only: explore Minimal, Gentle guidance, and Detailed onboarding modes
- [ ] 🔴 Later safety/legal review: optional trusted contacts, discreet emergency help, check-in timers, share-my-meetup-plan controls, location-sharing safeguards, region-aware emergency resources, crisis links, and abuse-prevention rules
- [ ] 🔴 Future QR/invite trust planning only: explore QR code meetup joining, invite links, introduced guest context, and host/admin controls without implementing backend, auth, permissions, moderation, real QR generation, or trust automation
- [ ] 🔴 Future co-host permissions planning only: explore helper roles without framing them as authority, moderation, verification, or safety-enforcement roles
- [ ] 🔴 Explore an optional AI assistant only after alpha feedback, and keep it separate from human support, safety reporting, verification, emergency flows, backend storage, notifications, analytics, or autonomous actions
- [ ] 🔴 Post-pilot: evaluate transition toward SoftHello branding based on demand, testing, and regional expansion

## Recommended Next Implementation Queue

These are the safest near-term alpha tasks. They should remain frontend-only/local-only and should avoid backend/auth, real verification, production moderation, emergency tooling, payments, AI agents, or navigation rewrites.

1. **Refresh checkpoint screenshots** ✅ Completed  
   **Difficulty:** 🟢 Easy  
   **Why it matters for alpha:** Keeps the visible product record aligned with the current mobile fixes and reduces confusion during tester walkthroughs.  
   **Suggested files:** `scripts/capture-checkpoint-screenshots.mjs`, `screenshots/checkpoint/*`, `docs/alpha-tester-guide.md`, `README.md`  
   **Scope:** frontend-only/local-only  
   **Checks:** `pnpm check`, `pnpm test`, then visually review changed screenshots

2. **Calm onboarding wording pass** ✅ Completed  
   **Difficulty:** 🟢 Easy  
   **Why it matters for alpha:** Helps testers understand NSN as a small Sydney/North Shore prototype without implying production matching, safety, or verification.  
   **Suggested files:** `app/onboarding.tsx`, `lib/onboarding-snapshot.ts`, `docs/alpha-tester-guide.md`  
   **Scope:** frontend-only/local-only  
   **Checks:** `pnpm check`, `pnpm test`, mobile onboarding smoke test

3. **Prototype-safe Settings & Privacy copy pass** ✅ Completed  
   **Difficulty:** 🟢 Easy  
   **Why it matters for alpha:** Makes local-only, demo, coming-soon, saved-locally, and prototype verification wording reassuring instead of alarming.  
   **Suggested files:** `app/(tabs)/settings.tsx`, `lib/settings-controls.ts`, `components/prototype-local-note.tsx`  
   **Scope:** frontend-only/local-only  
   **Checks:** `pnpm check`, `pnpm test`, mobile Settings & Privacy smoke test

4. **Mobile text wrapping audit**  
   **Difficulty:** 🟢 Easy  
   **Why it matters for alpha:** Prevents clipped titles, locations, descriptions, badges, and action text from making the app feel unfinished.  
   **Suggested files:** `app/(tabs)/index.tsx`, `app/(tabs)/meetups.tsx`, `app/event/[id].tsx`, `app/(tabs)/profile.tsx`  
   **Scope:** frontend-only/local-only  
   **Checks:** `pnpm check`, `pnpm test`, small-iPhone smoke test

5. **Bottom-nav spacing polish**  
   **Difficulty:** 🟢 Easy  
   **Why it matters for alpha:** Keeps cards, composers, modals, and buttons reachable without creating awkward empty space.  
   **Suggested files:** `app/(tabs)/_layout.tsx`, `components/screen-container.tsx`, `app/(tabs)/chats.tsx`, `app/(tabs)/index.tsx`, `app/(tabs)/meetups.tsx`  
   **Scope:** frontend-only/local-only  
   **Checks:** `pnpm check`, `pnpm test`, mobile tab smoke test

6. **Gentle empty states for quiet times** ✅ Completed  
   **Difficulty:** 🟢 Easy  
   **Why it matters for alpha:** Helps no-event, sleeping-time, and quiet-hour states feel intentional rather than broken.  
   **Suggested files:** `app/(tabs)/index.tsx`, `app/(tabs)/meetups.tsx`, `lib/nsn-data.ts`, `lib/home-view-filters.ts`  
   **Scope:** frontend-only/local-only  
   **Checks:** `pnpm check`, `pnpm test`, empty-state visual smoke test

7. **Gentle RSVP state prototype** ✅ Completed  
   **Difficulty:** 🟡 Medium  
   **Why it matters for alpha:** Lets testers express interest without binary pressure, while staying local-only and reversible.  
   **Suggested files:** `app/event/[id].tsx`, `app/(tabs)/meetups.tsx`, `lib/nsn-data.ts`, possible focused test file under `lib/*test.ts` if state helpers are extracted  
   **Scope:** frontend-only/local-only  
   **Checks:** `pnpm check`, `pnpm test`, RSVP interaction smoke test

8. **Running late / cannot make it wording review** ✅ Completed  
   **Difficulty:** 🟢 Easy  
   **Why it matters for alpha:** Keeps attendance changes low-pressure and kind without implying live notifications or backend delivery.  
   **Suggested files:** `app/(tabs)/chats.tsx`, `app/event/[id].tsx`, `lib/nsn-data.ts`  
   **Scope:** frontend-only/local-only  
   **Checks:** `pnpm check`, `pnpm test`, chat/event detail smoke test

9. **Profile/User Options grouping clarity pass**  
   **Difficulty:** 🟡 Medium  
   **Why it matters for alpha:** Reduces duplicate concepts across Profile, Preferences, Appearance & Layout, Safety & Support, and App Settings.  
   **Suggested files:** `app/(tabs)/profile.tsx`, `app/(tabs)/user-preferences.tsx`, `lib/profile-menu-row-metadata.ts`, `lib/options-hub.ts`  
   **Scope:** frontend-only/local-only  
   **Checks:** `pnpm check`, `pnpm test`, mobile drawer smoke test

10. **Alpha walkthrough checklist copy refresh** ✅ Completed  
    **Difficulty:** 🟢 Easy  
    **Why it matters for alpha:** Gives trusted testers a clearer path through privacy, comfort, meetup browsing, profile review, and demo-only safety language.  
    **Suggested files:** `docs/alpha-tester-guide.md`, `docs/alpha-tester-feedback-checklist.md`, `app/(tabs)/alpha-walkthrough.tsx`  
    **Scope:** documentation/frontend-only/local-only  
    **Checks:** `pnpm check`, `pnpm test`, read-through for prototype-safe claims

11. **README screenshot/mockup update** ✅ Completed  
    **Difficulty:** 🟢 Easy  
    **Why it matters for alpha:** Makes the repository presentation match the current NSN direction and helps future review sessions start with the right expectations.  
    **Suggested files:** `README.md`, `screenshots/home-web-mobile.png`, `screenshots/home-web-desktop.png`, `screenshots/checkpoint/*`  
    **Scope:** documentation/frontend-only/local-only  
    **Checks:** `pnpm check`, `pnpm test`, README render/read-through

12. **Community Guidelines visibility check** ✅ Completed  
    **Difficulty:** 🟢 Easy  
    **Why it matters for alpha:** Ensures photo/video consent and privacy reminders are visible without feeling heavy or corporate.  
    **Suggested files:** `app/event/[id].tsx`, `app/(tabs)/settings.tsx`, `lib/community-support-resources.ts`, `docs/alpha-tester-guide.md`  
    **Scope:** frontend-only/local-only  
    **Checks:** `pnpm check`, `pnpm test`, event detail and Settings smoke test

13. **Home density readability pass**  
    **Difficulty:** 🟢 Easy  
    **Why it matters for alpha:** Keeps Compact, Comfortable, and Spacious modes useful without making Home feel overloaded.  
    **Suggested files:** `app/(tabs)/index.tsx`, `lib/home-layout-presets.ts`, `lib/home-view-filters.ts`, `lib/home-header-context.ts`  
    **Scope:** frontend-only/local-only  
    **Checks:** `pnpm check`, `pnpm test`, desktop/mobile density smoke test

14. **Prototype badge consistency review** ✅ Completed  
    **Difficulty:** 🟢 Easy  
    **Why it matters for alpha:** Keeps Demo, Coming soon, Saved locally, and Prototype labels consistent so testers do not mistake local controls for live systems.  
    **Suggested files:** `app/(tabs)/settings.tsx`, `app/(tabs)/profile.tsx`, `app/event/[id].tsx`, `components/prototype-local-note.tsx`  
    **Scope:** frontend-only/local-only  
    **Checks:** `pnpm check`, `pnpm test`, copy audit for production-sounding claims

15. **Tester feedback prompt tidy-up** ✅ Completed  
    **Difficulty:** 🟢 Easy  
    **Why it matters for alpha:** Makes feedback easier to give around comfort, clarity, privacy, text wrapping, and low-pressure meetup flow.  
    **Suggested files:** `docs/alpha-tester-feedback-checklist.md`, `app/(tabs)/alpha-walkthrough.tsx`  
    **Scope:** documentation/frontend-only/local-only  
    **Checks:** `pnpm check`, `pnpm test`, read-through against alpha tone

## Future Website Planning

This is a post-alpha or near-alpha planning note only. Do not implement a website, waitlist backend, analytics, marketing automation, production safety claims, verification claims, matching claims, payment flows, or emergency claims from this section.

- [ ] 🔴 Plan a simple landing page that introduces North Shore Nights as a Sydney/North Shore alpha for low-pressure, small-group social meetups
- [ ] 🔴 Explain that SoftHello is the future/global direction, while NSN is the local learning pilot
- [ ] 🔴 Include current screenshots or mockups so testers can understand the product before installing or joining a walkthrough
- [ ] 🔴 Write a short privacy/trust philosophy in plain language: local prototype, minimal pressure, careful disclosure, no production verification claims
- [ ] 🔴 Add a tester/waitlist/contact section only when there is a clear privacy-safe way to collect or route interest
- [ ] 🔴 Use clear prototype/alpha wording throughout, including what is local-only or demo-only
- [ ] 🔴 Avoid claims about production safety, real identity verification, matching quality, emergency support, moderation coverage, payment handling, or automated trust decisions
- [ ] 🔴 Keep the first version small: landing page, product explanation, screenshots/mockups, privacy/trust note, tester/contact path, and SoftHello direction

## Social Handle Reservation Checklist

This is brand protection and future discoverability planning only. Reserving handles is separate from launching public marketing. For now, the goal is not audience growth, posting automation, or social media operations.

Platforms to consider later:

- [ ] 🔴 Instagram
- [ ] 🔴 Facebook Page
- [ ] 🔴 TikTok
- [ ] 🔴 YouTube
- [ ] 🔴 X/Twitter
- [ ] 🔴 LinkedIn Page
- [ ] 🔴 Threads
- [ ] 🔴 Domain names

Names to consider:

- [ ] 🔴 NorthShoreNights
- [ ] 🔴 NorthShoreNightsAU
- [ ] 🔴 NSNApp
- [ ] 🔴 NSNSydney
- [ ] 🔴 SoftHello
- [ ] 🔴 SoftHelloApp

## Repository Maintenance

- [ ] 🟢 Follow up on GitHub Actions warning: `pnpm/action-setup@v4` targets Node.js 20 and is being forced to run on Node.js 24; update or replace the action when a Node 24-compatible release is available.

## Immediate Alpha Priorities

- [x] Run a rendered mobile drawer smoke test on device or Expo web after dependency/type checks, focusing on drawer scrolling, close behaviour, and long label wrapping
- [x] Run mobile and desktop smoke tests for Compact, Comfortable, and Spacious Home layouts, focusing on map height, bottom-nav clearance, wrapped chips, and section visibility rows
- [x] Smoke test Settings & Privacy plus User Preferences on desktop and mobile, focusing on expanded accordion wrapping, keyboard focus through chips, and Profile/User Options back navigation
- [x] Review checkpoint screenshots for desktop and mobile layout regressions
- [x] Create an alpha tester feedback checklist after the walkthrough has been exercised
- [x] Continue button behaviour audit across Profile, Settings & Privacy, modal menus, disabled controls, and saved-locally actions
- [x] Keep prototype-only account actions visible for alpha as local pause and deletion-preview controls, with calm wording that real deletion/auth/backends are not connected yet
- [x] 🟢 Regenerate checkpoint screenshots after the alpha UX cleanup, including refreshed profile/demo identity assets
- [ ] 🟢 If exact original event-image upload pixels are needed later, save source files into `assets/images/events` and swap Home preview sources to local files

## Alpha Walkthrough Notes (May 2026)

This pass is a planning and review checkpoint for the NSN 2026 alpha. Do not treat these notes as approval for backend/auth work, real verification providers, emergency tooling, or large navigation rewrites. The next implementation pass should stay focused on mobile UX, tester clarity, prototype-safe trust wording, and reducing clutter.

- Review onboarding calmness and clarity: the flow should explain NSN as a local Sydney/North Shore prototype without sounding like a production matching, safety, or verification system.
- Review Home Options accordion density: sections should remain scannable on mobile, and Home should not feel overwhelming after recent Options, Preferences, and prototype tools additions.
- Review mobile overflow and clipping: verification, Profile drawers, Settings accordions, Home cards, Meetup cards, and Event details should scroll naturally and avoid hidden actions.
- Review bottom-nav spacing: chat composers, scroll views, modals, and card lists should sit above the tab bar/home indicator without excessive empty space.
- Review Profile/User Options grouping clarity: Profile, Preferences, Appearance & Layout, Safety & Support, and App Settings should feel distinct, with no confusing duplicate concepts.
- Review Settings & Privacy prototype wording: local-only, demo, coming-soon, saved-locally, and prototype verification copy should be clear without sounding alarming.
- Review verification flow: testers should be able to set local Contact Verified or Real Person Verified states, see the Profile trust badge update, and understand that no real identity verification occurs.
- Review chats and keyboard/composer spacing: group and private chat composers should feel calm, reachable, and consistently placed on smaller iPhones.
- Review meetup details comfort/safety wording: comfort, weather, photo/video consent, safety notes, and Community Guidelines alpha copy should feel practical and low-pressure.
- Review text wrapping on mobile: titles, descriptions, location text, and important card copy should wrap where readability matters instead of truncating too early.
- Keep checkpoint screenshots current after future walkthroughs and UI changes.

## Alpha UX Review Checklist

- [ ] No clipped mobile content
- [ ] No empty icon containers
- [ ] All buttons reachable on smaller iPhones
- [ ] Settings names feel distinct
- [ ] No confusing duplicate concepts
- [ ] Prototype/demo wording is clear
- [ ] Chats feel calm and low-pressure
- [ ] Home does not feel overwhelming
- [ ] Bottom-nav spacing is correct
- [ ] Text wraps instead of truncating where readability matters
- [ ] Verification works and stays prototype-safe
- [x] Community Guidelines alpha copy is visible and calm
- [x] Checkpoint screenshots are regenerated after the walkthrough

## Post-Alpha Core Features

- [ ] Add Guides or buddy-mode support to help first-time attendees feel oriented without creating pressure
- [ ] Add host templates for common meetup types
- [x] Add conversation starter cards and pre-made replies for low-pressure chats and meetups (implemented in prototype form as local-only helper chips)
- [ ] Gather tester feedback on whether gentle friendship/dating guidance feels reassuring or unnecessary
- [ ] Gather tester feedback on whether belonging/support guidance feels reassuring or too personal
- [x] Explore low-pressure first-meetup guidance (implemented in prototype form through first-meetup support, arriving-alone reassurance, and calm meetup guidance copy)
- [ ] Future idea, not production-ready: explore Pre-meetups as an optional comfort step before larger meetups, where users can choose a casual public first meeting such as a cafe, set their own pace, and indicate whether they would feel safer starting 1:1 or with a small group
- [ ] Future optional concept, planning only: explore Care & Connections as a friendship-first layer for recurring, interest-based small community circles that complement occasional meetups. This should support gradual familiarity, repeated faces, low-pressure participation, and comfort-led social pacing for people who find one-off events, loud venues, cold introductions, or performative social settings overwhelming. Keep it accessible, neurodiversity-aware, and useful for introverted or socially cautious users too, without framing it as therapy, clinical support, or disability-only. Possible circles could include Cards & Connections, Cars & Connections, Creativity & Connections, Cooking & Connections, and Capability & Connections. These circles could help users build friendships, arrange small events or parties that fit their needs, and choose venues outside the home such as bowling, mini-golf, escape rooms, cafes, parks, board game nights, or other accessible local options. Later, explore an optional, low-pressure preference where users can indicate they are open to dating eventually, while keeping the main focus friendship-first and community-first and avoiding any dating-first mechanic.
- [ ] Future community culture concept, planning only: explore Gentle Belonging and Cupcake Moments in `docs/community-support-vision.md`, including quiet optional milestones, shared food and care rituals, community sharing, environmental awareness, helper appreciation, community anniversaries, and later identity merchandise. Keep this privacy-first, low-pressure, non-competitive, allergy-aware, culturally respectful, and separate from UI, backend, gamification, rewards, payments, donations, commerce, moderation, permission systems, API calls, or AI logic.
- [ ] Explore consent-first buddy/guide systems
- [ ] Explore buddy/guide support for first-time attendees
- [ ] Future event detail display planning only: explore a Quick view / Detailed view toggle where Quick view shows calm essentials and Detailed view keeps documentation-style information for users who prefer reading before attending. Do not implement until section state, accessibility expectations, and tester feedback make it clearly worthwhile.
- [ ] Future Guides & Tips preferences, planning only: explore Minimal, Gentle guidance, and Detailed onboarding modes for optional contextual help. Tips should stay dismissible per tab or screen, short, non-blocking, non-gamified, privacy-first, and free of analytics or engagement tracking unless reviewed later.
- [ ] Explore consent-first comfort gestures only after community guidelines and safety review
- [ ] Add crisis/resource links only after regional safety/legal review
- [ ] Ensure support features are privacy-safe and do not expose sensitive personal information
- [ ] Avoid encouraging emotional dependency or replacing real support systems in support/belonging features
- [ ] Add interactive tutorials for privacy, preview visibility, comfort modes, and key meetup flows
- [ ] Add personality or preference-based recommendations that prioritise comfort, intent, pacing, shared interests, communication style, and group-size comfort without turning NSN into a quiz
- [ ] Connect social energy, communication style, group size, interests, food, and other comfort preferences to real preference-based recommendations
- [ ] Separate Day Events and Evening Events into clearer availability states and notify users when it is time to switch views
- [ ] Add event troubleshooting tools to help participants coordinate around busy work, study, and timetable constraints
- [ ] Evaluate whether group voting helps plan meetups or creates extra pressure for participants
- [ ] Unlock phone or video call preferences after a meetup, with users choosing the contact mode they are comfortable with
- [ ] Add post-meetup chat controls: archive or hide chats, delete with 30-day recovery, and choose whether to stay in contact
- [ ] Add chat appearance settings so users and hosts/admins can change background and text colours
- [ ] Add opt-out and group-change flows that reassure users it is okay to skip, leave, find a better-suited group, or create their own

## Safety, Privacy & Trust

- [x] Add compact alpha Community Guidelines wording for photo/video consent and no sharing private chats, profiles, screenshots, or meetup details without consent
- [x] Add event media comfort labels and prototype privacy/photo/video/screenshot reporting reminders (media labels and local report-shaped flows exist; production reporting remains deferred)
- [x] Add alpha copy clarifying broad local-area discovery, manual suburb selection, and no continuous background location in the prototype
- [ ] 🔴 Future location privacy planning only: if precise location sharing is ever added, keep it opt-in, temporary, event-specific, revocable, and clearly labelled with who can see it, how long it lasts, and how to stop it. Avoid permanent live maps, background tracking, proximity radar, exact home/routine exposure, or safety/emergency claims.
- [ ] Add 18+ compliance copy and safeguards beyond local age entry
- [ ] Decide the real verification provider strategy and UX handoff before claiming production verification
- [ ] Use `docs/database-auth-planning.md` to guide staged database/auth planning before replacing local prototype state or collecting live personal data
- [ ] Add a real trust-state backend before treating verification or privacy gates as production systems
- [ ] Expand privacy rules for progressive visibility, matched/shared visibility, event-visible fields, warm-up disclosure, and mutual profile-photo reveal
- [ ] Add mutual pre-meetup consent for optional 1-1 chats between members
- [ ] Decide whether verified student, work, or volunteer status is ever needed; if added, keep it optional, broad, privacy-controlled, and separate from exact employer or institution display
- [ ] Add stronger privacy controls for exact schools, workplaces, volunteer organisations, schedules, and routines before supporting those fields
- [ ] Gather tester feedback on whether comfort/trust settings feel clear, calm, and lightweight
- [ ] Gather tester feedback on whether background, community, work, study, and life-context sharing feels safe, useful, fresh enough, and appropriately broad
- [ ] Complete safety, privacy, legal, and regional compliance specifications before implementing emergency, verification, backend trust, or real-auth features
- [ ] Keep any future emergency-preparedness or first-aid awareness content clearly labelled as guidance only, not emergency medical advice, diagnosis, symptom checking, dispatch, medication storage, or health-data collection
- [ ] Review any future trusted contact, check-in, share-my-meetup-plan, emergency-awareness, or first-aid resource features for privacy, consent, misuse, legal, regional, and accessibility risks before implementation
- [ ] Later safety/legal review: optional trusted contacts, discreet emergency help, check-in timers, share-my-meetup-plan controls, location-sharing safeguards, region-aware emergency resources, crisis links, and abuse-prevention rules
- [ ] Keep future safety-awareness features calm and informational: guidance, reassurance, optional check-ins, external resource links, and emergency-service signposting only, without live tracking, threat detection, risk scoring, or panic-based UX
- [ ] Explore lightweight post-meetup reassurance flows such as got home safely, leaving now, heading home later, quiet exit/check-in, trusted contact reminder, and share-my-meetup-plan controls, all optional and easy to ignore without guilt
- [ ] Gather tester feedback on whether optional check-ins feel reassuring or intrusive, and preserve the low-pressure social atmosphere before connecting any check-in ideas to accounts, notifications, or trusted-contact systems
- [ ] Future QR/invite trust planning only: explore QR code meetup joining, invite links, unverified guest/family/friend invites, and host/admin controls to disable QR or invite links. QR/invite links should create a request or introduction, not automatic trust, attendance, verification, or access. Hosts/admins may verify or approve where appropriate, and attendees should see clear guest or introduced-by context so no one is surprised. Do not implement backend, auth, permissions, moderation, real QR generation, or trust automation from this note.

## Meetup Experience

- [x] Add gentle local RSVP states: Going, Interested, Deciding later, Running late, Unable to make it, and Clear
- [x] Add optional meetup comfort roles such as quiet joiner, happy to chat, host helper, first-time attendee, or guide request (implemented in prototype form as local-only role chips)
- [ ] Add a pre-meetup readiness flow covering expectations, location, host, plan, safety reminder, backup plan, and exit options
- [ ] Explore Pre-meetup UX only as a future safety/social comfort feature: support gradual trust before group activities, keep first meetings public and casual, make 1:1 or small-group comfort optional, and avoid creating pressure to prove readiness for the main meetup
- [ ] Explore lightweight emergency-awareness guide pages covering staying calm, contacting local emergency services when someone is in immediate danger, asking venue staff for help, locating exits, water, restrooms, and open-air spaces, and leaving/rejoining meetups without stigma
- [ ] Explore basic first-aid awareness links to external resources such as Australian Red Cross First Aid app, Healthdirect Australia first aid guidance, and St John Ambulance resources, with clear "not emergency medical advice" wording
- [ ] Add optional outbreak/illness comfort guidance around personal space, staying home when unwell, open-air venues, and respectful non-contact preferences without collecting health status or medical details
- [ ] Explore gentle event/environment awareness for weather disruption, bushfire/flood awareness, transport disruption guidance, large-event crowd intensity, and quieter meetup alternatives nearby, with clear "guidance only" framing and no real-time emergency claims
- [x] Add future wording patterns for meetup safety support: optional check-in, quiet reassurance, leave anytime, let trusted people know you got home safely, and guidance only (implemented in prototype form as quiet-exit, arriving-alone, and practical guidance copy)
- [ ] Add lightweight transportation and routing support with nearby stops, estimated travel time, suggested arrival windows, selected-event map focus, and links out to maps
- [ ] Add route-aware recommendations that combine transport comfort, local area preference, venue accessibility, selected event timing, and external map handoff options
- [ ] Add stronger venue accessibility metadata for step-free routes, parking, lighting, quietness, public transport proximity, dietary safety, quiet seating, alcohol-free comfort, and cafe suitability
- [ ] Gather tester feedback on whether smoke, scent, conversation tone, and venue accessibility comfort preferences feel helpful without becoming too personal or clinical
- [ ] Keep sensory and practical venue comfort preferences optional and avoid using them for ranking, exclusionary filters, or judgemental "good/bad venue" scoring
- [ ] Support quieter meetup alternatives near large public events without implying high-energy events are less welcome
- [ ] Explore calm corner or reset-area guidance for venues, including clear prototype-only wording until venue details are verified
- [ ] Gather tester feedback on whether crowd, pet/allergy, sensory, and flexible social-pacing comfort labels feel helpful and low-pressure
- [ ] Improve accessibility guidance for large public events, including arrival, step-out, crowd-density, noise, seating, transport, and rejoining notes
- [ ] Gather tester feedback on whether support and life-pacing preferences feel reassuring or too personal
- [ ] Explore stronger privacy controls before showing or using sensitive life-comfort information outside local-only settings
- [ ] Avoid turning support preferences into identity labels, compatibility scores, ranking systems, or mental-health matching
- [ ] Explore trusted contact support, meetup check-ins, share-my-meetup-plan controls, optional emergency contacts, and safety timers only as future planned safety tools after privacy, legal, consent, moderation, and misuse-risk review
- [ ] Ensure any future safety/check-in tooling is clearly opt-in, never presented as emergency support, and never shipped as production-ready without backend reliability and safety review
- [ ] Avoid framing future meetup check-ins as surveillance, monitoring, danger alerts, unsafe-user systems, or compliance tasks; they should support quiet reassurance and practical planning only
- [ ] Add dietary/allergy confirmation reminders before food-based meetups
- [ ] Define age-appropriate handling for alcohol-related event preferences and labels
- [ ] Gather user feedback on whether food and beverage categories feel calm, useful, and not overwhelming
- [ ] Explore broad background-based suggestions for study groups, volunteering meetups, and shared industry conversation starters without exposing exact institutions or routines
- [ ] Future co-host permissions planning only: hosts may invite or approve co-hosts, co-hosts may help with welcoming, logistics, meetup chat, or meetup details, and volunteers/helpers should stay framed as community support roles rather than authority, moderation, verification, or safety-enforcement roles

## Profile, Preferences & Settings

- [ ] Future UX architecture cleanup: review naming and grouping across Profile Controls, User Options, User Preferences, Display & Layout, Profile Layout, Width Settings, and Settings & Privacy so the mental model stays clear as NSN grows
- [ ] Explore calmer top-level settings groups such as Profile, Preferences, Appearance & Layout, Safety & Support, and App Settings while keeping navigation lightweight, scannable, mobile-friendly, and desktop-friendly
- [ ] Explore merging Display & Layout, Profile Layout, and Width Settings into a unified Appearance & Layout or Display & Appearance area, avoiding deep nesting and preserving the non-corporate NSN tone
- [ ] Expand richer food preference matching with lightweight comfort signals instead of restaurant recommendations
- [ ] Add interest-based recommendations that use hobbies, genres, and comfort modifiers
- [ ] Expand the interest taxonomy after tester feedback on categories, wording, and missing local activities
- [ ] Gather user feedback on whether Hobbies & Interests feels useful, calm, and not profile-heavy
- [ ] Add stale-profile reminders for optional work, study, volunteering, and life-context details without nagging users
- [ ] Expand profile freshness controls so users can review, hide, or refresh broad context when it may be outdated
- [ ] Refine local area and suburb APIs so Location Preference can stay broad without relying on exact addresses
- [ ] Gather tester feedback on contact preference wording, reply pace, and whether communication guidance reduces pressure
- [ ] Gather tester feedback on whether conversation comfort labels reduce social friction while preserving openness and avoiding ideology filtering
- [ ] Explore meetup-specific conversation tone guidance without overcomplicating social preference systems
- [ ] Explore lightweight event recurrence support, meetup pacing recommendations, and tester feedback on whether timing/rhythm preferences reduce social pressure without overcomplicating onboarding
- [ ] Avoid turning connection expectations, dating style, meetup rhythm, availability, or duration preferences into compatibility scores, strict filters, or optimisation-style matching
- [ ] Add profile photo crop, resize, filter, blur, and privacy-control tools after real upload/storage decisions are made
- [ ] Expand Profile display preferences so Home, Profile, and event-card layout controls share clearer naming and previews
- [ ] Explore optional header control density preferences with live preview, per-device defaults, and larger accessibility targets
- [ ] Expand the Profile User Options drawer as trust foundations and preference-based recommendations mature

## Localization & Regional Support

- [ ] Continue suburb/locality refinement with an API-backed or maintained Australian locality dataset
- [ ] Add better suburb/locality dataset/API integration for accurate local time, weather, routing, and search matching
- [ ] Add real Sydney/OpenStreetMap integration with proper attribution and no paid map-key dependency
- [ ] Review OpenStreetMap attribution wrapping in narrow screenshots before public launch or external website/social previews
- [ ] Broaden regional/date/time/unit localisation beyond the current prototype preferences, including more countries, calendars, weather units, distance units, currency display, and accessibility expectations
- [ ] Expand distance unit handling across meetups, profile, saved places, and transportation views
- [ ] Add currency display preference support when paid events, donations, or pricing features are introduced
- [ ] Add Australian public holiday data by state/region before using holidays for meetup suggestions
- [ ] Explore cultural event suggestions and a local Sydney/North Shore event feed without assuming everyone participates
- [ ] Add privacy-safe reminders around selected calendar moments, observances, holidays, birthdays, and quiet-plan seasons, with settings to turn celebration messages off
- [ ] Explore privacy-safe calendar integration only after alpha feedback, with local-only controls and clear opt-in copy
- [ ] Gather tester feedback on whether sensitive calendar preferences feel respectful, useful, and easy to hide
- [ ] Research Celtic language support, starting with Welsh, Irish, and Scottish Gaelic, and only ship languages after native-speaker or community review
- [ ] Keep endangered-language support community-led instead of adding broad picker entries without active users or native review
- [ ] Plan later Indian language expansion, prioritising Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, and Nepali after translation review
- [ ] Complete native-speaker review for newly listed languages before marking them fully translated, including Luxembourgish, Hungarian, Czech, Slovak, Croatian, Estonian, Latvian, Lithuanian, Armenian, Albanian, and Afrikaans
- [ ] Review translations with real users or native speakers before treating each language as complete

## Experimental / Optional Ideas

- [ ] After alpha readiness, consider optional Home widgets that users can add, remove, or reorder without becoming core NSN features
- [ ] Explore an optional photo/gallery widget for local memories, venue previews, saved-place inspiration, or deferred Home modules
- [ ] Explore optional local-only/single-player mini-game widgets such as Snake, Solitaire, a simple platformer, solo icebreakers, or group icebreakers
- [ ] Keep mini-games local-first and opt-in, with no social pressure or meetup matching dependency
- [ ] Add calm music player with ambient loops and a meetup prep timer
- [ ] Consider optional zodiac and personality prompts as playful self-expression, without using them as hard filters or compatibility scores
- [ ] Consider achievements as a later, gentle motivation layer that does not create social pressure
- [ ] Explore an optional AI assistant for in-app guidance, settings discovery, feature help, meetup preparation, reflection, and gentle planning support after alpha feedback
- [ ] Keep any AI assistant or companion clearly optional, privacy-safe, and separate from human support, safety reporting, verification, and emergency flows
- [ ] Broaden Home module layout customisation beyond simple ordering into dashboard, grid, magazine, and boxed module presets
- [ ] Add toggle animations when switching between Day and Night settings, including alternatives to the current circular glow
- [ ] Add optional donation button

### Future AI Agents Concept (Prototype-Safe Planning Only)

These ideas are future planning notes only. Do not add API calls, backend implementation, OpenAI keys, autonomous actions, safety decisions, verification decisions, emergency flows, or production assistant behaviour from this section. Any future assistant must be opt-in, reviewable, easy to ignore, privacy-first, low-pressure, and clearly separate from human support or moderation.

- [ ] Meetup question helper: help users draft gentle questions to ask a host or group before attending, such as accessibility, meeting point, timing, food, transport, or social pace. Suggestions should be editable, never sent automatically, and avoid pressuring users to disclose sensitive personal details.
- [ ] Meetup Comfort Guide agent: prototype prompt asset documented in `docs/meetup-comfort-guide-agent.md` and `lib/agents/meetup-comfort-guide.ts`. Future use should help people feel comfortable attending low-pressure meetups, normalize quiet participation and arriving slowly, avoid hype or judgement, and remain separate from therapy, moderation, verification, emergency support, API calls, backend storage, notifications, analytics, or autonomous actions.
- [ ] Host planning assistant: help hosts think through calm meetup details such as clear arrival notes, quieter options, weather backup, consent reminders, accessibility notes, and low-pressure icebreakers. It should support planning only and never create events, message attendees, change RSVPs, or make safety claims on behalf of the host.
- [ ] Personal comfort/preferences assistant: help users reflect on optional comfort settings, communication preferences, social energy, group size, sensory needs, and profile wording. It should keep everything private until the user chooses otherwise, never auto-publish profile content, and avoid labels, scoring, diagnosis, or compatibility judgements.
- [ ] Support/resources routing assistant: help users find existing guidance pages, community support resources, privacy settings, report-shaped prototype flows, or external help links where appropriate. It should route and explain options only, never replace crisis support, emergency services, professional advice, moderation review, or trusted human help.

## Repository Presentation

- [x] 🟢 Add README screenshots/mockups for the home screen, profile privacy, event details, Settings & Privacy, and onboarding
- [x] 🟢 Refresh checkpoint screenshots for core tabs, Settings & Privacy, and onboarding stages after recent UI changes

## Brand & Operations

- [ ] 🔴 Post-pilot: evaluate transition toward SoftHello branding based on demand, testing, and regional expansion
- [ ] 🔴 Future platform roadmap, not current scope: explore an official website, Windows app, macOS app, and watchOS companion only after the mobile/web prototype, safety boundaries, and demand are clearer
- [ ] 🟢 Remove AI Expo related settings as the app develops
- [ ] 🟢 Keep product language clear: NSN is the local Sydney/North Shore pilot, while SoftHello is the future/global direction
- [x] 🟢 Add a lightweight Dependabot maintenance workflow for weekly dependency review without automerge

## Historical Milestones / Release Notes

- [x] Implement NSN dark iOS-inspired visual theme and brand palette
- [x] Build Home screen with Day/Night segmented control, weather update, filters, day events, and evening events
- [x] Build Event Details screen for Movie Night with meetup metadata, weather card, expectations, meeting point, and Join Meetup action
- [x] Build Group Chat screen with meetup header, participant messages, composer, and local send interaction
- [x] Build Profile screen with avatar, vibe chips, about section, and settings rows
- [x] Add Meetups and Notifications placeholder screens matching the NSN visual system
- [x] Configure bottom tab navigation for Home, Meetups, Chats, Notifications, and Profile
- [x] Generate and install a custom NSN app icon and update app branding configuration
- [x] Complete the 5-stage local/mock NSN onboarding flow: welcome, about you, meeting comfort, privacy visibility, and review
- [x] Add 18+ age validation and preferred age range safeguards so under-18 and unrealistic ranges are blocked locally
- [x] Add Comfort Mode, Warm Up Mode, and Open Mode with profile preview visibility presets that users can still adjust manually
- [x] Add profile privacy controls for blur photo, blur level, private profile, local area, age, preferred age range, gender, interests, comfort, about me, and vibes
- [x] Add first name/nickname, optional middle name, optional last name, initials/full-name display settings, and gender preference controls
- [x] Add Simple/Detailed profile layouts and Contained/Wide profile width settings using the shared NSN/SoftHello theme system
- [x] Add local User menu submenus for Edit menu, Privacy guide, User preferences, Profile layout, Width settings, Notifications, Block & report, and Settings & Privacy
- [x] Add local user preference areas for transportation, location, food, hobbies/interests, contact preference, saved places, and meetup shortcuts
- [x] Add temporary deactivate account controls above Delete account in Settings & Privacy
- [x] Complete Settings & Privacy prototype safety polish with jump-chip icons, local update indicators, prototype badges, disabled coming-soon states, and account action confirmations
- [x] Add Profile User Options drawer and move Comfort & trust into User Preferences
- [x] Add mobile drawer and desktop full-view panels for Transportation Method, Contact Preference, and Location Preference
- [x] Add alpha tester walkthrough covering NSN purpose, local prototype scope, comfort/privacy settings, meetup browsing, alerts, profile review, and demo-only safety language
- [x] Add controlled alpha tester guide and feedback checklist docs for trusted walkthroughs
- [x] Add reusable fictional demo personas and anonymise screenshot/demo identity fixtures for repo presentation
- [x] Refine Home search into compact Search NSN suburb and meetup matching for the Sydney/North Shore prototype
- [x] Improve Search NSN autocomplete with Sydney locality data, region matching, aliases, and no default suburb list
- [x] Refine Home/Profile local area editing with shared location picker and API-ready fallback lookup service
- [x] Add Home view and filter controls for essential/comfortable layouts, nearby, small groups, weather-safe, map/list, and section visibility
- [x] Refine NSN Home comfort themes, warmer filter controls, and Compact/Comfortable/Spacious layout density
- [x] Start Phase 1 Trust Foundations in the prototype: progressive visibility, social energy, communication preferences, group size comfort, and verified-but-private trust state
- [x] Capture checkpoint screenshots for Home, Meetups, Chats, Alerts, Profile, Settings & Privacy, and onboarding stages
- [x] 2026-05-10: Validated TypeScript, app startup health, and core local flows during pilot setup
- [x] 2026-05-12: Standardised key action badges/statuses around Demo, Coming soon, and Saved locally language without adding backend/auth behaviour
- [x] 2026-05-12: Started progressive disclosure pass across Home Preferences and User Preferences
- [x] 2026-05-12: Merged Home gear/more entry points into one Options button and added accordion sections for Home/User preferences/Meetups/Chat/Safety/Alpha/Prototype tools
- [x] 2026-05-12: Added shared Compact/Comfortable/Spacious preset rules across Home, Search NSN, Noise Guide, Options, controls, section rows, chips, tags, and small actions
- [x] 2026-05-12: Polished Settings & Preferences responsive layouts, preference chip icon consistency, and Settings back navigation for alpha readiness
- [x] 2026-05-12: Removed Home locked-dashboard overflow, added bottom-nav clearance across tabbed scroll views, clarified web photo copy, and separated Simple versus Detailed Profile presentation
- [x] 2026-05-12: Added and refined local prototype event imagery, then switched Picnic, Beach, and Movie Night preview cards to realistic photo-style sources
- [x] 2026-05-12: Moved Profile back toward a social-first order with detailed comfort, work/life context, and trust controls behind User Options/Settings entry points
- [x] Add localisation options
- [x] Add timezone search and expanded timezone picker
- [x] Add profile display layout preference for Simple/Detailed layouts and Contained/Wide widths
- [x] Implement onboarding steps 2-5 beyond the original "Step 1 of 5" screen
- [x] Add user age and preferred age range to onboarding and profile preferences, while keeping 18+ safeguards separate from matching preferences
- [x] Allow profiles to blur their images for privacy
- [x] Add Location Preference, Transportation Method, Contact Preference, Food Preferences, Hobbies & Interests, Saved Places, and Settings & Privacy profile areas
- [x] Add transportation preference and arrival update messages for running late or not making it
- [x] Add event sharing, pinning, hiding, saved places, and hidden-event viewing controls
- [x] Add Noise Level Guide filtering that separates venue sound level from social talking pressure
- [x] Add local Contact Preference options for in-person, text, email, phone, and video comfort
- [x] Add arrival update reasons for users who cannot make it or are running late
- [x] Add Soft Exit controls so users can politely leave a meetup, chat, or connection without needing to over-explain
- [x] Add reporting, block host/member, unblock, report cancellation window, and escalation options
- [x] Add private post-event reflection prompts
- [x] Add saved comfort places for trusted venues
- [x] Clarify product split between SoftHello global release and North Shore Nights local release so users are not confused by mixed branding, colours, suburb/local-area features, and regional language
- [x] Define separate brand systems: SoftHello should use the soft purple global identity, while North Shore Nights can keep the local light-blue/dark-blue Australian design direction
- [x] v0.1.1-alpha — UX & Onboarding Polish

## Personality & Presence future notes

- Connect Personality & Presence to preference-based recommendations later.
- Gather tester feedback on whether appearance/personality descriptors feel helpful or too personal.
- Gather tester feedback on whether style/personality chips feel expressive without creating social pressure.
- Add stronger privacy controls before using these fields in recommendations.
- Gather tester feedback on whether presence descriptors feel helpful or too personal.
- Gather tester feedback on whether appearance descriptors feel inclusive and low-pressure.
- Avoid turning appearance systems into attractiveness filters or ranking systems.
- Explore stronger privacy controls before using these fields in recommendations.
- Consider voice/audio profile features only after privacy, consent, moderation, and safety review.
- Gather tester feedback on whether prompts feel welcoming or performative.
- Explore meetup-specific low-pressure icebreakers later.
- Explore private/shared visibility controls for prompts.
- Explore a future Gentle profile helper that asks a few lightweight optional questions, suggests Personality & Presence chips, Conversation Sparks, or comfort preference drafts, and lets users review, edit, remove, ignore, or keep every suggestion before anything appears publicly.
- Ensure any Gentle profile helper never auto-publishes suggested profile details and avoids compatibility scoring, personality testing, or AI-generated identity labels.
- Connect emoji density with reduced motion / calm UI mode later.
- Explore simplified profile mode for users who prefer low visual stimulation.
