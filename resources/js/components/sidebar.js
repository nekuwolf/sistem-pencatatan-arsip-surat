// document.addEventListener("DOMContentLoaded", () => {
//     const desktopToggle = document.getElementById("desktop-sidebar-toggle");
//     const mobileToggle = document.getElementById("mobile-sidebar-toggle");
//     const backdrop = document.querySelector(".sidebar-backdrop");

//     const SIDEBAR_KEY = "sidebarCollapsed";

//     // --- Cookie Helpers ---
//     const setCookie = (name, value, days = 365) => {
//         const d = new Date();
//         d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
//         let expires = "expires=" + d.toUTCString();
//         // path=/ ensures cookie is sent for all pages
//         // SameSite=Lax is generally good for UI state
//         document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
//     };

//     const getCookie = (name) => {
//         const nameEQ = name + "=";
//         const ca = document.cookie.split(';');
//         for (let i = 0; i < ca.length; i++) {
//             let c = ca[i];
//             while (c.charAt(0) === ' ') c = c.substring(1, c.length);
//             if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
//         }
//         return null;
//     };

//     // --- Helpers ---
//     const isMobile = () => window.matchMedia("(max-width: 992px)").matches;

//     const applySavedState = () => {
//         const saved = getCookie(SIDEBAR_KEY);

//         // Note: Cookies store values as strings
//         if (!isMobile() && saved === "true") {
//             document.body.classList.add("sidebar-collapsed");
//         } else {
//             document.body.classList.remove("sidebar-collapsed");
//         }
//     };

//     // Apply initial state
//     applySavedState();

//     // Re-check when resizing (desktop → mobile → desktop)
//     window.addEventListener("resize", applySavedState);

//     // --- Desktop Toggle ---
//     desktopToggle?.addEventListener("click", () => {
//         if (isMobile()) return; 

//         // Toggle class
//         document.body.classList.toggle("sidebar-collapsed");

//         // Check new state
//         const isCollapsed = document.body.classList.contains("sidebar-collapsed");
        
//         // Save to cookie (stores "true" or "false")
//         setCookie(SIDEBAR_KEY, isCollapsed);
//     });

//     // --- Mobile Toggle ---
//     mobileToggle?.addEventListener("click", () => {
//         document.body.classList.toggle("sidebar-open");
//     });

//     // --- Backdrop closes mobile ---
//     backdrop?.addEventListener("click", () => {
//         document.body.classList.remove("sidebar-open");
//     });
// });

console.log('loaded sidebar.js (empty)');