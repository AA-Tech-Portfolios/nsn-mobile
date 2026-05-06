# SoftHello Safety and Trust

SoftHello focuses on safety through design, not punishment. The product should reduce exposure, avoid pressure mechanics, and make trust visible before interaction moves toward meeting.

## Safety Principles

- Users control how visible they are.
- Users can opt out of meetups, chats, and connections without needing to justify themselves.
- Meeting requires verification.
- Block and report actions are always available.
- Reports are structured and private.
- Moderation should begin with proportionate, gentle responses where appropriate.
- Escalation is reserved for serious or repeated concerns.

## Verification Levels

| Level | Name | Meaning | MVP Treatment |
|---|---|---|---|
| Level 0 | Unverified | New or incomplete account. | Can browse limited content but cannot meet in person. |
| Level 1 | Contact Verified | Email and/or phone verified. | Can create a basic profile and send low-risk interactions. |
| Level 2 | Real Person Verified | Live selfie or equivalent human check. | Required before in-person meeting eligibility. |
| Level 3 | Identity Verified | Optional ID verification confirming name and age. | Post-MVP unless required for a specific high-trust flow. |

Real selfie and ID verification require a third-party provider or backend integration before production. The MVP can model verification state in the UI, but it should not claim real verification unless the provider flow exists.

## Meeting Safety Rule

Before meeting in person:

- Both users must be at least Real Person Verified.
- The event or connection must show the required verification status.
- Higher-trust meetups may require Identity Verified in a later release.
- Users should see a clear safety reminder before joining or attending.

For v1.1, this rule should be visible in onboarding, event details, and pre-meetup chat surfaces.

## Block and Report

Block user:

- Immediate and private.
- Stops further direct interaction.
- Does not notify the blocked user.

Report concern:

- Structured and calm.
- Allows users to describe safety, harassment, fake profile, underage concern, spam, or other issue.
- Can trigger moderation review, temporary limits, or additional verification.

## Moderation Approach

SoftHello moderation should be proportional:

- Gentle warning for minor first-time behavior.
- Temporary limits or timeouts for repeated boundary issues.
- Additional verification when trust is uncertain.
- Escalation for safety threats, harassment, underage risk, impersonation, or fraud.

The app should avoid public shaming, public reputation scores, and visible punishment mechanics.

## Opt-Out Safety

SoftHello should make it emotionally and socially safe to not attend, leave early, archive a chat, or choose a different group. Users should not be made to feel left behind because one event, chat, or group does not suit them.

Opt-out flows should:

- Use neutral, respectful language.
- Avoid public rejection signals.
- Offer gentle preset messages where useful.
- Help users find a better-suited group or create their own.
- Avoid penalizing users for changing their mind before attending.

## 18+ Compliance Expectations

SoftHello is an adults-only product. v1.1 should include:

- A clear 18+ confirmation before onboarding continues.
- Age group collection for discovery context.
- Safety copy stating that underage users are not allowed.
- Report option for suspected underage accounts.

Production 18+ compliance may require stronger age verification depending on launch region, app store policy, and legal review.

## Progressive Reveal Safety

Progressive reveal gives users control over exposure:

- Stage 0: Fully blurred profile.
- Stage 1: Slight reveal after early interaction.
- Stage 2: Partial reveal after conversation.
- Stage 3: Full reveal after mutual connection or consent.

For v1.1, the implementable minimum is blurred vs visible profile control with clear consent copy. Full staged reveal can follow after the underlying connection and consent model exists.
