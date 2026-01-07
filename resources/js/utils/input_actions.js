// Debounce function
// function debounce(func, wait) {
//   let timeout;
//   return () => {
//     clearTimeout(timeout);
//     timeout = setTimeout(func, wait);
//   };
// }

/**
 * Copy on click, looks for elements with attribute with same value
 * "cstm-data-copy" as target and "cstm-data-copy-btn" as the trigger button.
 * e.g.
 * <input cstm-data-copy="x">
 * <button cstm-data-copy-btn="x">
 */
// document.addEventListener("click", async (e) => {
//   const btn = e.target.closest("[cstm-data-copy-btn]");
//   if (!btn) return;

//   const key = btn.getAttribute("cstm-data-copy-btn");
//   if (!key) return;

//   // Select the *matching* target element
//   const target = document.querySelector(`[cstm-data-copy="${key}"]`);
//   if (!target) return;

//   const value = target.value ?? target.textContent ?? "";
//   const originalText = btn.textContent;

//   // Visual feedback
//   btn.textContent = "Copied";
//   setTimeout(() => {
//     btn.textContent = originalText;
//   }, 1500);

//   try {
//     if (!navigator.clipboard) {
//       throw new Error("Clipboard API not available.");
//     }

//     // Handle selecting text
//     if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
//       target.select();
//     } else if (target.isContentEditable) {
//       const range = document.createRange();
//       const selection = window.getSelection();
//       range.selectNodeContents(target);
//       selection.removeAllRanges();
//       selection.addRange(range);
//     }

//     await navigator.clipboard.writeText(value);
//   } catch (error) {
//     console.error("Error copying:", error.message);
//     btn.textContent = "Failed";
//     setTimeout(() => (btn.textContent = originalText), 1500);
//   }
// });

/**
 * Clear on click, looks for elements with attribute with same value
 * "cstm-data-clear" as target and "cstm-data-clear-btn" as the trigger button.
 * e.g. 
 * <input cstm-data-clear="x">
 * <button cstm-data-clear-btn="x">
 */
// document.addEventListener("click", async (e) => {
//   const btn = e.target.closest("[cstm-data-clear-btn]");
//   if (!btn) return;

//   const group = btn.getAttribute("cstm-data-clear-btn");
//   if (!group) return;

//   // Find ALL elements matching this group
//   const targets = document.querySelectorAll(`[cstm-data-clear="${group}"]`);
//   if (!targets.length) return;

//   targets.forEach(target => {
//     // Clear input-like elements
//     if ("value" in target) {
//       target.value = "";
//     }
//     // Clear contenteditable
//     else if (target.hasAttribute("contenteditable")) {
//       target.innerHTML = "";
//     }
//     // Otherwise clear text content
//     else {
//       target.textContent = "";
//     }

//     // Additional support: reset selects
//     if (target.tagName === "SELECT") {
//       target.selectedIndex = 0;
//     }
//   });
// });

/**
 * 1. Helper Function: Syncs the button icons based on the input's CURRENT state.
 * This does not toggle the input; it only updates the UI.
 */
// function syncIconState(btn) {
//   // Find the target input
//   const key = btn.getAttribute("cstm-data-toggle-password-btn");
//   const target = document.querySelector(`[cstm-data-toggle-password="${key}"]`);

//   if (!target) return;

//   // Determine visibility based on current type
//   // If type is "password", it is hidden. Anything else (text) is considered visible.
//   const isVisible = target.type !== "password";

//   // Find icons
//   const iconMain = btn.querySelector(".cstmtag-icon-main");
//   const iconAlt = btn.querySelector(".cstmtag-icon-alt");

//   if (iconMain && iconAlt) {
//     if (isVisible) {
//       // Input is Visible (Text): Hide 'Main', Show 'Alt'
//       iconMain.classList.add("d-none");
//       iconMain.hidden = true;

//       iconAlt.classList.remove("d-none");
//       iconAlt.hidden = false;
//     } else {
//       // Input is Hidden (Password): Show 'Main', Hide 'Alt'
//       iconMain.classList.remove("d-none");
//       iconMain.hidden = false;

//       iconAlt.classList.add("d-none");
//       iconAlt.hidden = true;
//     }
//   }
// }

/**
 * 2. On First Render: Loop through all buttons and sync them immediately.
 */
// document.addEventListener("DOMContentLoaded", async () => {
//   const allButtons = document.querySelectorAll("[cstm-data-toggle-password-btn]");
//   allButtons.forEach((btn) => {
//     syncIconState(btn);
//   });
// });

/**
 * 3. On Click: Toggle the type, then run the sync function.
 * Toggle password on click, looks for elements with attribute with same value
 * "cstm-data-toggle-password" as target and "cstm-data-toggle-password-btn" as the trigger button.
 * e.g. 
 * <input cstm-data-toggle-password="x">
 * <button cstm-data-toggle-password-btn="x">
 */
// document.addEventListener("click", async (e) => {
//   const btn = e.target.closest("[cstm-data-toggle-password-btn]");
//   if (!btn) return;

//   const key = btn.getAttribute("cstm-data-toggle-password-btn");
//   const target = document.querySelector(`[cstm-data-toggle-password="${key}"]`);
  
//   if (!target) return;

//   // Validate Input Tag
//   if (target.tagName !== "INPUT") return;

//   // LOGIC: Toggle the Input Type
//   if (target.type === "password") {
//     target.type = "text";
//   } else {
//     target.type = "password";
//   }

//   // LOGIC: Update the UI (Reuse the helper function)
//   syncIconState(btn);
// });

/**
 * bootstrap button loading style changer after click
 */
// document.addEventListener("click", async (e) => {
//   const btn = e.target.closest('[cstmtag-button-loading="true"]');
//   if (!btn) return;

//   const form = btn.closest("form");
//   // If button is inside a form and form is invalid, do nothing
//   if (form && !form.checkValidity()) {
//     return;
//   }

//   const main = btn.querySelector(".cstmtag-icon-main");
//   const loader = btn.querySelector(".cstmtag-loading-indicator");

//   if (!main || !loader) return;

//   // Hide main content
//   main.classList.add("d-none");
//   main.hidden = true;

//   // Show loading indicator
//   loader.classList.remove("d-none");
//   loader.hidden = false;

//   // workaround delay, if the button is disabled imeediately then the form wont submit
//   setTimeout(() => {
//     btn.disabled = true;
//   }, 10);
// });



console.log("loaded input_action.js (empty)")