# SoftHello v1.1 MVP Plan

## Overview

SoftHello is a calm, local platform for adults navigating friendships and dating in a low-pressure, safe, and natural environment. It is not built around swiping, performance, popularity, or urgency. The product is built around gradual human connection.

SoftHello prioritizes:

- Comfort before exposure.
- Trust before interaction.
- Safety before meeting.

This repo is still named `nsn-mobile`. North Shore Nights remains the local prototype identity, while SoftHello is the global product direction for the `prototype-2-softhello` branch.

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
   - Explain that meeting in person requires verification.

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
- Progressive profile reveal concept in the UI.
- Local events discovery.
- Event detail pages.
- Intro or group chat.
- Basic connection request or hello action.
- Block and report actions.
- Basic verification status.
- Meeting safety rule.
- Private post-event feedback.
- Accessibility and comfort preferences.
- Optional availability and comfort signals.

## Current Prototype Fit

The current prototype already includes:

- Event discovery.
- Event detail pages.
- Group chat prototype.
- Profile screen and profile photo blur.
- Settings, localisation, accessibility, timezone, and privacy controls.
- Create-event flow.
- Day/night visual modes.

Missing MVP pieces include:

- SoftHello branding.
- Onboarding and 18+ compliance.
- People discovery.
- Mutual connection flow.
- Verification states and meeting eligibility.
- Block and report flows.
- Post-event feedback.
- Production-ready data persistence and backend rules.

Product to-do ideas captured for upcoming iterations:

- Optional daily motivational messages when the app opens, controlled by a user setting.
- A dedicated app animations toggle so users can keep the interface still or playful depending on comfort.

## Non-Goals for v1.1

SoftHello v1.1 does not include:

- Public reputation scores.
- Global user reviews.
- Advanced AI moderation.
- Complex matching algorithms.
- Large-scale public communities.
- Leaderboards, streaks, or popularity metrics.
- Full ID verification implementation without a third-party provider or backend integration.

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
