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
    padding: 15px 30px;
    font-size: var(--subtitle-big);
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
    font-size: var(--text-big);
    outline: none;

    &:focus {
        border-color: var(--border-color-focus);
    }            
}

input::placeholder {
  opacity: 0.4;
}

label {
    color: var(--gray-color);
    font-size: var(--subtitle-small);
    margin-bottom: 5px;
    display: block;
}

</style>
