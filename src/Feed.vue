<template>
<div class="container">
  <Left
    @setFilterByPlatform="setFilterByPlatform"
  />
  <Main
    :filterByPlatform="filterByPlatform"
  />
</div>
</template>

<script>
import Left from './components/feed/Left.vue';
import Main from './components/feed/Main.vue';

export default {
  name: 'Feed',

  components: {
    Left,
    Main
  },
  data() {
    return {
      filterByPlatform: []
    }
  },
  methods: {
    setFilterByPlatform(value) {
      this.filterByPlatform = value;
    }
  },
  computed: {

  }
}
</script>
<style lang="scss">
.container {
  height: 100vh;
  display: grid;
  grid-template-columns: 2fr 5fr;
  position: relative;
  overflow: hidden;
}
</style>

