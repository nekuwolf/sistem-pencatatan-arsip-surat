/**
 * Initialize sidebar toggle behavior (desktop + mobile)
 */
export function initSidebar(root = document) {
  // Prevent double-binding (document-level)
  if (root === document && document.body.dataset.sidebarInit) return;
  if (root === document) {
    document.body.dataset.sidebarInit = 'true';
  }

  const desktopToggle = root.getElementById('desktop-sidebar-toggle');
  const mobileToggle = root.getElementById('mobile-sidebar-toggle');
  const backdrop = root.querySelector('.sidebar-backdrop');

  const SIDEBAR_KEY = 'sidebarCollapsed';

  // --- Cookie Helpers ---
  const setCookie = (name, value, days = 365) => {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = 'expires=' + d.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
  };

  const getCookie = (name) => {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1);
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length);
      }
    }
    return null;
  };

  // --- Helpers ---
  const isMobile = () =>
    window.matchMedia('(max-width: 992px)').matches;

  const applySavedState = () => {
    const saved = getCookie(SIDEBAR_KEY);

    // Cookies store strings
    if (!isMobile() && saved === 'true') {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  };

  // Initial state
  applySavedState();

  // Re-check when resizing (desktop ↔ mobile)
  window.addEventListener('resize', applySavedState);

  // --- Desktop Toggle ---
  desktopToggle?.addEventListener('click', () => {
    if (isMobile()) return;

    document.body.classList.toggle('sidebar-collapsed');

    const isCollapsed =
      document.body.classList.contains('sidebar-collapsed');

    setCookie(SIDEBAR_KEY, isCollapsed);
  });

  // --- Mobile Toggle ---
  mobileToggle?.addEventListener('click', () => {
    document.body.classList.toggle('sidebar-open');
  });

  // --- Backdrop closes mobile ---
  backdrop?.addEventListener('click', () => {
    document.body.classList.remove('sidebar-open');
  });
}

/**
 * DOM ready (Vite + AdonisJS)
 */
document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  console.log('loaded sidebar.js');
});

/**
 * Optional manual re-init
 */
window.initSidebar = initSidebar;
