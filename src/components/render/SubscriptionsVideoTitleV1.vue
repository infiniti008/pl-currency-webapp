<template>
  <div v-if="data" class="page" :style="pageStyles" :id="data.frameId" :class="data.frameClasses">
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
      required: false
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
  async created() {
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

    this.$nextTick(() => {
      this.$emit('setReady', this.data.frameId);
    });
  },
  computed: {
    pageStyles() {
      const titleFileName = this.renderSettings?.[this.data.titleImagePathVariable] || this.data.backgroundImagePath;
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

<style lang="scss" scoped>
@import url('https://fonts.cdnfonts.com/css/lumberjack');

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
  font-family: 'Lumberjack', sans-serif;
}
</style>
