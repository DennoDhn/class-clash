# Release QA — 2.1.0 Avatar Collection

Date: 12 November 2026.

Nine JavaScript syntax checks, 68 tests and the production build pass. The build includes 16 runtime files.

Twelve new animated bodies extend the six original pilots: duck, drone, toast, ninja cat, UFO, toilet helicopter, piggy bank, interceptor, space jellyfish, golden dragon, singularity and imperial ark. Prices range from 120 to 18,000 earned coins. All have individual talents; several combine timed effects. The ark has one innate rescue per new endless flight, separate from consumable stock. All bodies retain the same collision radius. Competitive and training modes disable their gameplay bonuses.

New tests cover every new combination ability, energy/recharge/boost differences, separate ark rescue persistence and stock accounting, all avatar ownership export/import, competitive-mode neutrality, and compatibility with pre-update CC3 checkpoints. Existing deterministic, long-run, economy and legacy tests remain green.

Browser verification: category filtering, collection count, prices and descriptions, toilet and ark animated previews, and a production-renderer gallery showing all twelve new silhouettes. The gallery is a temporary ignored QA file and is not deployed. Cards and previews were enlarged after visual review. Existing mobile checks below refer to 2.0.0; no new physical iOS/Android playtest is claimed.

---

# Release QA — 2.0.0 Expedition

Date: 12 November 2026.

## Automated verification

All eight JavaScript syntax checks, 60 tests and the clean production build pass. Build includes 15 runtime files. New tests verify all six pilot abilities; passive bonuses; boost duration; slow-motion course speed; phase expiry; one-use rescue cores; shop funds and limits; reserve/refund idempotency; replacing and resuming flights; opt-out; standard competitive modes; magnet range; double rewards; all five sectors, drones, vaults and four supply pickup kinds; one-time mission rewards; CC1/CC2 archives; malformed expedition states; starter-pack migration; deterministic CC3 challenges. The prior 30-minute simulated run and 40-seed tests also pass.

## Browser checks actually performed

Chrome desktop and 390 × 844 iframe viewport:

- Updated home, pilot descriptions, functional equipment descriptions and supplies tab inspected.
- Insufficient-funds feedback verified.
- A disposable local test profile was imported through the actual settings/file-picker UI. Solar Rush was purchased for 80 coins and a boost cell for 12. After a full reload: 108 of the original 200 test coins remained, Solar Rush remained equipped and stock was 3 boost cells.
- Starting a flight reserved the expected 1 rescue / 2 boost / 1 magnet. Replacing a paused flight preserved unused packed stock without double deduction.
- New HUD and action buttons are present. Safe pause on stalled frames remains active.
- Production renderer inspected in a temporary local deterministic scene harness for Goldgärten, Neonwerft, Drohnenpass and Aurora-Inseln. Ring, supply capsule, drone fields and sector decoration rendered successfully. Harness files are excluded from source and deployment.
- Mobile hangar wraps its tabs and supply summary without horizontal overflow.

Cloud browser frame stalls prevent a reliable continuous manual play session here. Automated simulation and static renderer checks supplement, but do not replace, physical mobile gameplay testing. No physical iOS/Android test or disconnected-browser reload is claimed. The successful import uses a generated test file; a downloaded export/import round trip remains unverified.

## Fixes from review

Replaced an unsupported shop arrow glyph; clarified mission counters; added an explicit display of supplies reserved in a paused flight; adjusted short portrait HUD layout; preserved calm segments when adding sector-specific obstacles. Old cosmetic-only copy was replaced with precise effect and mode descriptions.

---

# Release QA — 1.1.0

Date: 12 November 2026.

## Current release checks

Syntax checks, 40 Node tests and the production build pass. Additional regression tests cover shield boundary recovery, obstacle recovery, equal simulation at 5–60 FPS, stall pauses, invariant viewport visibility, bot collision positions, deeply malformed snapshots, backup recovery without currency rollback, gradual training, rings and warning fields, direct challenge links, exact legacy CC1 simulation compatibility, record migration and cosmetic progression.

Chrome browser checks: new helmet artwork and hangar tabs; XP and next unlock display; direct CC2 invitation prefill; training selection, countdown, safe pause and explicit training completion with zero rewards. Browser extension metadata errors were present; they are unrelated to the game. Cloud rendering stalls limit manual game-feel testing; deterministic simulation tests cover long runs separately.

No physical iOS or Android device testing. A full disconnected-browser reload and downloaded export/import browser round trip remain unverified. Earlier release checks below are historical, not a claim that each was repeated for 1.1.0.

---

# Release QA — 1.0.3

Date: 12 November 2026.

## Automated checks

`npm run check`: passes all five JavaScript syntax checks.

`npm test`: 23 passing tests. Covers deterministic inputs and course seeds; full snapshot continuation; 1,801 simulated seconds without a forced end; 40 seeds at three simulated minutes each; bounded gaps and speed; gravity/thrust; hits and shields; forgiving training; seven arena bots and win resolution; periodic storm; malformed snapshots; profile isolation; primary/backup storage; storage errors; invalid imports; permanent best retention; training reward exclusion; completed-run timestamp persistence.

The simulated flight uses an autopilot for reproducible verification, not a claim of 30 minutes of manual play.

## Browser checks actually performed

Chrome desktop (approximately 1365 × 936), plus an iframe viewport of 390 × 844 for responsive CSS and UI behavior:

- Start screen and procedural artwork visually inspected.
- Profile creation, activation and persistence across reload.
- Countdown, rendered flight, death and results.
- A saved flight resumed, paused, and continued.
- Completed run appears in leaderboard and survives a full reload.
- Hangar artwork/layout and insufficient-funds purchase behavior.
- Settings dialog and service-worker readiness indicator.
- Export action displays completion feedback. The browser automation download event timed out; a downloaded file/import round-trip was **not** verified end-to-end. The JSON serializer/validator round-trip is covered by unit tests.

The browser review caught and fixed a timestamp validation bug that could cause a completed save to fall back to an older backup. Added a regression test. Also replaced unsupported arrow/pause glyphs with CSS icons and adjusted the phone camera and hero label.

Screenshots: [desktop](desktop-preview.jpg), [390-pixel viewport](mobile-preview.jpg).

## Verification limits and deployment

No physical iPhone/iPad/Android testing or real touch-device performance measurement was possible. The narrow iframe tests responsive layout, not mobile Safari behavior. Offline cache registration was observed; a disconnected-browser reload was not tested.

The initial Actions run passed tests but could not enable Pages. Pages was subsequently enabled and the 1.0.1 custom deployment succeeded. A concurrent branch-based Pages deployment then replaced it with the rendered README because the game entry was nested under `public/`.

Release 1.0.2 moves the canonical game assets to the repository root and adds `.nojekyll`. The custom workflow builds a clean `dist/` containing only runtime files; branch-based Pages also serves the same root game. This removes the dependence on which Pages publishing mode is selected. The game rules and simulation are unchanged.

The public game was subsequently verified at https://dennodhn.github.io/class-clash/: start screen, countdown, rendered flight and completed-run result all observed. Both publish paths now use the same runtime source. Final visual correction: add a translucent HUD backing so scores remain readable over dark gates.
