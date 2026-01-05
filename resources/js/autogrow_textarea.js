import htmx from 'htmx.org';

/**
 * Initialize Auto-Grow Logic
 * Accepts a 'content' argument which is the DOM element (or tree) 
 * currently being processed by HTMX.
 */
function initAutoGrow(content) {
    // 1. Define the selector
    const selector = 'textarea[cstm-autogrow-height="true"]';

    // 2. Find elements. We check:
    //    a) Children of the injected content
    //    b) The content element itself (in case of hx-swap="outerHTML" on the textarea)
    let targets = content.querySelectorAll(selector);
    
    // If the swapped content is itself the textarea, querySelectorAll won't find it
    if (content.matches && content.matches(selector)) {
        targets = [content]; 
    }

    targets.forEach(el => {
        // 3. SAFETY CHECK: Ignore if already initialized
        if (el.hasAttribute('data-autogrow-init')) return;

        // Mark as initialized immediately
        el.setAttribute('data-autogrow-init', 'true');

        // --- Your Original Logic Below ---

        // Get configuration
        const minHeight = parseInt(el.getAttribute('cstm-autogrow-height-minpx')) || el.offsetHeight;
        const maxHeight = parseInt(el.getAttribute('cstm-autogrow-height-maxpx')) || Infinity;

        // Apply base styles
        el.style.resize = 'none';
        el.style.overflowY = 'hidden';
        el.style.boxSizing = 'border-box';
        el.style.minHeight = `${minHeight}px`;

        // Resize function
        const autoResize = () => {
            el.style.height = 'auto'; // Reset to shrink if needed
            let newHeight = el.scrollHeight;

            if (newHeight > maxHeight) {
                el.style.height = `${maxHeight}px`;
                el.style.overflowY = 'auto';
            } else {
                el.style.height = `${Math.max(newHeight, minHeight)}px`;
                el.style.overflowY = 'hidden';
            }
        };

        // Attach Event Listeners
        el.addEventListener('input', autoResize);

        // Trigger once immediately
        autoResize();
    });
}

// 4. Hook into HTMX
// This runs on page load (document.body) AND after every AJAX swap
htmx.onLoad((content) => {
    initAutoGrow(content);
});