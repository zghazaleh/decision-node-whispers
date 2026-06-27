## Plan

Fix the decision screen so a player can clearly select a stance and conclude the mission.

### Changes
- Make each stance behave like an obvious selectable option:
  - Larger tap target
  - Clear selected state with a check indicator
  - Better contrast for the active stance
- Make Commit unmistakable and reachable:
  - Convert it from a subtle text link into a primary action button
  - Keep it disabled only when no stance/custom decision is selected
  - Show a loading/locked state while analysis is running
- Improve mobile modal usability:
  - Make the decision panel scroll within the viewport if content is tall
  - Keep the bottom action row visible and easy to tap
- Add a small confirmation cue after selecting a preset so users know their choice was accepted.

### Technical notes
- Update only `src/routes/mission.$id.tsx`.
- Keep existing mission logic and analysis flow unchanged.
- No backend or data-model changes.