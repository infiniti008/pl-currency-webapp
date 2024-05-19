<template>
  <div v-if="isReady" :class="videoWrapperClasses">
    <component 
      v-for="frame in this.data?.frames"
      :is="frame.template" 
      :key="frame.index"
      :dataProp="frame" 
      :renderSettingsProp="renderSettings"
      :lastCurrenciesProp="lastCurrencies"
      @setReady="setReady"
    />
  </div>
  <H2 v-else>LOADING DATA</H2>
</template>

<script>
import { templateMixin } from './templateMixin.js';
import SubscriptionsVideoTitleV1 from './SubscriptionsVideoTitleV1.vue';
import SubscriptionsVideoV1 from './SubscriptionsVideoV1.vue';
import IframeImageV1 from './IframeImageV1.vue';

export default {
  name: "SubscriptionsVideoGeneralV1",
  mixins: [templateMixin],
  components: {
    SubscriptionsVideoTitleV1,
    SubscriptionsVideoV1,
    IframeImageV1
  },
  data() {
    return {
      isReady: false,
      videoWrapperClasses: ['video-general-wrapper']
    }
  },
  props: {
    id: {
      type: String,
      required: true
    },
  },
  async created() {
    const body = document.querySelector('body');
    body.classList.add('render-subscriptions-video');

    await this.getData();

    this.prepareToAnimation();

    body.style.width = `${this.data.width}px`;
    body.style.height = `${this.data.height}px`;
    
    this.isReady = true;
  },
  watch: {
    isAllFramesReady(value) {
      if (value) {
        this.$nextTick(() => {
          this.runAnimation();
        });
      }
    }
  },
  methods: {
    prepareToAnimation() {
      this.data.frames.forEach((frame, ind) => {
        const frameId = this.generateId(frame.index);
        this.$set(frame, 'isReady', false);
        this.$set(frame, 'frameId', frameId);
        this.$set(frame, 'frameClasses', {
          'animate-ready': false,
          'animate-active': ind === 0 ? true : false
        });
      });
    },
    generateId(index) {
      return `frame-${this.id}-${index}`;
    },
    setReady(frameId) {
      const frame = this.data.frames.find(frame => frame.frameId === frameId);

      frame.isReady = true;
      frame.frameClasses = {
        'animate-ready': true
      };
    },
    runAnimation() {
      console.log('START Animation');
      setTimeout(() => {
        this.videoWrapperClasses.push('show');
        this.animateFrame(0);
      }, 1000);
    },
    stopAnimation() {
      console.log('STOP Animation');
      this.videoWrapperClasses.push('finished');
    },
    animateFrame(index) {
      const frame = this.data.frames[index];
      frame.frameClasses = {
        'animate-ready': true,
        'animate-active': true
      };
      setTimeout(() => {
        if (index < this.data.frames.length - 1) {
          frame.frameClasses = {
          'animate-ready': true,
          'animate-active': false
        };
          this.animateFrame(index + 1);
        } else {
          this.stopAnimation();
        }
      }, frame.duration);
    }
  },
  computed: {
    isAllFramesReady() {
      return this.data?.frames.every(frame => frame.isReady);
    }
  }
};
</script>

<style lang="scss">
.animate-ready {
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  position: absolute !important;
  top: 0;
}
.animate-active {
  opacity: 1;
}
</style>

<style lang="scss" scoped>
.video-general-wrapper {
  height: 100%;
}
</style>
