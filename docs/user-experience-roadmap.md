# SoftHello User Experience Roadmap

> Future/global context only. NSN is the active Sydney/North Shore alpha prototype. Current implemented status lives in [`current-state.md`](current-state.md).

This is a lightweight UX roadmap. It should point to the source docs instead of repeating the full product philosophy.

## Phase 1 - Trust Foundations

Current NSN prototype coverage includes local profile blur, comfort mode, communication preferences, social energy, group size preference, and welcome/onboarding copy.

Still needed before these become production trust foundations:

- Backend-enforced visibility rules.
- Real account identity model.
- Clear audit of what other users can see.
- Manual QA with alpha testers.

## Phase 2 - Safety and Identity

Current NSN prototype coverage includes local/demo trust state, local contact/identity fields, broad local-area settings, saved-local report/block-shaped flows, and meeting safety copy.

Future work:

- Real verification provider strategy.
- Backend trust state.
- Moderation review tooling.
- Safety/legal review before emergency or escalation features.
- Clear region-aware compliance decisions.

## Phase 3 - Comfort and Personalisation

Current NSN prototype coverage includes appearance, accessibility, language, regional format, low-light, notification preference, food/interests, transport, location, and contact preference controls.

Future work:

- Native-speaker/community translation review.
- Real recommendation rules based on comfort signals.
- Optional atmosphere features such as music, widgets, wallpapers, or gentle prompts.
- Careful testing to ensure personalisation does not become pressure.

## Arrival & Transport Confidence

Planning only. Sydney users may want to attend a meetup but hesitate because getting there feels uncertain, stressful, or hard to recover from if something changes. NSN should reduce that confidence barrier without becoming a full transport-planning app.

Future meetup detail pages could include a lightweight "Arrival & Transport" or "Getting There" section that answers practical questions before someone commits:

- How do I get there?
- Is it near a train station or bus stop?
- Is parking available?
- How long is the walk?
- What if I arrive late?
- Will I be able to get home safely?
- Is the route simple, well-lit, or step-free?

Possible prototype metadata/tags:

- Near train station
- Nearby bus stop
- Easy public transport
- Parking nearby
- Short walk
- Step-free access
- Well-lit arrival route
- Late transport available
- Easy to leave early
- Rideshare/taxi pickup nearby

Example section copy:

> Getting there should feel simple. This meetup includes arrival notes so you can decide whether the location feels manageable before you go.

Example event notes:

- 7 min walk from Chatswood Station
- Nearby buses on Victoria Ave
- Westfield parking nearby
- It is okay to arrive a little late
- Leave whenever you need - no explanation required

Constraints:

- Do not build live route planning yet.
- Do not integrate real-time transport APIs yet.
- Treat this as prototype/local event metadata and UX copy until product, safety, accessibility, and privacy expectations are clearer.
- Keep the tone low-pressure and confidence-building: help people decide whether the trip feels manageable without implying NSN guarantees safety, transport availability, lighting, accessibility, or exact route conditions.

## Future Guides & Tips Preferences

Planning only. NSN may later offer optional guidance levels so people can choose how much contextual help they want:

- Minimal: keep guidance mostly hidden unless someone asks for help.
- Gentle guidance: show short, dismissible tips in relevant tabs or screens.
- Detailed onboarding: offer more structured reading for people who like to understand a flow before using it.

This should stay non-blocking, non-gamified, privacy-first, and free of analytics or engagement tracking unless a later privacy review explicitly approves a safer production approach.

## See Also

- [`current-state.md`](current-state.md) - current implemented state.
- [`softhello-ux-principles.md`](softhello-ux-principles.md) - UX rules and tone.
- [`softhello-feature-map.md`](softhello-feature-map.md) - MVP/post-MVP/future boundaries.
- [`../todo.md`](../todo.md) - active implementation roadmap.
