<template>
  <div class="subscription-page">
    <div class="item">
      <label for="countrySelect">
        Country:
      </label>
      <select class="item__select" id="countrySelect" v-model="selectedCountry">
        <option disabled value="0">Select</option>
        <option v-for="country in countries" :value="country" v-html="countryFlags[country] + ' ' + country" />
      </select>
    </div>
    <div class="item item--column">
      <label for="keySelect">
        Keys:
      </label>
      <select class="item__select" id="keySelect" v-model="selectedKey" :disabled="isKeysDisabled">
        <option disabled value="0">Select Item to Add</option>
        <option v-for="key in keysFilteredBySelectedItems" :key="key.key" :value="key.key">{{ getKeyName(key.key) }}</option>
      </select>
      <template v-if="addedKeys.length > 0">
        <label class="keys__lable">Keys to Subscribe:
          <br>
          <span class="tips">
            <dt>&#9989; - 4 Items Limit</dt>
            <dt>&#128303; - Unlimited</dt>
          </span>
        </label>
        <div class="item__list">
          <div class="list__item" v-for="addedKey in addedKeys" :key="addedKey">
            <span class="list__item--key" :class="isKeyDeprecated(addedKey) ? 'list__item--deprecated' : ''">
              {{ getKeyName(addedKey) }}
            </span>
            <span class="list__item--icon" @click="handleRemoveKey(addedKey)">
              <CancelSVG />
            </span>
          </div>
        </div>
      </template>
    </div>
    <div class="item">
      <label for="intervalSelect">
        Interval:
      </label>
      <select class="item__select" id="intervalSelect" v-model="selectedInterval" :disabled="!isKeysSelected">
        <option disabled value="0">Select</option>
        <option v-for="interval in intervals" :value="interval.key" :disabled="isIntervalDisabled(interval.isPremium)">
          <span v-html="interval.isPremium ? '&#128303;' : '&#9989;'" />
          {{ interval.name }}
        </option>
      </select>
    </div>
    <div class="item">
      <label>
        Start Time:
      </label>
      <span class="time">{{ selectedTime }}</span>
      <label for="hourSelect">
        Hour:
      </label>
      <select id="hourSelect" class="item__select" v-model="selectedHour" :disabled="isTimeDisabled">
        <option v-for="hour in hoursIntervals" :value="hour">{{ hour }}</option>
      </select>
      <label for="minuteSelect">
        Minute:
      </label>
      <select id="minuteSelect" class="item__select" v-model="selectedMinute" :disabled="isTimeDisabled">
        <option v-for="minute in mintutesIntervals" :value="minute">{{ minute }}</option>
      </select>
    </div>
    <div class="item" v-if="hasChangesToSave">
      <span class="time" v-for="time in getCalculatedTimes()" :key="time">{{ time }}</span>
    </div>
  </div>
</template>

<script>
import { getSubscriptionSettings, setSubscription, putSubscription } from '../services/api.js';
import config from '../models/config.js';
import buttontsService from '../services/buttons.js';
import CancelSVG from './ui/svg/CancelSVG.vue';
import StarSVG from './ui/svg/StarSVG.vue';

const { initButtons, updateButtonsByKey } = buttontsService;

export default {
  name: "PageManageSubscription",
  components: {
    CancelSVG,
    StarSVG
},
  data: () => {
    return {
      countryCurrencies: {
        BYN: 'by',
        PLN: 'pl',
        pl: 'PLN',
        by: 'BYN'
      },
      keys: [],
      selectedCountry: null,
      selectedKey: null,
      selectedInterval: null,
      selectedHour: null,
      selectedMinute: null,
      addedKeys: []
    };
  },
  created() {
    this.$bus.$on('saveSubscriptionChanges', this.saveSubscriptionChanges);
    this.$bus.$on('clearSubscriptionChanges', this.clearSubscriptionChanges);

    initButtons('PageManageSubscription', this.$store);
  },
  beforeDestroy() {
    this.$bus.$off('saveSubscriptionChanges');
    this.$bus.$off('clearSubscriptionChanges');

    this.$store.commit('setCurentSubscriptionToManage', null);
  },
  mounted() {
    this.resetChanges();
    this.getSubscriptionSettings();
  },
  watch: {
    selectedKey(newValue) {
      if (newValue && newValue !== '0') {
        this.addedKeys.push(newValue);
        this.selectedKey = '0'
      }
    },
    selectedCountry() {
      this.addedKeys = [];
    },
    hasChangesToSave(newValue) {
      updateButtonsByKey('PageManageSubscription', this.$store, 'hasChangesToSave', !newValue);
    }
  },
  computed: {
    keysFiltredByCountry() {
      const countryCurrency = this.countryCurrencies[this.selectedCountry];
      return this.keys.filter(key => key.currencyBase === countryCurrency);
    },
    keysFilteredBySelectedItems() {
      if (!this.$store.state.config.isPremium && this.addedKeys.length >= this.$store.state.config.limitFreeKeysInOneSubscription) {
        return [];
      }
      return this.keysFiltredByCountry.filter(item => !this.addedKeys.includes(item.key));
    },
    isCountrySelected() {
      return this.selectedCountry && this.selectedCountry !== '0';
    },
    isKeysDisabled() {
      return !this.isCountrySelected || this.keysFilteredBySelectedItems.length === 0;
    },
    isKeysSelected() {
      return this.addedKeys.length > 0;
    },
    isIntervalSelected() {
      return this.isKeysSelected && this.selectedInterval && this.selectedInterval !== '0';
    },
    isTimeDisabled() {
      return !this.isIntervalSelected;
    },
    isTimeSelected() {
      return this.selectedHour && this.selectedMinute;
    },
    hasChangesToSave() {
      return this.isCountrySelected && this.isKeysSelected && this.isIntervalSelected && this.isTimeSelected;
    },
    hoursIntervals() {
      const intervals = [];
      for (let hour = 0; hour < 24; hour++){
        intervals.push(hour < 10 ? '0' + hour : hour.toString());
      }
      return intervals;
    },
    mintutesIntervals() {
      const intervals = [];
      for (let minute = 0; minute < 60; minute+=10){
        intervals.push(minute < 10 ? '0' + minute : minute.toString());
      }
      return intervals;
    },
    selectedTime() {
      return `${this.selectedHour}:${this.selectedMinute}`
    },
    selectedSubscriptionToManage() {
      return this.$store.state.curentSubscriptionToManage;
    },
    countries() {
      return this.$store.state.config.countries;
    },
    countryFlags() {
      return this.$store.state.config.countryFlags;
    },
    intervals() {
      return this.$store.state.config.intervals;
    }
  },
  methods: {
    async saveSubscriptionChanges() {
      if (this.hasChangesToSave) {
        const request = {
          country: this.selectedCountry,
          keys: this.addedKeys,
          interval: this.selectedInterval,
          time: this.selectedTime,
          userId: config.TELEGRAM_USER,
          times: this.getCalculatedTimes()
        };

        try {
          this.isLoading = true;
          this.$bus.$emit('toggleLoading', true);
          const subscriptionId = this.selectedSubscriptionToManage?._id || false;
          let response = {};

          if (subscriptionId) {
            response = await putSubscription(request, subscriptionId);
          } else {
            response = await setSubscription(request);
          }

          if (response.status) {
            this.$emit('handleToggleTab', 'PageSubscriptions');
          } else {
            console.log('ERROR')
          }
        } catch(err) {
          console.log(err);
        } finally {
          this.$bus.$emit('toggleLoading', false);
          this.isLoading = false;
        }
      }
    },
    clearSubscriptionChanges() {
      if (this.hasChangesToSave) {
        this.resetChanges();
      }
    },
    resetChanges() {
      if (this.selectedSubscriptionToManage) {
        this.selectedCountry = this.selectedSubscriptionToManage.country, 
        this.selectedKey = '0',
        this.$nextTick(() => {
          this.selectedInterval = this.selectedSubscriptionToManage.interval,
          this.selectedHour = this.selectedSubscriptionToManage.time?.split(':')?.[0],
          this.selectedMinute = this.selectedSubscriptionToManage.time?.split(':')?.[1],
          this.addedKeys = this.selectedSubscriptionToManage.keys;
        });
        
        return;
      }

      this.selectedCountry = '0', 
      this.selectedKey = '0',
      this.selectedInterval = '0',
      this.selectedHour = '08',
      this.selectedMinute = '00',
      this.addedKeys = [];
    },
    async getSubscriptionSettings() {
      try {
        this.isLoading = true;
        this.$bus.$emit('toggleLoading', true);

        const response = await getSubscriptionSettings();

        this.keys = response.keys;
      } catch(err) {
        console.log(err);
      } finally {
        this.$bus.$emit('toggleLoading', false);
        this.isLoading = false;
      }
    },
    getKeyName(addedKey) {
      const key = this.keys.find(key => key.key === addedKey);
      if (key) {
        return `${key.currency} | ${key.name}`;
      }
      return addedKey;
    },
    isKeyDeprecated(addedKey) {
      return !this.keys.find(key => key.key === addedKey);
    },
    handleRemoveKey(keyToRemove) {
      this.addedKeys = this.addedKeys.filter(key => key !== keyToRemove);
    },
    getCalculatedTimes() {
      const times = [];
      const hour = parseInt(this.selectedHour);
      let start = 0;
      let interval = 4;
      switch (this.selectedInterval) {
        case 'every-1-hours':
          interval = 1;
          start = hour % interval;
          
          break;

        case 'every-2-hours':
          interval = 2;
          start = hour % interval;
          
          break;
        case 'every-3-hours':
          interval = 3;
          start = hour % interval;
          
          break;
        case 'every-4-hours':
          interval = 4;
          start = hour % interval;
          
          break;
        case 'every-6-hours':
          interval = 6;
          start = hour % interval;
          
          break;
        case 'every-12-hours':
          interval = 12;
          start = hour % interval;
          
          break;
        case 'every-24-hours':
          interval = 24;
          start = hour;
          break;
      }

      for (let index = start; index < 24; index += interval) {
        const cHour = index < 10 ? '0' + index : index.toString();
        times.push(cHour + ':' + this.selectedMinute);
      }
      return times;
    },
    isIntervalDisabled(isPremiumInterval) {
      return isPremiumInterval && !this.$store.state.config.isPremium;
    }
  }
};
</script>

<style lang="scss">
.subscription-page {
  padding: 10px;
  height: calc(100vh - 70px);
  overflow-y: auto;

  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
    border-bottom: 1px solid black;
    flex-wrap: wrap;

    & label {
      font-weight: 600;
      color: #FF8551;

      &.keys__lable {
        width: 100%;
      }

      .tips {
        display: flex;
        justify-content: space-between;
      }
    }

    &__select {
      height: 30px;
      text-align: center;
      max-width: 290px;
      width: auto;
      text-transform: uppercase;
    }

    &__list {
      width: 100%;
      color: #22A699;

      .list__item {
        display: flex;
        justify-content: space-between;
        width: 100%;
        align-items: center;
        padding: 4px 0px;

        &--icon {
          width: 24px;
        }

        &--deprecated {
          text-decoration: line-through;
        }
      }
    }

    .time {
      color: #22A699;
    } 

    &--column {
      flex-direction: column;
      gap: 6px;
      align-items: flex-start;

      & .item__select {
        max-width: 100%;
        width: 100%;
      }
    }
  }
}
</style>