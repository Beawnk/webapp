import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';

const ALERT_DURATION = 4000;

export const useAlertStore = defineStore('notification', () => {
  const globalErrors = ref([]); // Errors displayed at the top of the screen
  const globalSuccesses = ref([]); // Success messages displayed at the top of the screen
  const fieldErrors = reactive({}); // Field-specific errors

  let nextId = 0;

  // Each message has its own id, so its timer removes exactly that message
  // (removing "the oldest" would drop the wrong one after a clear)
  const addMessage = (list, text) => {
    const id = nextId++;
    list.value.push({ id, text });
    setTimeout(() => {
      list.value = list.value.filter((message) => message.id !== id);
    }, ALERT_DURATION);
  };

  // Add a global error
  const addGlobalError = (message) => addMessage(globalErrors, message);

  // Add a global success
  const addGlobalSuccess = (message) => addMessage(globalSuccesses, message);

  // Set a field-specific error
  const setFieldError = (field, message) => {
    fieldErrors[field] = message;
  };

  // Clear all notifications
  const clearNotifications = () => {
    globalErrors.value = [];
    globalSuccesses.value = [];
    Object.keys(fieldErrors).forEach((key) => {
      fieldErrors[key] = null;
    });
  };

  // Clear a specific field error
  const clearFieldError = (field) => {
    fieldErrors[field] = null;
  };

  return {
    globalErrors,
    globalSuccesses,
    fieldErrors,
    addGlobalError,
    addGlobalSuccess,
    clearNotifications,
    clearFieldError,
    setFieldError,
  };
});
