<script>
import { counties } from '@/config/county.js'
export default {
  props: {
    selectedCounty: {
      type: String,
      default: 'Taipei'
    },
    currentWeatherData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      counties,
      mapInput: '',
      showInputArea: false
    }
  },
  watch: {
    selectedCounty() {
      this.mapInput = this.selectedCounty
    }
  },
  mounted() {
    this.mapInput = this.selectedCounty
  },
  methods: {
    getMoreDatas() {
      this.$router.push('/weather-forecast')
    },
    editCounty() {
      if (this.showInputArea) {
        this.showInputArea = false
        return
      }
      this.showInputArea = true
      this.$nextTick(() => {
        this.$refs.countyInput.focus()
      })
    },
    updateMapCounty() {
      if (!this.mapInput.trim()) {
        this.$refs.countyInput.blur()
        return
      }
      this.$emit('updateMapCounty', this.mapInput.trim())
      this.showInputArea = false
    },
    resetEditArea() {
      this.mapInput = this.selectedCounty
      setTimeout(() => {
        this.showInputArea = false
      }, 200)
    }
  }
}
</script>

<template>
  <div class="county-box">
    <div class="county-box__tips">台灣地區可由地圖選擇，其他國家請輸入城市英文地名</div>
    <div class="county-box__title">
      <div class="county-box__title-fav" @click="editCounty">編</div>
      <div class="county-box__title-word">
        <p>輸入縣市</p>
        <div v-if="!showInputArea" @click="editCounty" class="county-box__title-county">
          {{ selectedCounty }}
        </div>
        <input
          @keyup.enter="updateMapCounty"
          ref="countyInput"
          @blur="resetEditArea"
          v-else
          v-model="mapInput"
        />
      </div>
    </div>
    <div class="county-box__desc">
      <div class="county-box__desc-main" v-if="currentWeatherData.temp">
        {{ currentWeatherData.temp }}°C
        <img :src="`https://openweathermap.org/img/wn/${currentWeatherData.icon}@2x.png`" />
      </div>
      <div class="county-box__desc-detail" v-if="currentWeatherData.temp">
        氣溫時間： {{ currentWeatherData.date + ' ' + currentWeatherData.time }} <br />
        體感溫度：{{ currentWeatherData.feels_like }}°C
        <br />
        最高溫度：{{ currentWeatherData.temp_max }}°C <br />
        最低溫度：{{ currentWeatherData.temp_min }}°C<br />
        濕度：{{ currentWeatherData.humidity }}%
      </div>
      <div class="county-box__desc-detail" v-if="!currentWeatherData.temp">
        很抱歉您輸入的城市無氣象資料，請重新輸入或點選左側地圖
      </div>
      <p class="county-box__desc-more" @click="getMoreDatas" v-if="currentWeatherData.temp">
        後四天{{ selectedCounty }}天氣預報 ＞＞
      </p>
    </div>
  </div>
</template>

<style lang="scss">
.county-box {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 20vh;
  &__tips {
    border: 2px dotted white;
    font-weight: bolder;
    color: white;
    padding: 2%;
    font-size: 12px;
    border-radius: 5px;
    margin-bottom: 5%;
  }
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
    &-county {
      color: $--app-color-word;
      font-size: 20px;
      font-weight: bolder;
      text-transform: capitalize;
    }
    &-word {
      border-left: 2px dotted $--app-color-primary;
      padding-left: 5%;
      p {
        font-size: 10px;
      }
      input {
        width: 90%;
        border: 2px dotted $--app-color-primary !important;
      }
    }
    &-fav {
      flex-shrink: 0;
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
    color: $--app-color-word;
    font-size: 15px;
    display: flex;
    padding: 3%;
    position: relative;
    &-main {
      margin-right: 3%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 10vw;
      height: 10vw;
      background-color: $--app-color-brown;
      border: 2px dotted $--app-color-word;
      font-size: 18px;
      font-weight: bolder;
      color: $--app-color-word;
      border-radius: 5px;
      img {
        width: 70%;
        flex-shrink: 1;
      }
      &-time {
        font-size: 8px;
        font-weight: bolder;
      }
    }
    &-detail {
      font-size: 12px;
      font-weight: bolder;
    }
    &-more {
      font-size: 12px;
      font-weight: bolder;
      position: absolute;
      bottom: 5%;
      right: 5%;
      cursor: pointer;
      padding: 2%;
      border-radius: 10px;
      &:hover {
        border: 2px dotted $--app-color-word;
      }
    }
  }
}
@media (max-width: 767.98px) {
  .county-box {
    width: 100%;
    margin-top: 0px;
    &__title {
      display: none;
      width: 100%;
    }
    &__tips {
      display: none;
    }
    &__desc {
      width: 100%;
      height: 100%;
      max-width: unset;
      margin-bottom: 10%;
      &-main {
        width: 30vw;
        height: 30vw;
        max-height: 100%;
      }
      &-more {
        display: none;
      }
    }
  }
}
</style>