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
