<template>
    <section class="register">
        <div class="gradient"></div>
        <div class="header">
          <div class="back-btn">
            <button class="" @click="$router.push('/')">Voltar</button>
          </div>
          <h2>Cadastro</h2>
        </div>
        <div class="form-register">
          <form>
            <div class="input-group">
              <label for="name">Nome</label>
              <input type="text" id="name" placeholder="Digite seu nome" required>
            </div>
            <div class="input-group">
              <label for="email">Email</label>
              <input type="email" id="email" placeholder="Digite seu email" required>
            </div>
            <div class="input-group">
              <label for="password">Senha</label>
              <input type="password" id="password" placeholder="Digite sua senha" required>
            </div>
            <h3>Endereço</h3>
            <div class="input-flex">
              <div class="input-group">
                <label for="street">Rua</label>
                <input type="text" id="street" placeholder="Digite sua rua" required>
              </div>
              <div class="input-group">
                <label for="number">Número</label>
                <input type="text" id="number" placeholder="Número da casa" required>
              </div>
            </div>
            <div class="input-group">
                <label for="city">Cidade</label>
                <input type="text" id="city" placeholder="Digite sua cidade" required>
            </div>
            <div class="input-group">
                <label for="state">Estado</label>
                <input type="text" id="state" placeholder="Digite seu estado" required>
            </div>
            <div class="input-group">
                <label for="zip">CEP</label>
                <input type="text" id="zip" placeholder="Digite seu CEP" required>
            </div>
            <div class="btn-flex">
              <button type="submit" class="btn primary" @click="$router.push('/dashboard')">Cadastrar</button>
            </div>
          </form>
        </div>
    </section>
</template>

<script setup>

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
    height: 20vh;
    border-radius: 0% 0 140px 140px;
  }

  .header {
    padding: 70px var(--side);   
    padding-bottom: 0;  
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    height: 20vh;
    z-index: 1;
    position: relative;
    justify-content: center;

    h2 {
      color: var(--text-color);
    }

    .back-btn {
      position: absolute;
      top: 20px;
      left: 20px;

      button {
        background-image: url('@/assets/images/icons/back-icon.png');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: left center;
        background-size: 12px;
        padding-left: 20px;
        color: var(--text-color);
        font-size: var(--subtitle-medium);
      }
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
        }
    }
}

</style>