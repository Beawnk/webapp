<template>
    <div class="emergency-btn">
        <button class="emergency" @click.prevent="openForm = true">Chamar Ajuda</button>
    </div>
    <div class="emergency-form" :class="{ open: openForm }">
        <div class="container">
            <h2>Chamar ajuda</h2>
            <form class="">
                <div class="input-group">
                    <label for="local">Sua localização atual</label>
                    <div id="map" style="height: 200px;"></div>
                </div>
                <div class="input-group">
                    <label for="message">Mensagem (opcional)</label>
                    <textarea id="message" rows="4" placeholder="Descreva sua situação..."></textarea>
                </div>
                <div class="input-group">
                    
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const openForm = ref(false);

const minimalStyle = [
  { featureType: "all", elementType: "labels", stylers: [{ visibility: "on" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#e9e9e9" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f5f5f5" }] }
];

onMounted(() => {
  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat, lng },
      zoom: 15,
      styles: minimalStyle,
      disableDefaultUI: true
    });

    new window.google.maps.Marker({
      position: { lat, lng },
      map,
      title: "Você está aqui!"
    });
  },
  (error) => {
    console.error("Erro ao obter localização:", error);
    alert("Não foi possível obter sua localização. Por favor, ative o GPS.");
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
    height: 100%;
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

        h2 {
            color: var(--white-color);
            font-size: var(--title-small);
            margin-bottom: 40px;
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
        }
    }
}
</style>