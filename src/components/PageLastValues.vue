<template>
  <div class="last-values">
    <div v-if="isRecordsVisible" class="currency-records">
      <div v-for="record in records" class="currency-records--row" :style="{color: record.bankColor}">
        <div class="record-item record-item--time">
          <span>{{ record.date.split(',')[0] }}</span>
          <span>{{ record.date.split(',')[1] }}</span>
        </div>
        <CurrencyConverter 
          :currency="record.currency"
          :value="record.value"
          :operation="record.operation"
          :bank="record.bank"
          :base-currency="record.currencyBase"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getLastCurrencies } from '../services/api.js';

import CurrencyConverter from './ui/CurrencyConverter.vue';

export default {
  name: "PageLastValues",
  components: {
    CurrencyConverter
  },
  data: () => {
    return {
      records: [],
      isLoading: false,
      country: 'pl'
    };
  },
  computed: {
    isRecordsVisible() {
      return !this.isLoading && this.records.length > 0;
    },
    isEmptyMessageVisible() {
      return this.records.length === 0 && !this.isLoading;
    }
  },
  mounted() {
    this.getActiveSubscriptions();
  },
  methods: {
    async getActiveSubscriptions() {
      this.isLoading = true;
      this.$bus.$emit('toggleLoading', true);
      try {
        this.records = await getLastCurrencies(this.country);
      } catch(error) {
        console.error(error);
      } finally {
        this.$bus.$emit('toggleLoading', false);
        this.isLoading = false;
      }
    }
  }
};
</script>

<style  lang="scss">
.last-values {
  .currency-records {
    padding: 10px 6px;
    font-size: 14px;

    &--row {
      display: grid;
      grid-template-columns: 1fr 3fr;
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

        &--time {
          font-size: 14px;
          display: flex;
          flex-direction: column;
        }
      }
    }
  }
}
</style>