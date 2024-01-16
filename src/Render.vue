<template>
<div :class="containerClasses">
  <component :is="templateName" v-if="templateName" :id="id" @setReady="setReady"/>
  <h1 v-else>Template not found</h1>
</div>
</template>

<script>
import CONFIG from './models/config.js';
import VerticalBitcoinV1 from './components/render/VerticalBitcoinV1.vue';
import SubscriptionsStoriesV1 from './components/render/SubscriptionsStoriesV1.vue';
import AskDonateV1 from './components/render/AskDonateV1.vue';
import SubscriptionsUsersV1 from './components/render/SubscriptionsUsersV1.vue';
import SubscriptionsVideoV1 from './components/render/SubscriptionsVideoV1.vue';

const { IS_DEV_MODE } = CONFIG;

export default {
  name: 'Rneder',

  components: {
    VerticalBitcoinV1,
    SubscriptionsStoriesV1,
    SubscriptionsUsersV1,
    SubscriptionsVideoV1,
    AskDonateV1
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
    this.setDevelopmentMode();
    this.prepareData();
  },
  methods: {
    setDevelopmentMode() {
      if (IS_DEV_MODE) {
        this.$nextTick(() => {
          const html = document.querySelector('html');
          html.style.width = '100%';
          html.style.height = '100%';

          const body = document.querySelector('body');
          body.style.transform = 'scale(0.47)';
          body.style.position = 'absolute';
          body.style.top = '-53%';
        });
      }
    },
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

