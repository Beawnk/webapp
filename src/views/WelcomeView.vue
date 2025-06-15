<template>
  <section class="welcome">
    <div class="gradient"></div>
    <div class="wrapper">
      <div class="logo-img">
          <img :src="logo" alt="Logo">
          <h1 class="title">IEmergency</h1>
      </div>
      <div class="welcome-text">
          <h2>Bem-vindo</h2>
      </div>
    </div>
    <div class="buttons">
        <button class="btn secondary" @click="$router.push('/login')">Entrar</button>
        <button class="btn primary" @click="openRegister">Cadastre-se</button>
        <a href="" class="link">Esqueceu a senha?</a>
    </div>
  </section>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { useUserStore } from '@/stores/UserStore'
import { useRouter } from 'vue-router';
import logo from '@/assets/images/logo2.png'

const userStore = useUserStore()
const router = useRouter()

const openRegister = () => {
  router.push('/user-data')
  userStore.page = 'register'
}

onBeforeMount(() => {
  if (userStore.logged) {
    router.push('/dashboard')
  }
})
</script>

<style lang="scss" scoped>
.welcome {
  
  .gradient {
    background: var(--primary-gradient-color);
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0%);
    width: var(--gradient-border-width);
    height: 60vh;
    border-radius: var(--gradient-border-radius);
    box-shadow: 0px 0px 14px 7px var(--shadow-color);
  }

  .wrapper {
    position: relative;
    z-index: 1;
    padding: 50px 70px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    height: 60vh;
    
    .logo-img {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      img {
        width: 150px;
        height: 150px;
        box-shadow: var(--shadow);
      }
      .title {
        color: var(--text-secondary-color);
        font-size: var(--title-super);
        text-align: center;
        margin-top: 10px;
        text-shadow:  2px 5px 6px rgba(0,0,0,0.3);
      }
    }

    .welcome-text {
      h2 {
        color: var(--text-color);
        font-family: var(--font-family-light);
        font-size: var(--title-big);
        text-align: center;
      }
    }
  }

  .buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 70px 50px;

    .btn {
      width: 100%;
      max-width: 300px;
      padding: 15px 50px;
      font-size: var(--title-small);

      &:first-child {
        margin-bottom: 25px;
      }
    }
    .link {
      margin-top: 20px;
    }
  }
}
</style>