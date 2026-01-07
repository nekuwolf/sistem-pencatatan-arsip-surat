/**
 * Initialize inputs with current local date/time
 * Targets:
 * input[cstmtag-datetime-now="true"]
 */
export function initDateTimeNow(root = document) {
  const inputs = root.querySelectorAll(
    'input[cstmtag-datetime-now="true"]'
  );

  if (!inputs.length) return;

  const now = new Date();
  const localNow = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000
  );

  inputs.forEach((input) => {
    // Do nothing if value already exists
    if (input.value) return;

    switch (input.type) {
      case 'datetime-local':
        input.value = localNow.toISOString().slice(0, 16);
        break;

      case 'date':
        input.value = localNow.toISOString().slice(0, 10);
        break;

      case 'datetime':
        input.value = localNow.toISOString();
        break;
    }
  });
}

/**
 * DOM ready (Vite + AdonisJS)
 */
document.addEventListener('DOMContentLoaded', () => {
  initDateTimeNow();
  console.log('loaded datetime_now.js');
});

/**
 * Optional: allow manual re-init
 */
window.initDateTimeNow = initDateTimeNow;
