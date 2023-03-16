<script>
import Navigation from '../components/Navigation.vue'
import CountyShowBox from '../components/CountyShowBox.vue'
import CountryMap from '../components/CountryMap.vue'
import OpenWeatherApis from './../apis/openWeather'
import BarChart from '../components/BarChart.vue'
import PieChart from '../components/PieChart.vue'
import moment from 'moment'

export default {
  components: {
    CountryMap,
    Navigation,
    CountyShowBox,
    BarChart,
    PieChart
  },
  data() {
    return {
      pathName: '',
      changeTheme: false,
      currentWeatherData: {},
      forecastCity: 'Taipei',
      inputCity: '',
      originWeatherDatas: [],
      weatherDataByDays: {},
      weatherDateKeys: [],
      averageHumidityByDays: [],
      fourDaysWeatherDatas: [],
      dataRangeSelected: '',
      showWeatherDays: 4,
      chartType: 'max'
    }
  },
  mounted() {
    this.pathName = this.$route.path
    this.getFourDaysWeatherData()
    this.getCurrentWeather()
  },
  watch: {
    '$route.path'(value) {
      this.changeTheme = true
      setTimeout(() => {
        this.pathName = value
      }, 750)
      setTimeout(() => {
        this.changeTheme = false
      }, 1500)
    }
  },
  computed: {
    year() {
      const todayDate = new Date()
      return todayDate.getFullYear()
    }
  },
  methods: {
    updateCounty(name) {
      this.forecastCity = name
      this.getCurrentWeather()
      this.getFourDaysWeatherData()
    },
    async getCurrentWeather() {
      try {
        const { data } = await OpenWeatherApis.getCurrentWeather({
          q: this.forecastCity
        })
        const todayDate = new Date()
        this.currentWeatherData = {
          time: todayDate.getHours() + ':' + todayDate.getMinutes(),
          date:
            todayDate.getFullYear() + '/' + (todayDate.getMonth() + 1) + '/' + todayDate.getDate(),
          feels_like: data.main.feels_like,
          humidity: data.main.humidity,
          temp: data.main.temp,
          temp_max: data.main.temp_max,
          temp_min: data.main.temp_min,
          description: data.weather[0]?.description,
          icon: data.weather[0]?.icon
        }
      } catch (e) {
        this.currentWeatherData = {}
        console.log(e)
      }
    },
    async getFourDaysWeatherData() {
      this.weatherDataByDays = {}
      this.weatherDateKeys = []
      this.fourDaysWeatherDatas = []
      this.averageHumidityByDays = []

      try {
        const { data } = await OpenWeatherApis.getWeathers({
          q: this.forecastCity
        })
        this.originWeatherDatas = data.list.map((item) => {
          return {
            date: moment.utc(item.dt_txt).local().format('YYYY-MM-DD'),
            moment: moment.utc(item.dt_txt).local().format('HH:mm'),
            temp_max: Math.round(item.main.temp_max * 10) / 10,
            temp_min: Math.round(item.main.temp_min * 10) / 10,
            humidity: item.main.humidity
          }
        })
        this.sortWeatherDataBydays(this.originWeatherDatas)
        this.filterWeatherDays()
        this.filterHumidity()
      } catch (e) {
        this.forecastCity = '無資料'
        this.originWeatherDatas = []
        this.fourDaysWeatherDatas = []
        console.log(e)
      } finally {
        this.inputCity = ''
      }
    },
    sortWeatherDataBydays(data) {
      let weatherDataByDays = {}
      data.forEach((item) => {
        if (weatherDataByDays[`${item.date}`]) {
          weatherDataByDays[`${item.date}`].push(item)
        } else {
          if (this.weatherDateKeys.length >= this.showWeatherDays) {
            return
          }
          this.weatherDateKeys.push(item.date)
          weatherDataByDays = {
            ...weatherDataByDays,
            [item.date]: [item]
          }
        }
      })
      this.weatherDataByDays = weatherDataByDays
      this.dataRangeSelected = this.weatherDateKeys[0]
    },
    filterWeatherDays() {
      this.fourDaysWeatherDatas = this.originWeatherDatas.filter((item) => {
        return this.weatherDateKeys.includes(item.date)
      })
    },
    filterHumidity() {
      for (let key in this.weatherDataByDays) {
        const humidities = this.weatherDataByDays[key].map((item) => {
          return Number(item.humidity)
        })
        const averageHumidity =
          humidities.reduce((accumulator, currentValue) => accumulator + currentValue) /
          this.weatherDataByDays[key].length
        this.averageHumidityByDays.push({
          date: key,
          humidity: Math.round(averageHumidity * 10) / 10
        })
      }
    }
  }
}
</script>

<template>
  <main>
    <div id="container">
      <Navigation />
      <div class="container-main">
        <div class="container-main__home-page">
          <img class="container-main__logo" src="@/assets/jw_logo_white.png" />
          <div :class="['container-transition', { active: changeTheme }]"></div>
          <div :class="['container-main__taiwan', { 'container-main__hide': pathName !== '/' }]">
            <div class="container-main__taiwan-map">
              <CountryMap :selectedCounty="forecastCity" @changeCounty="updateCounty" />
            </div>
            <CountyShowBox
              :selectedCounty="forecastCity"
              :currentWeatherData="currentWeatherData"
              @updateMapCounty="updateCounty"
            />
          </div>
          <div
            :class="{ 'container-main__hide': pathName !== '/weather-forecast' }"
            class="container-main__world"
          >
            <div class="container-main__world-panel">
              <div class="container-main__world-panel-city">
                <div class="container-main__world-panel-input">
                  <div class="container-main__world-panel-input-area">
                    <input
                      v-model="inputCity"
                      placeholder="請輸入城市英文名稱"
                      name="myfield"
                      @keyup.enter="updateCounty(inputCity)"
                    />
                  </div>
                  <button
                    :disabled="!inputCity"
                    @click="updateCounty(inputCity)"
                    :class="['container-main__world-panel-btn', { disabled: !inputCity }]"
                  >
                    送
                  </button>
                </div>
                <div class="container-main__world-panel--show">
                  {{ forecastCity }}
                </div>
              </div>
              <div class="container-main__world-panel-type">
                <div class="container-main__world-panel-control">氣象選單 ｜ 未來四天預測</div>
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
                  <button
                    @click="chartType = 'hum'"
                    :class="{ 'type-active': chartType === 'hum' }"
                  >
                    濕度<br />預測
                  </button>
                </div>
              </div>
            </div>
            <div class="container-main__chart">
              <button
                :class="[
                  'container-main__chart-btn',
                  { 'container-main__chart-btn--active': dateValue === dataRangeSelected }
                ]"
                v-for="(dateValue, index) in weatherDateKeys.slice(0, showWeatherDays)"
                :key="`chart-${index}`"
                @click="dataRangeSelected = dateValue"
              >
                <span>
                  {{ dateValue }}
                </span>
              </button>
              <BarChart
                v-if="chartType === 'max' || chartType === 'min'"
                :weatherData="fourDaysWeatherDatas"
                :dataRangeSelected="dataRangeSelected"
                :chartType="chartType"
              />
              <div v-else class="container-main__chart-pie">
                <div
                  class="container-main__chart-pie-main"
                  v-for="(item, index) in averageHumidityByDays"
                  :key="`humidity-${index}`"
                >
                  <PieChart
                    :hum="item.humidity"
                    :humdeg="Math.round((item.humidity / 100) * 360)"
                    :mainColor="item.date === dataRangeSelected ? '#9c5949' : '#cfbda5'"
                  />
                  <div class="container-main__chart-pie-date">{{ item.date }}</div>
                </div>
              </div>
            </div>
          </div>
          <div
            :class="{ 'container-main__hide': pathName !== '/contact' }"
            class="container-main__contact"
          >
            <img class="container-main__contact-logo" src="@/assets/jw_logo_dark.png" />
            <div class="container-main__contact-project">
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://www.cakeresume.com/x9276550"
                class="container-main__contact-btn"
                >看更多網站作品</a
              >
              <div class="container-main__contact-line" />
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://www.cakeresume.com/portfolios/7a1eb6"
                class="container-main__contact-btn"
                >看更多平面作品</a
              >
            </div>
          </div>
        </div>
      </div>
      <div class="container-copyright">copyright {{ year }} Jamie Weather all rights reserved.</div>
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
    &__hide {
      display: none !important;
    }
    &__home-page {
      position: relative;
      width: 100%;
      background-image: linear-gradient(to bottom, $--app-color-gradient, $--app-color-primary);
      height: 80vh;
      border-radius: 40px;
      margin: 0 auto;
      overflow: hidden;
      padding: 0 5%;
      transform: rotate(0deg);
    }
    &__taiwan {
      display: flex;
      justify-content: center;
      height: 80vh;
      width: 100%;
      &-map {
        width: 30vw;
      }
    }
    &__logo {
      display: none;
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
        width: 100%;
        padding-left: 5%;
        button {
          height: 5vw;
          width: 5vw;
          min-width: 45px;
          min-height: 45px;
          margin-right: 5%;
          margin-top: 2%;
          &.type-active {
            background-color: $--app-color-brown;
            color: white;
          }
        }
      }
      &-control {
        color: $--app-color-word;
        font-size: 15px;
        font-weight: bolder;
      }
      &-input {
        display: flex;
        padding-bottom: 3%;
        &-area {
          border-bottom: 2px solid $--app-color-brown;
        }
      }
      &--show {
        text-transform: Capitalize;
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
        span {
          font-weight: bolder;
        }
        &:hover {
          transform: scale(1.1);
        }
        &--active {
          background-color: $--app-color-brown;
        }
      }
      &-pie {
        display: flex;
        justify-content: space-around;
        flex-wrap: nowrap;
        &-main {
          margin-bottom: 5%;
          text-align: center;
        }
        &-date {
          margin-top: 10%;
          font-size: 14px;
          color: $--app-color-word;
          font-weight: bold;
        }
      }
    }
    &__contact {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      &-logo {
        width: 20%;
        object-fit: contain;
      }
      &-line {
        height: 80%;
        width: 1px;
        border-right: 2px dotted $--app-color-word;
        margin: 0 10%;
      }
      &-btn {
        white-space: nowrap;
        cursor: pointer;
        background-color: white;
        padding: 5%;
        border-radius: 10px;
        font-size: 14px;
        color: $--app-color-word;
        font-weight: bold;
        border: 2px dotted white;
        &:hover {
          border: 2px dotted $--app-color-word;
          background: transparent;
        }
      }
      &-project {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 5%;
      }
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
  .container-copyright {
    padding-top: 2%;
    padding-left: 1%;
    font-size: 12px;
    font-weight: bolder;
    -webkit-writing-mode: vertical-rl;
    writing-mode: vertical-rl;
  }
  @media (max-width: 767.98px) {
    .container-main {
      width: 100%;
      margin: 0;
      &__hide {
        display: unset !important;
      }
      &__home-page {
        height: 100%;
        overflow: visible;
        border-radius: 0px;
        padding: 2rem;
      }
      &__logo {
        display: block;
        width: 30%;
        margin: 0 auto 10% auto;
        object-fit: contain;
        border: 2px #3b5263 solid;
        padding: 3%;
        border-radius: 5px;
        background-color: #3b5263;
      }
      &__taiwan {
        width: 100%;
        height: unset;
        display: block !important;
      }
      &__taiwan-map {
        display: none;
      }
      &__world {
        display: block !important;
      }
      &__world-panel {
        width: 100%;
        margin: unset;
        margin-bottom: 5%;
        flex-direction: column;
        margin-top: 5%;
        height: unset;
        &-control {
          display: none;
        }
        &-city {
          border-right: unset;
        }
        &-type {
          padding-bottom: 5%;
          button {
            width: 15vw;
            height: 15vw;
          }
        }
        &-input-area {
          width: 100%;
        }
        &--show {
          font-size: 45px;
        }
      }
      &__mobile-hide {
        display: none;
      }
      &__contact {
        display: flex !important;
        margin-top: 10%;
        padding-top: 10%;
        height: unset;
        border-top: 2px dotted $--app-color-word;
        &-logo {
          margin: 0 auto;
        }
      }
      &__chart {
        padding: 0;
        height: unset;
        &-btn {
          margin-bottom: 2%;
        }
        &-pie {
          margin-top: 10%;
          flex-wrap: wrap;
        }
      }
    }
    .container-copyright {
      display: none;
    }
  }
}
</style>
