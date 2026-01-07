/**
 * Helper: Syncs the button icons based on the input's CURRENT state.
 * Does NOT toggle the input; only updates UI.
 */
function syncIconState(btn, root = document) {
  const key = btn.getAttribute('cstm-data-toggle-password-btn');
  const target = root.querySelector(
    `[cstm-data-toggle-password="${key}"]`
  );

  if (!target) return;

  // If type is "password", it is hidden; otherwise visible
  const isVisible = target.type !== 'password';

  const iconMain = btn.querySelector('.cstmtag-icon-main');
  const iconAlt = btn.querySelector('.cstmtag-icon-alt');

  if (!iconMain || !iconAlt) return;

  if (isVisible) {
    // Visible (text)
    iconMain.classList.add('d-none');
    iconMain.hidden = true;

    iconAlt.classList.remove('d-none');
    iconAlt.hidden = false;
  } else {
    // Hidden (password)
    iconMain.classList.remove('d-none');
    iconMain.hidden = false;

    iconAlt.classList.add('d-none');
    iconAlt.hidden = true;
  }
}

/**
 * Initialize toggle-password behavior
 * Targets:
 * [cstm-data-toggle-password-btn]
 */
export function initTogglePassword(root = document) {
  // Prevent double-binding (document-level delegation)
  if (root === document && document.body.dataset.togglePasswordInit) return;
  if (root === document) {
    document.body.dataset.togglePasswordInit = 'true';
  }

  // 1. Initial sync (on first render)
  const buttons = root.querySelectorAll(
    '[cstm-data-toggle-password-btn]'
  );

  buttons.forEach((btn) => {
    syncIconState(btn, root);
  });

  // 2. Click handler (delegated)
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('[cstm-data-toggle-password-btn]');
    if (!btn) return;

    const key = btn.getAttribute('cstm-data-toggle-password-btn');
    const target = root.querySelector(
      `[cstm-data-toggle-password="${key}"]`
    );

    if (!target) return;
    if (target.tagName !== 'INPUT') return;

    // Toggle input type
    target.type = target.type === 'password' ? 'text' : 'password';

    // Sync UI
    syncIconState(btn, root);
  });
}

/**
 * DOM ready (Vite + AdonisJS)
 */
document.addEventListener('DOMContentLoaded', () => {
  initTogglePassword();
  console.log('loaded toggle_password.js');
});

/**
 * Optional manual re-init
 */
window.initTogglePassword = initTogglePassword;
