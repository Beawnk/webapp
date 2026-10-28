<template>
    <div class="emergency-btn">
        <button type="button" class="emergency" @click.prevent="openForm = true">Chamar Ajuda</button>
    </div>
    <div class="emergency-form" :class="{ open: openForm }">
        <div class="container" ref="formContainer" role="dialog" aria-modal="true" aria-labelledby="emergency-form-title">
            <h2 id="emergency-form-title">Chamar ajuda</h2>
            <p class="demo-notice">
                O app registra seu pedido, mas não aciona os serviços sozinho.
                Depois de registrar, ligue pelos botões que aparecem aqui.
            </p>
            <!-- After registering, the call buttons replace the form. v-show, not v-if:
                 the map lives inside the form and must survive a second opening -->
            <div class="sent" v-show="callList.length" role="status">
                <p>Pedido registrado. Agora ligue:</p>
                <a v-for="call in callList" :key="call.number" :href="`tel:${call.number}`" class="call-btn">
                    <strong>{{ call.number }}</strong> {{ call.label }}
                </a>
                <div class="btn-flex">
                    <button type="button" class="btn secondary" @click="openForm = false">Fechar</button>
                </div>
            </div>
            <form v-show="!callList.length" @submit.prevent="sendEmergency">
                <div class="input-group">
                    <label for="address">Sua localização atual</label>
                    <input
                        id="address"
                        class="address"
                        type="text"
                        v-model="userAddress"
                        placeholder="Digite o endereço..."
                        @input="onAddressInput"
                        autocomplete="off"
                    />
                    <div class="map" ref="mapEl"></div>
                </div>
                <div class="input-group">
                    <label for="message">Mensagem (opcional)</label>
                    <textarea id="message" rows="3" placeholder="Descreva sua situação..." v-model="message"></textarea>
                </div>
                <div class="input-group" role="group" aria-labelledby="send-to-label">
                    <label id="send-to-label">Mandar para:</label>
                    <div class="checkbox-group" v-for="recipient in recipients" :key="recipient.value">
                        <input type="checkbox" :id="recipient.value" :value="recipient.value" v-model="checked">
                        <label :for="recipient.value">{{ recipient.label }}</label>
                    </div>
                </div>
                <div class="btn-flex">
                    <button type="button" class="btn secondary" @click="openForm = false">Cancelar</button>
                    <button type="submit" class="btn primary" :disabled="sending">{{ sending ? 'Registrando...' : 'Registrar pedido' }}</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { onClickOutside } from '@vueuse/core'
import { useAlertStore } from "@/stores/alertStore";
import { useUserStore } from '@/stores/UserStore';
import { supabase } from '@/lib/supabaseClient';
import { useGoogleMaps } from '@/composables/googleMaps';

const alertStore = useAlertStore();
const userStore = useUserStore();
const openForm = ref(false);
const formContainer = ref(null);
const mapEl = ref(null);
const userLocation = ref({ lat: null, lng: null });
const userAddress = ref('');
const message = ref('');
const checked = ref([]);
const sending = ref(false);
// Numbers to call for the request just registered (empty while filling the form)
const callList = ref([]);

const recipients = [
    { value: 'police', label: 'Polícia Militar', number: '190' },
    { value: 'ambulance', label: 'Ambulância', number: '192' },
    { value: 'fire', label: 'Corpo de Bombeiros', number: '193' },
    { value: 'samu', label: 'SAMU', number: '192' }
];

let map = null;
let marker = null;
let geocoder = null;
let addressTimeout = null;

const minimalStyle = [
  { featureType: "all", elementType: "labels", stylers: [{ visibility: "on" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#e9e9e9" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f5f5f5" }] }
];

const getAddressFromCoords = (lat, lng) => {
    if (!geocoder) return;
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
            userAddress.value = results[0].formatted_address;
        } else {
            userAddress.value = 'Endereço não encontrado';
        }
    });
}

const getCoordsFromAddress = (address) => {
    if (!geocoder) return;
    geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            const lat = location.lat();
            const lng = location.lng();
            userLocation.value = { lat, lng };
            if (marker) marker.setPosition({ lat, lng });
            if (map) map.panTo({ lat, lng });
        }
    });
}

const onAddressInput = () => {
    clearTimeout(addressTimeout);
    addressTimeout = setTimeout(() => {
        if (userAddress.value && userAddress.value.length > 5) {
            getCoordsFromAddress(userAddress.value);
        }
    }, 600);
};

const moveMarker = (lat, lng) => {
    marker.setPosition({ lat, lng });
    userLocation.value = { lat, lng };
    getAddressFromCoords(lat, lng);
    map.panTo({ lat, lng });
};

const initMap = async (lat, lng) => {
    try {
        const maps = await useGoogleMaps();
        const [{ Map }, { Geocoder }, { Marker }] = await Promise.all([
            maps.importLibrary('maps'),
            maps.importLibrary('geocoding'),
            maps.importLibrary('marker')
        ]);

        geocoder = new Geocoder();

        map = new Map(mapEl.value, {
            center: { lat, lng },
            zoom: 15,
            styles: minimalStyle,
            disableDefaultUI: true
        });

        marker = new Marker({
            position: { lat, lng },
            map,
            draggable: true,
            title: "Você está aqui!"
        });

        getAddressFromCoords(lat, lng);

        marker.addListener('dragend', (event) => moveMarker(event.latLng.lat(), event.latLng.lng()));
        map.addListener('click', (event) => moveMarker(event.latLng.lat(), event.latLng.lng()));
    } catch (error) {
        console.error('Erro ao carregar o mapa:', error);
        alertStore.addGlobalError('Não foi possível carregar o mapa. Digite o endereço.');
    }
};

const locateUser = () => {
    navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        userLocation.value = { lat, lng };
        initMap(lat, lng);
    },
    (error) => {
        console.error("Erro ao obter localização:", error);
        alertStore.addGlobalError("Não foi possível obter sua localização. Por favor, ative o GPS.");
    },
    {
        enableHighAccuracy: true
    });
};

// Ask for the location only when the user actually opens the form,
// not as soon as the page loads
watch(openForm, (open) => {
    if (open && !map) locateUser();
    // Each opening starts a new request
    if (open) callList.value = [];
});

// Ambulância and SAMU are both 192: one button with both names
const buildCallList = (selected) => {
    const byNumber = {};
    recipients
        .filter((recipient) => selected.includes(recipient.value))
        .forEach(({ number, label }) => {
            byNumber[number] = byNumber[number] ? `${byNumber[number]} / ${label}` : label;
        });
    return Object.entries(byNumber).map(([number, label]) => ({ number, label }));
};

const sendEmergency = async () => {
    if (!checked.value.length) {
        alertStore.addGlobalError('Selecione pelo menos um destinatário.');
        return;
    }

    sending.value = true;
    const { error } = await supabase
        .from('Emergencies')
        .insert([{
            User_id: userStore.user.id,
            Address: userAddress.value || null,
            Latitude: userLocation.value.lat,
            Longitude: userLocation.value.lng,
            Message: message.value || null,
            Recipients: checked.value
        }]);
    sending.value = false;

    // Even if saving fails, the call buttons are what matters in an emergency
    if (error) {
        console.error('Erro ao registrar pedido de ajuda:', error);
        alertStore.addGlobalError('Não foi possível registrar o pedido. Ligue pelos botões abaixo.');
    } else {
        alertStore.addGlobalSuccess('Pedido de ajuda registrado.');
        message.value = '';
    }
    callList.value = buildCallList(checked.value);
}

onClickOutside(formContainer, () => openForm.value = false)
</script>

<style lang="scss" scoped>
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
        transition: var(--transition);
        &:hover {
            transform: scale(1.05);
        }
    }
}

.emergency-form {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100%;
    background-color: rgba(73, 73, 73, 0.31);
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
        background: var(--emergency-gradient-color-second);
        padding: 30px;
        border-radius: 50px 50px 0 0;
        transition: var(--transition);
        max-height: 90vh;

        h2 {
            color: var(--white-color);
            font-size: var(--title-small);
            margin-bottom: 20px;
        }

        .demo-notice {
            color: var(--text-color);
            font-size: var(--text-small);
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: 10px;
            padding: 10px 15px;
            margin-bottom: 20px;

            a {
                text-decoration: underline;
                font-family: var(--font-family-semibold);
            }
        }

        form {
            max-height: 55vh;
            overflow-y: auto;
        }

        .sent {
            display: flex;
            flex-direction: column;
            gap: 10px;

            p {
                color: var(--text-color);
                font-size: var(--subtitle-medium);
            }

            .call-btn {
                display: block;
                background-color: var(--white-color);
                color: var(--emergency-color);
                border-radius: 40px;
                padding: 15px 20px;
                font-size: var(--subtitle-medium);
                text-align: center;
                box-shadow: var(--shadow);
            }
        }

        .input-group {

            label {
                display: block;
                margin-bottom: 10px;
                color: var(--text-color);
                font-size: var(--subtitle-medium);
            }

            .address {
                margin-bottom: 10px;
                border-radius: 8px;
                padding: 8px;
            }

            .map {
                width: 100%;
                height: 200px;
                border-radius: 20px;
            }

            .checkbox-group {
                margin-bottom: 10px;

                label {
                    color: var(--text-color);
                    font-size: var(--subtitle-small);
                }
            }
        }

        .btn-flex {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;

            .btn {

                &.secondary {
                    color: var(--emergency-color);
                    border-color: var(--emergency-color);
                }

                &.primary {
                    background-color: var(--emergency-color);
                    border-color: var(--emergency-color);
                }
            }
        }
    }
}
</style>
