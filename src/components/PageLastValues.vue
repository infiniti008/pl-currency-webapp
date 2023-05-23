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
        <StarSVG class="record-item--favorite" :is-favorite="isFavorite(record)" />
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
    this.getActiveSubscriptions();
  },
  created() {
    this.$bus.$on('showFavoriteOnly', this.showFavoriteOnly);

    this.$bus.$on('saveFavorites', this.saveFavorites);
    this.$bus.$on('resetFavorites', this.resetFavorites);

    this.$store.commit('setCurrentConfirmOperation', 'saveFavorites');
    this.$store.commit('setCurrentCancelOperation', 'resetFavorites');
  },
  beforeDestroy() {
    this.$bus.$off('showFavoriteOnly');

    this.$bus.$off('saveFavorites');
    this.$bus.$off('resetFavorites');
  },
  watch: {
    hasFavoriteChanges(newValue) {
      this.$store.commit('toggleConfirmButtonAvailability', newValue);
      this.$store.commit('toggleCancelButtonAvailability', newValue);
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
      return this.cachedRecords.filter(record => record.isFavorite).map(record => record._id);
    },
    hasFavoriteChanges() {
      const cache = this.favoriteIdsFromCache.sort().toString();
      const current = this.favoriteIds.sort().toString();

      return cache !== current;
    }
  },
  methods: {
    async getActiveSubscriptions() {
      this.isLoading = true;
      this.$bus.$emit('toggleLoading', true);
      try {
        this.records = await getLastCurrencies(this.$store.state.country);
        this.cachedRecords = JSON.parse(JSON.stringify(this.records));
      } catch(error) {
        console.error(error);
      } finally {
        this.$bus.$emit('toggleLoading', false);
        this.isLoading = false;
      }
    },
    showFavoriteOnly(isFavoriteOnly) {
      this.isFavoriteOnly = isFavoriteOnly;
    },
    handleToggleFavorite(record) {
      record.isFavorite = !record.isFavorite;
    },
    isFavorite(record) {
      return record.isFavorite;
    },
    resetFavorites() {
      this.records = JSON.parse(JSON.stringify(this.cachedRecords));
    },
    async saveFavorites() {
      try {
        this.isLoading = true;
        this.$bus.$emit('toggleLoading', true);

        const response = await saveFavorites(this.favoriteIds, this.$store.state.country);
      } catch (err) {
        console.log(err);
      } finally {
        this.$bus.$emit('toggleLoading', false);
        this.isLoading = false;
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

        &--favorite {
          height: 24px;
          width: 24px;
        }
      }
    }
  }
}
</style>