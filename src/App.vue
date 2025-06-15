<template>
    <main>
        <Notifications v-if="alertStore.globalErrors.length || alertStore.globalSuccesses.length"
          :errors="alertStore.globalErrors" 
          :successes="alertStore.globalSuccesses" 
        />
        <router-view/>
    </main>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useUserStore } from '@/stores/UserStore';
import Notifications from '@/components/Notifications.vue';
import { useAlertStore } from '@/stores/alertStore';

const alertStore = useAlertStore();
const userStore = useUserStore();

onMounted(() => {
  userStore.loadUserFromLocalStorage();
});
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

.checkbox-group {
    display: flex;
    align-items: center;
    gap: 10px;

    input[type="checkbox"] {
        /* Hide the default checkbox */
        opacity: 0;
        width: 0;
        height: 0;
        position: absolute;
    }

    /* Custom box */
    label {
        position: relative;
        padding-left: 30px;
        cursor: pointer;
        user-select: none;
        padding-top: 2px;

        &::before {
            content: "";
            position: absolute;
            left: 0;
            top: 2px;
            width: 16px;
            height: 16px;
            border: 2px solid var(--white-color);
            border-radius: 50%;
            background: transparent;
            transition: background 0.2s;
        }
    }

    /* Checked state */
    input[type="checkbox"]:checked + label::before {
        background: var(--white-color);
        border-color: var(--white-color);
    }

    /* Checkmark */
    input[type="checkbox"]:checked + label::after {
        content: "";
        position: absolute;
        left: 5px;
        top: 8px;
        width: 7.5px;
        height: 4px;
        border-left: 2px solid #6a3b84;
        border-bottom: 2px solid #6a3b84;
        transform: rotate(-45deg);
    }
}

</style>
