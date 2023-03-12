<script>
import Navigation from '../components/Navigation.vue'
import CountyShowBox from '../components/CountyShowBox.vue'
import CountryMap from '../components/CountryMap.vue'

export default {
  components: {
    CountryMap,
    Navigation,
    CountyShowBox
  },
  data() {
    return {
      activeIndex: 0,
      county: 'taipei_city'
    }
  },
  methods: {
    updateCounty(name) {
      this.county = name
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
          <div class="container-main__home-county">
            <!-- <img class="container-main__logo" src="@/assets/jw_logo_white.png" /> -->
            <CountryMap :selectedCounty="county" @changeCounty="updateCounty" />
            <CountyShowBox :selectedCounty="county" />
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
    }
    &__home-county {
      background-image: linear-gradient(to bottom, #e5dcd2, #cfbda5);
      height: 80vh;
      border-radius: 40px;
      margin: 0 auto;
      display: flex;
      justify-content: center;
    }
    &__logo {
      position: absolute;
      left: 5%;
      top: 5%;
      width: 150px;
      object-fit: contain;
    }
    .county-box {
      margin-top: 20vh;
    }
  }
}
// .home-page__county {
//   border: 1px red solid;
// }
</style>
