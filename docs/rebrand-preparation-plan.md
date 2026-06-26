# Rebrand Preparation Plan

SofterHello is the current local app identity, while North Shore Nights (NSN) remains the Sydney/North Shore alpha pilot identity. SoftHello is reserved for the broader global/future direction. This plan separates the current app identity, the local alpha identity, and the future global direction without deleting older NSN references blindly.

## Identity Model

- `appDisplayName`: the current local app display name, SofterHello.
- `currentLocalAppName`: the current local app identity, SofterHello.
- `globalFutureName`: the broader global/future direction, SoftHello.
- `localPilotName`: the Sydney/North Shore alpha pilot identity, North Shore Nights.
- `localPilotShortName`: the alpha pilot short name, NSN.

The source of truth is `lib/brand-identity.ts`.

## Copy Rules

- Use SofterHello for the current local app identity and app display-name language.
- Use SoftHello only for broader global/future direction, shared principles, and future-facing product language.
- Keep North Shore Nights / NSN where the wording clearly means the Sydney North Shore alpha/local pilot.
- Keep repository names, bundle IDs, route names, storage keys, test fixture names, and historical docs unless a separate migration explicitly covers them.
- Do not describe SoftHello as live, launched, production-ready, or supported by real production systems during the alpha.
