<template>
  <section class="login">
    <div class="gradient"></div>
    <div class="header">
      <h2>Entrar</h2>
    </div>
    <div class="form-login">
      <form>
        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" placeholder="Digite seu email" v-model="email" required>
        </div>
        <div class="input-group">
          <label for="password">Senha</label>
          <input type="password" id="password" placeholder="Digite sua senha" v-model="password" required>
        </div>
        <div class="btn-flex">
          <button class="btn secondary back-btn" @click="$router.push('/')">Voltar</button>
          <button type="submit" class="btn primary" @click.prevent="login">Entrar</button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/UserStore';

const userStore = useUserStore();

const email = ref('');
const password = ref('');

const login = () => {
  if (email.value && password.value) {
    userStore.login(email.value, password.value);
  } else {
    alert('Por favor, preencha todos os campos.');
  }
}
</script>

<style lang="scss" scoped>
.login {
  .gradient {
    background: var(--primary-gradient-color);
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0%);
    width: 600px;
    height: 15vh;
    border-radius: 0% 0 140px 140px;
  }

  .header {
    padding: 50px var(--side);   
    padding-bottom: 0;  
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    height: 15vh;
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
      }
    }
  }
}
</style>