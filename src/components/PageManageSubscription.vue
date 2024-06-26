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
            <dt>&#9989; - {{ keysLimit }} Items Limit</dt>
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
      <label for="subscriptionName">
        Subscription Name (30 symbols max):
      </label>
      <input v-model="selectedName" class="item__input" type="text" id="subscriptionName" :disabled="isTimeDisabled" maxlength="30">
    </div>
    <div class="item">
      <label>
        Time to Run:
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
    <div class="item">
      <label for="selectedTimeToGetDiff">
        Time to get Diff:
      </label>
      <span class="time">{{ selectedTimeToGetDiff }}</span>
      <input v-model="selectedTimeToGetDiff" type="time" id="selectedTimeToGetDiff">
    </div>
    <div class="item">
      <label for="color">
        Color:
      </label>
      <input v-model="selectedColor" class="item__input" type="text" id="color" maxlength="10">
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
      isAdmin: config.ADMIN_USER === config.TELEGRAM_USER,
      countryCurrencies: {
        BYN: 'by',
        PLN: 'pl',
        RUB: 'by',
        pl: ['PLN'],
        by: ['BYN', 'RUB']
      },
      keys: [],
      selectedCountry: null,
      selectedKey: null,
      selectedHour: null,
      selectedMinute: null,
      selectedName: '',
      selectedPlatform: 'subscriptions-users',
      selectedColor: null,
      selectedTimeToGetDiff: null,
      addedKeys: [],
      chanels: {
        'subscriptions-telegram': [
          '@by_currency_notifications',
          '@pl_currency_notifications'
        ],
        'subscriptions-video': [
          'all'
        ]
      }
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
    },
  },
  computed: {
    keysFiltredByCountry() {
      const currenciesFromCountry = this.countryCurrencies[this.selectedCountry];
      return this.keys.filter(key => currenciesFromCountry?.includes(key.currencyBase));
    },
    keysFilteredBySelectedItems() {
      if (this.addedKeys.length >= this.keysLimit) {
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
      return this.isKeysSelected;
    },
    isTimeDisabled() {
      return !this.isIntervalSelected;
    },
    isTimeSelected() {
      return this.selectedHour && this.selectedMinute;
    },
    hasChangesToSave() {
      return this.isCountrySelected && this.isKeysSelected && this.isTimeSelected;
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
    keysLimit() {
      return this.$store.state.config.limitFreeKeysInOneSubscription;
    },
  },
  methods: {
    async saveSubscriptionChanges() {
      if (this.hasChangesToSave) {
        const request = {
          country: this.selectedCountry,
          keys: this.addedKeys,
          time: this.selectedTime,
          userId: config.TELEGRAM_USER,
          name: this.selectedName,
          platform: this.selectedPlatform
        };

        request.color = this.selectedColor;
        request.chanel = this.selectedChanel;
        request.timeToGetDiff = this.selectedTimeToGetDiff;

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
            this.$toast.success(response.message, {
              duration: 5000,
              position: 'bottom'
            });
          } else {
            console.log('ERROR');
            this.$toast.error(response.message, {
              duration: 5000,
              position: 'bottom'
            });
          }
        } catch(err) {
          console.log(err);
          this.$toast.error(err.message, {
            duration: 5000,
            position: 'bottom'
          });
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
          this.selectedHour = this.selectedSubscriptionToManage.time?.split(':')?.[0],
          this.selectedMinute = this.selectedSubscriptionToManage.time?.split(':')?.[1],
          this.addedKeys = this.selectedSubscriptionToManage.keys;
          this.selectedName = this.selectedSubscriptionToManage.name;
        });
        
        return;
      }

      this.selectedCountry = '0', 
      this.selectedKey = '0',
      this.selectedHour = '08',
      this.selectedMinute = '00',
      this.addedKeys = [];
      this.selectedName = '';
      this.selectedPlatform = 'subscriptions-users';
      this.selectedChanel = null;
      this.selectedColor = '';
      this.selectedTimeToGetDiff = null;
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
      font-size: 12px;

      .list__item {
        display: flex;
        justify-content: space-between;
        width: 100%;
        align-items: center;
        padding: 1px 0px;

        &--icon {
          width: 24px;
        }

        &--deprecated {
          text-decoration: line-through;
        }
      }
    }

    &__input {
      width: 100%;
      padding: 6px 6px;
      font-size: 16px;
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