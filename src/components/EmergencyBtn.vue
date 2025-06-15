<template>
    <div class="emergency-btn">
        <button class="emergency" @click.prevent="openForm = true">Chamar Ajuda</button>
    </div>
    <div class="emergency-form" :class="{ open: openForm }">
        <div class="container" ref="formContainer">
            <h2>Chamar ajuda</h2>
            <form class="" @submit.prevent="sendEmergency">
                <div class="input-group">
                    <label for="local">Sua localização atual</label>
                    <div class="input-group">
                        <input
                        id="address"
                        type="text"
                        v-model="userAddress"
                        placeholder="Digite o endereço..."
                        @keyup="onAddressInput"
                        autocomplete="off"
                        style="margin-bottom: 10px; width: 100%; border-radius: 8px; padding: 8px;"
                        />
                    </div>
                    <div id="map" style="height: 200px;"></div>
                </div>
                <div class="input-group">
                    <label for="message">Mensagem (opcional)</label>
                    <textarea id="message" rows="3" placeholder="Descreva sua situação..."></textarea>
                </div>
                <div class="input-group">
                    <label for="send-to">Mandar para:</label>
                    <div class="checkbox-group">
                        <input type="checkbox" id="police" value="police" v-model="checked">
                        <label for="police">Polícia Militar</label>
                    </div>
                    <div class="checkbox-group">
                        <input type="checkbox" id="ambulance" value="ambulance" v-model="checked">
                        <label for="ambulance">Ambulância</label>
                    </div>
                    <div class="checkbox-group">
                        <input type="checkbox" id="fire" value="fire" v-model="checked">
                        <label for="fire">Corpo de Bombeiros</label>
                    </div>
                    <div class="checkbox-group">
                        <input type="checkbox" id="samu" value="samu" v-model="checked">
                        <label for="samu">SAMU</label>
                    </div>
                    <div class="checkbox-group">
                        <input type="checkbox" id="emergency-contacts" value="emergency-contacts" v-model="checked" checked>
                        <label for="emergency-contacts">Contatos de emergência</label>
                    </div>
                </div>
                <div class="btn-flex">
                    <button type="button" class="btn secondary" @click="openForm = false">Cancelar</button>
                    <button type="submit" class="btn primary">Enviar</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { onClickOutside } from '@vueuse/core'
import { useAlertStore } from "@/stores/alertStore";

const alertStore = useAlertStore();
const openForm = ref(false);
const formContainer = ref(null);
const userLocation = ref({ lat: null, lng: null });
const userAddress = ref('');
const checked = ref(['emergency-contacts']);

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
    if (!geocoder) geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
            userAddress.value = results[0].formatted_address;
        } else {
            userAddress.value = 'Endereço não encontrado';
        }
    });
}

const getCoordsFromAddress = (address) => {
    if (!geocoder) geocoder = new window.google.maps.Geocoder();
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

const sendEmergency = () => {
    alertStore.addGlobalSuccess(`Mensagem de emergência enviada!\nLocalização:  ${userAddress.value}`);
    openForm.value = false;
}

onClickOutside(formContainer, event => openForm.value = false)

onMounted(() => {
    navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        userLocation.value = { lat, lng };

        geocoder = new window.google.maps.Geocoder();

        map = new window.google.maps.Map(document.getElementById('map'), {
            center: { lat, lng },
            zoom: 15,
            styles: minimalStyle,
            disableDefaultUI: true
        });

        marker = new window.google.maps.Marker({
            position: { lat, lng },
            map,
            draggable: true,
            title: "Você está aqui!"
        });

        getAddressFromCoords(lat, lng);

        marker.addListener('dragend', (event) => {
            const newLat = event.latLng.lat();
            const newLng = event.latLng.lng();
            userLocation.value = { lat: newLat, lng: newLng };
            getAddressFromCoords(newLat, newLng);
            map.panTo(marker.getPosition());
        });

        map.addListener('click', (event) => {
            const newLat = event.latLng.lat();
            const newLng = event.latLng.lng();
            marker.setPosition({ lat: newLat, lng: newLng });
            userLocation.value = { lat: newLat, lng: newLng };
            getAddressFromCoords(newLat, newLng);
            map.panTo(marker.getPosition());
        });
    },
    (error) => {
        console.error("Erro ao obter localização:", error);
        alertStore.addGlobalError("Não foi possível obter sua localização. Por favor, ative o GPS.");
    }, 
    {
        enableHighAccuracy: true
    });
});
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
        transition: background-color 0.3s;
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
            margin-bottom: 40px;
        }

        form {
            max-height: 60vh;
            overflow-y: auto;
        }

        .input-group {
            
            label {
                display: block;
                margin-bottom: 10px;
                color: var(--text-color);
                font-size: var(--subtitle-medium);
            }

            #map {
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