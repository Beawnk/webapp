<template>
    <section class="register">
        <div class="gradient"></div>
        <div class="header">
          <h2>Cadastro</h2>
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
            <div class="input-group">
              <label for="password">Senha</label>
              <input type="password" id="password" placeholder="Digite sua senha" v-model="password"  required>
            </div>
            <div class="">
              <label for="birthdate">Data de nascimento</label>
              <input type="date" id="birthdate" placeholder="Digite sua senha" v-model="birthdate"  required>
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
              <button class="btn secondary back-btn" @click="$router.push('/')">Voltar</button>
              <button type="submit" class="btn primary" @click.prevent="updateUserStore">Cadastrar</button>
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
const zip_code = ref('');
const street = ref('');
const number = ref('');
const district = ref('');
const city = ref('');
const state = ref('');

// onMounted(() => {
//   email.value = userStore.user.email;
//   name.value = userStore.user.name;
//   profilePicUrl.value = userStore.user.avatar;
//   cep.value = userStore.user.address_cep;
//   street.value = userStore.user.address_street;
//   number.value = userStore.user.address_number;
//   district.value = userStore.user.address_district;
//   city.value = userStore.user.address_city;
//   state.value = userStore.user.address_state;
//   country.value = userStore.user.address_country;
// });

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

const updateUserStore = () => {
  try {
    userStore.user.Name = name.value;
    userStore.user.Email = email.value;
    userStore.user.Birthdate = birthdate.value;
    userStore.user.Zip_code = zip_code.value;
    userStore.user.Street = street.value;
    userStore.user.Number = number.value;
    userStore.user.District = district.value;
    userStore.user.City = city.value;
    userStore.user.State = state.value;

    userStore.register(email.value, password.value);
  } catch (error) {
    console.error('Error updating user store:', error);
  }
}
  

</script>

<style lang="scss" scoped>
.register {

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

  .form-register {
        padding: var(--side);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 1;
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
          .street {
            width: 80%;
          }
          .number {
            width: 20%;
          }

          .btn-flex {
            display: flex;
            justify-content: space-between;
          }
        }
    }
}

</style>