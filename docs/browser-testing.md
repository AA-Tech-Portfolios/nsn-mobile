# Browser And Platform Testing

NSN browser testing is part of preserving the product feeling: calm, low-pressure, readable, accessible, and predictable across the places people may first meet the app. Compatibility checks should protect that experience, not become a promise of broad production support during alpha.

## Current Scope

For the alpha prototype, browser testing applies to the Expo web app and any official web surfaces that appear later. It is separate from native Android and iOS app testing.

Native Expo app testing should still happen separately through Expo Go, emulators, simulators, and physical devices. Browser testing still matters for flows that leave or enter the app, including login/auth handoff later, maps, invite links, QR links, and any official NSN website.

Do not add browser automation, CI browser matrices, Playwright, or Cypress for this scope yet. Keep testing practical, manual, and focused on the highest-risk user experience checks.

## Browser Priority

Primary desktop browsers:

- Chrome latest stable
- Microsoft Edge latest stable
- Firefox latest stable
- Safari latest stable on macOS where available

Primary mobile web browsers:

- Safari on iPhone
- Chrome on Android
- Samsung Internet on Android

Secondary/privacy browsers:

- Brave
- DuckDuckGo browser
- Opera

Chrome, Safari, Edge, Firefox, Samsung Internet, and Opera are the main practical coverage targets because current global browser share is led by Chrome, Safari, Edge, Firefox, Samsung Internet, and Opera. Brave and DuckDuckGo are useful secondary checks for privacy-conscious users, stricter tracking defaults, and external-link behavior.

## Version Policy

Target:

- current stable version
- previous stable version where practical

Do not promise support for very old browsers yet. If an issue appears only in an old or niche browser, record it honestly, assess user impact, and avoid expanding official support claims before the alpha scope is ready.

## Web Checks

Use browser testing to confirm that core NSN interactions stay calm, legible, and low-friction:

- dark/light theme switching
- iOS/Safari status bar and safe-area behavior
- bottom navigation spacing
- responsive mobile layouts
- drawers, sheets, and modals
- accordions and quick-jump scrolling
- copy-to-clipboard feedback
- map and location links
- external browser handoff
- QR and invite links later
- login/auth browser handoff later
- keyboard behavior in chat and input fields
- local storage and prototype persistence
- accessibility basics: tap targets, contrast, readable text, reduced clutter, and controls that do not feel cramped

When testing mobile web, pay particular attention to fixed bottom UI, keyboard opening and closing, Safari viewport changes, safe-area padding, and whether users can still read and act without feeling rushed.

## Native App Distinction

Web browser testing does not replace native app testing. The Expo native app should still be checked on:

- Expo Go on physical iPhone and Android devices where practical
- iOS simulator on macOS where available
- Android emulator
- physical devices for touch, scrolling, safe areas, native sharing, maps, and app-to-browser handoff

Browser testing overlaps with native testing only around cross-boundary flows: auth, maps, QR codes, invite links, external links, and any official website or support page.

## Future Platform Notes

These targets are future-facing and outside the current alpha scope:

- official NSN website
- Windows app
- macOS app
- watchOS companion

Do not treat these as current delivery requirements. They are reminders to preserve platform awareness as NSN grows beyond the prototype.
