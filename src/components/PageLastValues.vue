<template>
  <div class="last-values">
    <div v-if="isRecordsVisible" class="currensy-records">
      <div v-for="record in records" class="currency-record">
        <div class="record-item record-item--bank">{{ record.bank }}</div>
        <div class="record-item">{{ record.currency }}</div>
        <div class="record-item">{{ record.operation }}</div>
        <div class="record-item">{{ record.value }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getLastCurrencies } from '../services/api.js'

export default {
  name: "LastValues",
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
    },
  }
};
</script>

<style  lang="scss">
.last-values {
  .currensy-records {
    padding: 10px;

    .currency-record {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      padding: 8px 0;

      .record-item {
        text-align: center;

        &:first-child {
          text-align: left;
        }
      }
    }
  }
}
</style>