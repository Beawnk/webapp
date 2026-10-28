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
          <input id="email" v-model="email" type="email" placeholder="Digite seu email" @blur="validateField('email')">
          <FieldNotifications field="email"/>
        </div>
        <div class="input-group">
          <label for="password">Senha</label>
          <input id="password" v-model="password" type="password" placeholder="Digite sua senha" @blur="validateField('password')">
          <FieldNotifications field="password"/>
        </div>
        <router-link to="/forgot-password" class="link forgot">Esqueceu a senha?</router-link>
        <div class="btn-flex">
          <button type="submit" class="btn primary">Entrar</button>
          <button type="button" class="btn secondary back-btn" @click="goBack">Voltar</button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { useGoBack } from '@/composables/goBack';
import { useForm, useField } from 'vee-validate';
import { useUserStore } from '@/stores/UserStore';
import { useRoute, useRouter } from 'vue-router';
import * as yup from 'yup';

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

const loginSchema = yup.object({
  email: yup.string()
    .required('Digite seu email')
    .email('Digite um email válido'),
  password: yup.string()
    .required('Digite sua senha')
});

const { handleSubmit } = useForm({
  validationSchema: loginSchema,
  validateOnMount: false
});

const { value: email, validate: validateEmail } = useField('email', undefined, {
  validateOnValueUpdate: false
});
const { value: password, validate: validatePassword } = useField('password', undefined, {
  validateOnValueUpdate: false
});

const validateField = (fieldName) => {
  if (fieldName === 'email') {
    validateEmail();
  } else if (fieldName === 'password') {
    validatePassword();
  }
};

const login = handleSubmit(async (values) => {
  try {
    await userStore.login(values.email, values.password);
  } catch (error) {
    console.error('Login failed:', error);
    return;
  }

  // Back to the private page that sent the user here. Only same-app paths:
  // "//host" would be read as another site
  const redirect = route.query.redirect;
  const isAppPath = typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//');
  router.push(isAppPath ? redirect : { name: 'dashboard' });
});

const goBack = useGoBack({ name: 'welcome' });
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

      .forgot {
        display: block;
        text-align: right;
        margin: -10px 0 20px;
      }

      .btn-flex {
        display: flex;
        justify-content: space-between;
        flex-direction: row-reverse;
      }
    }
  }
}
</style>