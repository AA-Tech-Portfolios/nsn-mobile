# Project TODO

- [x] Implement NSN dark iOS-inspired visual theme and brand palette
- [x] Build Home screen with Day/Night segmented control, weather update, filters, day events, and evening events
- [x] Build Event Details screen for Movie Night with meetup metadata, weather card, expectations, meeting point, and Join Meetup action
- [x] Build Group Chat screen with meetup header, participant messages, composer, and local send interaction
- [x] Build Profile screen with avatar, vibe chips, about section, and settings rows
- [x] Add Meetups and Notifications placeholder screens matching the NSN visual system
- [x] Configure bottom tab navigation for Home, Meetups, Chats, Notifications, and Profile
- [x] Generate and install a custom NSN app icon and update app branding configuration
- [x] Validate TypeScript, app startup health, and core local flows

## Upcoming

### Community and Trust

- [ ] Add Guides to help first-comers establish themselves in the community
- [ ] Add Community Guidelines
- [ ] Add 18+ compliance flow and safeguards
- [ ] Gather user feedback from testing sessions

### Emergency and Safety

- [ ] Plan emergency safety features for later, with careful privacy, legal, and regional review before implementation
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
- [x] Add profile display layout preference for clean profile vs full shortcut rows
- [ ] Implement onboarding steps 2-5 beyond the current "Step 1 of 5" screen
- [ ] Add user age and preferred age range to onboarding and profile preferences, while keeping 18+ safeguards separate from matching preferences
- [ ] Review translations with real users or native speakers before treating each language as complete
- [ ] Research Celtic language support, starting with Welsh, Irish, and Scottish Gaelic, and only ship languages after native-speaker or community review
- [ ] Keep endangered-language support community-led instead of adding broad picker entries without active users or native review
- [ ] Plan later Indian language expansion, prioritising Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi and Nepali after translation review
- [ ] Complete native-speaker review for newly listed languages before marking them fully translated, including Luxembourgish, Hungarian, Czech, Slovak, Croatian, Estonian, Latvian, Lithuanian, Armenian, Albanian and Afrikaans
- [ ] Add toggle animations when switching between Day and Night settings, including alternatives to the current circular glow
- [ ] Fix buttons and standardise button behaviour across the app
- [x] Allow profiles to blur their images for privacy
- [x] Add Comfort Mode and Open Mode profile visibility controls
- [x] Add Location Preference, Transportation Method, Food Preferences, Hobbies & Interests, Saved Places, and Settings & Privacy profile areas

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

- [ ] Add drag-and-drop image uploads for the web version

### Repository Presentation

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
- [ ] Create first release tag when ready: `v0.1.0 - Trust Foundations`
- [ ] Rename project to a global name
- [ ] Remove AI Expo related settings as the app develops
- [ ] Add optional donation button
