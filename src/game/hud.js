/* ==========================================================================
   NIGHT FALL LAND - Puzzle Adventure HUD Controller
   Tutorial guidance, interaction prompt, keys, and moon shards tracker
   ========================================================================== */

const LEVEL_NAMES = [
  '',
  'Darkwood: The Awakening',
  'Moon Village',
  'Old Factory',
  'Frozen Peak',
  'The Void',
];

class GameHUD {
  constructor() {
    this.keysVal    = document.getElementById('hud-keys-val');
    this.shardsVal  = document.getElementById('hud-shards-val');
    this.promptBadge   = document.getElementById('hud-interaction-prompt');
    this.tutorialGuide = document.getElementById('hud-tutorial-guide');
  }

  update(player, engine, world) {
    if (!player) return;

    // Keys
    if (this.keysVal) {
      this.keysVal.textContent = `🗝️ ${player.keys}`;
    }

    // Moon Shards
    if (this.shardsVal) {
      const total = world ? (world.totalShards || 1) : 1;
      this.shardsVal.textContent = `🌙 ${player.shards} / ${total}`;
    }

    // Interaction Prompt
    if (this.promptBadge) {
      if (player.nearbyInteractable) {
        this.promptBadge.textContent = player.nearbyInteractable.prompt;
        this.promptBadge.classList.add('visible');
      } else {
        this.promptBadge.classList.remove('visible');
      }
    }

    // Dynamic Tutorial Guide Banner (Level 1 only)
    if (this.tutorialGuide && world && world.levelId === 1) {
      const door1    = world.doors[0];
      const opticsDoor = world.doors[1];
      const exitDoor = world.doors[2];

      let guideText = 'Use [W, A, S, D] to explore the Darkwood chamber.';

      if (player.x < 290) {
        guideText = 'Step 1: Walk to the stone tablet and press [E] to read and record in Journal [J].';
      } else if (door1 && !door1.isOpen) {
        guideText = 'Step 2: Push the heavy runic block onto the purple pressure plate.';
      } else if (opticsDoor && !opticsDoor.isOpen) {
        guideText = 'Step 3: Walk to the Quartz Mirror and press [E] to rotate and reflect the light beam into the receptor!';
      } else if (player.keys === 0 && exitDoor && !exitDoor.isOpen) {
        guideText = 'Step 4: Collect the Golden Moon Key 🗝️ and Moon Shard 🌙.';
      } else if (exitDoor && !exitDoor.isOpen) {
        guideText = 'Step 5: Stand by the locked golden gate and press [E] to unlock it.';
      } else {
        guideText = 'Step 6: Step onto the glowing EXIT Stargate to complete the trial! ✦';
      }

      this.tutorialGuide.textContent = guideText;
    } else if (this.tutorialGuide && world && world.levelId > 1) {
      this.tutorialGuide.textContent =
        `Region ${world.levelId}: ${LEVEL_NAMES[world.levelId] || ''} • [J] Clue Journal`;
    }
  }

  showVictoryOverlay(stats) {
    const el = document.getElementById('overlay-victory');
    if (!el) return;

    const statShards  = document.getElementById('victory-stat-shards');
    const statTime    = document.getElementById('victory-stat-time');
    const levelLabel  = document.getElementById('victory-level-label');
    const nextBtn     = document.getElementById('btn-victory-next');

    const total = stats.totalShards || 1;
    if (statShards) statShards.textContent = `${stats.shards} / ${total} Found`;
    if (statTime)   statTime.textContent   = `${Math.floor(stats.time)}s`;
    if (levelLabel) levelLabel.textContent = LEVEL_NAMES[stats.levelId] || 'Trial Complete';

    // If final level, rename button
    if (nextBtn) {
      nextBtn.textContent = stats.levelId >= 5
        ? '✦ Conquer the Night ✦'
        : 'Next Region ➔';
    }

    window.screenManager.showOverlay('overlay-victory');
  }

  showPauseOverlay() {
    window.screenManager.showOverlay('overlay-pause');
  }
}

window.GameHUD = GameHUD;
