<script>
export default {
  data() {
    return {
      menu: [
        { path: '/', name: '目前天氣' },
        { path: '/weather-forecast', name: '氣象預測' },
        { path: '/contact', name: '聯繫我們' }
      ],
      activePage: ''
    }
  },
  mounted() {
    this.activePage = this.$route.path
  },
  watch: {
    '$route.path'(value) {
      this.activePage = value
    }
  }
}
</script>

<template>
  <nav class="desktop-nav">
    <img class="desktop-nav__logo" src="@/assets/jw_logo_white.png" />
    <div>
      <div
        :class="['desktop-nav__item', { active: activePage === item.path }]"
        v-for="(item, index) in menu"
        :key="`menu_${index}`"
      >
        <RouterLink :to="item.path">{{ item.name }}</RouterLink>
        <div v-show="index + 1 !== menu.length" class="desktop-nav__line" />
      </div>
    </div>
  </nav>
</template>

<style lang="scss">
.desktop-nav {
  position: absolute;
  bottom: 20px;
  left: 2%;
  height: 80vh;
  top: 0vh;
  width: 10%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;

  &__logo {
    width: 70%;
    object-fit: contain;
    border: 2px $--app-color-word solid;
    padding: 3%;
    border-radius: 5px;
    background-color: $--app-color-word;
  }
  &__line {
    height: 50px;
    width: 1.5px;
    background-color: $--app-color-word;
  }
  &__item {
    transition-delay: 0.3s;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px;
    &::before {
      height: 10px;
      width: 10px;
      content: '';
      left: -15px;
      top: 1px;
      position: absolute;
      border-radius: 50%;
      border: 2px $--app-color-word solid;
    }
    a {
      font-weight: bolder;
      -webkit-writing-mode: vertical-lr;
      writing-mode: vertical-lr;
      letter-spacing: 0.6vh;
    }
  }
  &__item.active {
    &::before {
      background-color: $--app-color-brown;
      border: 2px $--app-color-brown solid;
    }
    a {
      color: $--app-color-primary;
    }
  }
}
@media (max-width: 767.98px) {
  .desktop-nav {
    display: none;
  }
}
</style>