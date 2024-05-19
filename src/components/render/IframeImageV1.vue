<template>
  <div class="IframeImageV1">
    <iframe v-if="data" :src="url" frameborder="0" width="100%" height="100%" @load="handleLoadIframe"></iframe>
      
    <H2 v-else>LOADING DATA</H2>
  </div>
</template>

<script>
import { templateMixin } from './templateMixin.js';

export default {
  name: "IframeImageV1",
  mixins: [templateMixin],
  props: {
    id: {
      type: String,
      required: true
    }
  },
  async created() {
    const body = document.querySelector('body');
    body.classList.add('render-subscriptions-users');
    
    if (this.dataProp) {
      this.data = this.dataProp;
    } else {
      await this.loadData();
    }

    if (this.renderSettingsProp) {
      this.renderSettings = this.renderSettingsProp;
    } else {
      await this.loadRenderSettings();
    }

    body.style.width = this.data?.imageWidth;
    body.style.height = this.data?.imageHeight;

    this.setReady();
  },
  computed: {
    url() {
      return this.data.url;
    },
  },
  methods: {
    handleLoadIframe() {
      console.log('Iframe loaded');
    }
  }
};
</script>

<style lang="scss">
body.render-subscriptions-users {
  width: 100%;
  height: 100vh;
  padding: 0;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
} 

.IframeImageV1 {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}
</style>
