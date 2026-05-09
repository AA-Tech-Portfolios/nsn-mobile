# SoftHello / NSN 🌫️✨

A privacy-first social meetup and connection platform designed for introverts, shy-spoken people, and privacy-conscious users.

Built with Expo, React Native, and TypeScript.

## What Is SoftHello?

SoftHello is a calm, low-pressure way to meet people through small groups, clear expectations, gradual trust, and user-controlled privacy.

The product began as **NSN - North Shore Nights**, a mobile-first local meetup prototype for Sydney's North Shore. NSN remains the local prototype identity, while SoftHello is the broader product direction.

## Who It Is For

SoftHello is for people who:

- Prefer slower introductions.
- Feel drained by performance-driven social apps.
- Want friendships, dating, or social connection without pressure.
- Value privacy, consent, and control over profile visibility.
- Feel more comfortable in small groups than crowded discovery feeds.

## Why SoftHello?

Most social apps reward performance.

SoftHello rewards trust.

It exists to make meeting people feel safer, calmer, and more human by prioritizing comfort before exposure, privacy before popularity, and consent before contact.

## Core Principles

- 🌫️ Progressive Visibility
- 💙 Privacy before popularity
- 👥 Small groups over social performance
- 🛡 Verified but private identity
- 🎼 Comfort-first design

The current prototype focuses on Sydney's North Shore, but the architecture is moving toward broader location and timezone support.

## SoftHello Prototype Branch

This branch also documents the next global product direction: **SoftHello v1.1**. The repo remains `nsn-mobile`, and North Shore Nights remains the local prototype identity, but SoftHello is the calm, events-first MVP direction for a broader audience.

SoftHello planning docs:

- [`docs/vision.md`](docs/vision.md) - the heart and north star for SoftHello.
- [`docs/core-principles.md`](docs/core-principles.md) - non-negotiable SoftHello product principles.
- [`docs/softhello-v1.1-mvp.md`](docs/softhello-v1.1-mvp.md) - product overview and MVP build plan.
- [`docs/softhello-feature-map.md`](docs/softhello-feature-map.md) - MVP, post-MVP, and future feature boundaries.
- [`docs/softhello-safety-and-trust.md`](docs/softhello-safety-and-trust.md) - verification, meeting safety, reporting, and 18+ expectations.
- [`docs/softhello-privacy-comfort-trust-roadmap.md`](docs/softhello-privacy-comfort-trust-roadmap.md) - privacy, comfort, visibility, atmosphere, and trust roadmap.
- [`docs/user-experience-roadmap.md`](docs/user-experience-roadmap.md) - phased trust, safety, comfort, and personalisation roadmap.
- [`docs/softhello-ux-principles.md`](docs/softhello-ux-principles.md) - calm, ND-friendly, low-pressure UX rules.
- [`docs/brand-systems.md`](docs/brand-systems.md) - SoftHello global brand system and NSN local visual system.

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
- Settings for language, translation language, accessibility, and timezone.
- Light/day and dark/night visual themes.
- Region-based timezone picker with curated cities and world capital loading.

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
