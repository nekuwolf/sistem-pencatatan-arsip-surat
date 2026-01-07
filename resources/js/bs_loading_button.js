/**
 * Initialize bootstrap button loading behavior
 * Targets:
 * [cstmtag-button-loading="true"]
 */
export function initButtonLoading(root = document) {
  // Prevent double-binding
  if (root === document && document.body.dataset.buttonLoadingInit) return;
  if (root === document) {
    document.body.dataset.buttonLoadingInit = 'true';
  }

  root.addEventListener('click', (e) => {
    const btn = e.target.closest('[cstmtag-button-loading="true"]');
    if (!btn) return;

    const form = btn.closest('form');

    // If button is inside a form and form is invalid, do nothing
    if (form && !form.checkValidity()) {
      return;
    }

    const main = btn.querySelector('.cstmtag-icon-main');
    const loader = btn.querySelector('.cstmtag-loading-indicator');

    if (!main || !loader) return;

    // Hide main content
    main.classList.add('d-none');
    main.hidden = true;

    // Show loading indicator
    loader.classList.remove('d-none');
    loader.hidden = false;

    // Workaround delay:
    // if disabled immediately, form submit may be cancelled
    setTimeout(() => {
      btn.disabled = true;
    }, 10);
  });
}

/**
 * DOM ready (Vite + AdonisJS)
 */
document.addEventListener('DOMContentLoaded', () => {
  initButtonLoading();
  console.log('loaded button_loading.js');
});

/**
 * Optional manual re-init (API consistency)
 */
window.initButtonLoading = initButtonLoading;
