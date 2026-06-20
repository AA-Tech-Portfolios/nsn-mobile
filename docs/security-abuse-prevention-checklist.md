# Security And Abuse-Prevention Checklist

This is a planning-only checklist for NSN. The current alpha is prototype/local-first, and no production personal data should be collected until security, privacy, legal, and trust/safety reviews are complete.

Use this checklist before real authentication, shared databases, invite links, QR joins, messaging, moderation, or production deployment are treated as ready.

## Alpha Boundary

- Keep current prototype/local-first behaviour clearly labelled.
- Do not collect production personal data during alpha planning.
- Do not imply that local prototype verification, reporting, blocking, RSVP, invite, or moderation states are production safety systems.
- Require security, privacy, legal, and trust/safety review before any production launch or app-store release.

## Secrets And Configuration

- Never commit secrets, API keys, database URLs, service-role keys, OAuth secrets, signing keys, or production credentials.
- Use environment variables or managed secret stores for keys and deployment-specific configuration.
- Keep `.env.example` safe and placeholder-only.
- Rotate any secret immediately if it is accidentally exposed.

## Repository And CI Hygiene

- Enable GitHub secret scanning where available.
- Enable Dependabot for dependency and security update awareness.
- Keep CI checks running for type checks, linting, tests, and future security checks.
- Maintain a routine for reviewing and applying dependency updates.
- Document any known security exception instead of silently ignoring it.

## Transport And Sessions

- Use HTTPS only in production.
- Use secure authentication flows and secure session storage across Expo native and web.
- Review token lifetime, refresh behaviour, logout behaviour, device loss, and session revocation before production.
- Protect account-only routes and avoid exposing private state to logged-out users.

## Database And Access Control

- Use database Row Level Security where applicable.
- Apply least privilege to app roles, service roles, admin tools, and deployment credentials.
- Avoid direct client access to sensitive tables unless rules are explicit, tested, and reviewed.
- Plan backups, restore drills, and recovery procedures before production data exists.

## Abuse-Prevention Controls

- Add rate limiting for authentication attempts, messages, invite creation, invite acceptance, QR link joins, and other high-abuse surfaces.
- Treat invite links and QR codes as requests or introductions, not automatic trust, attendance, verification, or access.
- Require host/admin approval controls for sensitive joins or guest flows.
- Design reporting, blocking, and moderation workflows before enabling broad user-to-user interaction.
- Keep audit logs for sensitive admin actions, moderation decisions, verification changes, account restrictions, invite approvals, and data access.

## Network Risk

Network risk detection is a soft safety signal for spam, fake-account, abuse, and repeated suspicious signup patterns. VPN, proxy, or datacenter indicators should increase account risk only in combination with proportional review logic; they are not a standalone ban reason.

Current implementation notes:

- VPN/proxy detection is disabled by default for local and alpha environments.
- The system never automatically blocks users from network risk alone.
- Provider failures fail open so auth and session checks are not broken by an IP-intelligence outage.
- Network signals may contribute to additional verification requirements, including the soft user-facing copy: "For community safety, we need one extra check before you continue."
- Only coarse safety outcomes are exposed, such as `networkRiskFlag`, `riskLevel`, `riskScoreDelta`, `requiresExtraVerification`, and `verificationCopy`.
- Detailed browsing history, network history, raw provider payloads, or long-lived IP histories should not be exposed to clients.
- The current implementation uses an abstraction layer and mock providers. Real IP-intelligence integration, such as IPinfo, MaxMind, Cloudflare, or another provider, is deferred until a production abuse-review model exists.

Architecture notes:

- `lib/security/network-risk.ts` owns the provider abstraction, disabled local fallback, mock provider, coarse risk scoring, soft verification copy, and fail-safe assessment shape.
- `server/_core/authNetworkRisk.ts` extracts a coarse request IP from trusted forwarding headers, invokes the network-risk abstraction for auth/session checks, and fails open to the disabled provider if detection errors.
- Auth routes include coarse `accountSafety` output on successful OAuth mobile, `/api/auth/me`, and `/api/auth/session` responses.
- tRPC context carries `networkRisk`, and `auth.safety` exposes the same coarse safety outcome without changing `auth.me`.

## Age And Safety Review

- Maintain age-gating and underage safety review before any public release.
- Do not allow minors into production social meetup flows unless a dedicated legal, privacy, guardian-consent, moderation, and safeguarding model has been approved.
- Review identity, verification, visibility, and profile-photo flows for privacy and misuse risk.

## Launch Readiness

- Complete privacy/legal review before production launch.
- Complete a penetration/security review before app-store launch.
- Confirm backups and recovery planning are tested, not just documented.
- Confirm dependency update routines and incident response ownership are in place.
- Confirm trust/safety workflows can handle reports, blocks, moderation review, and sensitive admin actions without relying on ad hoc manual memory.
