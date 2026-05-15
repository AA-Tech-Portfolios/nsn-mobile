# NSN Alpha Readiness Roadmap

North Shore Nights (NSN) is the active identity for this repository: a local Sydney/North Shore pilot for low-pressure social meetups. This roadmap is for making the prototype understandable, trustworthy, and usable by an average Australian user before any real-world alpha testing.

The app is not launch-ready. The goal of this roadmap is readiness for controlled alpha testing, not public release.

For what is actually implemented today, see [`current-state.md`](current-state.md). Items below are readiness requirements and should not be read as current production capability.

## Readiness Principles

- Keep NSN separate from SoftHello in user-facing screens, docs, and test scripts.
- Use local wording: Sydney, North Shore, suburbs, meetups, RSVP, mates, plans, tonight, this weekend.
- Explain what happens before asking users to create an account, reveal details, join an event, or message anyone.
- Prefer plain Australian English over product language.
- Remove or clearly mark anything that does not work yet.

## Feature Labels

- **Must-have for alpha**: required before inviting real users into a controlled test.
- **Later**: useful, but not required before first alpha.

## Phase 1 - Make NSN Understandable

Phase 1 focuses on first impressions, onboarding, navigation, and cleanup. A new user should understand what NSN is, where it operates, what data is needed, and what they can do next.

### 1. Complete the 5-stage onboarding flow

**Must-have for alpha**

- Define the five onboarding stages and keep them consistent across copy, UI, state, and docs:
  1. Welcome to North Shore Nights.
  2. Confirm age and local intent.
  3. Set comfort preferences.
  4. Create or continue with an account.
  5. Preview the first local meetup flow.
- Make progress visible with clear stage labels such as "Step 2 of 5".
- Let users go back without losing earlier answers.
- Explain why each answer matters before asking for it.
- Store completion state using NSN naming rather than legacy SoftHello language where practical.
- Add a restart option from settings that says exactly what will reset.

**Wording suggestions**

- "North Shore Nights helps you find small, low-pressure plans around Sydney's North Shore."
- "First, we will set your comfort preferences so meetup suggestions feel more relevant."
- "You can change this later in Settings."
- "Step 3 of 5: What kind of night feels easiest?"

### 2. Account creation options

**Must-have for alpha**

Current status: account/auth behaviour is still prototype/scaffolded. Treat this section as a requirement before controlled alpha accounts are used, not as a shipped capability.

- Support email/password account creation and sign-in.
- Support Google sign-in.
- Explain why an account is needed before blocking progress.
- Show clear error messages for invalid email, weak password, duplicate account, and failed sign-in.
- Provide password reset or a clearly labelled temporary alpha fallback.

**Later**

- Add Apple ID sign-in after the core account flow is stable.
- Add 2FA in a future security phase, after the alpha flow proves users understand basic account creation.

**Wording suggestions**

- "Create an account so your RSVPs, preferences, and safety settings stay with you."
- "Continue with Google"
- "Sign in with email"
- "Apple sign-in is coming later."
- "Two-step verification will be added in a future security update."

### 3. User tutorials and guided first-use experience

**Must-have for alpha**

- Add a guided first-use path after onboarding that points to one sample event, one RSVP action, and one settings/privacy area.
- Keep tutorials short and dismissible.
- Use contextual prompts near the relevant UI instead of a long instruction page.
- Add an obvious "Skip for now" option.
- Track whether the first-use guide has been completed or skipped.

**Later**

- Add replayable tutorials from Help or Settings.
- Add tailored tips based on comfort preferences.

**Wording suggestions**

- "Want a quick look around?"
- "This card shows the plan, group size, location, and backup option."
- "You can RSVP, save it for later, or leave it alone."
- "No pressure - you can just browse."

### 4. Navigation clarity

**Must-have for alpha**

- Audit every tab, header button, and back path.
- Ensure the main tabs answer common user questions:
  - "What is happening near me?"
  - "What have I joined?"
  - "Who can see me?"
  - "Where are my settings?"
- Use plain labels instead of internal feature names.
- Make empty states useful and local.
- Make it clear when a screen is a prototype preview.

**Wording suggestions**

- "Home"
- "My Plans"
- "Messages"
- "Profile"
- "Settings"
- "No plans yet. Browse North Shore meetups or check back closer to the weekend."

### 5. Placeholder and dead button cleanup

**Must-have for alpha**

- Find every button, link, card action, menu item, and icon button.
- Remove actions that do nothing.
- Disable unavailable actions with honest labels.
- Replace placeholder alerts with specific next steps.
- Avoid "Coming soon" unless the feature is intentionally visible for alpha feedback.

**Wording suggestions**

- "Not available in this alpha"
- "This feature is being tested internally first."
- "Preview only - joining is not live yet."

## Phase 2 - Make Core Meetup Flows Usable

Phase 2 focuses on the two central product jobs: creating a clear local meetup and joining one safely.

### 6. Event creation flow

**Must-have for alpha**

- Create a simple event creation flow for internal/admin or approved alpha hosts.
- Require the basics:
  - Event title.
  - Suburb or venue area.
  - Date and time.
  - Group size.
  - Meetup type or vibe.
  - Cost expectation.
  - Public/private visibility.
  - Weather backup or cancellation note.
  - Host safety notes.
- Preview the event before publishing.
- Confirm what attendees will see before the event goes live.
- Prevent publishing incomplete or confusing events.

**Later**

- Allow regular users to create events after moderation, abuse handling, and safety workflows are stronger.
- Add recurring events.
- Add co-hosts.
- Add venue suggestions and transport hints.

**Wording suggestions**

- "Create a North Shore meetup"
- "Where is it happening?"
- "Keep the meeting point clear, public, and easy to find."
- "What is the backup plan if the weather turns?"
- "Preview what others will see"
- "Publish for alpha testers"

### 7. Event joining and RSVP flow

**Must-have for alpha**

Current status: event membership and RSVP-like behaviour are local prototype states. A real alpha needs honest labels or backend persistence before users rely on RSVP state.

- Make RSVP states clear and reversible:
  - Interested.
  - Going.
  - Not this time.
  - Leave plan.
- Show what happens after each RSVP choice.
- Confirm whether profile details become visible after RSVP.
- Show group size limits and whether the event is full.
- Show meeting point details only at the right privacy stage.
- Provide a clear way to cancel or leave.

**Later**

- Add waitlists.
- Add host approval for sensitive events.
- Add calendar integration.
- Add richer post-event feedback and recommendations.

**Wording suggestions**

- "Interested"
- "I'm going"
- "Not this time"
- "Leave this plan"
- "You can change your RSVP before the meetup."
- "Your profile is only shown after you RSVP."
- "Meeting details unlock once your spot is confirmed."

### 8. Privacy and profile settings clarity

**Must-have for alpha**

Current status: many profile/privacy controls exist locally. Backend-enforced privacy, real trust gates, and cross-user visibility rules are still future work.

- Make profile visibility understandable before users RSVP.
- Clearly separate:
  - Display name.
  - Profile photo or avatar.
  - Suburb or approximate area.
  - Age confirmation.
  - Contact preferences.
  - RSVP visibility.
  - Block/report controls.
- Use plain summaries beside each setting.
- Avoid privacy settings that appear to work but do not affect the app yet.
- Add a "what others can see" preview.

**Later**

- Add more granular reveal controls.
- Add verified identity indicators that do not require public identity exposure.
- Add 2FA as part of the future security phase.

**Wording suggestions**

- "What others can see"
- "Show my profile only after I RSVP"
- "Use my suburb, not my exact location"
- "People cannot see your exact address."
- "You choose what appears before and after joining a plan."

## Phase 3 - Prepare for Controlled Alpha Testing

Phase 3 makes the prototype testable with real people while keeping expectations clear and risk contained.

### 9. Documentation cleanup

**Must-have for alpha**

- Update README and docs so NSN is the active product identity.
- Keep SoftHello docs clearly marked as future/global context only.
- Keep [`current-state.md`](current-state.md) updated as the single source of truth for actual prototype status.
- Add a short alpha tester guide covering:
  - What NSN is.
  - What works.
  - What does not work yet.
  - How to report issues.
  - Privacy expectations.
  - Safety expectations.
- Add a manual QA checklist for onboarding, account creation, event browse, RSVP, settings, and logout.
- Remove outdated references that make NSN look like a different app.

**Later**

- Add product decision records for account auth, privacy model, moderation, and event creation permissions.
- Add release notes for each alpha build.

**Wording suggestions**

- "North Shore Nights is currently a local Sydney/North Shore alpha prototype."
- "Some screens are still previews. We will label them clearly."
- "Please do not use NSN for real meetups until the alpha organiser confirms testing is live."

### 10. Alpha testing readiness

**Must-have for alpha**

- Define the alpha audience: small group of trusted Sydney/North Shore testers.
- Decide what testers are allowed to do:
  - Complete onboarding.
  - Create or sign in to an account.
  - Browse sample events.
  - RSVP to test events.
  - Review privacy/profile settings.
  - Send feedback.
- Add a feedback route or external feedback form.
- Add known limitations inside the tester guide.
- Prepare test accounts and sample events.
- Confirm safety language is visible before any real meetup behaviour is tested.
- Run manual QA on iOS, Android, and web if all platforms are in scope.
- Decide the alpha exit criteria before inviting testers.

**Later**

- Add analytics or event logging for onboarding completion, RSVP attempts, and dead-end taps.
- Add crash reporting.
- Add moderation dashboards.
- Add public beta readiness criteria.

**Wording suggestions**

- "You are testing an early NSN prototype."
- "Please tell us where the app feels confusing, unfinished, or unsafe."
- "Do not rely on NSN for real-world plans unless the alpha organiser has confirmed the meetup separately."
- "Your feedback helps us make NSN clearer for local users before wider testing."

## Must-Have Checklist Before Alpha

- Complete 5-stage onboarding.
- Email/password sign-in works.
- Google sign-in works.
- First-use guide explains browsing, RSVP, and privacy.
- Event browse and event detail screens are understandable.
- RSVP states are clear, reversible, and honestly labelled.
- Event creation works for approved/internal hosts or is hidden from general users.
- Navigation labels match user expectations.
- Privacy/profile settings explain what others can see.
- Dead buttons and placeholders are removed, disabled, or labelled.
- NSN docs are separated from SoftHello future/global context.
- Alpha tester guide and manual QA checklist exist.

If real auth is not included in the first controlled test, the tester guide must state that clearly and avoid asking testers to trust local/demo account states.

## Later Feature Parking Lot

- Apple ID sign-in.
- 2FA.
- Regular user-created events.
- Waitlists.
- Host approval.
- Calendar integration.
- Recurring events.
- Co-hosts.
- Venue suggestions.
- Transport hints.
- Rich post-event feedback.
- Analytics, crash reporting, and moderation dashboards.

## Alpha Exit Criteria

NSN is ready for controlled alpha testing when a first-time Australian user can:

- Understand that NSN is a Sydney/North Shore local meetup prototype.
- Complete onboarding without help.
- Create or access an account.
- Find a sample local event.
- Understand group size, place, time, cost, and backup plan.
- RSVP or decline without confusion.
- See and adjust profile/privacy settings.
- Avoid every unavailable feature because it is hidden, disabled, or clearly labelled.
- Report feedback easily.

The alpha should not begin until the product feels honest about what works, what is still a preview, and what users should not rely on yet.
