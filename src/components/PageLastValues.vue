<template>
  <div class="last-values">
    <div v-if="isRecordsVisible" class="currency-records">
      <div v-for="record in filteredRecords" class="currency-records--row" :style="{color: record.bankColor}" @click="handleToggleFavorite(record)">
        <div class="record-item record-item__time" :class="timeClasses(record.timestamp)">
          <span>{{ record.date.split(',')[0] }}</span>
          <span>{{ record.date.split(',')[1] }}</span>
        </div>
        <CurrencyConverter 
          :currency="record.currency"
          :value="toFloat(record.value)"
          :operation="record.operation"
          :bank="record.bank"
          :base-currency="record.currencyBase"
        />
        <StarSVG class="record-item__favorite" :class="!isFavorite(record) ? 'record-item__favorite--disabled' : ''" />
      </div>
    </div>
    <div v-else-if="filteredRecords.length == 0" class="last-values--empty">
      No items to display
    </div>
  </div>
</template>

<script>
import { getLastCurrencies, saveFavorites } from '../services/api.js';
import config from '../models/config.js';

import CurrencyConverter from './ui/CurrencyConverter.vue';
import StarSVG from './ui/svg/StarSVG.vue';

export default {
  name: "PageLastValues",
  components: {
    CurrencyConverter,
    StarSVG
},
  data: () => {
    return {
      records: [],
      isLoading: false,
      isFavoriteOnly: false,
      cachedRecords: []
    };
  },
  mounted() {
    this.getLastCurrencies();
  },
  created() {
    this.$bus.$on('toggleShowFavoriteOnly', this.toggleShowFavoriteOnly);

    this.$bus.$on('saveFavorites', this.saveFavorites);
    this.$bus.$on('resetFavorites', this.resetFavorites);

    this.$store.commit('setFirstNavButton', {
      component: 'CancelSVG',
      isDisabled: true,
      action: 'resetFavorites'
    });

    this.$store.commit('setSecondNavButton', {
      component: 'ConfirmSVG',
      isDisabled: true,
      action: 'saveFavorites'
    });

    this.$store.commit('setThirdNavButton', {
      component: 'StarSVG',
      isDisabled: true,
      action: 'toggleShowFavoriteOnly'
    });
  },
  beforeDestroy() {
    this.$bus.$off('toggleShowFavoriteOnly');

    this.$bus.$off('saveFavorites');
    this.$bus.$off('resetFavorites');
  },
  watch: {
    hasFavoriteChanges(newValue) {
      this.$store.commit('setFirstNavButton', {
        component: 'CancelSVG',
        isDisabled: !newValue,
        action: 'resetFavorites'
      });

      if (this.$store.state.country !== 'all') {
        this.$store.commit('setSecondNavButton', {
          component: 'ConfirmSVG',
          isDisabled: !newValue,
          action: 'saveFavorites'
        });
      }
    },
    isFavoriteOnly(newValue) {
      this.$store.commit('setThirdNavButton', {
        component: 'StarSVG',
        isDisabled: !newValue,
        action: 'toggleShowFavoriteOnly'
      });
    }
  },
  computed: {
    isRecordsVisible() {
      return !this.isLoading && this.filteredRecords.length > 0;
    },
    isEmptyMessageVisible() {
      return this.records.length === 0 && !this.isLoading;
    },
    filteredRecords() {
      if (this.isFavoriteOnly) {
        return this.records.filter(record => record.isFavorite);
      }

      return this.records;
    },
    favoriteIds() {
      return this.records.filter(record => record.isFavorite).map(record => record._id);
    },
    favoriteIdsFromCache() {
      return this.cachedRecords?.filter(record => record.isFavorite).map(record => record._id);
    },
    hasFavoriteChanges() {
      const cache = this.favoriteIdsFromCache.sort().toString();
      const current = this.favoriteIds.sort().toString();

      return cache !== current;
    }
  },
  methods: {
    async getLastCurrencies() {
      const countries = config.COUNTRIES;
      this.isLoading = true;
      this.$bus.$emit('toggleLoading', true);
      try {
        let response = {};
        let { lastCurrencies, settings } = {};
        if (this.$store.state.country === 'all') {
          const requestsArray = [];
          countries.forEach(country => requestsArray.push(getLastCurrencies(country)));

          response = await Promise.all(requestsArray);

          response = response.reduce((acc, responseItem) => {
            acc.lastCurrencies = [ ...acc.lastCurrencies, ...responseItem.lastCurrencies ];
            acc.settings = responseItem.settings;
            return acc;
          }, { lastCurrencies: [] });
          
        } else {
          response = await getLastCurrencies(this.$store.state.country);
        }

        ({ lastCurrencies, settings } = response);
        this.records = lastCurrencies;
        this.cachedRecords = JSON.parse(JSON.stringify(this.records));
        this.isFavoriteOnly = settings.isStartWithFavorite || false;
      } catch(error) {
        console.error(error);
      } finally {
        this.$bus.$emit('toggleLoading', false);
        this.isLoading = false;
      }
    },
    toggleShowFavoriteOnly() {
      this.isFavoriteOnly = !this.isFavoriteOnly;
    },
    handleToggleFavorite(record) {
      record.isFavorite = !record.isFavorite;
    },
    isFavorite(record) {
      return record.isFavorite;
    },
    resetFavorites() {
      if (this.hasFavoriteChanges) {
        this.records = JSON.parse(JSON.stringify(this.cachedRecords));
      }
    },
    async saveFavorites() {
      if (this.hasFavoriteChanges) {
        try {
          this.isLoading = true;
          this.$bus.$emit('toggleLoading', true);

          const response = await saveFavorites(this.favoriteIds, this.$store.state.country);
          this.cachedRecords = JSON.parse(JSON.stringify(this.records));
        } catch (err) {
          console.log(err);
        } finally {
          this.$bus.$emit('toggleLoading', false);
          this.isLoading = false;
        }
      }
    },
    toFloat(value) {
      return parseFloat(value);
    },
    timeClasses(timestamp) {
      const now = new Date().valueOf();
      const diff = now - timestamp;
      
      if (diff < config.TIME_LIMIT_GREEN * 1000) {
        return 'record-item__time--green';
      } 
      else if (diff < config.TIME_LIMIT_YELLOW * 1000) {
        return 'record-item__time--yellow'
      }
      return 'record-item__time--red';
    }
  }
};
</script>

<style  lang="scss">
.last-values {
  overflow-y: auto;
  height: 100%;
  
  &--empty {
    padding: 20px 0px;
    text-align: center;
  }

  .currency-records {
    padding: 10px 6px;
    font-size: 14px;

    &--row {
      display: grid;
      grid-template-columns: 1fr 3fr 24px;
      padding: 4px 0;
      align-items: center;
      border-bottom: 1px solid #27E1C1;

      &:last-child {
        border-bottom: none;
      }

      .record-item {
        display: flex;
        align-items: center;
        justify-content: center;

        &:first-child {
          justify-content: start;
          align-items: flex-start;
        }

        &:last-child {
          justify-content: end;
        }

        &__time {
          font-size: 14px;
          display: flex;
          flex-direction: column;

          &--red {
            color: #B70404;
          }

          &--green {
            color:#1B9C85;
          }

          &--yellow {
            color: #F79327;
          }
        }

        &__favorite {
          height: 24px;
          width: 24px;

          &--disabled {
            opacity: 0.15;
          }
        }
      }
    }
  }
}
</style>