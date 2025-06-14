<template>
    <section class="register">
        <div class="gradient"></div>
        <div class="header">
          <Menu v-if="userStore.logged === true" />
          <h2 v-if="userStore.page === 'register' || userStore.logged === false">Cadastro</h2>
          <h2 v-else>Seus dados</h2>
        </div>
        <div class="form-register">
          <form>
            <div class="input-group">
              <label for="name">Nome</label>
              <input type="text" id="name" placeholder="Digite seu nome" v-model="name" required>
            </div>
            <div class="input-group">
              <label for="email">Email</label>
              <input type="email" id="email" placeholder="Digite seu email" v-model="email" required>
            </div>
            <div class="input-group" v-if="userStore.page === 'register' || userStore.logged === false">
              <label for="password">Senha</label>
              <input type="password" id="password" placeholder="Digite sua senha" v-model="password"  required>
            </div>
            <div class="input-group">
              <label for="birthdate">Data de nascimento</label>
              <input type="date" id="birthdate" placeholder="Digite sua senha" v-model="birthdate" required :disabled="userStore.page !== 'register' && userStore.logged === true">
            </div>
            <div class="input-group">
              <label for="phone">Telefone</label>
              <input type="text" id="phone" placeholder="Digite seu telefone" v-model="phone">
            </div>
            <h3>Endereço</h3>
            <div class="input-group">
              <label for="zip">CEP</label>
              <input type="text" id="zip" placeholder="Digite seu CEP" v-model="zip_code" @keyup="fillCep" required>
            </div>
            <div class="input-flex">
              <div class="input-group street">
                <label for="street">Rua</label>
                <input type="text" id="street" placeholder="Digite sua rua" v-model="street" required>
              </div>
              <div class="input-group number">
                <label for="number">Número</label>
                <input type="text" id="number" placeholder="Número" v-model="number" required>
              </div>
            </div>
            <div class="input-group">
                <label for="district">Bairro</label>
                <input type="text" id="district" placeholder="Digite seu bairro" v-model="district" required>
            </div>
            <div class="input-group">
                <label for="city">Cidade</label>
                <input type="text" id="city" placeholder="Digite sua cidade" v-model="city" required>
            </div>
            <div class="input-group">
                <label for="state">Estado</label>
                <input type="text" id="state" placeholder="Digite seu estado" v-model="state" required>
            </div>
            <div class="btn-flex">
              <button type="submit" class="btn primary" @click.prevent="updateUserStore" @keyup.enter.prevent="updateUserStore" v-if="userStore.page === 'register' || userStore.logged === false">Cadastrar</button>
              <button type="submit" class="btn primary" @click.prevent="updateUserStore" @keyup.enter.prevent="updateUserStore" v-else>Atualizar</button>
              <button class="btn secondary back-btn" @click.prevent="$router.go(-1)">Voltar</button>
            </div>
          </form>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/UserStore';
import { useGetAddress } from '@/composables/getAddress';

const userStore = useUserStore();

const email = ref('');
const password = ref('');
const name = ref('');
const birthdate = ref('');
const phone = ref('');
const zip_code = ref('');
const street = ref('');
const number = ref('');
const district = ref('');
const city = ref('');
const state = ref('');

const fillCep = async () => {
  const cepValue = zip_code.value.replace(/\D/g, '');
  if (cepValue.length == 8) {
    const address = await useGetAddress(cepValue);
    street.value = address.logradouro;
    district.value = address.bairro;
    city.value = address.localidade;
    state.value = address.uf;
  }
};

const updateUserStore = async () => {
  try {
    userStore.user.Name = name.value;
    userStore.user.Email = email.value;
    userStore.user.Birthdate = birthdate.value;
    userStore.user.Phone = phone.value;
    userStore.user.Zip_code = zip_code.value;
    userStore.user.Street = street.value;
    userStore.user.Number = number.value;
    userStore.user.District = district.value;
    userStore.user.City = city.value;
    userStore.user.State = state.value;

    if (userStore.page === 'register' || userStore.logged === false) {
      await userStore.register(email.value, password.value);
    } else {
      await userStore.updateUser();
    }
    
  } catch (error) {
    console.error('Error updating user store:', error);
  }
}

onMounted(() => {
  if (userStore.page === 'register' || userStore.logged === false) {
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