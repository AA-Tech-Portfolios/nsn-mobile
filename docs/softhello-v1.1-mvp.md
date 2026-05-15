# SoftHello v1.1 MVP Plan

> Future/global context only: North Shore Nights (NSN) remains the active identity for this repository and Sydney/North Shore pilot.

## Overview

SoftHello's original concept is documented as the global brand and journey anchor in
[`docs/brand-systems.md`](brand-systems.md).

SoftHello is a calm future/global platform concept for adults navigating friendships and dating in a low-pressure environment. It is not built around swiping, performance, popularity, or urgency. The product is built around gradual human connection.

For the shared philosophy, use [`vision.md`](vision.md) and [`core-principles.md`](core-principles.md). For what exists now in NSN, use [`current-state.md`](current-state.md).

This repo is still named `nsn-mobile`. North Shore Nights remains the local prototype identity, while SoftHello is retained here as possible future/global product context.

## Target Audience

SoftHello v1.1 is for adults 18+ who:

- Want to meet people locally.
- Prefer low-pressure social environments.
- Are open to friendships, dating, or both.
- May feel overwhelmed by traditional dating or social apps.
- Benefit from predictable, text-first, consent-based interactions.

## MVP Goals

SoftHello v1.1 is an events-first MVP. The first build should help a user move from a safe introduction into a local, small-group social experience without pressure.

The MVP should prove that users can:

- Complete onboarding smoothly.
- Set comfort, privacy, intent, and location preferences.
- Discover relevant local events and people.
- Initiate at least one low-pressure interaction.
- Understand safety requirements before meeting.
- Give private feedback after an event.

## Core Flow

1. Onboarding
   - Confirm the user is 18+.
   - Ask for suburb or general location.
   - Ask intent: friends, dating, both, or exploring.
   - Create a lightweight profile with name or nickname and optional photo.
   - Ask visibility preference: blurred or visible.

2. Events Discovery
   - Show local event cards filtered by location, age group, and comfort/vibe.
   - Prioritize small group gatherings, ideally 3-6 people.
   - Avoid swipe mechanics and popularity metrics.

3. Event Detail
   - Show venue, group size, age group, vibe, comfort notes, safety notes, and who may attend.
   - Include a clear join action.
   - Explain that future in-person meeting flows require real verification and backend enforcement.

4. Intro Chat
   - Unlock chat after joining an event or after mutual connection.
   - Use simple messaging with low-pressure system prompts.
   - Do not add streaks, likes, popularity counters, or urgency mechanics.

5. Safety
   - Keep block and report actions available.
   - Require at least Real Person Verified status before in-person meetings.
   - Use private, structured safety feedback.

6. Post-Event Feedback
   - Ask how the experience felt.
   - Collect private comfort and safety feedback.
   - Do not publish public ratings or user reviews in v1.1.

## MVP Capability List

SoftHello v1.1 should include:

- 18+ onboarding gate.
- Local suburb/location preference.
- Intent selection for friends, dating, both, or exploring.
- Optional photo with blurred profile default.
- Progressive profile reveal concept in the UI, clearly labelled as a concept unless backend visibility rules exist.
- Local events discovery.
- Event detail pages.
- Intro or group chat.
- Basic connection request or hello action.
- Block and report actions.
- Basic verification status, without claiming real verification until provider/backend work exists.
- Meeting safety rule as copy and gating logic, with production enforcement deferred.
- Private post-event feedback.
- Accessibility and comfort preferences.
- Optional availability and comfort signals.

## Current Prototype Fit

The current NSN implementation snapshot lives in [`current-state.md`](current-state.md). This SoftHello MVP plan should not duplicate that list, because the prototype is moving quickly.

At a high level, NSN already covers local onboarding, Home discovery, event details, meetup/chat previews, profile visibility, comfort preferences, saved-local event states, and settings. Production auth, backend persistence, real verification, live chat, moderation operations, and SoftHello global branding remain future work.

Product to-do ideas are tracked in [`../todo.md`](../todo.md). Feature boundary decisions belong in [`softhello-feature-map.md`](softhello-feature-map.md), so this MVP plan should stay focused on the intended first SoftHello loop rather than carrying every optional idea.

## Non-Goals for v1.1

SoftHello v1.1 does not include:

- Public reputation scores.
- Global user reviews.
- Advanced AI moderation.
- Complex matching algorithms.
- Large-scale public communities.
- Leaderboards, streaks, or popularity metrics.
- Full ID verification implementation without a third-party provider or backend integration.
- Production emergency response, legal escalation, or safety operations without dedicated review.

## Success Metrics

SoftHello v1.1 is successful if:

- Users complete onboarding without confusion.
- Users understand how visible their profile is.
- Users find at least one relevant local event or person.
- Users initiate at least one hello, connection request, event join, or chat message.
- Users understand what verification is required before meeting.
- Users report feeling safe, comfortable, and unpressured.

## Philosophy

SoftHello is not about maximizing matches. It is about helping people feel safe, comfortable, and able to build real-world relationships at their own pace.

Users should feel better choosing not to attend than forcing themselves into an event they are unlikely to enjoy. Opting out, leaving early, or choosing a different group should be treated as healthy self-knowledge, not failure.
