# Development Workflow

## Validated environments

These environments have been tested successfully for NSN development:

| Environment         | Status    | Notes                                                                    |
| ------------------- | --------- | ------------------------------------------------------------------------ |
| Windows 11 Home     | Primary   | Main development environment for NSN.                                    |
| WSL 2 Ubuntu        | Validated | Recommended to clone into the native Linux filesystem, not `/mnt/c/...`. |
| Ubuntu 26.04 VM     | Validated | Used for Linux workflow validation.                                      |
| macOS Apple Silicon | Validated | Used for Xcode/iOS build checks.                                         |

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

## Node Runtime On Windows

CI uses Node 22. For Windows local Expo/Metro development, use Node 22 LTS for now. The repo pins Corepack-managed `pnpm` 11.6.0, which requires Node 22.13 or newer.

Expo SDK 54 and React Native 0.81 document Node 20.19.x as the minimum runtime. Node 24 is a supported LTS release, but local Windows testing has shown that Node 24 can trigger Metro fallback watcher errors while crawling pnpm junctions under `node_modules/.pnpm`.

If Metro crashes with an error like this:

```text
EACCES: permission denied, lstat ... node_modules\.pnpm\...
```

switch back to Node 22, reinstall dependencies, and start Expo with a cleared cache:

```powershell
node -v
Remove-Item -Recurse -Force node_modules
pnpm install
pnpm expo start -c
```

The expected local runtime is:

```text
v22.13.0 or newer
```

Revisit Node 24 after Expo/Metro support is clearer or after Metro watcher behaviour changes.

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

Native dependencies such as `esbuild` can fail during `pnpm install` on mounted Windows paths with `ERR_PNPM_EPERM`. The native Linux filesystem avoids that install issue and has validated with Node.js 22 via `nvm` and Corepack-managed `pnpm` 11.6.0.

### Ubuntu 26.04 VirtualBox VM

Ubuntu 26.04 LTS has also been validated successfully in VirtualBox 7.2.8. The repository cloned cleanly in a fresh Ubuntu environment using Node.js 22.22.1 and Corepack-managed `pnpm` 11.6.0.

These commands completed successfully:

```bash
pnpm install
pnpm check
pnpm lint
pnpm test
```

The NSN web app launched successfully in Firefox on Ubuntu. A first `pnpm dev` run failed during Expo web bundling with:

```text
FATAL ERROR: Ineffective mark-compacts near heap limit
Allocation failed - JavaScript heap out of memory
```

Increase the Node heap size before starting the dev server:

```bash
NODE_OPTIONS="--max-old-space-size=4096" pnpm dev
```

With the Node heap limit raised to 4096 MB, the onboarding flow and Home screen loaded successfully. This VM pass confirms NSN compatibility across Windows, macOS, Ubuntu under WSL, Ubuntu Linux in a VM, and GitHub Actions Linux runners.

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
