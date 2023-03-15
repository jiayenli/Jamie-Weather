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
  <svg id="taiwan-county" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 595.28 841.89">
    <path
      @click="$emit('changeCounty', county.name)"
      :class="{
        'taiwan-county-active': county.name.toLowerCase() === selectedCounty.toLowerCase()
      }"
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
  display: block;
  path {
    stroke: white;
    stroke-width: 2;
    fill: transparent;
    transition: 0.5s;
    cursor: pointer;
    &:hover {
      fill: white;
      opacity: 0.7;
    }
  }
  path.taiwan-county-active {
    fill: $--app-color-word;
  }
}
</style>