<template>
  <div v-if="data && data.records?.[0]" class="page" :style="cssVars" :id="data.frameId" :class="data.frameClasses">
    <header>
      <p class="title color-base" v-html="data.name"></p>
      <p style="color: #A4D0A4;">{{ data.previousDateTime }} - {{ data.dateTime }}</p>
    </header>
    <main>
      <div class="table">
        <div class="head">
          <div class="head-item first">
            <span class="head-item-text">Currency</span>
          </div>
          <div class="head-item">
            <span class="head-item-text">Previous</span>
          </div>
          <div class="head-item">
            <span class="head-item-text">Diff</span>
          </div>
          <div class="head-item last color-base">
            <span class="head-item-text">Now</span>
          </div>
        </div>
        <div
          v-for="record in data.records"
          :key="record.id"
          class="row"
        >
          <div class="row-top" :style="{ color: record.COLOR }">
            {{ record.NAME }}
          </div>
          <div class="row-bottom">
            <div class="row-item currency">
              {{ record.CURRENCY }}
              <svg :class="record.ARROW_CLASS" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 20 34" version="1.1">
                <g style="transform: translate(2px, 1px) scale(1.5);">
                  <path
                    d="M4.973,4.175 L9.975,7.919 L9.975,3.979 L4.973,0.036 L0.004,4.078 L0.004,7.996 L0.016,8.007 L4.973,4.175 Z">
                  </path>
                  <path class="arrow-d-second"
                    d="M4.973,11.958 L9.975,15.909 L9.975,11.971 L4.973,8.005 L0.004,12.069 L0.004,15.987 L0.016,15.997 L4.973,11.958 Z">
                  </path>
                </g>
              </svg>
              {{ record.CURRENCY_BASE }}
            </div>
            <div class="row-item rate">
              <span class="currency-s">{{ record.PREVIOUS_VALUE_S }}</span><span class="currency-e">{{ record.PREVIOUS_VALUE_E }}</span>
            </div>
            <div class="row-item rate" :class="record.DIFF_STYLE">
              <span class="currency-s-diff">{{ record.DIFF_S }}</span><span class="currency-e-diff">{{ record.DIFF_E }}</span>
            </div>
            <div class="row-item rate last">
              <span class="currency-s currency-s-last">{{ record.LAST_VALUE_S }}</span><span class="currency-e">{{ record.LAST_VALUE_E
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <p class="copyright">Produced by Currency Notifications App</p>
    </main>
  </div>
  <H2 v-else>LOADING DATA</H2>
</template>

<script>
import { templateMixin } from './templateMixin.js';

export default {
  name: "SubscriptionsVideoV1",
  mixins: [templateMixin],
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

    if (this.lastCurrenciesProp) {
      this.lastCurrencies = this.lastCurrenciesProp;
    } else {
      await this.loadLastCurrencies();
    }
    
    await this.prepareData();
  },
  computed: {
    cssVars() {
      return {
        '--main-color': this.data.color
      }
    },
  }
};
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@300;600;900&display=swap');

.page {
  padding: 26px 46px 10px;
  margin: 0;
  font-weight: 700;
  width: 1080px;
  height: 1920px;
  box-sizing: border-box;
  background-color: white;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-family: 'Roboto Slab', serif;
}

.page header {
  text-align: center;
  font-size: 46px;
  margin-bottom: 28px;
}

.page header p {
  padding: 0;
  margin: 0;
}

.title {
  font-size: 64px;
  margin-bottom: 40px;
}

.table {
  margin: 0 15px;
}

.head {
  font-size: 48px;
  padding: 16px 0;
  display: grid;
  grid-auto-flow: row;
  grid-template-columns: 1fr 1fr 1fr 1fr;

  border-bottom: 1px solid var(--main-color);
  color: #643A6B;
}

.head-item {
  text-align: center;
  line-height: 44px;
  margin-left: 24px;
}

.head-item.last {
  text-align: end;
  padding-right: 44px;
}

.head-item.first {
  text-align: start;
  margin-left: 8px;
}

.head-item:last-child {
  border-right: none;
}

.head-item-text {
  display: inline-block;
  min-width: 60%;
}

.row {
  border-bottom: 1px solid var(--main-color);
}

.row-top {
  padding-top: 4px;
  margin-left: 8px;
  font-size: 38px;
}

.row-bottom {
  padding: 2px 0;
  display: grid;
  grid-auto-flow: row;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  font-size: 50px;
}

.row-item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.row-item.last {
  margin-right: 6px;
  justify-content: end;
}

.row-item.rate {
  font-size: 56px;
}

.row-item.currency {
  color: var(--main-color);
  font-weight: 900;
  margin-left: 6px
}

.diff-up {
  color: #1B9C85;
}

.diff-down {
  color: #B04759;
}

.currency-s {
  font-weight: 900;
  color: rgb(255, 186, 0);
}

.currency-e {
  color: #D8D8D8;
}

.currency-s-diff {
  color: #D8D8D8;
}

.currency-e-diff {
  font-weight: 900;
}

.currency-s-last {
  color: var(--main-color);
}

.arrow-left {
  height: 58px;
  margin: 0px 4px 0 16px;
  transform: rotate(-90deg);
  fill: #47A992;
  stroke: #47A992;
}

.arrow-right {
  height: 58px;
  margin: 2px 16px 0 4px;
  transform: rotate(90deg);
  fill: #A459D1;
  stroke: #A459D1;
}

.arrow-center {
  height: 58px;
  margin: 0px 8px 0 12px;
  transform: rotate(-90deg);
}

.arrow-center .arrow-d-second {
  transform: rotate(180deg) translate(-10px, -27px);
}

.bot-image {
  display: flex;
  justify-content: center;
}

.bot-image img {
  width: 100%;
}

.color-base {
  color: var(--main-color);
}

.copyright {
  text-align: center;
  margin: 0;
  font-size: 30px;
  font-weight: 400;
  margin-top: 10px;
}

.image-qr {
  display: flex;
  justify-content: center;
}

.image-qr img {
  width: 420px;
}
</style>
