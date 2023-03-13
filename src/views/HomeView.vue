<script>
import Navigation from '../components/Navigation.vue'
import CountyShowBox from '../components/CountyShowBox.vue'
import CountryMap from '../components/CountryMap.vue'
import OpenWeatherApis from './../apis/openWeather'
import BarChart from '../components/BarChart.vue'
import moment from 'moment'

export default {
  components: {
    CountryMap,
    Navigation,
    CountyShowBox,
    BarChart
  },
  data() {
    return {
      activeIndex: 0,
      county: 'taipei_city',
      changeTheme: false,
      pathName: '',
      worldCity: 'taipei',
      worldCityInput: '',
      worldWeatherData: {},
      worldDataDateKey: [],
      originWorldWeatherData: [],
      dataRangeSelected: '',
      showWeatherDays: 4,
      chartType: 'max'
    }
  },
  mounted() {
    this.pathName = this.$route.path
    this.getWorldWeatherData()
  },
  watch: {
    '$route.path'(value) {
      // switch
      this.changeTheme = true
      console.log(value)
      setTimeout(() => {
        this.pathName = value
      }, 750)
      setTimeout(() => {
        this.changeTheme = false
      }, 1500)
    }
  },
  methods: {
    updateCounty(name) {
      this.county = name
    },
    async getWorldWeatherData() {
      try {
        let worldWeatherData = {}
        const { data } = await OpenWeatherApis.getWorldWeather({
          q: this.worldCityInput || this.worldCity
        })
        const reviseDateKey = (date) => {
          return moment.utc(date).local().format('YYYY-MM-DD')
        }
        data.list.forEach((item) => {
          const date = reviseDateKey(item.dt_txt)
          const itemData = {
            date: moment.utc(item.dt_txt).local().format('YYYY-MM-DD'),
            moment: moment.utc(item.dt_txt).local().format('HH:mm'),
            temp_max: Math.floor(item.main.temp_max),
            temp_min: Math.floor(item.main.temp_min),
            humidity: item.main.humidity
          }
          if (worldWeatherData[`${date}`]) {
            worldWeatherData[`${date}`].push(itemData)
          } else {
            this.worldDataDateKey.push(date)
            worldWeatherData = {
              ...worldWeatherData,
              [date]: [itemData]
            }
          }
        })
        this.originWorldWeatherData = data.list.map((item) => {
          return {
            date: moment.utc(item.dt_txt).local().format('YYYY-MM-DD'),
            moment: moment.utc(item.dt_txt).local().format('HH:mm'),
            temp_max: Math.round(item.main.temp_max * 10) / 10,
            temp_min: Math.round(item.main.temp_min * 10) / 10,
            humidity: item.main.humidity
          }
        })
        this.dataRangeSelected = this.worldDataDateKey[0]
        this.filterWeatherDays()
        this.worldCity = this.worldCityInput || this.worldCity
      } catch (e) {
        this.worldCity = '無資料'
        this.originWorldWeatherData = []
        console.log(e)
      } finally {
        this.worldCityInput = ''
      }
    },
    filterWeatherDays() {
      this.originWorldWeatherData = this.originWorldWeatherData.filter((item) => {
        const filterDays = this.worldDataDateKey.slice(0, this.showWeatherDays)
        return filterDays.includes(item.date)
      })
    }
  }
}
</script>

<template>
  <main>
    <div id="container">
      <Navigation :activeIndex="activeIndex" />
      <div class="container-main">
        <div class="container-main__home-page">
          <div :class="['container-transition', { active: changeTheme }]"></div>
          <div v-if="pathName === '/taiwan-weather'" class="container-main__taiwan">
            <CountryMap :selectedCounty="county" @changeCounty="updateCounty" />
            <CountyShowBox :selectedCounty="county" />
          </div>
          <div v-if="pathName === '/world-weather'" class="container-main__world">
            <div class="container-main__world-panel">
              <div class="container-main__world-panel-city">
                <div class="container-main__world-panel-input">
                  <div class="container-main__world-panel-input-area">
                    <input
                      v-model="worldCityInput"
                      placeholder="請輸入城市英文名稱"
                      name="myfield"
                    />
                  </div>
                  <button
                    :disabled="!worldCityInput"
                    @click="getWorldWeatherData"
                    :class="['container-main__world-panel-btn', { disabled: !worldCityInput }]"
                  >
                    送
                  </button>
                </div>
                <div class="container-main__world-panel--show">
                  {{ worldCity }}
                </div>
              </div>
              <div class="container-main__world-panel-type">
                取最近的四天資料，資料來源openweather
                <div>
                  <button
                    :class="{ 'type-active': chartType === 'max' }"
                    @click="chartType = 'max'"
                  >
                    高溫<br />預測
                  </button>
                  <button
                    :class="{ 'type-active': chartType === 'min' }"
                    @click="chartType = 'min'"
                  >
                    低溫<br />預測
                  </button>
                  <button :class="{ 'type-active': chartType === 'hum' }">濕度<br />預測</button>
                </div>
              </div>
            </div>
            <div class="container-main__chart">
              <button
                :class="[
                  'container-main__chart-btn',
                  { 'container-main__chart-btn--active': dateValue === dataRangeSelected }
                ]"
                v-for="(dateValue, index) in worldDataDateKey.slice(0, showWeatherDays)"
                :key="`chart-${index}`"
                @click="dataRangeSelected = dateValue"
              >
                <span>
                  {{ dateValue }}
                </span>
              </button>
              <BarChart
                :weatherData="originWorldWeatherData"
                :dataRangeSelected="dataRangeSelected"
                :chartType="chartType"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss">
#container {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  .container-main {
    width: 80%;
    margin-left: 15%;
    flex-shrink: 1;
    &__home-page {
      position: relative;
      width: 100%;
      background-image: linear-gradient(to bottom, $--app-color-gradient, $--app-color-primary);
      height: 80vh;
      border-radius: 40px;
      margin: 0 auto;
      overflow: hidden;
    }
    &__taiwan {
      display: flex;
      justify-content: center;
      height: 80vh;
    }
    &__logo {
      position: absolute;
      left: 5%;
      top: 5%;
      width: 150px;
      object-fit: contain;
    }
    &__world-panel {
      display: flex;
      height: 20vh;
      background-color: white;
      width: 90%;
      border-radius: 10px;
      margin: 5%;
      padding: 2%;
      text-align: left;
      &-city {
        padding-right: 5%;
        border-right: 2px dotted $--app-color-primary;
      }
      &-btn.disabled {
        cursor: not-allowed;
        &:hover {
          background-color: white;
          color: $--app-color-brown;
        }
      }
      &-type {
        padding-left: 5%;
        color: $--app-color-word;
        font-size: 15px;
        font-weight: bolder;
        button {
          height: 60px;
          width: 60px;
          margin-right: 5%;
          margin-top: 5%;
          &.type-active {
            background-color: $--app-color-brown;
            color: white;
          }
        }
      }
      &-input {
        display: flex;
        padding-bottom: 3%;
        &-area {
          border-bottom: 2px solid $--app-color-brown;
        }
      }
      &--show {
        font-size: 25px;
        color: $--app-color-brown;
        font-weight: bold;
      }
    }
    &__chart {
      margin-top: 5%;
      padding: 0 5%;
      height: 100%;
      &-btn {
        margin-bottom: 5vh;
        margin-left: 2%;
        border-radius: 5px;
        border: 2px solid white;
        background-color: transparent;
        color: white;
        transition-duration: 0.4;
        font-size: border;
        &:hover {
          transform: scale(1.1);
        }
        &--active {
          border: none;
          background-color: #9c5949;
        }
      }
    }
    .county-box {
      margin-top: 20vh;
    }
  }
  .container-transition {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    height: 100%;
    width: 0%;
    background-color: $--app-color-word;
    &.active {
      animation-name: update;
      animation-duration: 1.5s;
    }
    @keyframes update {
      0% {
        width: 0;
      }
      40% {
        width: 100%;
      }
      60% {
        width: 100%;
      }
      100% {
        width: 0;
      }
    }
  }
}
</style>
