<template>
    <div class="menu-btn" ref="menuBtn">
		<button @click.prevent="toggleMenu">
			<span></span>
       		<span></span>
       		<span></span>
		</button>
	</div>
    <div class="menu-shadow" :class="{ 'open': menuOpen }" >
        <div class="menu" ref="menu">
            <div class="app-name">
                <div class="app-logo">
                    <img src="@/assets/images/logo2.png" alt="Logo">
                </div>
                <h4>IEmergency</h4>
            </div>
            <ul>
                <li class="profile"><p @click="openProfile">{{ userFirstName }}</p></li>
                <li><router-link to="/dashboard">Home</router-link></li>
                <li><router-link to="/reports">Suas Denúncias</router-link></li>
                <li><button class="link" @click.prevent="userStore.logout">Sair</button></li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '@/stores/UserStore';
import { useClickOutside } from '@/composables/clickOutside';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const menuOpen = ref(false);
const menu = ref(null);
const menuBtn = ref(null);

const toggleMenu = () => {
    menuOpen.value = !menuOpen.value;
};

const userFirstName = computed(() => {
    return userStore.user.Name ? userStore.user.Name.split(' ')[0] : 'Usuário';
});

const openProfile = () => {
    router.push('/user-data');
    userStore.page = 'profile';
};

onMounted(() => {
    useClickOutside(menu, menuBtn, () => {
        if (menuOpen.value) {
            menuOpen.value = false;
        }
    });
});
</script>

<style lang="scss" scoped>
.menu-btn {
	position: absolute;
	left: 30px;
	top: 30px;
	z-index: 10;
	button {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 3px;
		width: 20px;
		height: 20px;
		position: relative;
		span {
			display: block;
			width: 20px;
			height: 3px;
			background: var(--white-color);
			transition: var(--transition);
			position: absolute;
    		left: 50%;
    		transform: translateX(-50%);
			border-radius: var(--border-radius);
			&:nth-child(1) {
    		  top: 0px;
    		}
		
    		&:nth-child(2) {
    		  top: 7px;
    		}
		
    		&:nth-child(3) {
    		  top: 14px;
    		}
		}
	}
}
.menu-shadow {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #4949494f;
    z-index: 14;
    transition: var(--transition);
    opacity: 0;
    pointer-events: none;

    &.open {
        opacity: 1;
        pointer-events: auto;

        .menu {
            left: 0;
        }
    }
}
.menu {
    left: -1000px;
    position: absolute;
    top: 0;
    // left: 0;
    width: 300px;
    height: 100vh;
    background-color: var(--white-color); 
    border-radius: 0 20px 20px 0;
    box-shadow: 0px 0px 14px 7px var(--shadow-color);
    z-index: 15;
    transition: var(--transition);

    .app-name {
        display: flex;
        align-items: center;
        padding: 20px;
        gap: 10px;

        .app-logo {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }

        h4 {
            font-size: var(--subtitle-medium);
            color: var(--text-secondary-color);
        }
    }
    ul {

        li {
            color: var(--gray-color);
            font-size: var(--subtitle-medium);

            &.profile {
                border-bottom: 1px solid var(--border-color);
                color: var(--text-secondary-color);
                
                p {
                    cursor: pointer;
                    padding: 20px 15px;
                }
            }

            button, p, a {
                color: var(--gray-color);
                font-size: var(--subtitle-medium);
                padding: 15px;
                cursor: pointer;
                display: block;
                width: 100%;
                text-align: left;

                &:hover {
                    color: var(--text-secondary-color);
                }
            }

            &:hover {
                background-color: var(--hover-color);
                color: var(--text-secondary-color);
            }
        }
    }
}
</style>