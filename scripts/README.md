# Project Scripts

Small helper scripts live here when they are useful outside the normal Expo flow.

## `load-env.js`

Loads `.env` values without overwriting variables that already exist in the shell or hosting platform. It also maps selected server/platform variables to `EXPO_PUBLIC_*` names so Expo can read them on the client.

## `generate_qr.mjs`

Creates a PNG QR code for an Expo URL.

```sh
pnpm qr "exps://your-expo-url"
pnpm qr "exps://your-expo-url" custom-qr.png
```

## `optimize_nsn_icons.py`

Resizes a source icon into the Expo image targets under `assets/images`.

```sh
python scripts/optimize_nsn_icons.py path/to/source-icon.png
```

This script needs Pillow installed in the active Python environment.

## `reset-project.js`

Expo starter helper for wiping the sample app structure. Keep this as a last-resort scaffold reset tool, not part of the normal NSN workflow.
