# North Shore Nights (NSN)

North Shore Nights (NSN) is a Sydney/North Shore alpha prototype for low-pressure social meetups. It is built for young adults who want easier, calmer ways to meet new people locally: small groups, clear expectations, weather-aware plans, privacy controls, and chat scoped to a specific meetup.

**Alpha note:** this repository is still a prototype. Several safety, trust, RSVP, verification, moderation, and account behaviours are local-only, mocked, or scaffolded. Do not treat the app as production-ready or rely on it for real-world meetups without separate alpha organiser confirmation.

## Current Prototype Status

The active app identity is **North Shore Nights**, focused on Sydney's North Shore and Australia/Sydney local context. The prototype currently supports local onboarding, Home discovery, event details, meetup/chat previews, profile/privacy settings, comfort preferences, and saved-local prototype states.

For the real current state, including what is working, what is mocked, and what is not implemented yet, see [`docs/current-state.md`](docs/current-state.md).

## Product Intent

Many social apps assume users are ready for big groups, loud events, or open-ended networking. NSN is designed for people who may be shy, reserved, new to an area, neurodivergent, privacy-conscious, or simply more comfortable with structured, smaller meetups.

Core principles live in [`docs/core-principles.md`](docs/core-principles.md). The emotional mission lives in [`docs/vision.md`](docs/vision.md).

## NSN Local Pilot

NSN-specific docs:

- [`docs/current-state.md`](docs/current-state.md) - current implemented prototype status and limitations.
- [`docs/nsn-alpha-readiness.md`](docs/nsn-alpha-readiness.md) - readiness requirements for controlled alpha testing.
- [`docs/alpha-tester-guide.md`](docs/alpha-tester-guide.md) - human-facing guide for trusted controlled alpha testers.
- [`docs/alpha-tester-feedback-checklist.md`](docs/alpha-tester-feedback-checklist.md) - short feedback questions for alpha walkthroughs and debriefs.
- [`docs/brand-systems.md`](docs/brand-systems.md) - NSN local visual identity and future SoftHello brand context.
- [`docs/development-workflow.md`](docs/development-workflow.md) - Windows/PowerShell workflow notes.
- [`todo.md`](todo.md) - active implementation roadmap.

## SoftHello Future / Global Context

SoftHello remains the future/global direction. These docs are retained for product continuity, but they are not the active app identity in this repository:

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
- Settings for language, translation language, accessibility, appearance, regional formats, notification preferences, account pause/delete demo actions, and privacy controls.
- NSN and SoftHello brand theme support for design exploration, with NSN as the active identity.

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

## Roadmap

The active roadmap lives in [`todo.md`](todo.md). In short, the next work is alpha readiness: smoke testing, clearer tester feedback, continued locality refinement, honest prototype labels, and later real auth, backend trust, moderation, and safety/legal review before any public launch.

## Status

This is an early prototype generated and refined as a product exploration. It is not production-ready yet.

Created by Alon A.
