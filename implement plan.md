# Night Fall Land — Hard Levels & Map Folder Refactor

## Goal
1. Move all level geometry into dedicated files under `src/levels/`
2. Make `world.js` a thin data loader/renderer
3. Design 5 genuinely hard levels (5–15 min each) using the puzzle mechanics available

---

## Folder Structure After Changes

```
src/
  config/
    game-config.js
    supabase-config.js
  core/
    audio-manager.js
    screen-manager.js
    storage-manager.js
  game/
    camera.js
    engine.js
    hud.js
    input.js
    particles.js
    player.js
    puzzle-objects.js
    world.js          ← now a thin loader/renderer only
  levels/             ← NEW FOLDER
    level1-darkwood.js
    level2-moonvillage.js
    level3-oldfactory.js
    level4-frozenpeak.js
    level5-thevoid.js
  ui/
    auth-ui.js
    menu-ui.js
    settings-ui.js
```

---

## Puzzle Mechanics Available

| Mechanic | How it works |
|---|---|
| Push Block | Walk into block → it moves 46px in that direction |
| Pressure Plate | Player OR block overlapping → plate active |
| Door/Gate | Opens when linked plate(id)/lever(id) is active |
| Lever | [E] to toggle on/off |
| Lever Sequence | Must pull levers in specific order (tracked in world.js) — wrong order resets ALL |
| Compound Gate | Requires MULTIPLE plates/levers simultaneously (custom logic in world.js) |
| Moon Key | Collect → [E] on key-locked door to open |
| Moon Shard | Collectible secret item |
| Level Exit | Step on → triggers victory |

**Deadlock risk** (intentional challenge): If a block is pushed into a corner that is NOT a plate, it's permanently stuck there → player must press [R] to reset. This is the primary difficulty driver.

---

## Level Design Specifications

### LEVEL 1 — Darkwood: The Awakening (Tutorial, 5 min)
**Goal**: Teach all basic mechanics. Already well-designed, just clean it up and move to a data file.

**Solution path** (5 steps):
1. Read Tablet I → learn movement
2. Push block onto pressure plate → Door opens to Room 2
3. Pull lever → Door to Room 3 opens
4. Collect Moon Key + Moon Shard
5. Use Key on golden gate → Walk to exit portal

**Deadlock risk**: Block pushed past the plate into a corner → need [R] reset.

---

### LEVEL 2 — Moon Village: The Twin Guardians (Novice, 8–12 min)
**Core puzzle**: 2 blocks must land on 2 plates SIMULTANEOUSLY. The blocks enter Room 2 through a shared corridor and SPLIT into a north/south section. If wrong block goes to wrong section → DEADLOCK, must reset.

**Map**: 5 rooms left→right. A horizontal wall in Room 2 divides it into NORTH/SOUTH halves.

**Hard element 1 — Block Deadlock**:
- Block_Gold enters Room 2 from upper gap → lands in NORTH section
- Block_Silver enters Room 2 from lower gap → lands in SOUTH section  
- Plate_N is in NORTH, Plate_S is in SOUTH
- If player pushes Block_Gold SOUTH through the internal gap first → Block_Gold stuck in south, can't reach Plate_N. Block_Silver then blocks the gap. Both stuck → reset needed.
- **Tablet clue** (cryptic): *"The gold sentinel watches the north star. The silver one, the southern sea."* → push Gold NORTH, Silver SOUTH.

**Hard element 2 — Lever Sequence**:
- 3 levers in Rooms 3/4 must be pulled in order: Crescent (A) → Half (B) → Full (C)
- Clue is SPLIT across 3 tablets in different rooms (must explore all)
- Wrong order → all levers reset + message

**Solution path** (10 steps):
1. Read Tablet in Room 1 (partial clue: gold=north)
2. Push Block_Gold east into Room 2 north section
3. Push Block_Gold north → lands on Plate_N
4. Push Block_Silver east into Room 2 south section  
5. Push Block_Silver south → lands on Plate_S
6. Both plates active → gate to Room 3 opens
7. Explore Rooms 3/4, read all 3 tablet pieces for lever order
8. Pull levers in order: A → B → C
9. Gate to Room 5 opens → collect Key
10. Unlock exit portal gate

**Shards (3)**: One hidden in dead-end south corridor (red herring path), two in lever rooms.

---

### LEVEL 3 — Old Factory: Generator Array (Intermediate, 10–14 min)
**Core puzzle**: 4 generator plates must ALL be active simultaneously. Only 3 blocks are accessible at start. The 4th block is locked in a maintenance bay, requiring a lever to unlock. BUT the lever is behind a sub-gate that needs generators 1+2 active. So the order is critical.

**Hard element 1 — Block Routing**:
- Each plate has only ONE valid approach direction (because of wall geometry)
- Gen_4's plate is in a dead-end alcove with only a SOUTH entry
- If player pushes block from NORTH → block overshoots past plate into wall corner → permanent deadlock → reset
- **Tablet clue**: *"The fourth machine accepts burden only from the south corridor."*

**Hard element 2 — Compound Gate**:
- Sub-gate (to lever room) requires Gen_1 AND Gen_2 active simultaneously
- Master gate requires ALL 4 generators AND master lever active
- If player activates 3 generators then goes for lever → master gate won't open until all 4 active
- Creating a "last step" challenge: place 4th block correctly THEN pull master lever

**Solution path** (12 steps):
1. Read workshop manuals (3 tablets scattered around)
2. Push Block_A south → onto Gen_1 plate
3. Push Block_B east → onto Gen_2 plate
4. Sub-gate opens (Gen_1 + Gen_2 active) → enter lever room
5. Pull maintenance lever → unlocks Block_D storage room
6. Navigate to Block_D storage room (requires backtracking)
7. Push Block_C into position → onto Gen_3 plate
8. Enter Block_D room → push Block_D south through narrow corridor → onto Gen_4 plate (approach from south ONLY)
9. All 4 generators active → pull master lever
10. Master gate opens → key room accessible
11. Collect key (and 4 shards hidden in alcoves)
12. Unlock exit

**Shards (4)**: Hidden in maintenance alcoves, require detours.

---

### LEVEL 4 — Frozen Peak: The Summit Gate (Advanced, 12–15 min)
**Core puzzle**: NON-LINEAR map (not left→right). 6 rooms arranged around a central hub. 5 blocks must be placed on 5 summit plates to open the final gate. Blocks from outer rooms must be TRANSPORTED through the hub to their target plates.

**Hard element 1 — Transport Problem**:
- Block_E starts in Room 6 (far east)
- Its target plate is in Room 2 (far west)
- Player must push it through 3 rooms without trapping it in a dead end
- The optimal path is non-obvious; wrong turns create permanent deadlocks

**Hard element 2 — One-Way Lever**:
- A lever opens a shortcut between Room 3 and Room 5
- If player pulls it too early, they skip a room and miss a needed block → must restart
- Tablet hint: *"The shortcut opened by the crystal switch closes Room 5's western access permanently."*

**Hard element 3 — Summit Gate**:
- Final gate requires Plate_C AND Plate_D simultaneously PLUS a lever
- All 3 must be active at the same time → carefully place both blocks, THEN pull lever

**Solution path** (14+ steps): Requires exploring all 6 rooms in correct order, planning block transport routes.

**Shards (5)**: Hidden throughout the 6-room layout.

---

### LEVEL 5 — The Void: Convergence (Master, 15–20 min)
**Core puzzle**: A 3-chamber hub structure, each chamber with its own sub-puzzle. All 3 must be solved to open the central Void Gate. The final chamber has a 4-lever sequence (most complex yet).

**Hard element 1 — 4-Lever Sequence**:
- Levers: I, II, III, IV
- Clue is EXTREMELY cryptic, split across 6 tablets throughout all chambers
- Each tablet gives one fragment: *"After silence comes the first voice... The third echoes the second... The fourth completes the circle... But the second must hear the first."*
- Correct order: I → III → II → IV
- Most players will try I → II → III → IV (natural order) — this triggers a reset

**Hard element 2 — Block Mirroring**:
- Chamber 2 has a puzzle where 3 blocks must form an "L-shape" on plates
- One block must be placed BEFORE entering the room (from outside via wall gap)
- If player enters room first, the door auto-seals behind them temporarily (10 second delay) — need to pre-stage the block

**Hard element 3 — Dual Key Gates**:
- Key_A is in Chamber 1 (after solving its puzzle)  
- Key_B is in Chamber 3 (after solving its puzzle)
- The Void Gate requires BOTH keys — two separate key-locked doors in sequence
- (Implemented as two separate locked doors)

**Hard element 4 — Red Herrings**:
- 3 dead-end corridors with shards but no exit
- Players who chase all shards first will spend extra time

**Solution path** (20+ steps): Requires mastery of all mechanics.

**Shards (6)**: Scattered throughout all chambers, including dead-end paths.

---

## Data File Format (each level file)

```js
// src/levels/levelN-name.js
// PUZZLE SOLUTION (dev notes): ...

window.LEVEL_N_DATA = {
  totalShards: N,
  playerStart: { x: 140, y: 340 },   // optional override
  
  walls: [
    { x, y, width, height },
    // ...
  ],
  
  blocks: [
    { x, y, size: 44 },   // annotated with block role in comments
  ],
  
  plates: [
    { x, y, id: 'unique_id', size: 48 },
  ],
  
  // doors: { w, h, linkedId, requiresKey }
  doors: [
    { x, y, w: 24, h: 100, linkedId: 'plate_id', requiresKey: false },
  ],
  
  levers: [
    { x, y, id: 'lever_id' },
  ],
  
  // ordered sequence (optional)
  leverOrder: ['lever_id_1', 'lever_id_2', 'lever_id_3'],
  
  tablets: [
    { x, y, title: '...', message: '...' },
  ],
  
  keys:   [ { x, y } ],
  shards: [ { x, y } ],
  
  exit: { x, y, w: 64, h: 80 },
  
  // custom compound gate rules (evaluated in world._updateCompoundDoors)
  compoundRules: [
    // 'and' = all plates/levers must be active
    { doorId: 'gate_id', type: 'and', plateIds: ['p1','p2'], leverIds: ['l1'] },
  ],
};
```

## world.js After Refactor

`world.js` will only contain:
- `constructor(levelId)` → loads `LEVEL_N_DATA`, instantiates objects
- `update(dt, player, audio)` → tick logic (lever seq, compound doors, exit check)
- `draw(ctx)` → render all objects
- Helper methods: `checkWallCollision`, `checkOverlap`, `_updateLeverSequence`, `_updateCompoundDoors`

All puzzle GEOMETRY lives in the level files.

## index.html Script Load Order

```html
<!-- Level data files (must load BEFORE world.js) -->
<script src="src/levels/level1-darkwood.js"></script>
<script src="src/levels/level2-moonvillage.js"></script>
<script src="src/levels/level3-oldfactory.js"></script>
<script src="src/levels/level4-frozenpeak.js"></script>
<script src="src/levels/level5-thevoid.js"></script>
<!-- Then game engine -->
<script src="src/game/world.js"></script>
```

## Verification Plan
- Open browser, play through Level 1 fully (should complete in ~5 min)
- Test Level 2 block deadlock scenario (push wrong block → confirm stuck)
- Test Level 2 lever wrong-order reset
- Confirm shard counts display correctly in HUD for each level
- Confirm "Next Region" button loads the correct next level after victory
