<template>
    <div class="emergency-numbers">
        <div class="container" ref="numbers">
            <div class="title">
                <h2>Números de Emergência</h2>
            </div>
            <div class="numbers-list">
                <div class="number-item">
                    <a href="tel:190">190 Polícia Militar</a>
                </div>
                <div class="number-item">
                    <a href="tel:193">193 Corpo de Bombeiros</a>
                </div>
                <div class="number-item">
                    <a href="tel:192">192 Samu</a>
                </div>
                <div class="number-item">
                    <a href="tel:141">141 Centro de valorização da vida</a>
                </div>
                <div class="number-item">
                    <a href="tel:125">125 Conselho Tutelar</a>
                </div>
                <div class="number-item">
                    <a href="tel:180">180 Delegacia da mulher</a>
                </div>
                <div class="number-item">
                    <a href="tel:100">100 Disque denúncia</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core'

const emit = defineEmits(['close']);

const numbers = ref(null);

onClickOutside(numbers, event => emit('close'))
</script>

<style lang="scss" scoped>
.emergency-numbers {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    height: 100vh;
    background-color: #4949494f;
    z-index: 12;
    transition: var(--transition);
    opacity: 0;
    pointer-events: none;

    &.open {
        opacity: 1;
        pointer-events: auto;

        .container {
            bottom: 0;
        }
    }

    .container {
        position: absolute;
        bottom: -1000px;
        left: 0;
        right: 0;
        width: 100%;
        background-color: var(--white-color);
        padding: 30px;
        padding-top: 10px;
        border-radius: 20px 20px 0 0;
        transition: var(--transition);

        h2 {
            color: var(--emergency-text-color);
            font-size: var(--subtitle-big);
            padding-bottom: 10px;
            padding-top: 15px;
            border-bottom: 2px solid var(--emergency-text-color);
            background-image: url('@/assets/images/icons/ligacao-de-emergencia.png');
            background-size: 40px;
            background-repeat: no-repeat;
            background-position: left center;
            padding-left: 50px;
        }

        .numbers-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 20px;

            .number-item {
                a {
                    color: var(--gray-color);
                    font-size: var(--subtitle-small);
                    text-decoration: none;
                    padding: 15px;
                    padding-left: 40px;
                    background-image: url('@/assets/images/icons/phone-red.png');
                    background-size: 20px;
                    background-repeat: no-repeat;
                    background-position: left center;

                    &:hover {
                        color: var(--emergency-text-color);
                    }
                }
            }
        }
    }
}
</style>