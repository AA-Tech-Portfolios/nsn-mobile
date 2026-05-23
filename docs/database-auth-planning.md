# Database And Authentication Planning

This is an early planning note for moving NSN toward real accounts and shared data without breaking the current local prototype. It is not an implementation plan for production auth, live personal data collection, or app-store launch.

## Staged Approach

Keep the current local prototype state working while backend trust foundations are designed. The alpha app should continue to run with local onboarding, local preferences, local verification labels, and local saved states until each real backend feature has been reviewed, built, and tested.

Recommended sequence:

1. Document the first database schema shape before replacing local state.
2. Keep auth and database code behind explicit feature flags when implementation begins.
3. Add authentication later, after route, session, privacy, and trust boundaries are agreed.
4. Migrate one small feature at a time, starting with low-risk data that has clear rollback behavior.
5. Keep prototype copy honest until a feature is truly backed by production-grade auth, storage, moderation, and support processes.

Avoid a large all-at-once migration. NSN has safety, privacy, and social trust requirements that need careful transitions, especially around identity, visibility, RSVP, messaging, reports, blocks, and invite flows.

## Candidate Stack

Possible auth and database direction:

- Expo Router auth flow and protected routes for logged-out, onboarding, and logged-in app states.
- Supabase Auth plus Postgres as a possible hosted option if managed auth, session handling, and hosted database operations are preferred.
- Drizzle ORM and migrations for typed schema management if NSN keeps its own backend and database layer.

This stack is not final. The decision should consider privacy review, data residency, moderation workflows, migration complexity, Expo/native session handling, local development ergonomics, backup/export needs, and how much backend control NSN needs before production.

## First Database Entities

Plan the first schema around the data NSN already models locally or will need for trust and safety:

- users and profiles
- verification status
- meetups and events
- RSVP states
- chats and messages
- saved places
- preferences
- reports and blocks
- invited guests and introduced-by context

Keep sensitive fields minimal at first. Prefer broad, user-controlled profile and preference data over exact locations, exact institutions, routines, or other details that increase privacy risk.

## Trust And Safety Requirements

Real auth and database work must support NSN's safety posture, not just account creation:

- identity can be verified while remaining private to other users
- age gating must prevent minors or add strong safeguards before any broader release
- invite links and QR joins require host/admin approval controls
- QR and invite links must not create automatic trust, attendance, verification, or full access
- moderation and reporting should be audit-friendly later
- privacy, legal, and safety review must happen before production use

Trust should be earned through reviewed systems and human-appropriate controls. A link, QR code, local setting, or profile badge should never be treated as proof of safety by itself.

## Auth Flow Planning

Initial auth planning should cover:

- email/password or magic link sign-in
- optional social auth later
- secure session storage across Expo native and web
- protected routes for account-only surfaces
- clear logged-out, onboarding, and logged-in app states

Logged-out users should see only appropriate public or prototype-safe surfaces. Logged-in users should still have privacy controls, clear visibility boundaries, and a way to understand what is local, shared, private, pending review, or unavailable.

## Implementation Guardrails

Until the production path is approved:

- do not ship production auth yet
- do not collect live personal data yet
- do not commit secrets, service-role keys, database URLs, OAuth secrets, or production credentials
- do not launch to app stores before legal, privacy, and safety review
- do not replace local prototype state until a scoped migration has tests, rollback thinking, and user-facing copy updates

Any backend/auth experiment should default to local development, disposable test data, feature flags, and clear prototype labels.
