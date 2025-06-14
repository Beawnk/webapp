<template>
  <div class="custom-select">
    <div class="select-wrapper" :class="{ open: isOpen }" @click="toggleOpen">
      <span class="selected">{{ selectedLabel }}</span>
      <ul v-if="isOpen" class="options">
        <li
          v-for="option in options"
          :key="option.value"
          :class="{ selected: option.value === modelValue }"
          @click.stop="select(option.value)"
        >
          {{ option.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: [String, Number, Boolean],
  options: { type: Array, required: true }, // [{ label, value }]
  label: String
})
const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const selectedLabel = computed(() => {
  const found = props.options.find(opt => opt.value === props.modelValue)
  return found ? found.label : 'Selecione...'
})

function toggleOpen() {
  isOpen.value = !isOpen.value
}
function select(value) {
  emit('update:modelValue', value)
  isOpen.value = false
}

// Optional: close on outside click
function onClickOutside(e) {
  if (!e.target.closest('.custom-select')) isOpen.value = false
}
watch(isOpen, open => {
  if (open) window.addEventListener('click', onClickOutside)
  else window.removeEventListener('click', onClickOutside)
})
</script>

<style lang="scss" scoped>
.custom-select {
  position: relative;
  width: 100%;
  max-width: 100%;
}
.select-wrapper {
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 12px;
    background: var(--input-color);
    cursor: pointer;
    user-select: none;

    &::after {
        content: '';
        position: absolute;
        top: 50%;
        right: 12px;
        transform: translateY(-50%);
        width: 10px;
        height: 10px;
        background-image: url('@/assets/images/icons/down-icon-blue.png');
        background-size: 10px;
        background-repeat: no-repeat;
        transition: var(--transition);
    }

    &.open {
       
        &::after {
            transform: translateY(-50%) rotate(180deg);
        }
    }
}
.selected {
  color: var(--gray-color);
  font-size: var(--text-big);
}
.options {
  position: absolute;
  left: 0; right: 0;
  top: 100%;
  background: var(--input-color);
  border: 1px solid var(--border-color);
  border-radius: 0 0 8px 8px;
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
  color: var(--gray-color);
}
.options li {
    font-size: var(--text-big);
    padding: 12px;
    cursor: pointer;
}
.options li.selected,
.options li:hover {
  background: var(--btn-report-color);
  color: var(--white-color);
}
</style>