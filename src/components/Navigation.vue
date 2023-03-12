<script>
export default {
  props: {
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      menu: [
        { path: '/', name: '地圖首頁' },
        { path: '/weather-detail', name: '天氣圖表' },
        { path: '/contact', name: '聯繫我們' }
      ]
    }
  }
}
</script>

<template>
  <nav class="desktop-nav">
    <img class="desktop-nav__logo" src="@/assets/jw_logo_black.png" />
    <div>
      <div
        :class="['desktop-nav__item', { active: activeIndex === index }]"
        v-for="(item, index) in menu"
        :key="`menu_${index}`"
      >
        <RouterLink to="/">{{ item.name }}</RouterLink>
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
    width: 100%;
    object-fit: contain;
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
      letter-spacing: 1vh;
    }
  }
  &__item.active {
    &::before {
      background-color: $--app-color-primary;
      border: 2px $--app-color-primary solid;
    }
    a {
      color: $--app-color-primary;
    }
  }
}
</style>