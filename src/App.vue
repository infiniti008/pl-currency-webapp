<template>
  <div class="app" :class="isExpanded ? 'app--expanded' : ''">
    <div class="swipe-message" :class="!isExpanded ? 'swipe-message--expanded' : ''">
      <span class="swipe-message__arrow">
        &#9650;
      </span>
      <span>Please swipe UP to see navigation menu</span>
      <span class="swipe-message__arrow">
        &#9650;
      </span>
      <hr>
    </div>
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
import PageContact from './components/PageContact.vue';
import PageSubscriptions from './components/PageSubscriptions.vue';
import PageManageSubscription from './components/PageManageSubscription.vue';
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
    PageContact,
    PageSubscriptions,
    PageManageSubscription,
    Footer,
    Spinner,
    Modal,
  },
  data() {
    return {
      tabName: 'PageHello',
      isLoading: false,
      previosTab: ''
    }
  },
  created() {
    this.$bus.$on('toggleLoading', this.toggleLoading);
    this.$bus.$on('handleReturnBack', this.handleReturnBack);

    this.$store.commit('startObserveExpanded');
  },
  beforeDestroy() {
    this.$bus.$off('toggleLoading');
    this.$bus.$off('handleReturnBack');
  },
  computed: {
    isExpanded() {
      return this.$store.state.isExpanded;
    }
  },
  methods: {
    handleToggleTab(tab) {
      this.$store.commit('setFirstNavButton', {
        component: '',
        isDisabled: true,
        action: ''
      });

      this.$store.commit('setSecondNavButton', {
        component: '',
        isDisabled: true,
        action: ''
      });

      if (tab !== 'PageMenu' ) {
        this.$store.commit('setThirdNavButton', {
          component: '',
          isDisabled: true,
          action: ''
        });
      }

      if (this.tabName !== 'PageMenu') {
        this.previosTab = this.tabName;
      }

      this.tabName = tab;
    },
    toggleLoading(isLoading) {
      this.isLoading = isLoading;
    },
    handleReturnBack() {
      if (this.previosTab) {
        this.handleToggleTab(this.previosTab);
      }
    }
  }
}
</script>

<style lang="scss">
.app {
  max-width: 380px;
  margin: 0 auto;
  height: calc(100vh - 90px);
  margin-bottom: 70px;
  transition: height ease-out 0.3s;

  &--expanded {
    height: calc(100vh - 70px);
  }

  .swipe-message {
    transition: height ease-out 0.3s;
    text-align: center;
    height: 0px;
    opacity: 0;
    color: #F79327;
    font-weight: 600;

    &--expanded {
      height: 20px;
      opacity: 1;
    }

    &__arrow {
      transition: opacity linear 0.6s;
      animation: arrorAnimation 5s infinite;
    }
  }

  @keyframes arrorAnimation {
    0%   {color:#F79327; opacity: 1;}
    25%  {color:#068DA9; opacity: 0;}
    50%  {color:#068DA9; opacity: 1;}
    75%  {color:#F79327; opacity: 0;}
    100% {color:#F79327; opacity: 1;}
  }
}
</style>
