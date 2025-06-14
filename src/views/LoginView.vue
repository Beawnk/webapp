<template>
  <section class="login">
    <div class="gradient"></div>
    <div class="header">
      <h2>Entrar</h2>
    </div>
    <div class="form-login">
      <form @submit.prevent="login">
        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" placeholder="Digite seu email" v-model="email" required>
        </div>
        <div class="input-group">
          <label for="password">Senha</label>
          <input type="password" id="password" placeholder="Digite sua senha" v-model="password" required>
        </div>
        <div class="btn-flex">
          <button type="submit" class="btn primary">Entrar</button>
          <button class="btn secondary back-btn" @click.prevent="$router.go(-1)">Voltar</button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/UserStore';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const email = ref('');
const password = ref('');

const login = () => {
  if (email.value && password.value) {
    userStore.login(email.value, password.value);
  } else {
    alert('Por favor, preencha todos os campos.');
  }
}

onMounted(() => {
  if (userStore.logged) {
    router.push('/dashboard')
  }
})
</script>

<style lang="scss" scoped>
.login {
  .gradient {
    background: var(--primary-gradient-color);
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0%);
    width: var(--gradient-border-width);
    height: 17vh;
    border-radius: var(--gradient-border-radius);
    box-shadow: 0px 0px 14px 7px var(--shadow-color);
  }

  .header {
    padding: 50px var(--side);   
    padding-bottom: 0;  
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    height: 17vh;
    z-index: 1;
    position: relative;
    justify-content: center;

    h2 {
      color: var(--text-color);
    }
  }

  .form-login {
    padding: 0 var(--side);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh;
    z-index: 1;

    form {
      width: 100%;
      max-width: 400px;

      .btn-flex {
        display: flex;
        justify-content: space-between;
        flex-direction: row-reverse;
      }
    }
  }
}
</style>