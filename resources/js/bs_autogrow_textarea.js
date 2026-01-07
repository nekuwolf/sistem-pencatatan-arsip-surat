/**
 * Initialize Auto-Grow Logic
 * Finds:
 * textarea[cstm-autogrow-height="true"]
 */
function initAutoGrow(root = document) {
  const selector = 'textarea[cstm-autogrow-height="true"]';

  let targets = root.querySelectorAll(selector);

  // If root itself is the textarea (edge case)
  if (root.matches && root.matches(selector)) {
    targets = [root];
  }

  targets.forEach((el) => {
    // SAFETY: prevent double init
    if (el.hasAttribute('data-autogrow-init')) return;

    el.setAttribute('data-autogrow-init', 'true');

    // Config
    const minHeight =
      parseInt(el.getAttribute('cstm-autogrow-height-minpx')) ||
      el.offsetHeight;
    const maxHeight =
      parseInt(el.getAttribute('cstm-autogrow-height-maxpx')) || Infinity;

    // Base styles
    el.style.resize = 'none';
    el.style.overflowY = 'hidden';
    el.style.boxSizing = 'border-box';
    el.style.minHeight = `${minHeight}px`;

    const autoResize = () => {
      el.style.height = 'auto';

      const newHeight = el.scrollHeight;

      if (newHeight > maxHeight) {
        el.style.height = `${maxHeight}px`;
        el.style.overflowY = 'auto';
      } else {
        el.style.height = `${Math.max(newHeight, minHeight)}px`;
        el.style.overflowY = 'hidden';
      }
    };

    // Events
    el.addEventListener('input', autoResize);

    // Initial run
    autoResize();
  });
}

/**
 * DOM ready (Vite + AdonisJS)
 */
document.addEventListener('DOMContentLoaded', () => {
  initAutoGrow();
  console.log('loaded autogrow_textarea.js');
});

/**
 * Optional manual re-init for dynamic DOM inserts
 */
window.initAutoGrow = initAutoGrow;
