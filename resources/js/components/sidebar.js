document.addEventListener("DOMContentLoaded", () => {
    const desktopToggle = document.getElementById("desktop-sidebar-toggle");
    const mobileToggle = document.getElementById("mobile-sidebar-toggle");
    const backdrop = document.querySelector(".sidebar-backdrop");

    const SIDEBAR_KEY = "sidebarCollapsed";

    // --- Helpers ---
    const isMobile = () => window.matchMedia("(max-width: 992px)").matches;

    const applySavedState = () => {
        const saved = localStorage.getItem(SIDEBAR_KEY);

        if (!isMobile() && saved === "true") {
            document.body.classList.add("sidebar-collapsed");
        } else {
            document.body.classList.remove("sidebar-collapsed");
        }
    };

    // Apply initial state
    applySavedState();

    // Re-check when resizing (desktop → mobile → desktop)
    window.addEventListener("resize", applySavedState);

    // --- Desktop Toggle ---
    desktopToggle?.addEventListener("click", () => {
        if (isMobile()) return; // Disable collapse on mobile

        document.body.classList.toggle("sidebar-collapsed");

        const isCollapsed = document.body.classList.contains("sidebar-collapsed");
        localStorage.setItem(SIDEBAR_KEY, isCollapsed);
    });

    // --- Mobile Toggle ---
    mobileToggle?.addEventListener("click", () => {
        document.body.classList.toggle("sidebar-open");
    });

    // --- Backdrop closes mobile ---
    backdrop?.addEventListener("click", () => {
        document.body.classList.remove("sidebar-open");
    });
});

console.log('loaded sidebar.js');
