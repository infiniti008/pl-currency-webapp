<template>
  <div class="subscriptions">
    <template v-if="isRecordsVisible">
      <div
        v-for="record in records" 
        :key="record.recorId" 
        class="subscriptions__item"
      >
        <div class="subscriptions__item-content">
          <span>{{ record.pointName }} </span>
          <span>{{ record.date }}</span>
        </div>
        <div class="subscriptions__item-control" @click="deleteRecord(record)">
          X
        </div>
      </div>
    </template>
    <p class="subscriptions__empty-list" v-if="isEmptyMessageVisible">
      У вас пока нет <b>активных</b> подписок. 
      <br /><br />
      Перейдите в редактор чтобы добавить свою первую подписку.
    </p>
  </div>
</template>

<script>
import { getActiveSubscriptions, deleteSubscription } from '../services/base';

let TELEGRAM_USER = '';
const IS_DEV_MODE = window.location.search.indexOf('isDevMode=true') !== -1;
const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || '';

if(userId) {
  TELEGRAM_USER = userId.toString();
}

if(IS_DEV_MODE) {
  TELEGRAM_USER='208067133';
}

export default {
  name: "SibscriptionsList",
  components: {
    
  },
  data: () => {
    return {
      records: [],
      isLoading: false,
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
        this.records = await getActiveSubscriptions(TELEGRAM_USER);
      } catch(error) {
        console.error(error);
      } finally {
        this.$bus.$emit('toggleLoading', false);
        this.isLoading = false;
      }
    }, 

    async deleteRecord (recordToDelete) {
      this.$bus.$emit('toggleLoading', true);
      try {
        await deleteSubscription(TELEGRAM_USER, recordToDelete);
        const filtredRecords = this.records.filter(record => record.recorId !== recordToDelete.recorId);
        console.log('filtredRecords', filtredRecords)
        this.records = filtredRecords;
      } catch(error) {
        console.error(error);
      } finally {
        this.$bus.$emit('toggleLoading', false);
      }
    }
  }
};
</script>

<style lang="scss">
@import '../styles/variables/colors.scss';

.subscriptions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 10px 80px 10px;

  &__empty-list {
    padding: 0 10px;
  } 

  &__item {
    background-color: $--white;
    border: 2px solid $--yellow;
    color: $--green;
    font-size: 16px;
    padding: 10px;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    gap: 40px;
    border-radius: 6px;
  }

  &__item-content {
    display: flex;
    gap: 10px;
    justify-content: space-between;
    flex: 1;
  }

  &__item-control {
    color: $--white;
    height: 100%;
    width: 30px;
    background-color: $--red;
    text-align: center;
    border-radius: 4px;
    cursor: pointer;
  }
}
</style>