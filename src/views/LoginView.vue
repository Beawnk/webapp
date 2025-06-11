<template>
  <section class="login">
    <div class="gradient"></div>
    <div class="header">
      <div class="back-btn">
        <button class="" @click="$router.push('/')">Voltar</button>
      </div>
      <h2>Entrar</h2>
    </div>
    <div class="form-login">
      <form>
        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" placeholder="Digite seu email" required>
        </div>
        <div class="input-group">
          <label for="password">Senha</label>
          <input type="password" id="password" placeholder="Digite sua senha" required>
        </div>
        <div class="btn-flex">
          <button type="submit" class="btn primary" @click="$router.push('/dashboard')">Entrar</button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>

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

  .form-login {
    padding: 0 var(--side);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh;
    z-index: 1;
    position: relative;

    form {
      width: 100%;
      max-width: 400px;

      .btn-flex {
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>