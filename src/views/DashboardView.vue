<template>
  <section class="dashboard">
    <div class="gradient"></div>
    <div class="header">
        <Menu/>
        <div class="info">
            <h2>Olá, {{ userFirstName }}!</h2>
            <p>O que você quer denunciar?</p>
            <div class="warning">
              <p class="warning-info">Em caso de emergência, aperte no botão vermelho.</p>
              <button class="warning-btn"></button>
            </div>
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
        <div class="info">
          <p>Escolhendo uma categoria sua denúncia poderá ser rapidamente identificada e encaminhada à autoritade responsável.</p>
        </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/UserStore';
import ReportTypeSearch from '@/components/ReportTypeSearch.vue';

import dangerIcon from '@/assets/images/icons/danger.png'
import femenineIcon from '@/assets/images/icons/femenine.png'
import robberIcon from '@/assets/images/icons/robber.png'
import accidentIcon from '@/assets/images/icons/accident.png'
import disasterIcon from '@/assets/images/icons/disaster.png'
import pawprintIcon from '@/assets/images/icons/pawprint.png'

const userStore = useUserStore();

const searchQuery = ref('')

const reportItems = [
  { icon: dangerIcon, label: 'Incêndio' },
  { icon: femenineIcon, label: 'Violência doméstica' },
  { icon: robberIcon, label: 'Assalto' },
  { icon: accidentIcon, label: 'Acidente de trânsito' },
  { icon: disasterIcon, label: 'Árvore caída' },
  { icon: pawprintIcon, label: 'Animal perdido' }
]

const userFirstName = computed(() => {
    return userStore.user.Name ? userStore.user.Name.split(' ')[0] : 'Usuário';
});

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
        box-shadow: 0px 0px 14px 7px var(--shadow-color);
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
        .warning {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: absolute;
          bottom: 40px;
          margin-right: 30px;

          .warning-info {
            font-size: var(--subtitle-small);
            display: block;
            margin-right: 10px;
            max-width: 80%;
          }

          button {
            background-image: url('@/assets/images/icons/warning.png');
            background-size: cover;
            background-position: center;
            width: 40px;
            height: 40px;
            display: block;
          }
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

        .info {
            margin-top: 30px;
            p {
                font-size: var(--text-big);
                color: var(--gray-color);
            }
        }
    }
}
</style>