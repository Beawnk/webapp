<template>
  <section class="dashboard">
    <div class="gradient"></div>
    <div class="header">
        <div class="menu-btn">
            
        </div>
        <div class="info">
            <h2>Olá, ####!</h2>
            <p>O que você quer denunciar?</p>
            <p class="warning-info">Em caso de emergência, clique no botão vermelho acima.</p>
        </div>
    </div>
    <div class="content">
        <div class="search">
            <input type="text" placeholder="Pesquisar por tipo de denúncia...">
        </div>
        <div class="cards">
            <div class="card">
                <div class="icon">
                    <img src="@/assets/images/icons/danger.png" alt="">
                </div>
                <p>Incêndio</p>
            </div>
            <div class="card">
                <div class="icon">
                    <img src="@/assets/images/icons/femenine.png" alt="">
                </div>
                <p>Violência doméstica</p>
            </div>
            <div class="card">
                <div class="icon">
                    <img src="@/assets/images/icons/robber.png" alt="">
                </div>
                <p>Assalto</p>
            </div>
            <div class="card">
                <div class="icon">
                    <img src="@/assets/images/icons/accident.png" alt="">
                </div>
                <p>Acidente de trânsito</p>
            </div>
                        <div class="card">
                <div class="icon">
                    <img src="@/assets/images/icons/disaster.png" alt="">
                </div>
                <p>Árvore caída</p>
            </div>
                        <div class="card">
                <div class="icon">
                    <img src="@/assets/images/icons/pawprint.png" alt="">
                </div>
                <p>Animal perdido</p>
            </div>
        </div>
    </div>
  </section>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.dashboard {

    .gradient {
        background: var(--primary-gradient-color);
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, 0%);
        width: 700px;
        height: 40vh;
        border-radius: 0% 0 25% 25%;
    }

    .header {
        padding: 70px var(--side);
        padding-bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        height: 40vh;
        z-index: 1;
        position: relative;
    
        h2 {
            font-size: var(--title-big);
            color: var(--text-color);
            margin-bottom: 20px;
            margin-top: 40px;
        }
        
        p {
            color: var(--text-color);
            font-size: var(--subtitle-big);
        }

        .warning-info {
            font-size: var(--subtitle-small);
            position: absolute;
            bottom: 40px;
        }
    }
    .content {
        padding: var(--side);

        .search {
            margin-bottom: 30px;
            position: relative;
            width: 100%;
            
            input {
                width: 100%;
                padding: 10px;
                border-radius: 30px;
                border: 1px solid var(--border-color);
                background-color: var(--white-color);
                font-size: var(--text-big);
                color: var(--gray-color);
            }

            &::after {
                content: '';
                position: absolute;
                top: 50%;
                right: 10px;
                transform: translateY(-50%);
                width: 20px;
                height: 20px;
                background-image: url('@/assets/images/icons/lupa.png');
                background-size: 20px;
                opacity: 0.5;
            }
        }

        .cards {
            display: grid;
            grid-template-columns: repeat(2, minmax(150px, 200px));
            gap: 30px;

            .card {
                background-color: var(--white-color);
                border-radius: 20px;
                padding: 15px;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                box-shadow: var(--shadow);

                .icon {
                    width: 50px;
                    height: 50px;
                    margin-bottom: 10px;
                    opacity: 0.5;

                    img {
                        width: 100%;
                        height: 100%;
                    }
                }

                p {
                    font-size: var(--text-big);
                    color: var(--grey-color);
                    opacity: 0.5;
                }
            }
        }
    }
}
</style>