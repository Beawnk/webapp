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
              <button class="warning-btn" @click.prevent="$router.push('/emergency')"></button>
            </div>
        </div>
    </div>
    <div class="content">
        <ReportTypeSearch @emit-search="val => searchQuery = val" />
        <ReportCards :search-query="searchQuery" @report-selected="newReport" />
        <div class="info">
          <p>Escolhendo uma categoria sua denúncia poderá ser rapidamente identificada e encaminhada à autoridade responsável.</p>
        </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue'
import { useUserStore } from '@/stores/UserStore';
import { useRouter } from 'vue-router';
import ReportTypeSearch from '@/components/ReportTypeSearch.vue';
import ReportCards from '@/components/ReportCards.vue';

const userStore = useUserStore();
const router = useRouter();

const searchQuery = ref('')

const userFirstName = computed(() => {
    return userStore.user.Name ? userStore.user.Name.split(' ')[0] : 'Usuário';
});

const newReport = (reportType) => {
  router.push({
    name: 'new-report',
    params: { type: reportType }
  });
};

onBeforeMount(() => {
  if (!userStore.logged) {
    router.push({ name: 'login' });
  }
});
</script>

<style lang="scss" scoped>
.dashboard {

    .gradient {
        background: var(--primary-gradient-color);
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, 0%);
        width: var(--gradient-border-width);
        height: 40vh;
        border-radius: var(--gradient-border-radius);
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
          right: 30px;
          left: 30px;

          .warning-info {
            font-size: var(--subtitle-small);
            display: block;
            margin-right: 10px;
            max-width: 85%;
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