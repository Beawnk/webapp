<template>
  <section class="emergency-view">
    <div class="gradient"></div>
    <div class="header">
        <h2>Emergência</h2>
    </div>
    <div class="content">
        <div class="emergency-info">
        </div>
    </div>
  </section>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.emergency-view {

    .gradient {
        background: var(--emergency-gradient-color);
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, 0%);
        width: var(--gradient-border-width);
        height: 15vh;
        border-radius: var(--gradient-border-radius);
        box-shadow: 0px 0px 14px 7px var(--shadow-color);
    }

    .header {
        padding: 50px var(--side);   
        padding-bottom: 0;  
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        height: 15vh;
        z-index: 1;
        position: relative;
        justify-content: center;

        h2 {
            color: var(--text-color);
        }
    }

    .content {
        padding: var(--side);
    }
}
</style>