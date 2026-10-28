<template>
  <transition name="alert-down" mode="out-in">
    <p v-if="alertMessage" class="field-alert">{{ alertMessage }}</p>
    <p v-else-if="alertMessageStore" class="field-alert">{{ alertMessageStore }}</p>
  </transition>
</template>

<script setup>
import { computed } from 'vue';
import { useFieldError } from 'vee-validate';
import { useAlertStore } from '@/stores/alertStore';

// The name of the vee-validate field (or alertStore.fieldErrors key) to show
const props = defineProps({
  field: { type: String, required: true },
});

const alertStore = useAlertStore();

// Only reads the field's error: useField here would register the field a second time
const alertMessage = useFieldError(props.field);
const alertMessageStore = computed(() => alertStore.fieldErrors[props.field]);
</script>

<style lang="scss" scoped>
.field-alert {
  color: var(--error-color);
  font-size: var(--text-small);
  margin-top: 5px;
}

.alert-down-enter-active,
.alert-down-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

.alert-down-enter-from,
.alert-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.alert-down-enter-to,
.alert-down-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
