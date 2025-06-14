<template>
  <div class="cards">
        <div class="card" v-for="(item, idx) in filteredItems" :key="idx" @click="$emit('reportSelected', item.label)">
          <div class="icon">
            <img :src="item.icon" alt="">
          </div>
          <p>{{ item.label }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import dangerIcon from '@/assets/images/icons/danger.png'
import femenineIcon from '@/assets/images/icons/femenine.png'
import robberIcon from '@/assets/images/icons/robber.png'
import accidentIcon from '@/assets/images/icons/accident.png'
import disasterIcon from '@/assets/images/icons/disaster.png'
import pawprintIcon from '@/assets/images/icons/pawprint.png'

const props = defineProps(['searchQuery'])
const emit = defineEmits(['reportSelected'])

const reportItems = [
  { icon: dangerIcon, label: 'Incêndio' },
  { icon: femenineIcon, label: 'Violência doméstica' },
  { icon: robberIcon, label: 'Assalto' },
  { icon: accidentIcon, label: 'Acidente de trânsito' },
  { icon: disasterIcon, label: 'Árvore caída' },
  { icon: pawprintIcon, label: 'Animal perdido' }
]

const filteredItems = ref([])

const cleanSearch = (str) =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

const filterItems = () => {
  if (!props.searchQuery) {
    filteredItems.value = reportItems
    return
  }
  const cleanedQuery = cleanSearch(props.searchQuery)
  filteredItems.value = reportItems.filter(item =>
    cleanSearch(item.label).includes(cleanedQuery)
  )
}

watch(() => props.searchQuery, (newVal) => {
  filterItems()
}, { immediate: true })
</script>

<style lang="scss" scoped>
.cards {
    display: grid;
    grid-template-columns: repeat(2, minmax(150px, 200px));
    gap: 30px;

    .card {
        background-color: var(--white-color);
        cursor: pointer;
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
            color: var(--grey-color);
            opacity: 0.5;
        }
    }
}
</style>