/* ==========================================================================
   NIGHT FALL LAND - Puzzle Adventure HUD Controller
   Tutorial guidance, interaction prompt, keys, and moon shards tracker
   ========================================================================== */

class GameHUD {
  constructor() {
    this.keysVal = document.getElementById('hud-keys-val');
    this.shardsVal = document.getElementById('hud-shards-val');
    this.promptBadge = document.getElementById('hud-interaction-prompt');
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
      this.shardsVal.textContent = `🌙 ${player.shards} / 1`;
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

    // Dynamic Step-by-Step Tutorial Guide Banner
    if (this.tutorialGuide && world) {
      let guideText = 'Use [W, A, S, D] to explore the Darkwood chamber.';

      // Check puzzle stage
      const plate = world.plates[0];
      const door1 = world.doors[0];
      const lever = world.levers[0];
      const exitDoor = world.doors[2];

      if (player.x < 300) {
        guideText = 'Step 1: Walk to the stone tablet and press [E] to read the ancient writings.';
      } else if (!door1.isOpen) {
        guideText = 'Step 2: Walk directly into the stone block to push it onto the purple pressure plate.';
      } else if (!lever.isOn) {
        guideText = 'Step 3: Proceed through the opened gate and press [E] to pull the ancient lever.';
      } else if (player.keys === 0 && !exitDoor.isOpen) {
        guideText = 'Step 4: Collect the Golden Moon Key 🗝️ and the hidden Moon Shard 🌙.';
      } else if (!exitDoor.isOpen) {
        guideText = 'Step 5: Stand by the locked gate and press [E] to unlock it with your Moon Key.';
      } else {
        guideText = 'Step 6: Step onto the glowing exit portal to complete the trial!';
      }

      this.tutorialGuide.textContent = guideText;
    }
  }

  showVictoryOverlay(stats) {
    const el = document.getElementById('overlay-victory');
    if (!el) return;

    const statShards = document.getElementById('victory-stat-shards');
    const statTime = document.getElementById('victory-stat-time');

    if (statShards) statShards.textContent = `${stats.shards} / 1 Found`;
    if (statTime) statTime.textContent = `${Math.floor(stats.time)}s`;

    window.screenManager.showOverlay('overlay-victory');
  }

  showPauseOverlay() {
    window.screenManager.showOverlay('overlay-pause');
  }
}

window.GameHUD = GameHUD;
