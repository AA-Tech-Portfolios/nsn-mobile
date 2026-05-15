# Project TODO

## Current Product Direction (2026 Alpha)

NSN is currently focused on a Sydney/North Shore alpha pilot for low-pressure, small-group social meetups. The alpha should prioritise calm onboarding, tester-friendly UX, progressive privacy controls, comfort settings, and broad local-area discovery without overpromising production safety, verification, backend trust, or real authentication. SoftHello remains the future/global product direction after the local pilot has been validated.

## Immediate Alpha Priorities

- [ ] Run a rendered mobile drawer smoke test on device or Expo web after dependency/type checks, focusing on drawer scrolling, close behaviour, and long label wrapping
- [ ] Run mobile and desktop smoke tests for Compact, Comfortable, and Spacious Home layouts, focusing on map height, bottom-nav clearance, wrapped chips, and section visibility rows
- [ ] Smoke test Settings & Privacy plus User Preferences on desktop and mobile, focusing on expanded accordion wrapping, keyboard focus through chips, and Profile/User Options back navigation
- [ ] Review checkpoint screenshots for desktop and mobile layout regressions
- [x] Create an alpha tester feedback checklist after the walkthrough has been exercised
- [ ] Continue button behaviour audit across Profile, Settings & Privacy, modal menus, disabled controls, and saved-locally actions
- [ ] Decide which prototype-only account actions should stay visible after tester walkthrough, be backed by real auth, or be hidden before alpha
- [ ] If exact original event-image upload pixels are needed later, save source files into `assets/images/events` and swap Home preview sources to local files

## Post-Alpha Core Features

- [ ] Add Guides or buddy-mode support to help first-time attendees feel oriented without creating pressure
- [ ] Add host templates for common meetup types
- [ ] Add conversation starter cards and pre-made replies for low-pressure chats and meetups
- [ ] Add interactive tutorials for privacy, preview visibility, comfort modes, and key meetup flows
- [ ] Add personality or preference-based recommendations that prioritise comfort, intent, pacing, shared interests, communication style, and group-size comfort without turning NSN into a quiz
- [ ] Connect social energy, communication style, group size, interests, food, and other comfort preferences to real preference-based recommendations
- [ ] Separate Day Events and Evening Events into clearer availability states and notify users when it is time to switch views
- [ ] Add empty-state timing messages for no active events, sleeping time, and quiet hours
- [ ] Add event troubleshooting tools to help participants coordinate around busy work, study, and timetable constraints
- [ ] Evaluate whether group voting helps plan meetups or creates extra pressure for participants
- [ ] Unlock phone or video call preferences after a meetup, with users choosing the contact mode they are comfortable with
- [ ] Add post-meetup chat controls: archive or hide chats, delete with 30-day recovery, and choose whether to stay in contact
- [ ] Add chat appearance settings so users and hosts/admins can change background and text colours
- [ ] Add opt-out and group-change flows that reassure users it is okay to skip, leave, find a better-suited group, or create their own

## Safety, Privacy & Trust

- [ ] Add Community Guidelines, including photo/video consent expectations and no sharing private chats, profiles, or meetup details without consent
- [ ] Add event media comfort labels and a future reporting flow for privacy, photo, video, or screenshot violations
- [ ] Add 18+ compliance copy and safeguards beyond local age entry
- [ ] Decide the real verification provider strategy and UX handoff before claiming production verification
- [ ] Add a real trust-state backend before treating verification or privacy gates as production systems
- [ ] Expand privacy rules for progressive visibility, matched/shared visibility, event-visible fields, warm-up disclosure, and mutual profile-photo reveal
- [ ] Add mutual pre-meetup consent for optional 1-1 chats between members
- [ ] Decide whether verified student, work, or volunteer status is ever needed; if added, keep it optional, broad, privacy-controlled, and separate from exact employer or institution display
- [ ] Add stronger privacy controls for exact schools, workplaces, volunteer organisations, schedules, and routines before supporting those fields
- [ ] Gather tester feedback on whether comfort/trust settings feel clear, calm, and lightweight
- [ ] Gather tester feedback on whether background, community, work, study, and life-context sharing feels safe, useful, fresh enough, and appropriately broad
- [ ] Complete safety, privacy, legal, and regional compliance specifications before implementing emergency, verification, backend trust, or real-auth features
- [ ] Later safety/legal review: optional trusted contacts, discreet emergency help, check-in timers, share-my-meetup-plan controls, location-sharing safeguards, region-aware emergency resources, crisis links, and abuse-prevention rules

## Meetup Experience

- [ ] Add gentle RSVP states such as coming, interested, deciding later, needing encouragement, running late, or unable to make it
- [ ] Add optional meetup comfort roles such as quiet joiner, happy to chat, host helper, first-time attendee, or guide request
- [ ] Add a pre-meetup readiness flow covering expectations, location, host, plan, safety reminder, backup plan, and exit options
- [ ] Add lightweight transportation and routing support with nearby stops, estimated travel time, suggested arrival windows, selected-event map focus, and links out to maps
- [ ] Add route-aware recommendations that combine transport comfort, local area preference, venue accessibility, selected event timing, and external map handoff options
- [ ] Add stronger venue accessibility metadata for step-free routes, parking, lighting, quietness, public transport proximity, dietary safety, quiet seating, alcohol-free comfort, and cafe suitability
- [ ] Add dietary/allergy confirmation reminders before food-based meetups
- [ ] Define age-appropriate handling for alcohol-related event preferences and labels
- [ ] Gather user feedback on whether food and beverage categories feel calm, useful, and not overwhelming
- [ ] Explore broad background-based suggestions for study groups, volunteering meetups, and shared industry conversation starters without exposing exact institutions or routines

## Profile, Preferences & Settings

- [ ] Expand richer food preference matching with lightweight comfort signals instead of restaurant recommendations
- [ ] Add interest-based recommendations that use hobbies, genres, and comfort modifiers
- [ ] Expand the interest taxonomy after tester feedback on categories, wording, and missing local activities
- [ ] Gather user feedback on whether Hobbies & Interests feels useful, calm, and not profile-heavy
- [ ] Add stale-profile reminders for optional work, study, volunteering, and life-context details without nagging users
- [ ] Expand profile freshness controls so users can review, hide, or refresh broad context when it may be outdated
- [ ] Refine local area and suburb APIs so Location Preference can stay broad without relying on exact addresses
- [ ] Gather tester feedback on contact preference wording, reply pace, and whether communication guidance reduces pressure
- [ ] Add profile photo crop, resize, filter, blur, and privacy-control tools after real upload/storage decisions are made
- [ ] Expand Profile display preferences so Home, Profile, and event-card layout controls share clearer naming and previews
- [ ] Explore optional header control density preferences with live preview, per-device defaults, and larger accessibility targets
- [ ] Expand the Profile User Options drawer as trust foundations and preference-based recommendations mature

## Localization & Regional Support

- [ ] Continue suburb/locality refinement with an API-backed or maintained Australian locality dataset
- [ ] Add better suburb/locality dataset/API integration for accurate local time, weather, routing, and search matching
- [ ] Add real Sydney/OpenStreetMap integration with proper attribution and no paid map-key dependency
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

## Repository Presentation

- [ ] Add README screenshots or mockups for the home screen, blur settings, profile privacy, and meetups page
- [ ] Keep checkpoint screenshots current for core tabs, Settings & Privacy, and onboarding stages after major UI changes

## Brand & Operations

- [ ] Post-pilot: evaluate transition toward SoftHello branding based on demand, testing, and regional expansion
- [ ] Remove AI Expo related settings as the app develops
- [ ] Keep product language clear: NSN is the local Sydney/North Shore pilot, while SoftHello is the future/global direction

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
