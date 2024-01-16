<template>
  <div v-if="data" class="page" :style="pageStyles">
    <div class="date-container">{{ titleDate }}</div>
  </div>
  <H2 v-else>LOADING DATA</H2>
</template>

<script>
import { templateMixin } from './templateMixin.js';
import CardV1 from './ui/CardV1.vue';
import CONFIG from '../../models/config.js';
import { DateTime } from 'luxon';
import { getTimeZone } from '../../services/templateHelper';


const { SERVER_URL } = CONFIG;

export default {
  name: "SubscriptionsVideoTitleV1",
  mixins: [templateMixin],
  components: {
    CardV1
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  async created() {
    const body = document.querySelector('body');
    body.classList.add('render');
    body.classList.add('render-subscriptions-video-title');
    await this.loadData();
    await this.loadRenderSettings();
  },
  computed: {
    pageStyles() {
      const titleFileName = this.renderSettings?.[this.data.titleImagePathVariable] || '';
      const titleImageTemplatePath = SERVER_URL + '/files' + titleFileName;
      if (titleFileName) {
        return {
          'background-image': `url(${titleImageTemplatePath})`
        }
      }

      return {};
    },
    titleDate() {
      const targetTimeZone = getTimeZone(this.data.country);
      const date = DateTime.fromJSDate(new Date(), { zone: targetTimeZone });
      return date.toFormat('dd.MM.yyyy HH:mm');
    }
  }
};
</script>

<style lang="scss">
@import url('https://fonts.cdnfonts.com/css/lumberjack');

body.render-subscriptions-video-title {
  width: 1080px;
  height: 1920px;
  padding: 0;
  margin: 0;
  font-family: 'Lumberjack', sans-serif;
}

.page {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
}

.date-container {
  background-color: #FF6565;
  color: #004AAD;
  font-size: 86px;
  width: 810px;
  height: 135px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 52px;
  transform: rotate(-90deg);
  position: relative;
  top: 892px;
  left: 567px;
}
</style>
