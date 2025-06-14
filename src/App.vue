<template>
    <main>
        <router-view/>
    </main>
</template>

<script setup>

</script>

<style lang="scss">
@import "@/assets/style/main.scss";

main {
    max-width: 500px;
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 100vh;
    overflow: hidden;
    background-color: var(--background-color);
}

.btn {
    border-radius: 40px;
    padding: 5px 15px;
    min-width: 130px;
    font-size: var(--subtitle-medium);
    border: 2px solid var(--primary-color);

    &.primary {
        background-color: var(--primary-color);
        color: var(--text-color);
        box-shadow: var(--shadow);
    }

    &.secondary {
        background-color: transparent;
        color: var(--primary-color);
    }

    &.back-btn {
        background-image: url('@/assets/images/icons/back-icon-purple.png');
        background-size: 10px;
        background-position: 10px center;
        background-repeat: no-repeat;
    }

    &:hover {
        transform: scale(1.05);
    }
}

a.link {
    color: var(--primary-color);
    font-size: var(--subtitle-small);
    opacity: 0.5;

    &:hover {
        opacity: 1;
    }
}

.input-flex {
    display: flex;
    gap: 20px;
}

.input-group {
    margin-bottom: 20px;
    width: 100%;
}

input, textarea {
    display: block;
    width: 100%;
    padding: 20px 15px;
    border-radius: 10px;
    border: 1px solid var(--border-color);
    background-color: var(--input-color);
    font-family: var(--font-family);
    font-size: var(--text-big);
    outline: none;

    &:focus {
        border-color: var(--border-color-focus);
    }            
}

input::placeholder {
  opacity: 0.8;
}

label {
    color: var(--gray-color);
    font-size: var(--subtitle-small);
    margin-bottom: 5px;
    display: block;
}

</style>
