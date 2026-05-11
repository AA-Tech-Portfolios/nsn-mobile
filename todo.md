# Project TODO

- [x] Implement NSN dark iOS-inspired visual theme and brand palette
- [x] Build Home screen with Day/Night segmented control, weather update, filters, day events, and evening events
- [x] Build Event Details screen for Movie Night with meetup metadata, weather card, expectations, meeting point, and Join Meetup action
- [x] Build Group Chat screen with meetup header, participant messages, composer, and local send interaction
- [x] Build Profile screen with avatar, vibe chips, about section, and settings rows
- [x] Add Meetups and Notifications placeholder screens matching the NSN visual system
- [x] Configure bottom tab navigation for Home, Meetups, Chats, Notifications, and Profile
- [x] Generate and install a custom NSN app icon and update app branding configuration

## Checkpoint - NSN onboarding and profile privacy polish

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
- [x] Refine Home search into compact Search NSN suburb and meetup matching for the Sydney/North Shore prototype
- [x] Improve Search NSN autocomplete with Sydney locality data, region matching, aliases, and no default suburb list
- [x] Refine Home/Profile local area editing with shared location picker and API-ready fallback lookup service
- [x] Add Home view and filter controls for essential/comfortable layouts, nearby, small groups, weather-safe, map/list, and section visibility
- [x] Refine NSN Home comfort themes, warmer filter controls, and Compact/Comfortable/Spacious layout density
- [x] Start Phase 1 Trust Foundations in the prototype: progressive visibility, social energy, communication preferences, group size comfort, and verified-but-private trust state
- [x] Capture checkpoint screenshots for Home, Meetups, Chats, Alerts, Profile, Settings & Privacy, and onboarding stages

## Next Focus

### Alpha readiness

- [ ] Review checkpoint screenshots for layout regressions on desktop and mobile
- [ ] Create an alpha tester feedback checklist after the walkthrough has been exercised
- [ ] Continue suburb/locality refinement with an API-backed or maintained Australian locality dataset
- [ ] Decide which prototype-only account actions should stay visible after tester walkthrough, be backed by real auth, or be hidden before alpha
- [ ] Create first release tag when ready: `v0.1.0 - Trust Foundations`

### Deferred Home polish ideas

- [ ] After alpha readiness, consider optional Home widgets that users can add, remove, or reorder without becoming core NSN features
- [ ] Explore an optional photo/gallery widget for local memories, venue previews, or saved-place inspiration
- [ ] Explore optional local-only/single-player mini-game widgets such as Snake, Solitaire, or a simple platformer
- [ ] Keep mini-games local-first and opt-in, with no social pressure or meetup matching dependency
- [ ] Add real Sydney/OpenStreetMap integration with proper attribution and no paid map-key dependency
- [ ] Add richer map search and event location routing, including selected-event focus and transport-aware handoff
- [ ] Refine richer event-location map behaviour with multiple pins, selected-event syncing, travel context, and external map handoff options
- [ ] Add richer live map integration with real Sydney/North Shore tiles, multiple pins, transport context, and external map handoff
- [ ] Broaden localization and regional unit options beyond the current prototype date/time/unit preferences
- [ ] Broaden regional/date/time/unit localization for more countries, calendars, weather units, and accessibility expectations
- [ ] Expand distance unit handling across meetups, profile, saved places, and transportation views
- [ ] Add currency display preference support when paid events, donations, or pricing features are introduced
- [ ] Broaden regional support beyond the current suburb/local area fallback logic
- [ ] Add better suburb/locality dataset/API integration for accurate local time, weather, routing, and search matching
- [ ] Broaden Home module layout customization beyond simple ordering into dashboard, grid, magazine, and boxed module presets
- [ ] Expand Profile display preferences so Home, Profile, and event-card layout controls share clearer naming and previews
- [ ] Explore optional header control density preferences with live preview, per-device defaults, and larger accessibility targets
- [ ] Continue future suburb/locality API or maintained-dataset refinement so Home time, weather, and local prompts can reflect selected areas more accurately

### Safety and trust

- [ ] Add Community Guidelines, including photo/video consent expectations and no sharing private chats, profiles, or meetup details without consent
- [ ] Add event media comfort labels and a future reporting flow for privacy, photo, video, or screenshot violations
- [ ] Add 18+ compliance copy and safeguards beyond local age entry
- [ ] Decide real verification provider strategy before claiming production verification
- [ ] Decide the real verification provider and UX handoff for the verified-but-private trust state
- [ ] Add a real trust-state backend before treating verification or privacy gates as production systems
- [ ] Expand privacy rules for progressive visibility, matched/shared visibility, event-visible fields, and warm-up disclosure
- [ ] Connect social energy, communication style, and group size preferences to real preference-based recommendations
- [ ] Expand the Profile User Options drawer as trust foundations and preference-based recommendations mature
- [ ] Gather tester feedback on whether comfort/trust settings feel clear, calm, and lightweight
- [ ] Complete safety, privacy, legal, and regional compliance specification before emergency feature implementation

### Meetup flow

- [ ] Add gentle RSVP states such as coming, interested, deciding later, or needing encouragement
- [ ] Add optional meetup comfort roles such as quiet joiner, happy to chat, host helper, or first-time attendee
- [ ] Add pre-meetup readiness checklist covering location, host, plan, safety, and exit options
- [ ] Add lightweight transportation options with nearby stops, estimated travel time, suggested arrival windows, and links out to maps
- [ ] Add route-aware recommendations that combine transport comfort, local area preference, venue accessibility, and selected event timing
- [ ] Add stronger venue accessibility metadata for step-free routes, parking, lighting, quietness, and public transport proximity

### Profile and settings polish

- [ ] Continue button behaviour audit across Profile, Settings & Privacy, and modal menus
- [ ] Expand richer food preference matching with lightweight comfort signals instead of restaurant recommendations
- [ ] Add dietary/allergy confirmation reminders before food-based meetups
- [ ] Add venue metadata for dietary safety, quiet seating, alcohol-free comfort, and cafe suitability
- [ ] Define age-appropriate handling for alcohol-related event preferences and labels
- [ ] Gather user feedback on whether food and beverage categories feel calm, useful, and not overwhelming
- [ ] Add interest-based recommendations that use hobbies, genres, and comfort modifiers without turning NSN into a quiz
- [ ] Connect richer preference matching across interests, food, social energy, communication, and group size
- [ ] Explore broad background-based suggestions for study groups, volunteering meetups, and shared industry conversation starters without exposing exact institutions or routines
- [ ] Add stale-profile reminders for optional work, study, volunteering, and life-context details without nagging users
- [ ] Expand profile freshness controls so users can review, hide, or refresh broad context when it may be outdated
- [ ] Explore privacy-safe calendar integration only after alpha feedback, with local-only controls and clear opt-in copy
- [ ] Add Australian public holiday data by state/region before using holidays for meetup suggestions
- [ ] Explore cultural event suggestions and a local Sydney/North Shore event feed without assuming everyone participates
- [ ] Add privacy-safe reminders around selected calendar moments, observances, and quiet-plan seasons
- [ ] Gather tester feedback on whether sensitive calendar preferences feel respectful, useful, and easy to hide
- [ ] Expand the interest taxonomy after tester feedback on categories, wording, and missing local activities
- [ ] Gather user feedback on whether Hobbies & Interests feels useful, calm, and not profile-heavy
- [ ] Add profile photo crop, resize, filter, blur, and privacy-control tools after real upload/storage decisions are made
- [ ] Add interactive tutorials for privacy, preview visibility, and comfort modes
- [ ] Explore an optional AI assistant for in-app guidance, settings discovery, and feature help after alpha feedback. Keep it clearly optional, privacy-safe, and separate from human support or safety reporting.
- [ ] Refine local area and suburb APIs so Location Preference can stay broad without relying on exact addresses
- [ ] Gather tester feedback on contact preference wording, reply pace, and whether communication guidance reduces pressure
- [ ] Review translations with real users or native speakers before treating each language as complete

## Upcoming

### Community and Trust

- [ ] Add Guides to help first-comers establish themselves in the community
- [ ] Gather user feedback from testing sessions

### Emergency and Safety

- [ ] Add optional trusted contact setup for meetups
- [ ] Add discreet emergency help action from active meetup chats and event details
- [ ] Add optional check-in timer with "I'm safe" confirmation and escalation if the user does not respond
- [ ] Add share-my-meetup-plan controls for selected trusted contacts
- [ ] Add location-sharing safeguards, including clear consent, expiry, and approximate-location options
- [ ] Add region-aware emergency resources and crisis support links
- [ ] Add abuse-prevention rules so emergency tools cannot be used to stalk, coerce, or expose another user

### Product Experience

- [ ] Add interactive tutorials
- [x] Add localisation options
- [x] Add timezone search and expanded timezone picker
- [x] Add profile display layout preference for Simple/Detailed layouts and Contained/Wide widths
- [x] Implement onboarding steps 2-5 beyond the original "Step 1 of 5" screen
- [x] Add user age and preferred age range to onboarding and profile preferences, while keeping 18+ safeguards separate from matching preferences
- [ ] Research Celtic language support, starting with Welsh, Irish, and Scottish Gaelic, and only ship languages after native-speaker or community review
- [ ] Keep endangered-language support community-led instead of adding broad picker entries without active users or native review
- [ ] Plan later Indian language expansion, prioritising Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi and Nepali after translation review
- [ ] Complete native-speaker review for newly listed languages before marking them fully translated, including Luxembourgish, Hungarian, Czech, Slovak, Croatian, Estonian, Latvian, Lithuanian, Armenian, Albanian and Afrikaans
- [ ] Add toggle animations when switching between Day and Night settings, including alternatives to the current circular glow
- [ ] Fix buttons and standardise button behaviour across the app
- [x] Allow profiles to blur their images for privacy
- [x] Add Comfort Mode, Warm Up Mode, and Open Mode profile visibility controls
- [x] Add Location Preference, Transportation Method, Contact Preference, Food Preferences, Hobbies & Interests, Saved Places, and Settings & Privacy profile areas

### Matching and Discovery

- [ ] Add personality compatibility matching that prioritises comfort, intent, pacing, and shared meetup preferences
- [ ] Consider optional zodiac and personality prompts as playful self-expression, without using them as hard filters or compatibility scores
- [ ] Explore an optional AI companion as a later comfort feature for meetup preparation, reflection, and gentle planning support
- [ ] Consider achievements as a later, gentle motivation layer that does not create social pressure

### Event Planning and Attendance

- [ ] Add gentle RSVP states such as coming, interested, deciding later, or needing encouragement
- [ ] Add optional meetup comfort roles such as quiet joiner, happy to chat, host helper, or first-time attendee
- [ ] Add pre-meetup grounding screen with expectations, safety reminder, and backup plan
- [ ] Add pre-meetup readiness checklist covering location, host, plan, safety, and exit options
- [ ] Add event troubleshooting tools to help participants coordinate around busy work, study, and timetable constraints
- [ ] Decide whether verified student, work, or volunteer status is ever needed, and keep exact institutions/employers private by default if added
- [ ] If verified student/work/volunteer status is added, keep it optional, broad, privacy-controlled, and separate from exact employer or institution display
- [x] Add transportation preference and arrival update messages for running late or not making it
- [ ] Add lightweight transportation options with nearby stops, estimated travel time, suggested arrival windows, and links out to maps
- [ ] Add host templates for common meetup types
- [x] Add event sharing, pinning, hiding, saved places, and hidden-event viewing controls
- [x] Add Noise Level Guide filtering that separates venue sound level from social talking pressure
- [ ] Separate Day Events and Evening Events into clearer availability states and notify users when it is time to switch views
- [ ] Add empty-state timing messages for no active events, sleeping time, and quiet hours
- [ ] Add regional holiday and birthday greetings, with a setting to turn celebration messages off
- [ ] Evaluate whether group voting helps plan meetups or creates extra pressure for participants

### Consent and Contact

- [ ] Add conversation starter cards for low-pressure chats and meetups
- [ ] Add mutual pre-meetup consent for optional 1-1 chats between members
- [ ] Add mutual consent flow for revealing blurred profile pictures when both members feel ready
- [ ] Gather tester feedback on whether Background & community sharing feels safe, useful, and appropriately broad
- [ ] Gather tester feedback on whether Work, study & life context feels safe, useful, fresh enough, and not too occupation-focused
- [ ] Add stronger privacy controls for exact schools, workplaces, volunteer organisations, schedules, and routines before supporting those fields
- [x] Add local Contact Preference options for in-person, text, email, phone, and video comfort
- [ ] Unlock phone or video call preferences after a meetup, with users choosing the contact mode they are comfortable with

### Exit and Chat Lifecycle

- [ ] Add post-meetup chat controls: archive or hide chats, delete with 30-day recovery, and choose whether to stay in contact
- [x] Add arrival update reasons for users who cannot make it or are running late
- [x] Add Soft Exit controls so users can politely leave a meetup, chat, or connection without needing to over-explain
- [x] Add reporting, block host/member, unblock, report cancellation window, and escalation options
- [ ] Add chat appearance settings so users and hosts/admins can change background and text colours
- [ ] Add pre-made reply options behind the chat plus button
- [ ] Add opt-out and group-change flows that reassure users it is okay to skip, leave, find a better-suited group, or create their own

### Media and Web

- [ ] Decide whether optional gallery and mini-game widgets remain deferred Home modules or move into a separate experimental area

### Repository Presentation

- [x] Capture checkpoint screenshots for core tabs, Settings & Privacy, and onboarding stages
- [ ] Add README screenshots or mockups for the home screen, blur settings, profile privacy, and meetups page

### Wellbeing and Icebreakers

- [ ] Add calm music player with ambient loops and a meetup prep timer
- [ ] Add mini-games for solo and group icebreakers
- [x] Add private post-event reflection prompts
- [x] Add saved comfort places for trusted venues
- [ ] Add buddy mode or guide request for first meetups

### Brand and Operations

- [x] Clarify product split between SoftHello global release and North Shore Nights local release so users are not confused by mixed branding, colours, suburb/local-area features, and regional language
- [x] Define separate brand systems: SoftHello should use the soft purple global identity, while North Shore Nights can keep the local light-blue/dark-blue Australian design direction
- [ ] Post-pilot: evaluate transition toward SoftHello branding based on demand, testing, and regional expansion
- [ ] Remove AI Expo related settings as the app develops
- [ ] Add optional donation button

## Release Notes

- 2026-05-10: Validated TypeScript, app startup health, and core local flows during pilot setup.
