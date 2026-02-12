# Specification

## Summary
**Goal:** Automatically generate and publish the production ZIP on every build, without any user confirmation prompts, and provide a stable direct download link.

**Planned changes:**
- Remove any “confirm/ask-to-generate ZIP” step from the build/export flow so the production ZIP is always produced automatically.
- Ensure each production build copies the latest ZIP into the static site output root as `shank-game.zip` so it is served at `/shank-game.zip`.
- Keep (or add if missing) a visible in-app “Download ZIP” control that links directly to `/shank-game.zip` with no intermediate dialogs or pages.

**User-visible outcome:** The app always offers a direct “Download ZIP” link that immediately downloads the latest `shank-game.zip`, and no prompts appear asking whether to generate the ZIP.
