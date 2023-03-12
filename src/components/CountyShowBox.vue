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
  },
  computed: {
    county() {
      return this.counties.find((item) => item.name === this.selectedCounty)
    }
  }
}
</script>

<template>
  <div class="county-box">
    <div class="county-box__title">
      <p>選擇縣市</p>
      {{ county.zh_name }}
    </div>
    <div class="county-box__desc">說明</div>
  </div>
</template>

<style lang="scss">
.county-box {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  &__title {
    border: 2px solid white;
    height: 10vh;
    width: 15vw;
    border-radius: 5px;
    margin-bottom: 10%;
    color: white;
    font-weight: bolder;
    font-size: 20px;
    text-align: center;
    p {
      font-size: 15px;
    }
  }
  &__desc {
    height: 30vh;
    width: 30vw;
    max-width: 350px;
    border: 2px solid white;
    border-radius: 5px;
    font-weight: bolder;
    color: white;
    font-size: 15px;
  }
}
</style>