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

## Comments

Keep comments focused on product rules, safety behavior, accessibility choices, and platform
quirks that are not obvious from the code. Prefer clear names and small helpers over comments
that repeat what the next line already says.
