<template>
    <main>
        <router-view/>
    </main>
</template>

<script setup>

</script>

<style lang="scss">
@import "@/assets/style/main.scss";

.btn {
    border-radius: 40px;
    padding: 15px 50px;
    font-size: var(--title-small);
    border: 3px solid var(--primary-color);

    &.primary {
        background-color: var(--primary-color);
        color: var(--text-color);
        box-shadow: var(--shadow);
    }

    &.secondary {
        background-color: transparent;
        color: var(--primary-color);
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

</style>
