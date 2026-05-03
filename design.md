# NSN — North Shore Nights Mobile Interface Design Plan

NSN is designed as a **low-pressure social meetup app** for people around Sydney’s North Shore who want small, weather-aware day and night events without the intensity of conventional networking or dating products. The interface will follow a **first-party iOS dark aesthetic**, optimized for **mobile portrait orientation at 9:16** and comfortable **one-handed usage**. The design direction is drawn from the provided concept: deep navy backgrounds, glass-like cards, soft neon blue-violet accents, warm day/night contrast, compact event metadata, and a calm social tone.

## Screen List

| Screen | Purpose | Primary Content and Functionality |
|---|---|---|
| Home | Let users browse suitable meetups by day or night. | Segmented Day/Night switch, date and location context, weather alert card, event category chips, day event cards, evening event cards, and quick access to event details. |
| Event Details | Show all information needed before joining. | Hero event icon, event title, venue, date, time, group size, weather update, expectations, meeting point, and a prominent Join Meetup action. |
| Group Chat | Let users chat with the meetup group before the event. | Header with event name and member count, system notice, participant message bubbles, composer, add button, send button, and disappearing-chat reminder. |
| Profile | Let users express social preferences and access personal areas. | Avatar, display name editing affordance, vibe chips, about text, and settings-style rows for meetups, chats, events, saved places, and privacy. |
| Meetups | Provide a lightweight placeholder for joined and upcoming meetups. | Upcoming joined event summary cards and status labels. |
| Notifications | Provide a lightweight placeholder for weather and meetup alerts. | Weather switch suggestions, meetup reminders, and quiet notification copy. |

## Primary Layout Direction

The application will use a **single bottom tab bar** with Home, Meetups, Chats, Notifications, and Profile. The bottom navigation mirrors the concept image and keeps the most important destinations reachable by thumb. The Home screen will be the main entry point and will use vertical scrolling because event discovery benefits from quick scanning. Cards will have generous corner radii, subtle borders, and layered navy surfaces to preserve the quiet nighttime brand.

| UI Area | Layout Treatment | Interaction Treatment |
|---|---|---|
| Header | Compact text logo, optional moon accent, and notification access. | Tapping notification icon opens the Notifications tab. |
| Day/Night switch | Full-width rounded segmented control near the top of Home. | Active segment changes color and filters the event emphasis. |
| Weather update | Elevated blue translucent card below location context. | Tapping it can surface weather-adaptive copy in the prototype. |
| Event cards | Image-like color blocks, event details, status chips, and circular arrow affordance. | Tapping a card opens Event Details. |
| Event details CTA | Sticky-feeling gradient button near the bottom of the details content. | Tapping Join Meetup changes local joined state and routes to chat. |
| Chat composer | Rounded input-like row above the tab bar area. | Sending adds a local message to the visible chat thread. |
| Profile settings rows | iOS Settings-style list with icons and chevrons. | Rows provide press feedback and remain local prototype actions. |

## Key User Flows

The first main flow is **event discovery to join**. A user opens Home, reviews the weather alert and Day/Night event sections, taps “Movie Night — Watch + Chat,” lands on Event Details, reviews expectations and meeting point, then taps Join Meetup. The prototype should acknowledge the action and move the user into the Group Chat screen for that meetup.

The second main flow is **pre-meetup chat**. A user opens Chats, sees the Movie Night group, reads the low-pressure system notice, types a short message, and taps send. The new outgoing message appears in the thread, reinforcing that the chat is scoped to the meetup and will disappear after the event.

The third main flow is **self-expression through profile vibes**. A user opens Profile, sees an avatar, display name, selected vibes such as Calm, Good listener, Into games, Thoughtful, and Small groups, then reviews the About Me section and settings list. The prototype will emphasize presentation and local interactions rather than account management because authentication was not requested.

## Color Choices

| Role | Color | Rationale |
|---|---:|---|
| App background | `#020814` | A deep midnight navy matching the North Shore Nights mood. |
| Primary surface | `#071426` | A layered dark card color that separates content without harsh contrast. |
| Secondary surface | `#0B1D35` | A brighter navy for weather alerts and selected panels. |
| Primary accent | `#3848FF` | Electric blue-violet for selected states and tab emphasis. |
| Cyan accent | `#18C8D1` | Used in gradients to signal modern social energy. |
| Warm day accent | `#FFE5A3` | Used for the Day segment and sunshine details. |
| Text primary | `#F5F7FF` | High readability on dark backgrounds. |
| Text secondary | `#A6B1C7` | Calmer supporting copy and metadata. |
| Border | `#22324D` | Subtle glass-card outlines. |
| Success/vibe green | `#72D67E` | Balanced and calm vibe chips. |

## Content and Component System

The app will rely on reusable data-driven components for event cards, chips, weather panels, settings rows, and chat bubbles. All content will be local mock data in the first prototype so that the core experience is fast, stable, and does not require accounts or a backend. The app can later evolve into authenticated event creation, real weather integration, location suggestions, and live group chat if those features are requested.

## Implementation Notes

The first build will prioritize the visible screens from the concept image and a small amount of local interactivity. It will not introduce cloud storage, user authentication, payments, or external APIs because those were not requested. The interface should feel like a cohesive iOS product: rounded controls, readable type scale, understated motion, thumb-friendly tap targets, clear hierarchy, and calm feedback for every primary action.

## References

No external references were used for this design document; it is based on the user-provided NSN concept image and stated mobile app direction.
