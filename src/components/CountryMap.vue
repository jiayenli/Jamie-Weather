<script>
import { counties } from '@/config/county.js'

export default {
  props: {
    selectedCounty: {
      type: String,
      default: 'taipei_city'
    }
  },
  data() {
    return {
      counties
    }
  }
}
</script>

<template>
  <svg
    id="taiwan-county"
    data-name="圖層 1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 595.28 841.89"
  >
    <path
      @click="$emit('changeCounty', county.name)"
      :class="{ 'taiwan-county-active': county.name === selectedCounty }"
      v-for="county in counties"
      :key="county.name"
      :d="county.path"
      :data-name="county.name"
    />
  </svg>
</template>

<style lang="scss">
#taiwan-county {
  height: 100%;
  path {
    stroke: white;
    stroke-width: 2;
    fill: transparent;
    transition: 0.5s;
    cursor: pointer;
    &:hover {
      fill: #bdad98;
    }
  }
  path.taiwan-county-active {
    fill: #89755d;
  }
}
</style>