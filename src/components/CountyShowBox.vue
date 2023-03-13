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
      <div class="county-box__title-fav">加</div>
      <div class="county-box__title-word">
        <p>選擇縣市</p>
        {{ county.zh_name }}
      </div>
    </div>
    <div class="county-box__desc">說明</div>
  </div>
</template>

<style lang="scss">
.county-box {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  &__title,
  &__desc {
    background-color: white;
    border-radius: 5px;
    &:hover {
      box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
    }
  }
  &__title {
    display: flex;
    align-items: center;
    height: 10vh;
    width: 15vw;
    margin-bottom: 10%;
    &-word {
      color: $--app-color-word;
      font-size: 20px;
      border-left: 2px dotted $--app-color-primary;
      padding-left: 5%;
      font-weight: bolder;
      p {
        font-size: 10px;
      }
    }
    &-fav {
      margin: 0 5%;
      font-weight: bolder;
      font-size: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $--app-color-brown;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      border: 2px solid $--app-color-brown;
      cursor: pointer;
      &:hover {
        color: white;
        background-color: $--app-color-brown;
      }
    }
  }
  &__desc {
    height: 30vh;
    width: 30vw;
    max-width: 350px;
    font-weight: bolder;
    color: white;
    font-size: 15px;
  }
}
</style>