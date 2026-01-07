// Debounce function
export function debounce(func, wait) {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  };
}