# North Shore Nights / NSN Mobile

North Shore Nights (NSN) is the current Sydney/North Shore alpha pilot for calm, low-pressure social connection. **SoftHello** is the future broader product direction after local pilot learning is clearer; it is not live or production-ready. SoftShore remains historical naming exploration, not the active pilot name.

**Tagline:** Small meetups for big moments.

The pilot is built for young adults who want easier, calmer ways to reach out, reconnect, and find small local gatherings: small groups, clear expectations, weather-aware plans, privacy controls, and chat scoped to a specific meetup.

**Alpha note:** this repository is still a prototype. Several safety, trust, RSVP, verification, moderation, and account behaviours are local-only, mocked, or scaffolded. Do not treat the app as production-ready or rely on it for real-world meetups without separate alpha organiser confirmation.

## Current Prototype Status

The active pilot is **North Shore Nights (NSN)**, focused on Sydney's North Shore and Australia/Sydney local context. The prototype currently supports local onboarding, Home discovery, event details, meetup/chat previews, profile/privacy settings, comfort preferences, a prototype Support & Resources surface, and saved-local prototype states.

For the real current state, including what is working, what is mocked, and what is not implemented yet, see [`docs/current-state.md`](docs/current-state.md).

## Visual Preview

NSN is currently a Sydney/North Shore alpha prototype for calmer first meetups: small groups, clear expectations, privacy-conscious profile controls, and local-only demo states that are easy to review with trusted testers.

The screenshots below are checkpoint assets from the current prototype, captured from browser and mobile viewports in both Day and Night modes. They are presentation aids only; they do not imply production verification, live matching, emergency tooling, payments, or connected moderation systems.

### Day Preview

| Screen             | Browser                                                                                                       | Mobile                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Home Discovery     | ![NSN Day Home Discovery browser screenshot](screenshots/visual-preview/day/home-discovery-browser.png)       | ![NSN Day Home Discovery mobile screenshot](screenshots/visual-preview/day/home-discovery-mobile.png)       |
| Event Details      | ![NSN Day Event Details browser screenshot](screenshots/visual-preview/day/event-details-browser.png)         | ![NSN Day Event Details mobile screenshot](screenshots/visual-preview/day/event-details-mobile.png)         |
| Profile & Privacy  | ![NSN Day Profile & Privacy browser screenshot](screenshots/visual-preview/day/profile-privacy-browser.png)   | ![NSN Day Profile & Privacy mobile screenshot](screenshots/visual-preview/day/profile-privacy-mobile.png)   |
| Settings & Privacy | ![NSN Day Settings & Privacy browser screenshot](screenshots/visual-preview/day/settings-privacy-browser.png) | ![NSN Day Settings & Privacy mobile screenshot](screenshots/visual-preview/day/settings-privacy-mobile.png) |
| Onboarding         | ![NSN Day Onboarding browser screenshot](screenshots/visual-preview/day/onboarding-browser.png)               | ![NSN Day Onboarding mobile screenshot](screenshots/visual-preview/day/onboarding-mobile.png)               |

### Night Preview

| Screen             | Browser                                                                                                           | Mobile                                                                                                          |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Home Discovery     | ![NSN Night Home Discovery browser screenshot](screenshots/visual-preview/night/home-discovery-browser.png)       | ![NSN Night Home Discovery mobile screenshot](screenshots/visual-preview/night/home-discovery-mobile.png)       |
| Event Details      | ![NSN Night Event Details browser screenshot](screenshots/visual-preview/night/event-details-browser.png)         | ![NSN Night Event Details mobile screenshot](screenshots/visual-preview/night/event-details-mobile.png)         |
| Profile & Privacy  | ![NSN Night Profile & Privacy browser screenshot](screenshots/visual-preview/night/profile-privacy-browser.png)   | ![NSN Night Profile & Privacy mobile screenshot](screenshots/visual-preview/night/profile-privacy-mobile.png)   |
| Settings & Privacy | ![NSN Night Settings & Privacy browser screenshot](screenshots/visual-preview/night/settings-privacy-browser.png) | ![NSN Night Settings & Privacy mobile screenshot](screenshots/visual-preview/night/settings-privacy-mobile.png) |
| Onboarding         | ![NSN Night Onboarding browser screenshot](screenshots/visual-preview/night/onboarding-browser.png)               | ![NSN Night Onboarding mobile screenshot](screenshots/visual-preview/night/onboarding-mobile.png)               |

NSN's tone should stay low-pressure and plain-spoken: people can browse quietly, decide later, keep profile details private, and treat every alpha action as feedback rather than a commitment.

## Product Intent

Many social apps assume users are ready for big groups, loud events, or open-ended networking. The NSN local pilot and future SoftHello direction are designed for people who may be shy, reserved, new to an area, neurodivergent, privacy-conscious, or simply more comfortable with structured, smaller gatherings.

Core principles live in [`docs/core-principles.md`](docs/core-principles.md). The emotional mission lives in [`docs/vision.md`](docs/vision.md).

## Brand And Naming

Use these docs before making brand-facing changes:

- [`docs/BRAND_NAMING.md`](docs/BRAND_NAMING.md) - current naming model for NSN, SoftHello, and retired SoftShore exploration.
- [`docs/softhello-softshore-brand-naming-story.md`](docs/softhello-softshore-brand-naming-story.md) - naming story and tone guidance.
- [`docs/codex-brand-context-prompt.md`](docs/codex-brand-context-prompt.md) - prompt context for future Codex sessions.
- [`docs/brand-systems.md`](docs/brand-systems.md) - visual identity boundaries and implementation rules.

In short: **NSN / North Shore Nights** is the current local Sydney/North Shore pilot, **SoftHello** is the future broader product direction, and **SoftShore** is retired naming exploration. The shared tagline remains **Small meetups for big moments.** Do not rename the repository, package, folders, bundle identifiers, or internal references without a separate migration task.

## Local Pilot

Pilot docs:

- [`docs/current-state.md`](docs/current-state.md) - current implemented prototype status and limitations.
- [`docs/nsn-alpha-readiness.md`](docs/nsn-alpha-readiness.md) - readiness requirements for controlled alpha testing.
- [`docs/alpha-tester-guide.md`](docs/alpha-tester-guide.md) - human-facing guide for trusted controlled alpha testers.
- [`docs/alpha-tester-feedback-checklist.md`](docs/alpha-tester-feedback-checklist.md) - short feedback questions for alpha walkthroughs and debriefs.
- [`docs/community-support-vision.md`](docs/community-support-vision.md) - support, resources, gentle independence, accessibility, and boundary principles.
- [`docs/brand-systems.md`](docs/brand-systems.md) - NSN and future SoftHello visual identity boundaries.
- [`docs/development-workflow.md`](docs/development-workflow.md) - Windows/PowerShell workflow notes, verification commands, and Expo web/native testing guidance.
- [`docs/browser-testing.md`](docs/browser-testing.md) - practical alpha browser coverage, web checks, and future platform testing boundaries.
- [`docs/database-auth-planning.md`](docs/database-auth-planning.md) - early staged planning for real auth, database entities, and trust/safety guardrails.
- [`docs/security-abuse-prevention-checklist.md`](docs/security-abuse-prevention-checklist.md) - planning-only security, abuse-prevention, and launch-readiness checklist.
- [`todo.md`](todo.md) - active implementation roadmap.

## SoftHello Global Context

SoftHello is the future broader product direction. These docs describe shared principles, future product boundaries, and the long-term product world beyond the current local NSN pilot:

- [`docs/vision.md`](docs/vision.md) - emotional mission and north star.
- [`docs/core-principles.md`](docs/core-principles.md) - short non-negotiable rules.
- [`docs/softhello-v1.1-mvp.md`](docs/softhello-v1.1-mvp.md) - future/global MVP concept.
- [`docs/softhello-feature-map.md`](docs/softhello-feature-map.md) - MVP, post-MVP, and future feature boundaries.
- [`docs/softhello-safety-and-trust.md`](docs/softhello-safety-and-trust.md) - future safety and trust model, not current production capability.
- [`docs/softhello-privacy-comfort-trust-roadmap.md`](docs/softhello-privacy-comfort-trust-roadmap.md) - future privacy, comfort, atmosphere, and trust concepts.
- [`docs/user-experience-roadmap.md`](docs/user-experience-roadmap.md) - future UX roadmap summary.
- [`docs/softhello-ux-principles.md`](docs/softhello-ux-principles.md) - UX rules and copy guidance.

## Repository Structure

- `app/` - Expo Router screens and routes.
- `components/` - reusable UI components.
- `lib/` - app settings, local data, prototype logic, search, formatting, and preference helpers.
- `server/` - Express/tRPC/OAuth/storage scaffolding.
- `shared/` - shared server/client utilities.
- `assets/` - app icons and event imagery.
- `docs/` - product, roadmap, and contributor documentation.
- `tests/` - Vitest coverage for prototype logic.
- `scripts/` - local helper scripts.

## Current Features

- Home discovery with Day/Night mode, Sydney/North Shore context, filters, layout controls, and weather-aware meetup cards.
- Event detail pages with expectations, meeting point, safety copy, media comfort labels, saved places, pin/hide actions, and local join state.
- Meetups and chat prototype screens with calm alpha guidance.
- Five-stage local onboarding with adult age validation, local-area selection, comfort preferences, and profile preview controls.
- Profile, vibes, optional photo, blur controls, visibility settings, contact preferences, food/interests, saved places, and user preference panels.
- Support & Resources prototype with expandable demo placeholders for life skills, community connection, accessibility, animals and wildlife, and crisis/emergency pathways.
- Settings for language, translation language, accessibility, appearance, regional formats, notification preferences, account pause/delete demo actions, and privacy controls.
- NSN and future SoftHello brand theme support for design exploration. SoftHello theme support is exploratory and does not mean SoftHello is live or production-ready.

## Tech Stack

- Expo
- React Native
- Expo Router
- TypeScript
- PNPM
- tRPC / Express server scaffold
- Drizzle ORM scaffold
- AsyncStorage for local prototype state

## Getting Started

On Windows, use Node 22 LTS for local Expo/Metro development. Node 24 may trigger Metro watcher `EACCES` errors while crawling pnpm junctions; see [`docs/development-workflow.md`](docs/development-workflow.md#node-runtime-on-windows).

Install dependencies:

```sh
pnpm install
```

Run the app locally:

```sh
pnpm dev
```

Run the TypeScript check:

```sh
pnpm check
```

Run tests:

```sh
pnpm test
```

## Environment

Copy `.env.example` to `.env` when local environment variables are needed.

```sh
cp .env.example .env
```

The app can run as a UI prototype without most backend values configured.

## Useful Scripts

- `pnpm dev` starts the local server and Expo web app.
- `pnpm check` runs TypeScript validation.
- `pnpm lint` runs Expo linting.
- `pnpm test` runs Vitest tests.
- `pnpm qr "exps://..."` generates a QR code PNG for an Expo URL.

More script notes live in [`scripts/README.md`](scripts/README.md).
Windows and PowerShell-safe command notes live in [`docs/development-workflow.md`](docs/development-workflow.md).

## Design Notes

The design language is calm, night-friendly, and privacy-conscious: deep navy surfaces, soft blue accents, readable cards, friendly icons, and clear social expectations.

See [`design.md`](design.md) for the broader interface plan and [`docs/brand-systems.md`](docs/brand-systems.md) for product identity boundaries.

## Future Website And Social Preview Notes

A lightweight future website can reuse these same prototype-safe messages:

- Small meetups for big moments.
- Supporting visual copy: Small moments. Big skies.
- Optional mood line: Sometimes the best conversations start with simply showing up.
- NSN is the Sydney/North Shore pilot for small, low-pressure local gatherings.
- SoftHello is the broader product direction once the local learning is clearer.
- Privacy and trust are design principles first; production safety, verification, matching, payments, and moderation claims should wait until those systems are real and reviewed.
- Good preview assets for a future landing page or social profile are Home discovery, Event Details, Settings & Privacy, and Onboarding. These show the app's calm feel without overpromising live operations.
- Reserving names or preparing preview images is separate from public marketing. The near-term goal is brand protection, tester clarity, and future discoverability.

## Roadmap

The active roadmap lives in [`todo.md`](todo.md). In short, the next work is alpha readiness: smoke testing, clearer tester feedback, continued locality refinement, honest prototype labels, and later real auth, backend trust, moderation, and safety/legal review before any public launch.

## Status

This is an early prototype generated and refined as a product exploration. It is not production-ready yet.

Created by Alon A.
