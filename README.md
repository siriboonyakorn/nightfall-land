# 🌙 Night Fall Land

> **A pixel-art puzzle adventure where knowledge is your greatest ability.**

Night Fall Land is a browser-based, single-player pixel-art puzzle adventure game. Players explore a mysterious world trapped in eternal darkness, solve environmental puzzles, unlock new levels, discover hidden secrets, and uncover the truth behind the endless night.

Unlike traditional games where the player becomes stronger by gaining weapons or abilities, **Night Fall Land focuses on the player's knowledge and problem-solving skills**.

> The character may remain the same, but the player becomes smarter.

---

# 📖 Table of Contents

* [Game Overview](#-game-overview)
* [Core Concept](#-core-concept)
* [Gameplay](#-gameplay)
* [Story](#-story)
* [World and Maps](#️-world-and-maps)
* [Puzzle System](#-puzzle-system)
* [Player System](#-player-system)
* [Progression](#-progression)
* [Characters](#-characters)
* [Secrets and Collectibles](#-secrets-and-collectibles)
* [Art Style](#-art-style)
* [Audio](#-audio)
* [Technology Stack](#️-technology-stack)
* [Project Structure](#-project-structure)
* [Game Systems](#️-game-systems)
* [Save System](#-save-system)
* [Level Development](#-level-development)
* [Development Roadmap](#️-development-roadmap)
* [Installation](#-installation)
* [Controls](#️-controls)
* [Testing](#-testing)
* [Future Features](#-future-features)
* [Contributing](#-contributing)
* [License](#-license)

---

# 🎮 Game Overview

## Genre

* Puzzle Adventure
* Exploration
* Mystery
* Pixel Art
* Single Player

## Platform

The initial version of Night Fall Land is designed as a **web browser game**.

Possible future platforms include:

* 🌐 Web
* 💻 Windows
* 🍎 macOS
* 🐧 Linux
* 📱 Mobile
* 🎮 Other gaming platforms

---

# 🌑 Core Concept

Night Fall Land is a mysterious world where night never ends.

The player wakes up without understanding where they are or why the world is covered in darkness.

There is no sun.

There are almost no stars.

The world is silent.

The player must explore different regions and solve puzzles to progress through the world.

The main design philosophy is:

```text
LEARN
  ↓
UNDERSTAND
  ↓
TEST
  ↓
COMBINE
  ↓
EXPERIMENT
  ↓
SOLVE
  ↓
DISCOVER
```

A mechanic introduced early in the game may become important much later.

For example:

```text
🔥 Fire
    +
🧊 Ice
    ↓
💧 Water
```

The player learns that fire melts ice.

Later, they may need to combine this knowledge with:

* Pressure plates
* Electricity
* Machines
* Doors
* Shadows

The game rewards memory and logical thinking.

---

# 🧠 Core Design Philosophy

Night Fall Land follows one important rule:

> **Teach → Test → Combine → Surprise**

### Example

### 1. Teach

The player discovers:

```text
🔥 + 🧊 = Melted Ice
```

### 2. Test

The player must use fire to melt an ice wall.

### 3. Combine

The player melts ice to reveal a pressure plate.

### 4. Surprise

Later, the player discovers that melting the ice can also flood an important area.

The goal is to create puzzles that make the player think:

> "Oh... that's why that object was there."

---

# 🎮 Gameplay

The main gameplay loop is:

```text
Explore
   ↓
Observe
   ↓
Discover a Problem
   ↓
Experiment
   ↓
Understand the Puzzle
   ↓
Solve It
   ↓
Unlock New Areas
   ↓
Discover Secrets
   ↓
Continue Exploring
```

The player will:

* Explore maps
* Enter levels
* Solve puzzles
* Interact with objects
* Discover hidden areas
* Find collectibles
* Meet mysterious characters
* Read notes and clues
* Unlock new levels
* Discover the story

---

# 🧩 Puzzle System

The puzzle system is the core of Night Fall Land.

Puzzles should be modular, allowing different mechanics to interact with each other.

## Basic Puzzle Objects

* 🔘 Buttons
* 🟫 Pressure Plates
* 🎚️ Levers
* 🚪 Doors
* 🔑 Keys
* 📦 Pushable Blocks
* 🌉 Bridges
* 🌀 Teleporters
* ⚙️ Machines

Example:

```text
Player
   ↓
Push Box
   ↓
Activate Pressure Plate
   ↓
Open Door
   ↓
Reach Exit
```

---

## Environmental Mechanics

The game can gradually introduce new mechanics.

### 🔥 Fire

Fire can:

* Melt ice
* Activate objects
* Destroy specific materials
* Create light
* Trigger other mechanisms

### 🧊 Ice

Ice can:

* Block paths
* Melt
* Freeze water
* Create slippery surfaces

### 💧 Water

Water can:

* Flow
* Activate mechanisms
* Conduct electricity
* Freeze
* Fill specific areas

### ⚡ Electricity

Electricity can:

* Power machines
* Activate doors
* Travel through conductive objects

### 💡 Light

Light can:

* Reveal hidden objects
* Create shadows
* Activate light-sensitive mechanisms

### 🌑 Shadows

Shadows can:

* Hide paths
* Reveal symbols
* Activate special mechanisms

### 🪞 Mirrors

Mirrors can:

* Reflect light
* Redirect lasers
* Create environmental puzzles

### 🌀 Wind

Wind can:

* Move objects
* Activate mechanisms
* Change environmental conditions

### ⏪ Time

A future advanced mechanic can allow players to manipulate time.

---

# 🗺️ World and Maps

The world is divided into multiple major regions.

```text
                         🌙 NIGHT FALL LAND
                                │
                              CASTLE
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
          🌲 DARKWOOD      🏘️ MOON VILLAGE    🏜️ DEADLANDS
              │                 │                 │
          🏔️ ICE PEAK ─────────┘             🏭 OLD FACTORY
              │
          🌫️ LOST CITY
              │
          🌋 DEEP NIGHT
              │
           🌑 THE VOID
```

Each region introduces new mechanics and gradually increases the difficulty.

---

## 🌲 Darkwood

The first major region.

### Main Purpose

Teach the player the fundamentals.

### Possible Mechanics

* Movement
* Interaction
* Buttons
* Doors
* Pushable blocks
* Pressure plates
* Basic exploration

Darkwood should introduce the game's core systems without overwhelming the player.

---

## 🏘️ Moon Village

An abandoned village filled with clues and mysteries.

### Main Mechanics

* Notes
* Symbols
* NPC dialogue
* Patterns
* Hidden switches
* Combination puzzles

Moon Village teaches players that **information itself can be part of a puzzle**.

---

## 🏭 Old Factory

An abandoned industrial facility.

### Main Mechanics

* Electricity
* Machines
* Gears
* Conveyor belts
* Moving platforms
* Power systems

Players begin combining multiple puzzle mechanics.

---

## 🏔️ Frozen Peak

A frozen mountain region.

### Main Mechanics

* Ice
* Water
* Fire
* Snow
* Wind
* Slippery surfaces

Example:

```text
Fire
  ↓
Melt Ice
  ↓
Water Appears
  ↓
Activate Mechanism
  ↓
Open Door
```

---

## 🏜️ Deadlands

A mysterious and dangerous region.

### Main Mechanics

* Sand
* Moving terrain
* Direction puzzles
* Hidden paths
* Environmental clues

---

## 🌫️ Lost City

A mysterious abandoned city.

### Main Mechanics

* Illusions
* Mirrors
* Fake walls
* Invisible paths
* Perspective puzzles
* False information

The player begins questioning whether everything they see is real.

---

## 🌋 Deep Night

The late-game region.

Deep Night combines mechanics from previous maps.

```text
Fire
 ↓
Ice
 ↓
Water
 ↓
Electricity
 ↓
Machine
 ↓
Door
```

The player already understands individual mechanics.

The challenge is learning how to combine them.

---

## 🌑 The Void

The final region.

The Void should feel different from every other map.

The player encounters strange environments and unfamiliar rules.

Previous mechanics may behave differently.

The final puzzles combine everything learned throughout the game.

---

# 👤 Player System

The player controls the main character.

## Core Actions

* Walk
* Run, optional
* Interact
* Push objects
* Pull objects, optional
* Pick up objects
* Drop objects
* Examine objects

## Player Movement

The player can move in multiple directions.

```text
W
A S D
```

The movement system should include:

* Collision detection
* Movement animation
* Direction tracking
* Interaction range

---

# 🔍 Interaction System

When the player approaches an interactive object:

```text
Player
   ↓
Detect Nearby Object
   ↓
Display Interaction Prompt
   ↓
Player Presses E
   ↓
Object Responds
```

Examples:

```text
Door     → Open
NPC      → Talk
Button   → Activate
Lever    → Pull
Note     → Read
Block    → Push
Chest    → Open
```

---

# 📈 Progression System

Players progress by completing levels.

```text
Level 1
   ↓
Level 2
   ↓
Level 3
   ↓
Complete Map
   ↓
Unlock New Map
```

Each map contains:

* Main levels
* Optional levels
* Secret areas
* Collectibles
* Story events

The player should be able to revisit previously completed maps.

---

# 👻 Characters

## 🌑 The Wanderer

A mysterious character who appears throughout the game.

The Wanderer rarely gives direct answers.

Example:

> "The path you seek was already walked."

The player must interpret what the character means.

---

## 🦉 The Owl

The Owl provides subtle hints.

Instead of directly explaining the solution, the Owl may say:

> "The stone remembers where it belongs."

The player must still solve the puzzle themselves.

---

## 👁️ The Watcher

A mysterious figure that appears in the background.

The player may notice it:

* Behind trees
* Inside windows
* On rooftops
* In reflections
* In distant rooms

Eventually, the player realizes:

> The Watcher has been following them.

---

# 📜 Story System

The story should be discovered through exploration rather than long explanations.

Story elements include:

* Notes
* Books
* Signs
* NPC dialogue
* Environmental storytelling
* Cutscenes
* Hidden lore

Example:

```text
NOTE #01

The sun disappeared 47 years ago.
```

Later:

```text
NOTE #08

It wasn't the sun that disappeared.
```

Later:

```text
NOTE #17

Something covered the sky.
```

The player slowly discovers what happened to Night Fall Land.

---

# 🔐 Secrets

Exploration should be rewarded.

## Secret Rooms

Players may find:

* Hidden doors
* Breakable walls
* Invisible paths
* Alternative routes
* Secret puzzles

Example:

```text
██████████████
████████░█████
██████████████
```

A slightly different wall may hide a secret.

---

# 🌙 Collectibles

The primary collectible can be:

## Moon Shards

Moon Shards can unlock:

* Character skins
* Visual effects
* Music
* Lore
* Secret content

Collectibles should not be required to complete the main story.

---

# 🏆 Completion System

Each map can track player progress.

```text
DARKWOOD

Main Levels:      100%
Secrets:           60%
Moon Shards:       80%
Lore:              40%

Overall:           72%
```

---

# 🎨 Art Style

Night Fall Land uses a pixel-art visual style.

## Art Direction

The game should focus on:

* Atmospheric darkness
* Strong silhouettes
* Bright light sources
* Environmental storytelling
* Detailed pixel environments
* Smooth pixel animations

Each region should have a unique visual identity.

---

# 🌈 Map Colors

| Map          | Visual Style                    |
| ------------ | ------------------------------- |
| Darkwood     | Dark green and blue             |
| Moon Village | Blue, gray, warm lights         |
| Old Factory  | Dark gray and mechanical lights |
| Frozen Peak  | Cold blue and white             |
| Deadlands    | Dark orange and brown           |
| Lost City    | Purple and blue                 |
| Deep Night   | Dark red and black              |
| The Void     | Black and monochrome            |

---

# 🎵 Audio System

The game requires both music and sound effects.

## Music

Music should change depending on:

* Current map
* Puzzle state
* Story events
* Secrets
* Dangerous situations

## Sound Effects

Examples:

* Walking
* Interacting
* Button press
* Door opening
* Puzzle completion
* Item collection
* Fire
* Water
* Ice
* Electricity
* Secret discovery
* UI interactions

---

# 🖥️ User Interface

The UI should remain minimal.

## Required Screens

### Main Menu

```text
NIGHT FALL LAND

▶ PLAY
  SETTINGS
  CREDITS
```

### Pause Menu

```text
PAUSED

▶ RESUME
  RESTART LEVEL
  SETTINGS
  MAIN MENU
```

### Level Complete

```text
LEVEL COMPLETE

Time: 02:31
Secrets: 2/3
Moon Shards: 4/5

▶ NEXT LEVEL
  REPLAY
  MAP
```

### World Map

```text
🌲 Darkwood       ✓
🏘️ Moon Village   🔒
🏭 Old Factory    🔒
🏔️ Frozen Peak    🔒
```

---

# 🛠️ Technology Stack

Night Fall Land does not require a complicated backend for the initial version.

## Core Technology

| Technology               | Purpose             |
| ------------------------ | ------------------- |
| HTML                     | Game webpage        |
| CSS                      | User interface      |
| TypeScript               | Game programming    |
| Phaser                   | Game engine         |
| Git                      | Version control     |
| GitHub                   | Source code hosting |
| Tiled                    | Map creation        |
| Aseprite                 | Pixel art, optional |
| Web Audio                | Audio playback      |
| localStorage / IndexedDB | Local saves         |

## Hosting

The game can be hosted as a static website.

Possible hosting platforms:

* GitHub Pages
* Cloudflare Pages
* Netlify

## Database

### Vercel Environment Variables

For cloud saves, configure these environment variables in Vercel. Never put the
service-role key in frontend files or expose it to the browser:

```text
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-public-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

The browser receives the public Supabase URL and anon key at runtime from
`api/public-config.js` for authentication. These values are public by design.
Database profile operations are routed through `api/player-profile.js`, which
verifies the user's access token before using the server-side service-role key.

### Initial Version

**No database is required.**

Player progress can be stored locally:

```text
Browser
   ↓
localStorage / IndexedDB
   ↓
Saved Game Progress
```

A database should only be considered later if the game requires:

* Online accounts
* Cloud saves
* Multiplayer
* Global leaderboards
* Community-created levels

---

# 📁 Project Structure

```text
night-fall-land/
│
├── public/
│   └── favicon.ico
│
├── src/
│   │
│   ├── main.ts
│   │
│   ├── game/
│   │   ├── Game.ts
│   │   ├── GameConfig.ts
│   │   └── Constants.ts
│   │
│   ├── scenes/
│   │   ├── BootScene.ts
│   │   ├── PreloadScene.ts
│   │   ├── MainMenuScene.ts
│   │   ├── WorldMapScene.ts
│   │   ├── LevelScene.ts
│   │   └── PauseScene.ts
│   │
│   ├── entities/
│   │   ├── Player.ts
│   │   ├── NPC.ts
│   │   ├── Wanderer.ts
│   │   ├── Owl.ts
│   │   └── Watcher.ts
│   │
│   ├── puzzles/
│   │   ├── Puzzle.ts
│   │   ├── Button.ts
│   │   ├── PressurePlate.ts
│   │   ├── Lever.ts
│   │   ├── Door.ts
│   │   ├── PushBlock.ts
│   │   ├── Fire.ts
│   │   ├── Ice.ts
│   │   ├── Water.ts
│   │   └── Electricity.ts
│   │
│   ├── systems/
│   │   ├── SaveSystem.ts
│   │   ├── AudioSystem.ts
│   │   ├── DialogueSystem.ts
│   │   ├── PuzzleSystem.ts
│   │   ├── InputSystem.ts
│   │   └── LightingSystem.ts
│   │
│   ├── maps/
│   │   ├── Darkwood/
│   │   ├── MoonVillage/
│   │   ├── OldFactory/
│   │   ├── FrozenPeak/
│   │   ├── Deadlands/
│   │   ├── LostCity/
│   │   ├── DeepNight/
│   │   └── TheVoid/
│   │
│   ├── data/
│   │   ├── levels/
│   │   ├── dialogue/
│   │   ├── story/
│   │   └── puzzles/
│   │
│   └── ui/
│       ├── Menu.ts
│       ├── PauseMenu.ts
│       ├── SettingsMenu.ts
│       └── CompletionScreen.ts
│
├── assets/
│   │
│   ├── sprites/
│   │   ├── player/
│   │   ├── npc/
│   │   └── objects/
│   │
│   ├── tilesets/
│   │   ├── darkwood/
│   │   ├── village/
│   │   ├── factory/
│   │   └── frozen-peak/
│   │
│   ├── maps/
│   ├── music/
│   ├── sounds/
│   └── fonts/
│
├── docs/
│   ├── GAME_DESIGN.md
│   ├── STORY.md
│   ├── PUZZLES.md
│   ├── MAPS.md
│   ├── CHARACTERS.md
│   └── DEVELOPMENT.md
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

# ⚙️ Game Systems

The game consists of several major systems.

## Player System

Handles:

* Movement
* Animation
* Collision
* Interaction

## Puzzle System

Handles:

* Puzzle objects
* Puzzle states
* Puzzle completion
* Object connections

## Level System

Handles:

* Level loading
* Level completion
* Level restart
* Exits

## Save System

Handles:

* Player progress
* Completed levels
* Collectibles
* Settings

## Dialogue System

Handles:

* NPC conversations
* Notes
* Story events

## Audio System

Handles:

* Music
* Sound effects
* Volume settings

## Lighting System

Handles:

* Darkness
* Light sources
* Shadows

---

# 💾 Save System

The initial version uses local browser storage.

The game should save:

```text
{
  currentMap,
  currentLevel,
  completedLevels,
  collectedMoonShards,
  discoveredSecrets,
  storyProgress,
  unlockedMaps,
  settings
}
```

Players should be able to continue from their last saved progress.

---

# 🧱 Level Development

Levels should be created using reusable puzzle components.

Example:

```text
Player
   ↓
Push Block
   ↓
Pressure Plate Activated
   ↓
Door Opens
   ↓
Player Reaches Exit
```

The goal is to avoid creating a completely new system for every puzzle.

Instead:

```text
Puzzle
   ├── Button
   ├── Door
   ├── Lever
   ├── Block
   ├── Fire
   └── Ice
```

These objects can be combined in different ways.

---

# 🗺️ Map Creation

Maps can be created using a tile-based editor such as Tiled.

Each map may contain:

* Ground layer
* Decoration layer
* Collision layer
* Object layer
* Puzzle layer
* NPC layer

Example:

```text
MAP
│
├── Ground
├── Walls
├── Decorations
├── Objects
├── Puzzle Objects
├── NPCs
└── Exits
```

---

# 🚀 Development Roadmap

## Phase 1 — Basic Prototype

Create:

* Player movement
* Collision
* Camera
* Basic map
* Interaction

Goal:

> Create one playable room.

---

## Phase 2 — First Puzzle

Create:

* Pushable block
* Pressure plate
* Door
* Level exit

Goal:

> Create one complete puzzle level.

---

## Phase 3 — Level System

Add:

* Multiple levels
* Level completion
* Level transitions
* Restart system

---

## Phase 4 — Save System

Add:

* Automatic saving
* Progress tracking
* Level unlocking

---

## Phase 5 — Darkwood Demo

Create:

* 5–10 levels
* Basic pixel art
* Basic music
* One NPC
* Secrets
* Moon Shards

Goal:

> Release a small playable demo.

---

## Phase 6 — Story

Add:

* Dialogue
* Notes
* Lore
* The Wanderer
* The Owl
* The Watcher

---

## Phase 7 — Advanced Mechanics

Add:

* Fire
* Ice
* Water
* Electricity
* Shadows
* Mirrors

---

## Phase 8 — Additional Maps

Develop:

* Moon Village
* Old Factory
* Frozen Peak
* Deadlands
* Lost City

---

## Phase 9 — Final Worlds

Develop:

* Deep Night
* The Void

Combine mechanics from the entire game.

---

## Phase 10 — Final Polish

Improve:

* Performance
* Animations
* Audio
* Visual effects
* UI
* Puzzle balancing
* Mobile compatibility

---

# 💻 Installation

## Requirements

Install:

* Node.js
* npm
* Git

## Clone the Repository

```bash
git clone https://github.com/USERNAME/night-fall-land.git
```

Move into the project folder:

```bash
cd night-fall-land
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The game should now be available in your browser.

---

# 🎮 Controls

| Key | Action        |
| --- | ------------- |
| W   | Move Up       |
| A   | Move Left     |
| S   | Move Down     |
| D   | Move Right    |
| E   | Interact      |
| R   | Restart Level |
| ESC | Pause         |

Controls may change during development.

---

# 🧪 Testing

Every level should be tested for:

* Broken puzzles
* Impossible solutions
* Unintended solutions
* Player soft-locks
* Collision problems
* Performance issues
* Save problems

Puzzle testing questions:

1. Can the player understand the available objects?
2. Is there enough information to solve the puzzle?
3. Is the solution logical?
4. Can the player accidentally get permanently stuck?
5. Is the puzzle satisfying when solved?

---

# 🔮 Future Features

Potential future features include:

* 🌐 Online accounts
* ☁️ Cloud saves
* 🏆 Leaderboards
* 🧩 Daily puzzles
* 🧱 Community level editor
* 🌍 Community-created levels
* 🧑‍🤝‍🧑 Cooperative puzzles
* 🏅 Achievements
* 📱 Mobile version
* 🎮 Controller support
* 🖥️ Desktop version

These features are **not required for the initial version**.

---

# 📊 Development Priorities

The recommended development order is:

```text
1. Player Movement
        ↓
2. Collision
        ↓
3. Interaction
        ↓
4. First Puzzle
        ↓
5. Level System
        ↓
6. Save System
        ↓
7. Pixel Art
        ↓
8. Audio
        ↓
9. Story
        ↓
10. More Maps
```

Do not try to build every feature simultaneously.

---

# 🎯 First Playable Version

The first version of Night Fall Land should be small.

```text
NIGHT FALL LAND v0.1

🌲 DARKWOOD

✓ Player movement
✓ 5 playable levels
✓ Basic puzzles
✓ 1 NPC
✓ 1 secret area
✓ Moon Shards
✓ Pixel art
✓ Music
✓ Local save system
```

Once this version works, the foundation of the game is complete.

The rest of the game can be expanded from that foundation.

---

# ⚠️ Project Rules

## Rule 1

Do not add features without testing the core game first.

## Rule 2

Every puzzle should have a logical solution.

## Rule 3

Avoid random guessing.

## Rule 4

Reward exploration.

## Rule 5

Reuse mechanics in creative ways.

## Rule 6

Do not explain everything to the player.

## Rule 7

Respect the player's intelligence.

---

# 🌙 Final Vision

Night Fall Land is a game about:

* Curiosity
* Observation
* Experimentation
* Logic
* Mystery
* Discovery

The player enters a world they do not understand.

The game does not immediately explain everything.

Instead, the player learns by exploring.

They make mistakes.

They experiment.

They discover patterns.

They understand the rules.

Then those rules become part of bigger puzzles.

The ultimate question remains:

> **Why did the night never end?**

---

# 🌑 Welcome to Night Fall Land

```text
The world is silent.

The sun is gone.

The darkness never ends.

You don't know why you are here.

But someone has been waiting for you.

Welcome to Night Fall Land.
```


---

## 📌 Project Status

🚧 **Currently in Planning / Early Development**

---

## 📜 License

License information will be added when the project is ready for public release.

---

**🌙 Night Fall Land — Learn the rules. Question the rules. Escape the night.**
