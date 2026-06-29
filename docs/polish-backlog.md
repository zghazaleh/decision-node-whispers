# Decision Nodes — Polish & Bug Backlog

Priority: nothing new until everything is perfect end-to-end.

## Open Build Items
- [ ] Streaming text on the reading — word by word reveal, cinematic pace. Unlocks results reveal content format.
- [ ] Theme card tap affordance — needs clearer visual signal that cards are interactive
- [ ] Header element spacing on mobile — sound controls spacing on some devices
- [ ] Limelight effect on carousel — centre card highlight needs validation across devices

## Open Bugs (from QA source analysis)
- [ ] B-01: /missions/1 → 404. Redirect /missions/:n → /mission/mission-0n — verify live
- [ ] B-02: "20 cases" count in archive header is static SSR text — will desync if cases added without redeployment
- [ ] B-03: The Papers (mission-15) opening chips truncated — verify Phase 1 fix
- [ ] B-04: Per-case OG/Twitter metadata — verify all 20 cases have unique metadata
- [ ] B-05: Commit button pacing signals — verify "The decision is within reach" appears correctly
- [ ] B-06: Off/Low/Normal audio intensity on mobile — verify Phase 2 fix
- [ ] B-07: Password field autocomplete — verify Phase 1 fix
- [ ] B-08: Per-case branded shimmer on slow connections — verify Phase 2 fix
- [ ] B-09: Anonymous gate pre-signal — verify Phase 1 fix
- [ ] B-10: Archive filter dropdowns screen reader behaviour — monitor

## Deferred Features (post-polish)
- [ ] "What others chose" — community donut/bar chart post-analysis. Hold until cases have enough plays
- [ ] 9:16 mobile-first layout for POV content format
- [ ] Mid-session persistence signal — users who leave mid-case don't know if they can return
- [ ] Decision Journal — verify implementation and data persistence
- [ ] Alternate Paths — verify 3-beat structure across all 20 cases

## Content Backlog (no build required)
- [ ] Produce 5 dilemma cards: The Checkpoint, The Glitch, The Rope, The Release, Black Site
- [ ] Identify 3-5 community seeding accounts (philosophy/ethics, psychology, interactive fiction)
- [ ] Record first results reveal once streaming text is live
- [ ] Produce 5 case teasers (one per theme) for brand-building content
