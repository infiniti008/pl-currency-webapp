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
    },
    dataProp: {
      type: Object,
      required: false,
      default: null
    },
    renderSettingsProp: {
      type: Object,
      required: false,
      default: null
    },
    lastCurrenciesProp: {
      type: Array,
      required: false,
      default: null
    }
  },
  async mounted() {
    const body = document.querySelector('body');
    body.classList.add('render-iframes');
    
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
  beforeDestroy() {
    const body = document.querySelector('body');
    body.classList.remove('render-iframes');
    body.style.width = 'auto';
    body.style.height = 'auto';
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
body.render-iframes {
  width: 100%;
  height: 100vh;
  padding: 0;
}
</style>
<style lang="scss" scoped>
.IframeImageV1 {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}
</style>
