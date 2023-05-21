<template>
  <div class="app">
    <component :is="tabName" @handleToggleTab="handleToggleTab" />

    <Footer @handleToggleTab="handleToggleTab" :tab="tabName" />
    <Spinner v-if="isLoading" />
    <Modal /> 
  </div>
</template>

<script>
import PageHello from './components/PageHello.vue';
import PageMenu from './components/PageMenu.vue';
import PageLastValues from './components/PageLastValues.vue';
import PageService from './components/PageService.vue';
import Footer from './components/Footer.vue';
import Spinner from './components/ui/Spinner.vue';
import Modal from './components/ui/Modal.vue';

export default {
   name: 'App',

  components: {
    PageHello,
    PageLastValues,
    PageMenu,
    PageService,
    Footer,
    Spinner,
    Modal,
  },
  data() {
    return {
      tabName: 'PageLastValues',
      isLoading: false,
      isExpanded: window.Telegram?.WebApp?.isExpanded,
      isExpandedInterval: null
    }
  },
  created() {
    this.$bus.$on('toggleLoading', this.toggleLoading);
  },
  beforeDestroy() {
    this.$bus.$off('toggleLoading');
  },
  computed: {},
  methods: {
    handleToggleTab(tab) {
      this.tabName = tab;
    },
    toggleLoading(isLoading) {
      this.isLoading = isLoading;
    },
  }
}
</script>

<style lang="scss">
.app {
  max-width: 380px;
  margin: 0 auto;
}
</style>
