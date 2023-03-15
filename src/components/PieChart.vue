<script>
export default {
  props: {
    mainColor: {
      type: String,
      default: '#cfbda5'
    },
    humdeg: {
      type: [String, Number],
      default: '60'
    },
    subColor: {
      type: String,
      default: 'white'
    },
    hum: {
      type: [String, Number],
      default: '60'
    }
  }
}
</script>

<template>
  <div class="pie-chart">
    <div
      class="pie-chart-content"
      :style="`--main-color: ${mainColor}; 
      --sub-color: ${subColor}; --hum-rate: ${humdeg}deg;`"
    >
      {{ hum }}%
    </div>
  </div>
</template>

<style lang="scss">
.pie-chart {
  &-content {
    display: flex;
    padding-bottom: 10%;
    align-items: flex-end;
    justify-content: center;
    width: 25vh;
    height: 25vh;
    max-width: 13vw;
    max-height: 13vw;
    background: conic-gradient(var(--main-color) var(--hum-rate), var(--sub-color) var(--hum-rate));
    border-radius: 50%;
    font-weight: bolder;
    color: $--app-color-word;
    animation-name: shrink;
    animation-duration: 1s;
    @keyframes shrink {
      0% {
        transform: scale(1, 1);
      }
      50% {
        transform: scale(1.05, 1.05);
      }
      100% {
        transform: scale(1, 1);
      }
    }
  }
  @media (max-width: 767.98px) {
    &-content {
      width: 40vw;
      height: 40vw;
      max-width: unset;
      max-height: unset;
    }
  }
}
</style>