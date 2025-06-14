<template>
  <section class="emergency-view">
    <div class="gradient"></div>
    <div class="header">
        <Menu />
        <h2>Emergência</h2>
    </div>
    <div class="content">
        <div class="emergency-info">
            <div class="icon">
                <img src="@/assets/images/icons/warning-red.png" alt="Ícone de emergência" />
            </div>
            <p>Aperte o botão para enviar uma mensagem de emergência</p>
        </div>
        <div class="emergency-btn">
            <button class="emergency" @click.prevent="$router.push('/emergency-form')">Chamar Ajuda</button>
        </div>
        <div class="btn-flex">
            <button class="btn secondary back-btn" @click="$router.go(-1)">Voltar</button>
            <button class="btn secondary numbers" @click.prevent="openNumbers = !openNumbers" ref="numbersBtn">Números de emergência</button>
        </div>
        <EmergencyNumbers :class="{ open: openNumbers }" @close="openNumbers = false"/>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useClickOutside } from '@/composables/clickOutside';
import EmergencyNumbers from '@/components/EmergencyNumbers.vue';

const openNumbers = ref(false);
const numbersBtn = ref(null);
</script>

<style lang="scss" scoped>
.emergency-view {
    .gradient {
        background: var(--emergency-gradient-color);
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

    .content {
        padding: var(--side);

        .emergency-info {
            display: flex;
            align-items: center;
            gap: 20px;
            background-color: var(--bg-emergency-color);
            padding: 20px;
            border-radius: 10px;
            box-shadow: var(--shadow);
            margin-top: 20px;

            .icon {
                width: 40px;
                height: 40px;

                img {
                    width: 100%;
                    height: 100%;
                }
            }

            p {
                color: var(--emergency-text-color);
                font-size: var(--subtitle-small);
                max-width: 80%;
            }
        }

        .emergency-btn {
            display: flex;
            justify-content: center;
            height: 50vh;
            align-items: center;

            .emergency {
                background-color: var(--emergency-color);
                color: var(--white-color);
                padding: 20px;
                width: 250px;
                height: 250px;
                font-size: var(--title-small);
                border: 12px dashed #d43636;
                cursor: pointer;
                border-radius: 50%;
                box-shadow: 0px 0px 14px 7px var(--shadow-color);
                transition: background-color 0.3s;
                transition: var(--transition);

                &:hover {
                    transform: scale(1.05);
                }
            }
        }

        .btn-flex {
            display: flex;
            justify-content: space-between;
            position: absolute;
            bottom: 30px;
            left: 30px;
            right: 30px;
            gap: 20px;
            margin-top: 30px;

            .btn {

                &.secondary {
                    border-color: var(--emergency-color);
                    color: var(--emergency-color);
                }

                &.back-btn {
                    background-image: url('@/assets/images/icons/back-icon-red.png');
                }

                &.numbers {
                    max-width: 150px;
                    padding-left: 50px;
                    font-size: var(--text-medium);
                    background-image: url('@/assets/images/icons/ligacao-de-emergencia.png');
                    background-size: 30px;
                    background-position: left 10px center;
                    background-repeat: no-repeat;
                    text-align: left;
                }

            }
        }
    }
}
</style>