/**
 * Copy on click
 *
 * Targets:
 *  - Trigger: [cstm-data-copy-btn="key"]
 *  - Target:  [cstm-data-copy="key"]
 *
 * Example:
 * <input cstm-data-copy="x" value="Hello">
 * <button cstm-data-copy-btn="x">Copy</button>
 */
export function initDataCopy(root = document) {
  // Prevent double-binding on document
  if (root === document && document.body.dataset.dataCopyInit) return;
  if (root === document) {
    document.body.dataset.dataCopyInit = 'true';
  }

  root.addEventListener('click', async (e) => {
    const btn = e.target.closest('[cstm-data-copy-btn]');
    if (!btn) return;

    const key = btn.getAttribute('cstm-data-copy-btn');
    if (!key) return;

    const target = document.querySelector(`[cstm-data-copy="${key}"]`);
    if (!target) return;

    const value =
      target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement
        ? target.value
        : target.textContent ?? '';

    const originalContent = btn.innerHTML;

    // Visual feedback
    btn.textContent = 'Copied';

    try {
      if (!navigator.clipboard) {
        throw new Error('Clipboard API not available');
      }

      await navigator.clipboard.writeText(value);
    } catch (err) {
      console.error('Copy failed:', err);
      btn.textContent = 'Failed';
    }

    setTimeout(() => {
      btn.innerHTML = originalContent;
    }, 1500);
  });
}

/**
 * DOM ready (Vite + AdonisJS)
 */
document.addEventListener('DOMContentLoaded', () => {
  initDataCopy();
  console.log('loaded data_copy.js');
});

/**
 * Optional manual re-init
 */
window.initDataCopy = initDataCopy;
