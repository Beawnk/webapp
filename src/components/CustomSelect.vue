<template>
  <!-- The root is the focusable element, so a @blur passed by the parent
       (falls through as a native listener) fires when focus leaves the select -->
  <div
    ref="root"
    class="custom-select"
    tabindex="0"
    role="combobox"
    aria-haspopup="listbox"
    :aria-expanded="isOpen"
    :aria-activedescendant="isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined"
    @keydown="onKeydown"
  >
    <div class="select-wrapper" :class="{ open: isOpen }" @click="toggleOpen">
      <span class="selected">{{ selectedLabel }}</span>
      <ul v-if="isOpen" class="options" role="listbox">
        <li
          v-for="(option, index) in options"
          :id="optionId(index)"
          :key="option.value"
          role="option"
          :aria-selected="option.value === modelValue"
          :class="{ selected: option.value === modelValue, active: index === activeIndex }"
          @click.stop="select(option.value)"
        >
          {{ option.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, useId } from 'vue'
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
  modelValue: { type: [String, Number, Boolean], default: '' },
  options: { type: Array, required: true }, // [{ label, value }]
  label: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])

const root = ref(null)
const isOpen = ref(false)
// Option highlighted by the arrow keys
const activeIndex = ref(-1)
const uid = useId()
const optionId = (index) => `${uid}-option-${index}`

const selectedLabel = computed(() => {
  const found = props.options.find(opt => opt.value === props.modelValue)
  return found ? found.label : 'Selecione...'
})

function open() {
  isOpen.value = true
  const selectedIndex = props.options.findIndex(opt => opt.value === props.modelValue)
  activeIndex.value = Math.max(selectedIndex, 0)
}
function close() {
  isOpen.value = false
}
function toggleOpen() {
  isOpen.value ? close() : open()
}
function select(value) {
  emit('update:modelValue', value)
  close()
}

function onKeydown(e) {
  if (!isOpen.value) {
    if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
      e.preventDefault()
      open()
    }
    return
  }

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      activeIndex.value = Math.min(activeIndex.value + 1, props.options.length - 1)
      break
    case 'ArrowUp':
      e.preventDefault()
      activeIndex.value = Math.max(activeIndex.value - 1, 0)
      break
    case 'Enter':
    case ' ':
      e.preventDefault()
      select(props.options[activeIndex.value].value)
      break
    case 'Escape':
    case 'Tab':
      close()
      break
  }
}

onClickOutside(root, close)
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
.options li.active,
.options li:hover {
  background: var(--btn-report-color);
  color: var(--white-color);
}
</style>