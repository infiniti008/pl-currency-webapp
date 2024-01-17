<template>
<div :class="containerClasses">
  <component :is="templateName" v-if="templateName" :id="id" @setReady="setReady"/>
  <h1 v-else>Template not found</h1>
  <Tools />
</div>
</template>

<script>
import CONFIG from './models/config.js';
import VerticalBitcoinV1 from './components/render/VerticalBitcoinV1.vue';
import SubscriptionsStoriesV1 from './components/render/SubscriptionsStoriesV1.vue';
import AskDonateV1 from './components/render/AskDonateV1.vue';
import SubscriptionsUsersV1 from './components/render/SubscriptionsUsersV1.vue';
import SubscriptionsVideoV1 from './components/render/SubscriptionsVideoV1.vue';
import SubscriptionsVideoTitleV1 from './components/render/SubscriptionsVideoTitleV1.vue';
import Tools from './components/render/Tools.vue';

const { IS_DEV_MODE } = CONFIG;

export default {
  name: 'Rneder',

  components: {
    VerticalBitcoinV1,
    SubscriptionsStoriesV1,
    SubscriptionsUsersV1,
    SubscriptionsVideoV1,
    SubscriptionsVideoTitleV1,
    AskDonateV1,
    Tools
  },
  data() {
    return {
      containerClasses: {
        'container': true,
        'ready': false 
      },
      templateName: null,
      id: null
    }
  },
  created() {
    this.prepareData();
  },
  methods: {
    async prepareData() {
      const templateName = this.getTemplateName();
      const subscriptionID = this.getSubscribtioId();
      if (templateName) {
        this.setProps(templateName, subscriptionID);
      }
    },
    getTemplateName() {
      const hasTemplateName = window.location.search.indexOf('templateName=') !== -1;
      if (hasTemplateName) {
        const templateNameString = window.location.search.split('templateName=');
        const templateName = templateNameString[1].split('&')[0];
        return templateName;
      }
    },
    getSubscribtioId() {
      const hasSubscriptionID = window.location.search.indexOf('id=') !== -1;
      if (hasSubscriptionID) {
        const subscriptionIDString = window.location.search.split('id=');
        const subscriptionID = subscriptionIDString[1].split('&')[0];
        return subscriptionID;
      }
    },
    setProps(templateName, id) {
      this.id = id;
      this.templateName = templateName;
    },
    setReady() {
      this.$nextTick(() => {
        this.containerClasses.ready = true;
      });
    },
  },
  computed: {
    devModeClass() {
      return IS_DEV_MODE ? 'dev-mode' : '';
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
}
</style>

