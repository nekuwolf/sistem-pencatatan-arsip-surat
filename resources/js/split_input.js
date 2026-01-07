import { debounce } from './debounce';

/**
 * Split input with join sync
 * Looks for elements with the same `cstm-split-input` value
 * and joins them into `cstm-split-input-join`
 *
 * Example:
 * <input cstm-split-input="x" cstm-split-input-index="1">
 * <input cstm-split-input="x" cstm-split-input-index="2">
 * <input cstm-split-input-join="x" hidden>
 */
function initSplitInputs(root = document) {
  const splitInputs = Array.from(
    root.querySelectorAll('[cstm-split-input], [cstm-split-input-join]')
  );

  const groups = splitInputs.reduce((acc, input) => {
    const key = input.getAttribute('cstm-split-input');
    const index =
      parseInt(input.getAttribute('cstm-split-input-index'), 10) - 1;

    if (!key || isNaN(index)) return acc;

    if (!acc[key]) acc[key] = [];
    acc[key][index] = input;
    return acc;
  }, {});

  Object.entries(groups).forEach(([key, inputs]) => {
    const joinInput = root.querySelector(
      `[cstm-split-input-join="${key}"]`
    );
    if (!joinInput) return;

    // Prevent double-binding
    if (joinInput.dataset.splitInitialized) return;
    joinInput.dataset.splitInitialized = 'true';

    const updateJoin = debounce(() => {
      joinInput.value = inputs.map(i => i?.value || '').join('');
    }, 60);

    inputs.forEach((input, idx) => {
      if (!input) return;
      if (input.dataset.splitInitialized) return;
      input.dataset.splitInitialized = 'true';

      const maxlength =
        parseInt(input.getAttribute('maxlength')) || Infinity;
      const minlength =
        parseInt(input.getAttribute('minlength')) || 0;

      input.addEventListener('input', () => {
        if (input.value.length > maxlength) {
          input.value = input.value.slice(0, maxlength);
        }

        updateJoin();

        if (input.value.length === maxlength && inputs[idx + 1]) {
          inputs[idx + 1].focus();
        }
      });

      input.addEventListener('paste', (e) => {
        e.preventDefault();
        let remainingText =
          (e.clipboardData || window.clipboardData).getData('text');

        inputs.forEach((currentInput, i) => {
          if (!currentInput) return;

          const max =
            parseInt(currentInput.getAttribute('maxlength')) || Infinity;

          let chars = remainingText.slice(0, max);

          if (currentInput.type === 'number') {
            chars = chars.replace(/\D/g, '');
          }

          currentInput.value = chars;
          remainingText = remainingText.slice(chars.length);

          if (chars.length === max && inputs[i + 1]) {
            inputs[i + 1].focus();
          }
        });

        updateJoin();
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && input.value === '' && inputs[idx - 1]) {
          inputs[idx - 1].focus();
        }
      });

      input.addEventListener('blur', () => {
        if (input.value.length < minlength) {
          input.value = '';
        }
      });
    });

    // Initialize from join input value
    if (joinInput.value) {
      let pos = 0;
      inputs.forEach(input => {
        if (!input) return;
        const max =
          parseInt(input.getAttribute('maxlength')) || Infinity;
        input.value = joinInput.value.slice(pos, pos + max);
        pos += max;
      });
    }

    joinInput.addEventListener(
      'input',
      debounce(() => {
        let pos = 0;
        inputs.forEach(input => {
          if (!input) return;
          const max =
            parseInt(input.getAttribute('maxlength')) || Infinity;
          input.value = joinInput.value.slice(pos, pos + max);
          pos += max;
        });
      }, 50)
    );
  });
}

/**
 * DOM ready (Vite + AdonisJS)
 */
document.addEventListener('DOMContentLoaded', () => {
  initSplitInputs();
  console.log('loaded split_input.js');
});

/**
 * Optional: allow manual re-init for dynamically injected HTML
 */
window.initSplitInputs = initSplitInputs;
