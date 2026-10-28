<template>
    <div class="search">
        <input id="search" v-model="searchQuery" type="text" name="search" aria-label="Pesquisar por tipo de denúncia" placeholder="Pesquisar por tipo de denúncia..." @input="searchReportType" @keyup.enter.prevent="searchReportType">
        <button type="button" class="search-btn" aria-label="Pesquisar" @click="searchReportType"></button>
        <button v-show="searchQuery" type="button" class="clear" aria-label="Limpar pesquisa" @click="clearSearch"></button>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['emitSearch']);

const searchQuery = ref('');

const clearSearch = () => {
    searchQuery.value = '';
    emit('emitSearch', searchQuery.value)
}

const searchReportType = () => {
    emit('emitSearch', searchQuery.value)
}
</script>

<style lang="scss" scoped>
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
    .search-btn {
        content: '';
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        width: 30px;
        height: 30px;
        background-image: url('@/assets/images/icons/lupa.png');
        background-repeat: no-repeat;
        background-position: center;
        background-size: 20px;
        opacity: 0.5;
        border: none;
        background-color: transparent;
    }
    .clear {
        width: 10px;
        height: 10px;
        background-image: url('../assets/images/icons/clear.png');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        position: absolute;
        right: 50px;
        top: 50%;
        transform: translateY(-50%);
        opacity: 0.5;
    }
}
</style>