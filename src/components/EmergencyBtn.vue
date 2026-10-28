<template>
    <div class="emergency-btn">
        <button type="button" class="emergency" @click.prevent="openForm = true">Chamar Ajuda</button>
    </div>
    <div class="emergency-form" :class="{ open: openForm }">
        <div class="container" ref="formContainer" role="dialog" aria-modal="true" aria-labelledby="emergency-form-title">
            <h2 id="emergency-form-title">Chamar ajuda</h2>
            <p class="demo-notice">
                Modo demonstração: nada é enviado de verdade.
                Em uma emergência real, ligue <a href="tel:190">190</a>, <a href="tel:192">192</a> ou <a href="tel:193">193</a>.
            </p>
            <form @submit.prevent="sendEmergency">
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
                    <button type="submit" class="btn primary">Enviar (simulação)</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { onClickOutside } from '@vueuse/core'
import { useAlertStore } from "@/stores/alertStore";
import { useGoogleMaps } from '@/composables/googleMaps';

const alertStore = useAlertStore();
const openForm = ref(false);
const formContainer = ref(null);
const mapEl = ref(null);
const userLocation = ref({ lat: null, lng: null });
const userAddress = ref('');
const message = ref('');
const checked = ref(['emergency-contacts']);

const recipients = [
    { value: 'police', label: 'Polícia Militar' },
    { value: 'ambulance', label: 'Ambulância' },
    { value: 'fire', label: 'Corpo de Bombeiros' },
    { value: 'samu', label: 'SAMU' },
    { value: 'emergency-contacts', label: 'Contatos de emergência' }
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
});

const sendEmergency = () => {
    if (!checked.value.length) {
        alertStore.addGlobalError('Selecione pelo menos um destinatário.');
        return;
    }

    const names = recipients
        .filter((recipient) => checked.value.includes(recipient.value))
        .map((recipient) => recipient.label)
        .join(', ');
    const location = userAddress.value || 'localização não informada';
    const note = message.value ? ` Mensagem: "${message.value}"` : '';

    alertStore.addGlobalSuccess(`Simulação: em um app real, sua localização (${location}) seria enviada para ${names}.${note}`);
    openForm.value = false;
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
