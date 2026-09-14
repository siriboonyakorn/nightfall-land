/* ==========================================================================
   NIGHT FALL LAND - In-Game Clue Journal & Codex UI
   Records discovered ancient tablets, astronomical ciphers, and puzzle sketches.
   Toggleable via [J] key or the HUD button.
   ========================================================================== */

class ClueJournal {
  constructor() {
    this.entries = [];
    this.isOpen = false;
    this.modal = null;
    this.listContainer = null;
    this.detailContainer = null;
    this.selectedEntryId = null;
  }

  init() {
    this.modal = document.getElementById('modal-journal');
    this.listContainer = document.getElementById('journal-entries-list');
    this.detailContainer = document.getElementById('journal-detail-content');

    const btnClose = document.getElementById('btn-close-journal');
    if (btnClose) {
      btnClose.addEventListener('click', () => this.close());
    }

    const hudBtn = document.getElementById('btn-hud-journal');
    if (hudBtn) {
      hudBtn.addEventListener('click', () => this.toggle());
    }
  }

  addEntry(entry) {
    // Check if already recorded
    const existing = this.entries.find(e => e.id === entry.id);
    if (!existing) {
      this.entries.push({
        id: entry.id,
        title: entry.title || 'Ancient Inscription',
        text: entry.text || '',
        category: entry.category || 'Tablet Lore',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      // Notify player that a new clue is added to journal
      if (window.screenManager) {
        window.screenManager.showToast(`Recorded in Clue Journal [J]: "${entry.title}"`, 'info');
      }

      this.updateHudBadge();
    }
  }

  updateHudBadge() {
    const badge = document.getElementById('hud-journal-badge');
    if (badge) {
      badge.textContent = `${this.entries.length}`;
    }
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    if (window.audioManager && window.audioManager.playJournalOpen) {
      window.audioManager.playJournalOpen();
    } else if (window.audioManager && window.audioManager.playClick) {
      window.audioManager.playClick();
    }

    if (this.modal) {
      this.modal.classList.add('active');
    }

    this.render();
  }

  close() {
    this.isOpen = false;
    if (this.modal) {
      this.modal.classList.remove('active');
    }
  }

  render() {
    if (!this.listContainer || !this.detailContainer) return;

    this.listContainer.innerHTML = '';

    if (this.entries.length === 0) {
      this.listContainer.innerHTML = `
        <div class="journal-empty-note">
          <div style="font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.6;">📜</div>
          <p>No ancient writings recorded yet.</p>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.3rem;">
            Examine ancient stone tablets and wall glyphs in the chambers [E] to transcribe clues.
          </p>
        </div>
      `;
      this.detailContainer.innerHTML = `
        <div class="journal-detail-placeholder">
          <h3>The Wanderer's Codex</h3>
          <p>Read tablets, examine dials, and observe the environment to reveal the secrets of the night.</p>
        </div>
      `;
      return;
    }

    if (!this.selectedEntryId || !this.entries.find(e => e.id === this.selectedEntryId)) {
      this.selectedEntryId = this.entries[this.entries.length - 1].id;
    }

    // Render left list of entries
    this.entries.forEach(entry => {
      const item = document.createElement('div');
      item.className = `journal-list-item ${entry.id === this.selectedEntryId ? 'active' : ''}`;
      item.innerHTML = `
        <div class="journal-item-title">${entry.title}</div>
        <div class="journal-item-meta">
          <span>${entry.category}</span>
          <span>${entry.time}</span>
        </div>
      `;
      item.addEventListener('click', () => {
        this.selectedEntryId = entry.id;
        this.render();
      });
      this.listContainer.appendChild(item);
    });

    // Render right detail view
    const current = this.entries.find(e => e.id === this.selectedEntryId);
    if (current) {
      this.detailContainer.innerHTML = `
        <div class="journal-paper-header">
          <span class="journal-category-pill">${current.category}</span>
          <h2 class="journal-paper-title">${current.title}</h2>
        </div>
        <div class="journal-paper-body">
          ${current.text.replace(/\n/g, '<br>')}
        </div>
        <div class="journal-paper-footer">
          <span>✦ Night Fall Land Codex</span>
          <span>Observation is power.</span>
        </div>
      `;
    }
  }

  clear() {
    this.entries = [];
    this.selectedEntryId = null;
    this.updateHudBadge();
  }
}

window.clueJournal = new ClueJournal();
