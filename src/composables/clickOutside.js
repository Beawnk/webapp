export function useClickOutside(element, btn, callback) {
  function handleClickOutside(event) {
    if (element.value && !element.value.contains(event.target) && !btn.value.contains(event.target)) {
      callback();
    }
  }

  document.addEventListener('mousedown', handleClickOutside);

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}