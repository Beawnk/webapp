<template>
  <section class="dashboard">
    <div class="gradient"></div>
    <div class="header">
        <div class="menu-btn">
            
        </div>
        <div class="info">
            <h2>Olá, ####!</h2>
            <p>O que você quer denunciar?</p>
            <p class="warning-info">Em caso de emergência, clique no botão vermelho acima.</p>
        </div>
    </div>
    <div class="content">
        <ReportTypeSearch @emit-search="val => searchQuery = val" />
        <div class="cards">
            <div class="card" v-for="(item, idx) in filteredItems" :key="idx">
              <div class="icon">
                <img :src="item.icon" alt="">
              </div>
              <p>{{ item.label }}</p>
            </div>
        </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import ReportTypeSearch from '@/components/ReportTypeSearch.vue';

import dangerIcon from '@/assets/images/icons/danger.png'
import femenineIcon from '@/assets/images/icons/femenine.png'
import robberIcon from '@/assets/images/icons/robber.png'
import accidentIcon from '@/assets/images/icons/accident.png'
import disasterIcon from '@/assets/images/icons/disaster.png'
import pawprintIcon from '@/assets/images/icons/pawprint.png'

const searchQuery = ref('')

const reportItems = [
  { icon: dangerIcon, label: 'Incêndio' },
  { icon: femenineIcon, label: 'Violência doméstica' },
  { icon: robberIcon, label: 'Assalto' },
  { icon: accidentIcon, label: 'Acidente de trânsito' },
  { icon: disasterIcon, label: 'Árvore caída' },
  { icon: pawprintIcon, label: 'Animal perdido' }
]

const cleanSearch = (str) =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()


const filteredItems = computed(() => {
  if (!searchQuery.value) return reportItems
  const cleanedQuery = cleanSearch(searchQuery.value)
  console.log('Search query:', cleanedQuery)
    console.log('Report items:', reportItems)
  return reportItems.filter(item =>
    cleanSearch(item.label).includes(cleanedQuery)
  )
})
</script>

<style lang="scss" scoped>
.dashboard {

    .gradient {
        background: var(--primary-gradient-color);
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, 0%);
        width: 700px;
        height: 40vh;
        border-radius: 0% 0 25% 25%;
    }

    .header {
        padding: 70px var(--side);
        padding-bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        height: 40vh;
        z-index: 1;
        position: relative;
    
        h2 {
            font-size: var(--title-big);
            color: var(--text-color);
            margin-bottom: 20px;
            margin-top: 40px;
        }
        
        p {
            color: var(--text-color);
            font-size: var(--subtitle-big);
        }

        .warning-info {
            font-size: var(--subtitle-small);
            position: absolute;
            bottom: 40px;
        }
    }
    .content {
        padding: var(--side);

        .cards {
            display: grid;
            grid-template-columns: repeat(2, minmax(150px, 200px));
            gap: 30px;

            .card {
                background-color: var(--white-color);
                border-radius: 20px;
                padding: 15px;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                box-shadow: var(--shadow);

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
    }
}
</style>