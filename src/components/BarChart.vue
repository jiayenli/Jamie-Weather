<script>
export default {
  props: {
    weatherData: {
      type: Array,
      default: () => []
    },
    chartType: {
      type: String,
      default: 'max'
    },
    dataRangeSelected: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      maxTemp: 0
    }
  },
  mounted() {
    this.findMaxTemp()
  },
  watch: {
    weatherData: {
      handler() {
        this.findMaxTemp()
      },
      deep: true
    }
  },
  methods: {
    findMaxTemp() {
      const maxTemp = this.weatherData.map((item) => {
        return Number(item.temp_max)
      })
      this.maxTemp = Math.max(...maxTemp)
    }
  }
}
</script>

<template>
  <div class="weather-chart">
    <div class="weather-chart__main" v-for="(data, index) in weatherData" :key="index">
      <div class="weather-chart__temp">
        {{ chartType === 'max' ? data.temp_max : data.temp_min }}°C
      </div>
      <div
        :class="[
          { 'weather-chart__max': chartType === 'max' },
          { 'weather-chart__min': chartType === 'min' },
          { 'weather-chart__min': data === 'min' },
          { 'weather-chart__active': dataRangeSelected === data.date }
        ]"
        :style="`--height: calc(25vh * ${
          (chartType === 'max' ? data.temp_max : data.temp_min) / maxTemp
        })`"
      ></div>
      <div class="weather-chart__time">{{ data.moment }}</div>
    </div>
  </div>
</template>

<style lang="scss">
.weather-chart {
  display: flex;
  width: 100%;
  overflow: scroll;
  height: 100%;
  &__main {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    flex-direction: column;
  }
  &__max,
  &__min {
    flex-shrink: 0;
    width: 30px;
    border: 2px solid $--app-color-word;
    background-color: white;
    margin-right: 20px;
    animation-name: grow;
    animation-duration: 1.5s;
    height: var(--height);
    transform-origin: bottom;
    @keyframes grow {
      0% {
        transform: scale(1, 0.1);
      }
      100% {
        transform: scale(1, 1);
      }
    }
  }
  &__max.weather-chart__active {
    background-color: $--app-color-word;
  }
  &__min.weather-chart__active {
    background-color: $--app-color-word;
  }
  &__time {
    font-size: 12px;
    color: $--app-color-word;
    font-weight: bolder;
  }
  &__temp {
    font-size: 12px;
    color: #9c5949;
    font-weight: bolder;
  }
}
@media (max-width: 767.98px) {
  .weather-chart {
    height: unset;
  }
}
</style>