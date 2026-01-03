import TomSelect from "tom-select/dist/js/tom-select.popular.js";

// Debounce function
function debounce(func, wait) {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  };
}

/**
 * Copy on click, looks for elements with attribute with same value
 * "cstm-data-copy" as target and "cstm-data-copy-btn" as the trigger button.
 * e.g.
 * <input cstm-data-copy="x">
 * <button cstm-data-copy-btn="x">
 */
document.addEventListener("click", async (e) => {
  const btn = e.target.closest("[cstm-data-copy-btn]");
  if (!btn) return;

  const key = btn.getAttribute("cstm-data-copy-btn");
  if (!key) return;

  // Select the *matching* target element
  const target = document.querySelector(`[cstm-data-copy="${key}"]`);
  if (!target) return;

  const value = target.value ?? target.textContent ?? "";
  const originalText = btn.textContent;

  // Visual feedback
  btn.textContent = "Copied";
  setTimeout(() => {
    btn.textContent = originalText;
  }, 1500);

  try {
    if (!navigator.clipboard) {
      throw new Error("Clipboard API not available.");
    }

    // Handle selecting text
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      target.select();
    } else if (target.isContentEditable) {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(target);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    await navigator.clipboard.writeText(value);
  } catch (error) {
    console.error("Error copying:", error.message);
    btn.textContent = "Failed";
    setTimeout(() => (btn.textContent = originalText), 1500);
  }
});

/**
 * Clear on click, looks for elements with attribute with same value
 * "cstm-data-clear" as target and "cstm-data-clear-btn" as the trigger button.
 * e.g. 
 * <input cstm-data-clear="x">
 * <button cstm-data-clear-btn="x">
 */
document.addEventListener("click", async (e) => {
  const btn = e.target.closest("[cstm-data-clear-btn]");
  if (!btn) return;

  const group = btn.getAttribute("cstm-data-clear-btn");
  if (!group) return;

  // Find ALL elements matching this group
  const targets = document.querySelectorAll(`[cstm-data-clear="${group}"]`);
  if (!targets.length) return;

  targets.forEach(target => {
    // Clear input-like elements
    if ("value" in target) {
      target.value = "";
    }
    // Clear contenteditable
    else if (target.hasAttribute("contenteditable")) {
      target.innerHTML = "";
    }
    // Otherwise clear text content
    else {
      target.textContent = "";
    }

    // Additional support: reset selects
    if (target.tagName === "SELECT") {
      target.selectedIndex = 0;
    }
  });
});

/**
 * Split input with join sync, looks for elements with attribute with same value
 * "cstm-split-input" as source, source has "cstm-split-input-index" as index indicator, 
 * and then join it at "cstm-split-input-join" as final value
 * e.g.
 * <input cstm-split-input="x" cstm-split-input-index="1">
 * <input cstm-split-input-join="x" hidden>
 */
function initSplitInputs(root = document) {
    const splitInputs = Array.from(
        root.querySelectorAll("[cstm-split-input], [cstm-split-input-join]")
    );

    const groups = splitInputs.reduce((acc, input) => {
        const key = input.getAttribute("cstm-split-input");
        const index = parseInt(input.getAttribute("cstm-split-input-index"), 10) - 1;

        if (!key || isNaN(index)) return acc;

        if (!acc[key]) acc[key] = [];
        acc[key][index] = input;
        return acc;
    }, {});

    Object.entries(groups).forEach(([key, inputs]) => {
        const joinInput = root.querySelector(`[cstm-split-input-join="${key}"]`);
        if (!joinInput) return;

        // Prevent double-binding
        if (joinInput.dataset.splitInitialized) return;
        joinInput.dataset.splitInitialized = "true";

        const updateJoin = debounce(() => {
            joinInput.value = inputs.map(i => i?.value || "").join("");
        }, 60);

        inputs.forEach((input, idx) => {
            if (!input) return;
            if (input.dataset.splitInitialized) return;
            input.dataset.splitInitialized = "true";

            const maxlength = parseInt(input.getAttribute("maxlength")) || Infinity;
            const minlength = parseInt(input.getAttribute("minlength")) || 0;

            input.addEventListener("input", () => {
                if (input.value.length > maxlength) {
                    input.value = input.value.slice(0, maxlength);
                }

                updateJoin();

                if (input.value.length === maxlength && inputs[idx + 1]) {
                    inputs[idx + 1].focus();
                }
            });

            input.addEventListener("paste", (e) => {
                e.preventDefault();
                let remainingText =
                    (e.clipboardData || window.clipboardData).getData("text");

                inputs.forEach((currentInput, i) => {
                    if (!currentInput) return;

                    const max = parseInt(currentInput.getAttribute("maxlength")) || Infinity;
                    let chars = remainingText.slice(0, max);

                    if (currentInput.type === "number") {
                        chars = chars.replace(/\D/g, "");
                    }

                    currentInput.value = chars;
                    remainingText = remainingText.slice(chars.length);

                    if (chars.length === max && inputs[i + 1]) {
                        inputs[i + 1].focus();
                    }
                });

                updateJoin();
            });

            input.addEventListener("keydown", (e) => {
                if (e.key === "Backspace" && input.value === "" && inputs[idx - 1]) {
                    inputs[idx - 1].focus();
                }
            });

            input.addEventListener("blur", () => {
                if (input.value.length < minlength) {
                    input.value = "";
                }
            });
        });

        // Initialize from join input value
        if (joinInput.value) {
            let pos = 0;
            inputs.forEach(input => {
                if (!input) return;
                const max = parseInt(input.getAttribute("maxlength")) || Infinity;
                input.value = joinInput.value.slice(pos, pos + max);
                pos += max;
            });
        }

        joinInput.addEventListener("input", debounce(() => {
            let pos = 0;
            inputs.forEach(input => {
                if (!input) return;
                const max = parseInt(input.getAttribute("maxlength")) || Infinity;
                input.value = joinInput.value.slice(pos, pos + max);
                pos += max;
            });
        }, 50));
    });
}

/**
 * tomselect for select
 * looks for select with attribute data-tom-select="true"
 */
function initTomSelect(root = document) {
  root.querySelectorAll('select[data-tom-select="true"]:not([data-ts-initialized])')
    .forEach(select => {
      const endpoint = select.getAttribute('cstm-data-query-endpoint');
      const method = (select.getAttribute('cstm-data-query-endpoint-method') || 'GET').toUpperCase();
      const onlyLocal = select.dataset.tomSelectOnlySearchLocally === 'true';

      const ALLOWED_TS_PLUGINS = new Set([
        'dropdown_input',
        'remove_button',
        'no_backspace_delete',
        'restore_on_backspace', 
      ])

      // Concated string with ";" as separator e.g. "xxx_xxx;yyy_yyy"
      function getValidatedTomSelectPlugins(plugins, defaults = []) {
        const _plugins = plugins
          .split(';')
          .map(p => p.trim())
          .filter(Boolean)
          .filter(p => {
            if (!ALLOWED_TS_PLUGINS.has(p)) {
              console.warn(
                `[cstm] TomSelect: Invalid plugin "${p}" ignored`,
                select
              )
              return false
            }
            return true
          })

        return _plugins.length ? _plugins : defaults
      }

      const config = {
        plugins: getValidatedTomSelectPlugins(select.dataset.tsPlugins || ''),
        valueField: select.dataset.tsoValueField || 'value',
        labelField: select.dataset.tsoLabelField || 'label',
        searchField: select.dataset.tsoSearchField || 'label',
        placeholder: select.dataset.tsoPlaceholder || 'Search and select',
        maxItems: Number(select.dataset.tsoMaxItems) || 1,
        hideSelected: select.dataset.tsoHideSelected === 'false' ? false : true,
        closeAfterSelect: select.dataset.tsoCloseAfterSelect === 'true' ? true : false,
        copyClassesToDropdown: select.dataset.tsoCopyClasessToDropdown === 'false' ? false : true,
        allowEmptyOption: select.dataset.tsoAllowEmptyOption === 'false' ? false : true,
        delimiter: select.dataset.tsoDelimiter || '|',
        loadThrottle: Number(select.dataset.tsoLoadThrottle) || 100,
        preload: select.dataset.tsoPreload === 'true' ? true : select.dataset.tsoPreload === 'false' ? false : select.dataset.tsoPreload
      };

      console.log(`tsPlugins: ${getValidatedTomSelectPlugins(select.dataset.tsPlugins || '')}`)
      // console.log(`tsoValueField: ${select.dataset.tsoValueField || 'value'}`)
      // console.log(`tsoLabelField: ${select.dataset.tsoLabelField || 'label'}`)
      // console.log(`tsoSearchField: ${select.dataset.tsoSearchField || 'label'}`)
      // console.log(`tsoPlaceholder: ${select.dataset.tsoPlaceholder || 'Search and select'}`)
      // console.log(`tsoMaxItems: ${Number(select.dataset.tsoMaxItems) || 1}`)
      // console.log(`tsoHideSelected: ${select.dataset.tsoHideSelected === 'false' ? false : true}`)
      // console.log(`tsoCloseAfterSelect: ${select.dataset.tsoCloseAfterSelect === 'true' ? true : false}`)
      // console.log(`tsoCopyClasessToDropdown: ${select.dataset.tsoCopyClasessToDropdown === 'false' ? false : true}`)
      // console.log(`tsoAllowEmptyOption: ${select.dataset.tsoAllowEmptyOption === 'false' ? false : true}`)
      // console.log(`tsoDelimiter: ${select.dataset.tsoDelimiter || '|'}`)
      // console.log(`tsoLoadThrottle: ${Number(select.dataset.tsoLoadThrottle) || 100}`)
      // console.log(`tsoPreload: ${select.dataset.tsoPreload === 'true' ? true : select.dataset.tsoPreload === 'false' ? false : select.dataset.tsoPreload}`)
      // console.log('------------------------------------------')

      // Only use remote load if endpoint exists and not forcing local search
      if (endpoint && !onlyLocal) {
        config.load = (query, callback) => {
          const url = new URL(endpoint, window.location.origin);
          let fetchOptions = { method };
          const ts = this;

          if (method === 'GET') {
            url.searchParams.set('q', query);
            url.searchParams.set('resAsJson', true);
          } else {
            fetchOptions.headers = { 'Content-Type': 'application/json' };
            fetchOptions.body = JSON.stringify({ q: query, resAsJson: true });
          }

          fetch(url, fetchOptions)
            .then(res => res.json())
            .then(data => {
              callback(data);
              // handle isSelected
              const selectedValues = data
                .filter(item => item.isSelected)
                .map(item => item[config.valueField]);
              if (selectedValues.length) {
                ts.setValue(selectedValues);
              }
            })
            .catch(() => callback());
        };
      }

      const ts = new TomSelect(select, config);

      // Bootstrap invalid sync
      if (select.classList.contains('is-invalid')) {
        ts.control.classList.add('is-invalid');
      }

      select.dataset.tsInitialized = 'true';
    });
}



document.addEventListener("DOMContentLoaded", async () => {
    initSplitInputs();
    initTomSelect();
});

document.body.addEventListener("htmx:afterSwap", async (e) => {
    initSplitInputs(e.target);
    initTomSelect(e.target);
});

/**
 * 1. Helper Function: Syncs the button icons based on the input's CURRENT state.
 * This does not toggle the input; it only updates the UI.
 */
function syncIconState(btn) {
  // Find the target input
  const key = btn.getAttribute("cstm-data-toggle-password-btn");
  const target = document.querySelector(`[cstm-data-toggle-password="${key}"]`);

  if (!target) return;

  // Determine visibility based on current type
  // If type is "password", it is hidden. Anything else (text) is considered visible.
  const isVisible = target.type !== "password";

  // Find icons
  const iconMain = btn.querySelector(".cstmtag-icon-main");
  const iconAlt = btn.querySelector(".cstmtag-icon-alt");

  if (iconMain && iconAlt) {
    if (isVisible) {
      // Input is Visible (Text): Hide 'Main', Show 'Alt'
      iconMain.classList.add("d-none");
      iconMain.hidden = true;

      iconAlt.classList.remove("d-none");
      iconAlt.hidden = false;
    } else {
      // Input is Hidden (Password): Show 'Main', Hide 'Alt'
      iconMain.classList.remove("d-none");
      iconMain.hidden = false;

      iconAlt.classList.add("d-none");
      iconAlt.hidden = true;
    }
  }
}

/**
 * 2. On First Render: Loop through all buttons and sync them immediately.
 */
document.addEventListener("DOMContentLoaded", async () => {
  const allButtons = document.querySelectorAll("[cstm-data-toggle-password-btn]");
  allButtons.forEach((btn) => {
    syncIconState(btn);
  });
});

/**
 * 3. On Click: Toggle the type, then run the sync function.
 * Toggle password on click, looks for elements with attribute with same value
 * "cstm-data-toggle-password" as target and "cstm-data-toggle-password-btn" as the trigger button.
 * e.g. 
 * <input cstm-data-toggle-password="x">
 * <button cstm-data-toggle-password-btn="x">
 */
document.addEventListener("click", async (e) => {
  const btn = e.target.closest("[cstm-data-toggle-password-btn]");
  if (!btn) return;

  const key = btn.getAttribute("cstm-data-toggle-password-btn");
  const target = document.querySelector(`[cstm-data-toggle-password="${key}"]`);
  
  if (!target) return;

  // Validate Input Tag
  if (target.tagName !== "INPUT") return;

  // LOGIC: Toggle the Input Type
  if (target.type === "password") {
    target.type = "text";
  } else {
    target.type = "password";
  }

  // LOGIC: Update the UI (Reuse the helper function)
  syncIconState(btn);
});

/**
 * textarea autogrow height
 * looks for any textarea with attrbute cstm-autogrow-height="true" 
 * with option
 * cstm-autogrow-height-minpx
 * cstm-autogrow-height-maxpx
 */
document.addEventListener("DOMContentLoaded", async () => {
    // Select all textareas with the specific attribute
    const autoGrowTextareas = document.querySelectorAll('textarea[cstm-autogrow-height="true"]');

    autoGrowTextareas.forEach(el => {
        // 1. Get configuration from attributes (defaulting if not present)
        const minHeight = parseInt(el.getAttribute('cstm-autogrow-height-minpx')) || el.offsetHeight;
        const maxHeight = parseInt(el.getAttribute('cstm-autogrow-height-maxpx')) || Infinity;

        // 2. Apply base styles to ensure smooth behavior
        el.style.resize = 'none';           // Disable manual resize handle
        el.style.overflowY = 'hidden';      // Hide scrollbar initially
        el.style.boxSizing = 'border-box';  // Ensure padding/border calculations match Bootstrap
        el.style.minHeight = `${minHeight}px`;

        // 3. Define the resize function
        const autoResize = () => {
            // Reset height to 'auto' so the scrollHeight shrinks if text is deleted
            el.style.height = 'auto';

            // Calculate the new height based on content
            let newHeight = el.scrollHeight;

            // Handle Maximum Height & Scrollbars
            if (newHeight > maxHeight) {
                // If content exceeds max, cap the height and show scrollbar
                el.style.height = `${maxHeight}px`;
                el.style.overflowY = 'auto';
            } else {
                // Otherwise, grow normally and hide scrollbar
                // Use Math.max to ensure we never go below the minHeight
                el.style.height = `${Math.max(newHeight, minHeight)}px`;
                el.style.overflowY = 'hidden';
            }
        };

        // 4. Attach Event Listeners
        el.addEventListener('input', autoResize);

        // 5. Trigger once on load (to handle pre-filled content)
        autoResize();
    });
});

/**
 * bootstrap button loading style changer after click
 */
document.addEventListener("click", async (e) => {
  const btn = e.target.closest('[cstmtag-button-loading="true"]');
  if (!btn) return;

  const form = btn.closest("form");
  // If button is inside a form and form is invalid, do nothing
  if (form && !form.checkValidity()) {
    return;
  }

  const main = btn.querySelector(".cstmtag-icon-main");
  const loader = btn.querySelector(".cstmtag-loading-indicator");

  if (!main || !loader) return;

  // Hide main content
  main.classList.add("d-none");
  main.hidden = true;

  // Show loading indicator
  loader.classList.remove("d-none");
  loader.hidden = false;

  // workaround delay, if the button is disabled imeediately then the form wont submit
  setTimeout(() => {
    btn.disabled = true;
  }, 10);
});



console.log("loaded input_action.js")