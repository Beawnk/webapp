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
          <input type="email" id="email" placeholder="Digite seu email" v-model="email" @blur="validateField('email')">
          <FieldNotifications field="email"/>
        </div>
        <div class="input-group">
          <label for="password">Senha</label>
          <input type="password" id="password" placeholder="Digite sua senha" v-model="password" @blur="validateField('password')">
          <FieldNotifications field="password"/>
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
import { useForm, useField } from 'vee-validate';
import { useUserStore } from '@/stores/UserStore';
import { useRouter } from 'vue-router';
import * as yup from 'yup';

const userStore = useUserStore();
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
  }
});

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