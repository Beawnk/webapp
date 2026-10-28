<template>
  <section class="register">
    <div class="gradient"></div>
    <div class="header">
      <AppMenu v-if="!isRegister" />
      <h2 v-if="isRegister">Cadastro</h2>
      <h2 v-else>Seus dados</h2>
    </div>
    <div class="form-register">
      <form @submit.prevent="updateUserStore">
        <div class="input-group">
          <label for="name">Nome</label>
          <input
            id="name"
            v-model="name"
            type="text"
            placeholder="Digite seu nome"
            @blur="validateField('name')"
          />
          <FieldNotifications field="name" />
        </div>
        <div class="input-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Digite seu email"
            @blur="validateField('email')"
          />
          <FieldNotifications field="email" />
        </div>
        <div v-if="isRegister" class="input-group">
          <label for="password">Senha</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Digite sua senha"
            @blur="validateField('password')"
          />
          <FieldNotifications field="password" />
        </div>
        <div class="input-group">
          <label for="birthdate">Data de nascimento</label>
          <input
            id="birthdate"
            v-model="birthdate"
            type="date"
            :disabled="!isRegister"
            @blur="validateField('birthdate')"
          />
          <FieldNotifications field="birthdate" />
        </div>
        <div class="input-group">
          <label for="phone">Telefone</label>
          <input
            id="phone"
            v-model="phone"
            type="text"
            placeholder="Digite seu telefone"
            @blur="validateField('phone')"
          />
          <FieldNotifications field="phone" />
        </div>
        <h3>Endereço</h3>
        <div class="input-group">
          <label for="zip">CEP</label>
          <input
            id="zip"
            v-model="zip_code"
            type="text"
            placeholder="Digite seu CEP"
            @input="fillCep"
            @blur="validateField('cep')"
          />
          <FieldNotifications field="cep" />
        </div>
        <div class="input-flex">
          <div class="input-group street">
            <label for="street">Rua</label>
            <input
              id="street"
              v-model="street"
              type="text"
              placeholder="Digite sua rua"
              @blur="validateField('street')"
            />
            <FieldNotifications field="street" />
          </div>
          <div class="input-group number">
            <label for="number">Número</label>
            <input
              id="number"
              v-model="number"
              type="text"
              placeholder="Número"
              @blur="validateField('number')"
            />
            <FieldNotifications field="number" />
          </div>
        </div>
        <div class="input-group">
          <label for="district">Bairro</label>
          <input
            id="district"
            v-model="district"
            type="text"
            placeholder="Digite seu bairro"
            @blur="validateField('district')"
          />
          <FieldNotifications field="district" />
        </div>
        <div class="input-group">
          <label for="city">Cidade</label>
          <input
            id="city"
            v-model="city"
            type="text"
            placeholder="Digite sua cidade"
            @blur="validateField('city')"
          />
          <FieldNotifications field="city" />
        </div>
        <div class="input-group">
          <label for="state">Estado</label>
          <input
            id="state"
            v-model="state"
            type="text"
            placeholder="Digite seu estado"
            @blur="validateField('state')"
          />
          <FieldNotifications field="state" />
        </div>
        <div class="btn-flex">
          <button v-if="isRegister" type="submit" class="btn primary">Cadastrar</button>
          <button v-else type="submit" class="btn primary">Atualizar</button>
          <button type="button" class="btn secondary back-btn" @click="goBack">Voltar</button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { useGoBack } from '@/composables/goBack';
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useForm, useField } from 'vee-validate';
import { getUserSchema } from '@/composables/userSchema';
import { useAlertStore } from '@/stores/alertStore';
import { useUserStore } from '@/stores/UserStore';
import { useCepAutofill } from '@/composables/cepAutofill';

// 'register' (/register, logged out) or 'profile' (/profile, logged in)
const props = defineProps({
  mode: { type: String, required: true },
});

const userStore = useUserStore();
const alertStore = useAlertStore();
const router = useRouter();

const isRegister = computed(() => props.mode === 'register');
const goBack = useGoBack(isRegister.value ? { name: 'welcome' } : { name: 'dashboard' });

// Initialize form with validation schema
const { handleSubmit } = useForm({
  validationSchema: computed(() => getUserSchema(!isRegister.value)),
  validateOnMount: false,
});

// Setup fields with validation
const { value: email, validate: validateEmail } = useField('email', undefined, {
  validateOnValueUpdate: false,
});

const { value: name, validate: validateName } = useField('name', undefined, {
  validateOnValueUpdate: false,
});

const { value: password, validate: validatePassword } = useField('password', undefined, {
  validateOnValueUpdate: false,
});

const { value: birthdate, validate: validateBirthdate } = useField('birthdate', undefined, {
  validateOnValueUpdate: false,
});

const { value: phone, validate: validatePhone } = useField('phone', undefined, {
  validateOnValueUpdate: false,
});

const { value: zip_code, validate: validateCep } = useField('cep', undefined, {
  validateOnValueUpdate: false,
});

const { value: street, validate: validateStreet } = useField('street', undefined, {
  validateOnValueUpdate: false,
});

const { value: number, validate: validateNumber } = useField('number', undefined, {
  validateOnValueUpdate: false,
});

const { value: district, validate: validateDistrict } = useField('district', undefined, {
  validateOnValueUpdate: false,
});

const { value: city, validate: validateCity } = useField('city', undefined, {
  validateOnValueUpdate: false,
});

const { value: state, validate: validateState } = useField('state', undefined, {
  validateOnValueUpdate: false,
});

// Validate single field
const validateField = (fieldName) => {
  const validateMap = {
    email: validateEmail,
    name: validateName,
    password: validatePassword,
    birthdate: validateBirthdate,
    phone: validatePhone,
    cep: validateCep,
    street: validateStreet,
    number: validateNumber,
    district: validateDistrict,
    city: validateCity,
    state: validateState,
  };

  if (validateMap[fieldName]) {
    validateMap[fieldName]();
  }
};

const { fillCep } = useCepAutofill(
  { zipCode: zip_code, street, district, city, state },
  validateField,
);

const updateUserStore = handleSubmit(async (values) => {
  alertStore.clearNotifications();

  try {
    userStore.user.Name = values.name;
    userStore.user.Email = values.email;
    // The raw input value ("YYYY-MM-DD"): values.birthdate is a Date cast by yup,
    // whose JSON form is a UTC timestamp that can land on the previous day
    userStore.user.Birthdate = birthdate.value;
    userStore.user.Phone = values.phone;
    userStore.user.Zip_code = values.cep;
    userStore.user.Street = values.street;
    userStore.user.Number = values.number;
    userStore.user.District = values.district;
    userStore.user.City = values.city;
    userStore.user.State = values.state;

    if (isRegister.value) {
      const loggedIn = await userStore.register(values.email, values.password);
      // With email confirmation on there is no session yet: the user logs in
      // after clicking the link in the email
      router.push({ name: loggedIn ? 'dashboard' : 'login' });
    } else {
      await userStore.updateUser();
    }
  } catch (error) {
    console.error('Error updating user store:', error);
  }
});

onMounted(() => {
  if (isRegister.value) {
    name.value = '';
    email.value = '';
    birthdate.value = '';
    phone.value = '';
    zip_code.value = '';
    street.value = '';
    number.value = '';
    district.value = '';
    city.value = '';
    state.value = '';
  } else {
    name.value = userStore.user.Name;
    email.value = userStore.user.Email;
    birthdate.value = userStore.user.Birthdate;
    phone.value = userStore.user.Phone;
    zip_code.value = userStore.user.Zip_code;
    street.value = userStore.user.Street;
    number.value = userStore.user.Number;
    district.value = userStore.user.District;
    city.value = userStore.user.City;
    state.value = userStore.user.State;
  }
});
</script>

<style lang="scss" scoped>
.register {
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

  .form-register {
    padding: var(--side);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    form {
      width: 100%;
      .btn-flex {
        display: flex;
        justify-content: center;
      }
      h3 {
        color: var(--text-secondary-color);
        font-size: var(--subtitle-medium);
        margin: 20px 0;
      }

      input:disabled {
        pointer-events: none;
        opacity: 0.5;
      }

      .street {
        width: 80%;
      }
      .number {
        width: 20%;
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
