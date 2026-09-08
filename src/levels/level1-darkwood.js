/* ==========================================================================
   NIGHT FALL LAND - Level 1: Darkwood (The Awakening)
   Tutorial level: Teaches movement, stone block pushing, pressure plate,
   lever, Moon Key collection, and key-locked exit gate.
   ========================================================================== */

window.LEVEL_1_DATA = {
  id: 1,
  title: 'Darkwood: The Awakening',
  act: 'Region I',
  totalShards: 1,
  playerStart: { x: 140, y: 320 },

  // Outer Boundary & Internal Dividing Walls
  walls: [
    // Outer perimeter
    { x: 40,   y: 60,  width: 1200, height: 28 },   // top
    { x: 40,   y: 632, width: 1200, height: 28 },   // bottom
    { x: 40,   y: 60,  width: 28,   height: 600 },  // left
    { x: 1212, y: 60,  width: 28,   height: 600 },  // right

    // Divider 1: Room 1 -> Room 2 (open gap at y 240-380 for walking)
    { x: 300, y: 60,  width: 24, height: 180 },
    { x: 300, y: 380, width: 24, height: 280 },

    // Divider 2: Room 2 -> Room 3 (gap at y 290-390 occupied by plate door)
    { x: 580, y: 60,  width: 24, height: 230 },
    { x: 580, y: 390, width: 24, height: 270 },

    // Divider 3: Room 3 -> Alcove (gap at y 270-410 occupied by lever door)
    { x: 860, y: 60,  width: 24, height: 210 },
    { x: 860, y: 410, width: 24, height: 250 },

    // Alcove inner wall (closes south section of alcove)
    { x: 680, y: 380, width: 180, height: 24 },

    // Divider 4: Alcove -> Final Room (solid enclosure around locked golden gate)
    { x: 1010, y: 60,  width: 24, height: 200 },  // top segment (60 to 260)
    { x: 1010, y: 380, width: 24, height: 280 },  // bottom segment (380 to 660)
  ],

  // Pushable Stone Blocks (size = 44)
  blocks: [
    { x: 380, y: 310, size: 44 } // Tutorial block: push onto plate_gate_1
  ],

  // Pressure Plates
  plates: [
    { x: 470, y: 210, id: 'plate_gate_1', size: 48 }
  ],

  // Doors / Barriers
  doors: [
    // Plate Door: opens when block rests on plate_gate_1
    { x: 580, y: 290, width: 24, height: 100, linkedId: 'plate_gate_1', requiresKey: false },
    // Lever Door: opens when lever_gate_1 is pulled
    { x: 860, y: 270, width: 24, height: 140, linkedId: 'lever_gate_1', requiresKey: false },
    // Golden Gate: requires Moon Key
    { x: 1010, y: 260, width: 24, height: 120, linkedId: 'locked_exit_gate', requiresKey: true }
  ],

  // Levers
  levers: [
    { x: 680, y: 210, id: 'lever_gate_1' }
  ],

  // Ancient Lore & Instruction Tablets
  tablets: [
    {
      x: 180, y: 160,
      title: 'Tablet I: The First Steps',
      message: 'Welcome, Wanderer.\n\nYou wake in the eternal darkness of Night Fall Land.\nWalk freely using [W, A, S, D] or Arrow keys.\nWhen near a tablet or object, press [E] to examine it.'
    },
    {
      x: 420, y: 140,
      title: 'Tablet II: Pressure & Mechanisms',
      message: 'Principles of Weight:\n\nWalk directly into stone blocks to push them.\nSlide the glowing block onto the purple pressure plate to lower the energy barrier.\n\nCaution: If pushed into a corner, press [R] to reset.'
    },
    {
      x: 700, y: 140,
      title: 'Tablet III: Levers & Secrets',
      message: 'The Ancient Switch:\n\nPress [E] near a lever to pull it.\nThis will deactivate the laser barrier guarding the Golden Moon Key and hidden Moon Shard.'
    },
    {
      x: 920, y: 160,
      title: 'Tablet IV: The Trial Complete',
      message: 'The Moon Archway:\n\nUse your collected Moon Key on the locked golden gate by pressing [E] near it.\nStep onto the glowing exit portal to complete the Darkwood Awakening.'
    }
  ],

  // Pickups
  keys: [
    { x: 760, y: 470 }
  ],
  shards: [
    { x: 800, y: 470 }
  ],

  // Level Exit Portal
  exit: { x: 1090, y: 290, width: 64, height: 80 },

  // No compound rules needed for level 1
  compoundRules: []
};
