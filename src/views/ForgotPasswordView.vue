<template>
  <section class="forgot-password">
    <div class="gradient"></div>
    <div class="header">
      <h2>Recuperar senha</h2>
    </div>
    <div class="form-wrapper">
      <!-- Same message whether or not the email has an account: the page
           shouldn't reveal who is registered -->
      <div v-if="sent" class="sent" role="status">
        <p>
          Se <strong>{{ sentTo }}</strong> tiver uma conta, você vai receber um email com um link
          para criar uma nova senha.
        </p>
        <p>Não chegou? Confira o spam ou tente de novo em alguns minutos.</p>
        <div class="btn-flex">
          <router-link to="/login" class="btn primary">Voltar ao login</router-link>
        </div>
      </div>
      <form v-else @submit.prevent="sendLink">
        <p class="hint">
          Digite o email da sua conta e enviaremos um link para você criar uma nova senha.
        </p>
        <div class="input-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Digite seu email"
            @blur="validateEmail()"
          />
          <FieldNotifications field="email" />
        </div>
        <div class="btn-flex">
          <button type="submit" class="btn primary" :disabled="sending">
            {{ sending ? 'Enviando...' : 'Enviar link' }}
          </button>
          <button type="button" class="btn secondary back-btn" @click="goBack">Voltar</button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { useUserStore } from '@/stores/UserStore';
import { useGoBack } from '@/composables/goBack';

const userStore = useUserStore();
const goBack = useGoBack({ name: 'login' });

const sent = ref(false);
const sentTo = ref('');
const sending = ref(false);

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    email: yup.string().required('Digite seu email').email('Digite um email válido'),
  }),
  validateOnMount: false,
});

const { value: email, validate: validateEmail } = useField('email', undefined, {
  validateOnValueUpdate: false,
});

const sendLink = handleSubmit(async (values) => {
  sending.value = true;
  try {
    await userStore.requestPasswordReset(values.email);
    sentTo.value = values.email;
    sent.value = true;
  } catch (error) {
    console.error('Password reset request failed:', error);
  } finally {
    sending.value = false;
  }
});
</script>

<style lang="scss" scoped>
.forgot-password {
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

  .form-wrapper {
    padding: 0 var(--side);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh;

    form,
    .sent {
      width: 100%;
      max-width: 400px;
    }

    .hint,
    .sent p {
      color: var(--gray-color);
      margin-bottom: 20px;
    }

    .btn-flex {
      display: flex;
      justify-content: space-between;
      flex-direction: row-reverse;
    }

    .sent .btn {
      display: inline-block;
      text-align: center;
    }
  }
}
</style>
