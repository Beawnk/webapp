<template>
  <section class="reset-password">
    <div class="gradient"></div>
    <div class="header">
      <h2>Nova senha</h2>
    </div>
    <div class="form-wrapper">
      <!-- The email link signs the user in. Without a session the link was
           invalid, already used or expired -->
      <div v-if="!userStore.logged" class="invalid" role="status">
        <p>Este link é inválido ou expirou. Peça um novo para redefinir sua senha.</p>
        <div class="btn-flex">
          <router-link to="/forgot-password" class="btn primary">Pedir novo link</router-link>
        </div>
      </div>
      <form v-else @submit.prevent="savePassword">
        <div class="input-group">
          <label for="password">Nova senha</label>
          <input id="password" v-model="password" type="password" placeholder="Digite a nova senha" autocomplete="new-password" @blur="validatePassword()">
          <FieldNotifications field="password"/>
        </div>
        <div class="input-group">
          <label for="password-confirm">Confirme a nova senha</label>
          <input id="password-confirm" v-model="passwordConfirm" type="password" placeholder="Digite a nova senha de novo" autocomplete="new-password" @blur="validatePasswordConfirm()">
          <FieldNotifications field="passwordConfirm"/>
        </div>
        <div class="btn-flex">
          <button type="submit" class="btn primary" :disabled="saving">{{ saving ? 'Salvando...' : 'Salvar senha' }}</button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { useUserStore } from '@/stores/UserStore';

const userStore = useUserStore();
const router = useRouter();
const saving = ref(false);

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    // Same rule as the sign-up form (userSchema.js)
    password: yup.string()
      .required('Digite a nova senha')
      .min(6, 'Senha deve ter pelo menos 6 caracteres'),
    passwordConfirm: yup.string()
      .required('Confirme a nova senha')
      .oneOf([yup.ref('password')], 'As senhas não são iguais')
  }),
  validateOnMount: false
});

const { value: password, validate: validatePassword } = useField('password', undefined, {
  validateOnValueUpdate: false
});
const { value: passwordConfirm, validate: validatePasswordConfirm } = useField('passwordConfirm', undefined, {
  validateOnValueUpdate: false
});

const savePassword = handleSubmit(async (values) => {
  saving.value = true;
  try {
    await userStore.updatePassword(values.password);
    router.push({ name: 'dashboard' });
  } catch (error) {
    console.error('Password update failed:', error);
  } finally {
    saving.value = false;
  }
});
</script>

<style lang="scss" scoped>
.reset-password {
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
    .invalid {
      width: 100%;
      max-width: 400px;
    }

    .invalid p {
      color: var(--gray-color);
      margin-bottom: 20px;
    }

    .btn-flex {
      display: flex;
      justify-content: flex-end;
    }

    .invalid .btn {
      display: inline-block;
      text-align: center;
    }
  }
}
</style>
