import { toDateFormat, getTimestampToGetDiff, getTimeZone, prepareContentToRender } from "../../services/templateHelper";
import { getSubscriptionById, getRenderSettings, getLastCurrenciesForRender, getDiffCurrencies } from "../../services/api";

import { DateTime } from 'luxon';


export const templateMixin = {
  data: function () {
    return {
      data: null,
      renderSettings: null
    }
  },
  methods: {
    async loadData() {
      this.data = await getSubscriptionById(this.id);
      console.log('data', this.data);
    },
    async loadRenderSettings() {
      this.renderSettings = await getRenderSettings();
      console.log('renderSettings', this.renderSettings);
    },
    async loadLastCurrencies() {
      this.lastCurrencies = (await getLastCurrenciesForRender(this.data.country))?.lastCurrencies || [];
      console.log('lastCurrencies', this.lastCurrencies);
    },
    async getData() {
      await this.loadData();
      await this.loadRenderSettings();
      await this.loadLastCurrencies();
    },

    async prepareData() {
      const item = this.data;
      const time = item.times[0] || item.time;
      const targetTimeZone = getTimeZone(item.country);
      const timeString = `${time}:00`;
      const nowTimeInTargetZone = DateTime.fromFormat(timeString, 'HH:mm:ss', { zone: targetTimeZone });
      const now = nowTimeInTargetZone

      item.lastCurrencies = {};
      item.diffCurrencies = {};
      item.now = time;
      console.log('now', nowTimeInTargetZone.toFormat(toDateFormat));

      // -- Get Values to Diff
      const targetTimestampToGetDiff = getTimestampToGetDiff(item.timeToGetDiff, item.dayToGetDiff, now, targetTimeZone);
      item.targetTimestampToGetDiff = targetTimestampToGetDiff;

      const diffCurrencies = await getDiffCurrencies(item.country, item.keys, targetTimestampToGetDiff);

      item.keys = item.keys.filter(key => {
        return this.lastCurrencies.some(lastCurrency => lastCurrency.key === key);
      });

      item.keys.forEach(key => {
        // -- Add last values to subscription data
        item.lastCurrencies[key] = this.lastCurrencies.find(lastCurrencie => lastCurrencie.key === key);

        // -- Add Diff values to subscription data
        item.diffCurrencies[key] = diffCurrencies.find(diffCurrencie => diffCurrencie.key === key);
      });

      const content = prepareContentToRender(item, now, time);
      
      console.log('content', content);
      this.data = content;

      this.$nextTick(() => {
        this.setReady();
      });
    },
    setReady() {
      setTimeout(() => {
        this.$nextTick(() => {
          console.log("READY")
          this.$emit('setReady');
        });
      }, 100);
    }
  }
}
