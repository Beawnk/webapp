<template>
  <div class="cards">
        <button type="button" class="card" v-for="item in filteredItems" :key="item.label" @click="$emit('reportSelected', item.label)">
          <div class="icon">
            <img :src="item.icon" alt="">
          </div>
          <p>{{ item.label }}</p>
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { reportTypes } from '@/constants/reportTypes'

const props = defineProps(['searchQuery'])
const emit = defineEmits(['reportSelected'])

const cleanSearch = (str) =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

const filteredItems = computed(() => {
  if (!props.searchQuery) return reportTypes

  const cleanedQuery = cleanSearch(props.searchQuery)
  return reportTypes.filter(item =>
    cleanSearch(item.label).includes(cleanedQuery)
  )
})
</script>

<style lang="scss" scoped>
.cards {
    display: grid;
    grid-template-columns: repeat(2, minmax(150px, 200px));
    gap: 30px;

    .card {
        background-color: var(--white-color);
        cursor: pointer;
        width: 100%;
        text-align: left;
        border-radius: 20px;
        padding: 15px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        box-shadow: var(--shadow);
        transition: var(--transition);

        &:hover {
          transform: scale(1.05);
        }

        .icon {
            width: 50px;
            height: 50px;
            margin-bottom: 10px;
            opacity: 0.5;

            img {
                width: 100%;
                height: 100%;
            }
        }

        p {
            font-size: var(--text-big);
            color: var(--gray-color);
            opacity: 0.5;
        }
    }
}
</style>