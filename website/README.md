# SofterHello Website

Initial static landing page for SofterHello.

## Purpose

This page gives SofterHello a simple discoverable public home while the app and local alpha continue development.

It uses the current SofterHello brand direction:

- **Name:** SofterHello
- **Tagline:** Smaller meetups for bigger moments.
- **Tone:** calm, warm, low-pressure, plain-spoken
- **Alpha boundary:** early, not a live matching / RSVP / emergency / moderation service

## Files

- `index.html` - static landing page markup
- `styles.css` - responsive styling and brand palette
- `assets/softerhello-logo.svg` - temporary editable SVG mark for the landing page
- `assets/softerhello-social-card.svg` - temporary social preview image

## Local preview

Open `website/index.html` directly in a browser, or serve this folder with any static server.

Example:

```sh
cd website
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Social links

The landing page currently includes the reserved public profiles:

- Facebook
- Instagram
- Threads
- TikTok
- X
- LinkedIn
- YouTube
- Reddit

Before production deployment, verify every URL from the live account profile pages and replace any handle if a platform forced a variation.

## Deployment notes

This folder is intentionally framework-free so it can be deployed quickly to Cloudflare Pages, GitHub Pages, Netlify, Vercel static hosting, or any simple web host.

Recommended first deployment flow:

1. Confirm final domain choice.
2. Verify social URLs.
3. Replace the temporary SVG mark with the official logo asset if needed.
4. Deploy the `website/` folder as a static site.
5. Add analytics only after privacy wording is ready.
