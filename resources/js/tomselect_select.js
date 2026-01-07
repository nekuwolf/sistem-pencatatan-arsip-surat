import TomSelect from "tom-select/dist/js/tom-select.popular.js";

/**
 * TomSelect safe initializer (no HTMX)
 * Looks for:
 *   <select data-tom-select="true">
 */
function initTomSelect(root = document) {
  root
    .querySelectorAll(
      'select[data-tom-select="true"]:not([data-ts-initialized])'
    )
    .forEach((select) => {
      if (select.tomselect) return;

      const endpoint = select.getAttribute('cstm-data-query-endpoint');
      const method = (
        select.getAttribute('cstm-data-query-endpoint-method') || 'GET'
      ).toUpperCase();
      const onlyLocal =
        select.dataset.tomSelectOnlySearchLocally === 'true';

      const ALLOWED_TS_PLUGINS = new Set([
        'dropdown_input',
        'remove_button',
        'no_backspace_delete',
        'restore_on_backspace',
      ]);

      function getValidatedTomSelectPlugins(plugins, defaults = []) {
        if (!plugins) return defaults;

        const validated = plugins
          .split(';')
          .map((p) => p.trim())
          .filter(Boolean)
          .filter((p) => {
            if (!ALLOWED_TS_PLUGINS.has(p)) {
              console.warn(
                `[cstm] TomSelect: Invalid plugin "${p}" ignored`,
                select
              );
              return false;
            }
            return true;
          });

        return validated.length ? validated : defaults;
      }

      const config = {
        plugins: getValidatedTomSelectPlugins(select.dataset.tsPlugins || ''),
        valueField: select.dataset.tsoValueField || 'value',
        labelField: select.dataset.tsoLabelField || 'label',
        searchField: select.dataset.tsoSearchField || 'label',
        placeholder: select.dataset.tsoPlaceholder || 'Search and select',
        maxItems: Number(select.dataset.tsoMaxItems) || 1,
        hideSelected: select.dataset.tsoHideSelected !== 'false',
        closeAfterSelect: select.dataset.tsoCloseAfterSelect === 'true',
        copyClassesToDropdown: select.dataset.tsoCopyClasessToDropdown !== 'false',
        allowEmptyOption: select.dataset.tsoAllowEmptyOption !== 'false',
        delimiter: select.dataset.tsoDelimiter || '|',
        loadThrottle: Number(select.dataset.tsoLoadThrottle) || 100,
        preload:
          select.dataset.tsoPreload === 'true'
            ? true
            : select.dataset.tsoPreload === 'false'
            ? false
            : select.dataset.tsoPreload,
      };

      console.log(config)

      let pendingSelectedValues = [];
      let controller = null;

      // Remote loading
      if (endpoint && !onlyLocal) {
        config.load = (query, callback) => {
          if (controller) controller.abort();
          controller = new AbortController();

          const url = new URL(endpoint, window.location.origin);
          const fetchOptions = {
            method,
            signal: controller.signal,
            credentials: 'same-origin',
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
            },
          };

          if (method === 'GET') {
            url.searchParams.set('q', query);
            // url.searchParams.set('resAsJson', 'true');
          } else {
            fetchOptions.headers['Content-Type'] = 'application/json';
            fetchOptions.body = JSON.stringify({
              q: query,
              resAsJson: true,
            });
          }

          fetch(url, fetchOptions)
            .then((res) => res.json())
            .then((data) => {
              callback(data);

              pendingSelectedValues = Array.isArray(data)
                ? data
                    .filter((item) => item.isSelected)
                    .map((item) => item[config.valueField])
                : [];
            })
            .catch((err) => {
              if (err.name !== 'AbortError') callback();
            });
        };
      }

      const ts = new TomSelect(select, config);

      // Apply selected values after init
      if (pendingSelectedValues.length) {
        ts.setValue(pendingSelectedValues, true);
      }

      // Bootstrap invalid sync
      if (select.classList.contains('is-invalid')) {
        ts.control.classList.add('is-invalid');
      }

      select.dataset.tsInitialized = 'true';
    });
}

/**
 * DOM ready (Vite-safe)
 */
document.addEventListener('DOMContentLoaded', () => {
  initTomSelect();
  console.log('TomSelect initialized');
});

/**
 * Optional: expose for manual re-init after AJAX / fetch / Alpine / etc.
 */
window.initTomSelect = initTomSelect;
