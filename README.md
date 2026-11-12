# Class Clash

**Noch ein Flug.** A self-contained German browser game: one-button jetpack flying through an endless, procedurally generated cloud city. No runtime dependencies, external assets, advertising, tracking or backend.

## Play

Hold the screen, mouse button or **Space** to rise; release to descend. **Escape** or the pause button pauses. On phones, the camera keeps the pilot toward the left to improve visibility. Collisions use a forgiving circle inside the artwork.

- **Endless:** unlimited flight, bounded difficulty, gates as the main record.
- **Arena:** seven explicitly labeled computer opponents, same physics and collisions.
- **Training:** collisions forgive; no earned currency, XP or leaderboards.
- **Challenge:** share `CC1-ABC123` codes for the same seeded course and rules. Comparison is manual, not online multiplayer.

Three near misses charge a one-hit shield. Storm edges appear periodically and recede. Collect gold crystals to buy one of six cosmetic pilot colors. No cosmetic changes flight performance.

## Local data

Up to 12 profiles in `localStorage` under `class-clash.v1`, with a previous valid backup. Recent history is bounded to 50 runs, permanent bests retained separately, challenge bests bounded to 100 codes. Auto-checkpoint every five seconds and on pause/pagehide. Same-rule snapshots restore the complete simulation including RNG and bots. Changing rules requires a new `RULES` value and compatible save migration/record archival.

Settings provide JSON export and validated replacement import (2 MB limit). No cloud sync. Profiles and scores are locally editable; not suitable as an authoritative competition backend. Guest progress is in memory only. Browser deletion, private-mode limits, or device changes can remove local data. Play in one tab at a time; concurrent writes are detected and pause the old session.

## Files

- `engine.js`: renderer-independent fixed 120 Hz simulation and seeded generation.
- `render.js`: original procedural canvas artwork and camera.
- `storage.js`: profiles, validated backups, achievements, cosmetics, records.
- `app.js`: UI, input, pause/resume, audio, import/export, sharing.
- `sw.js`: versioned same-origin offline cache. New versions activate after old tabs close, preventing a mid-run mixed deployment.
- `tests/`: Node built-in tests, no install required.

## Verify

```sh
npm run check
npm test
npm run build
```

Tests cover deterministic challenges, snapshot continuation, a simulated 30-minute flight, 40 generated courses, shield behavior, training, arena placement, storm bounds, persistence recovery, import validation and permanent best retention.

## Publish

GitHub Pages workflow `.github/workflows/pages.yml` tests and publishes `` on pushes to `main`. In repository **Settings → Pages**, select **GitHub Actions** if Pages is not yet enabled. The workflow attempts initial enablement, but organization/app permissions may require the repository owner to select it once.

The root contains the canonical game entry point and assets, so branch-based Pages deployment also serves the game instead of rendering this README. The build copies only the runtime files into `dist/` for Actions deployments.

The game uses only relative paths, so repository subpaths work. Manifest and bundled PNG icons support installation where the browser offers it. After one complete successful load, the service worker makes the app available offline; browsers may evict cached data.

## Limits

This is a complete first release, not online multiplayer. The artwork is original 2D canvas, not Fortnite assets. Browser functional testing does not replace testing on physical iOS and Android devices. Game feel should be further tuned with real player feedback.
