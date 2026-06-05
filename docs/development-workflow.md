# Development Workflow

## PowerShell-safe commands

This project is usually edited from Windows PowerShell. Expo Router file paths can include
characters that PowerShell treats specially, such as parentheses in `app/(tabs)` and square
brackets in `app/event/[id].tsx`.

When passing these paths to Git or other shell commands, quote each path and use `--` before
the path list:

```powershell
git add -- "app/(tabs)/profile.tsx" "app/event/[id].tsx"
git diff -- "app/(tabs)/profile.tsx"
```

Prefer one-purpose commands when checking or staging work. For example:

```powershell
git status --short
pnpm check
```

Avoid relying on unquoted route paths in PowerShell. A command that looks fine in a Unix shell
can fail or match the wrong files on Windows.

## Testing The App

Use these checks before handing over app changes:

```powershell
pnpm check
pnpm lint
pnpm test
```

`pnpm lint` may report existing warnings in unrelated screens. Preserve the current warning policy unless the task is specifically to clean those files up.

### Ubuntu WSL

When validating from Ubuntu under WSL, clone the repository into the native Linux filesystem, such as `~/Projects/nsn-mobile`, instead of running it from a Windows-mounted path like `/mnt/c/...`.

Native dependencies such as `esbuild` can fail during `pnpm install` on mounted Windows paths with `ERR_PNPM_EPERM`. The native Linux filesystem avoids that install issue and has validated with Node.js 22 via `nvm` and Corepack-managed `pnpm` 11.5.1.

### Expo Web

Start Expo web for browser testing:

```powershell
pnpm dev:metro
```

Open the local Expo web URL shown in the terminal, usually on `localhost`. Use this for quick layout checks, copy/share feedback, keyboard navigation, and responsive browser smoke tests.

For browser priority, version policy, and NSN-specific web compatibility checks, see [`browser-testing.md`](browser-testing.md).

### Android Emulator Or Expo Go

Start Metro:

```powershell
pnpm dev:metro
```

Then open the project in an Android emulator from Expo DevTools or scan the QR code with Expo Go on a physical Android device when the local network allows it.

### iOS Simulator Or Expo Go

Start Metro:

```powershell
pnpm dev:metro
```

On macOS, open the iOS simulator from Expo DevTools or the Expo CLI prompts. For a physical iPhone, scan the QR code with Expo Go when the local network allows it.

### Physical iPhone Or Android

For same-network testing, start Metro:

```powershell
pnpm dev:metro
```

For easier physical-device testing across networks, use the Expo tunnel:

```powershell
pnpm dev:tunnel
```

Treat physical-device testing as a smoke test for touch targets, scrolling, safe-area spacing, native share/link handoffs, and Expo Go behaviour. Do not add API keys or production services just to test the prototype.

Browser testing is separate from native Expo testing, but both matter for handoffs such as maps, external links, invite or QR links later, and login/auth browser flows later.

## Future Platform Roadmap

These are future-facing notes, not current implementation scope:

- official NSN website for public information, alpha status, safety boundaries, and download/testing guidance
- Windows app exploration after the mobile/web prototype has clearer demand
- macOS app exploration for desktop-friendly planning and community management workflows
- watchOS companion exploration for gentle reminders or meetup-day glanceability only after privacy, notification, and safety review

## Comments

Keep comments focused on product rules, safety behaviour, accessibility choices, and platform
quirks that are not obvious from the code. Prefer clear names and small helpers over comments
that repeat what the next line already says.
