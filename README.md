# Class Clash

**Noch ein Flug.** A self-contained German browser game: one-button jetpack flying through an endless, procedurally generated cloud city. No runtime dependencies, external assets, advertising, tracking or backend.

## Play

Hold the screen, mouse button or **Space** to rise; release to descend. **Escape** or the pause button pauses. Every screen uses the same 880 × 720 playfield and forward visibility, fitted without distortion. Collisions use a forgiving circle inside the artwork.

- **Endless:** unlimited flight, bounded difficulty, gates as the main record.
- **Arena:** seven explicitly labeled computer opponents, same physics and collisions.
- **Training:** four gradual lessons, slower flight and wider gates; collisions forgive; no earned currency, XP or leaderboards.
- **Challenge:** share direct invitation links and `CC3-ABC123` codes for the same seeded course and rules. Comparison is manual, not online multiplayer.

Three near misses charge a one-hit shield. Storm edges appear periodically and recede. Endless Expedition includes five cycling sectors: Skyline Valley, Goldgärten, Neonwerft, Drohnenpass and Aurora-Inseln. Collect crystals, bonus rings, treasure rings and supply capsules. Three per-flight contracts award additional coins. Six pilots have distinct active abilities and passive talents; selected helmets and jetpacks add bonuses. Trails remain cosmetic. These gameplay bonuses and supplies apply only to new CC3 endless flights; challenges, arena and training use equal standard physics.

## Local data

Up to 12 profiles in `localStorage` under `class-clash.v1`, with a previous valid backup. Recent history is bounded to 50 runs, permanent bests retained separately, challenge bests bounded to 100 codes. Auto-checkpoint every five seconds and on pause/pagehide. Same-rule snapshots restore the complete simulation including RNG and bots. Changing rules requires a new `RULES` value and compatible save migration/record archival.

Settings provide JSON export and validated replacement import (2 MB limit). No cloud sync. Profiles and scores are locally editable; not suitable as an authoritative competition backend. Guest progress is in memory only. Browser deletion, private-mode limits, or device changes can remove local data. Play in one tab at a time; concurrent writes are detected and pause the old session.

## Files

- `engine.js`: renderer-independent fixed 120 Hz simulation, seeded generation, abilities and missions.
- `equipment.js`: shared pilot, equipment, supply and sector definitions.
- `legacy-v2.js`: frozen CC2 simulation for earlier challenges and saved flights.
- `legacy-engine.js`: frozen CC1 rules for old challenges and saved flights.
- `render.js`: original procedural canvas artwork and camera.
- `storage.js`: profiles, validated backups, achievements, cosmetics, records.
- `app.js`: UI, input, pause/resume, audio, import/export, sharing.
- `sw.js`: versioned same-origin offline cache. An update banner lets players save and reload into a waiting version; otherwise activation waits for old tabs to close.
- `tests/`: Node built-in tests, no install required.

## Verify

```sh
npm run check
npm test
npm run build
```

Tests cover deterministic challenges, snapshot continuation, a simulated 30-minute flight, 40 generated courses, shield behavior, training, arena placement, storm bounds, persistence recovery, import validation and permanent best retention.

## Publish

GitHub Pages workflow `.github/workflows/pages.yml` tests and publishes `dist/` on pushes to `main`. In repository **Settings → Pages**, select **GitHub Actions** if Pages is not yet enabled. The workflow attempts initial enablement, but organization/app permissions may require the repository owner to select it once.

The root contains the canonical game entry point and assets, so branch-based Pages deployment also serves the game instead of rendering this README. The build copies only the runtime files into `dist/` for Actions deployments.

The game uses only relative paths, so repository subpaths work. Manifest and bundled PNG icons support installation where the browser offers it. After one complete successful load, the service worker makes the app available offline; browsers may evict cached data.

## Limits

This is a complete first release, not online multiplayer. The artwork is original 2D canvas, not Fortnite assets. Browser functional testing does not replace testing on physical iOS and Android devices. Game feel should be further tuned with real player feedback.

## Version 1.1.0

CC2 fixes shield recovery, rendered bot/collision alignment and low-frame-rate timing. Stalls over half a second pause safely. Damaged nested snapshots recover from a valid matching backup without rolling back current currency. Old CC1 bests remain in a separate archive; profiles, currency, cosmetics and resumable CC1 flights are preserved. New progress panels show XP and the next affordable cosmetic; particles and record notices provide feedback.

## Version 2.0.0 — Expedition

- Use **E** for the equipped pilot's rechargeable ability, **B** for a boost cell and **M** for a magnet capsule. Touch buttons provide the same actions. Boost/phase protect against hits, time dilation reduces course speed, magnets collect nearby crystals/capsules, and gold rush doubles pickup/ring currency. Shields absorb one hit.
- Supply shop: rescue core 25 coins, boost cell 12, magnet capsule 15. No real-money purchases. One rescue core, two boost cells and one magnet capsule can be packed per endless flight. Auto-pack is optional. Used supplies are spent; unused supplies are returned on completion or replacement of a saved flight. Pausing preserves the packed supplies.
- Each profile gets one starter rescue core, two boost cells and one magnet capsule exactly once during creation/migration. Existing unlocked colors become pilots without a repurchase.
- Pilot and equipment choices are captured in the saved flight; changing the hangar while a flight is paused does not change that flight's powers.
- New results use CC3. CC1 and CC2 records are retained in separate archives and their saved flights retain original rules. Local records remain editable and are not competitive-server scores.
- 60 automated tests pass, including exact old-version continuation, supply accounting, ability effects, mission idempotency, five-sector generation and profile migration. See `docs/QA.md` for actual browser checks and limits.
