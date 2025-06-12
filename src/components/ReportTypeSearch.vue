<template>
    <div class="search">
        <input type="text" id="search" name="search" v-model="searchQuery" placeholder="Pesquisar por tipo de denúncia..." @input="searchReportType" @keyup.enter.prevent="searchReportType">
        <input class="search-btn" type="submit" @click.prevent="searchReportType" @keyup.enter.prevent="searchReportType" value=""/>
        <button class="clear" @click="clearSearch" v-show="searchQuery"></button>
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