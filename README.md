# North Shore Nights (NSN)

North Shore Nights (NSN) is a Sydney/North Shore local pilot for low-pressure social meetups. It is built for young adults who want easier, calmer ways to meet new people locally: small groups, clear expectations, weather-aware plans, privacy controls, and chat scoped to a specific meetup.

The current prototype focuses on Sydney's North Shore. Broader location and timezone support may arrive later, but the active app identity in this repository is North Shore Nights.

## Future Global Context

Some planning docs mention **SoftHello v1.1** as a possible future/global product direction. Those notes are retained as context only; they are not the active app identity for this repository.

Future/global planning docs:

- [`docs/vision.md`](docs/vision.md) - future product vision notes.
- [`docs/core-principles.md`](docs/core-principles.md) - non-negotiable SoftHello product principles.
- [`docs/softhello-v1.1-mvp.md`](docs/softhello-v1.1-mvp.md) - product overview and MVP build plan.
- [`docs/softhello-feature-map.md`](docs/softhello-feature-map.md) - MVP, post-MVP, and future feature boundaries.
- [`docs/softhello-safety-and-trust.md`](docs/softhello-safety-and-trust.md) - verification, meeting safety, reporting, and 18+ expectations.
- [`docs/softhello-privacy-comfort-trust-roadmap.md`](docs/softhello-privacy-comfort-trust-roadmap.md) - privacy, comfort, visibility, atmosphere, and trust roadmap.
- [`docs/user-experience-roadmap.md`](docs/user-experience-roadmap.md) - phased trust, safety, comfort, and personalisation roadmap.
- [`docs/softhello-ux-principles.md`](docs/softhello-ux-principles.md) - calm, ND-friendly, low-pressure UX rules.
- [`docs/brand-systems.md`](docs/brand-systems.md) - future/global brand context and the NSN local visual system.

## Product Intent

Many social apps assume users are ready for big groups, loud events, or open-ended networking. NSN is designed for people who may be shy, reserved, new to an area, or simply more comfortable with structured, smaller meetups.

Core principles:

- Low-pressure meetups with clear context before joining.
- Small group experiences instead of crowded event discovery.
- Day and night modes for different social energy levels.
- Weather-aware suggestions and indoor alternatives.
- Privacy-first profile controls.
- Accessibility and translation settings for a wider audience.

## Current Features

- Home discovery with Day/Night mode.
- Weather-aware meetup cards.
- Event detail pages with expectations and meeting point.
- Group chat prototype for meetup conversations.
- Profile, vibes, photo controls, and privacy settings.
- Settings for language, translation language, and accessibility.
- Light/day and dark/night visual themes.
- Sydney/North Shore local time and weather context using Australia/Sydney.

## Tech Stack

- Expo
- React Native
- Expo Router
- TypeScript
- PNPM
- tRPC / Express server scaffold
- Drizzle ORM scaffold

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

See [`design.md`](design.md) for the broader interface plan.

## Roadmap

- Persist user settings and profile details.
- Add real authentication and account management.
- Build real RSVP and attendee flows.
- Replace mock chat with live group chat.
- Expand event creation and moderation.
- Improve location support beyond the North Shore prototype.
- Add stronger safety, reporting, and trust features before any real-world launch.

## Status

This is an early prototype generated and refined as a product exploration. It is not production-ready yet.

Created by Alon A.
