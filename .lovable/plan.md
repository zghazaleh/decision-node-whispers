## What's wrong

The Today / Case of the Day card has the artwork loaded correctly (the negotiating-room render exists at `src/assets/scene-interpreter.jpg`), but on the archive page it reads as a near-black panel. Two issues stack:

1. The mission engine sets a `scene.filter` (e.g. `saturate(0.78) contrast(1.07) brightness(0.86)`) tuned for the mission scene background, but the `SceneArt` component on `/missions` never reads or applies it — so the raw, already-dark JPEG gets shown as-is.
2. The bottom-to-top scrim is heavy (`rgba(6,8,12,0.78)` at the bottom, fading up) and combined with the dark image swallows almost everything that isn't sky.

## The fix

Scope: the Today / Case of the Day card on `/missions` only (per your answer).

1. Brighten the artwork on the card so it actually reads:
   - Apply a card-specific CSS filter to the `<img>` that lifts brightness and contrast, independent of the per-mission `scene.filter` (which is tuned for the full-screen scene, not a small card).
   - Add a subtle scale so the image fills the frame without letterboxing artifacts.
2. Rework the overlay so the title stays legible but the scene stays visible:
   - Replace the single bottom-heavy gradient with a lighter two-stop scrim: a faint top vignette for the "Case File · …" eyebrow and a shorter, less opaque bottom gradient for the title block.
   - Keep the eyebrow + title + location text unchanged.
3. Keep the rest of the card (info strip, Enter button, layout, copy) exactly as it is.

I'll only touch the Today card block in `src/routes/missions.tsx`. The expanded ledger row, mission scene background, and any other surfaces stay untouched — you can ask me to extend the treatment to them later if you want.

## How to verify

Open `/missions` in preview — the Today card should show the lit lamp, the window, and the silhouettes around the table clearly, with "The Interpreter" and the location still readable over the lower edge.