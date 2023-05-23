<template>
  <div class="app" :class="isExpanded ? 'app--expanded' : ''">
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
import PageSettings from './components/PageSettings.vue';
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
    PageSettings,
    Footer,
    Spinner,
    Modal,
  },
  data() {
    return {
      tabName: 'PageLastValues',
      isLoading: false,
    }
  },
  created() {
    this.$bus.$on('toggleLoading', this.toggleLoading);
    this.$store.commit('startObserveExpanded');
  },
  beforeDestroy() {
    this.$bus.$off('toggleLoading');
  },
  computed: {
    isExpanded() {
      return this.$store.state.isExpanded;
    }
  },
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
  height: auto;
  margin-top: 70px;

  &--expanded {
    height: calc(100vh - 70px);
    margin-bottom: 70px;
    margin-top: unset;
  }
}
</style>
