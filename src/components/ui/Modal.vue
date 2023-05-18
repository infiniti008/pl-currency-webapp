<template>
  <div v-if="showModal" class="overlay" @click="closeModal">
    <div class="modal" @click.stop.prevent="handleClickModal">
      <component 
        :is="modalName" 
        :data="data" 
        @close="closeModal" 
      />
    </div>  
  </div>
</template>

<script>
import NotifyModal from '../modals/NotifyModal.vue';

export default {
  components: { NotifyModal },
  name: "Modal",
  conponents: {
    NotifyModal
  },
  data() {
    return {
      modalName: '',
      showModal: false,
      data: {}
    }
  },
  created() {
    this.$bus.$on('open-modal', this.openModal);
  },
  beforeDestroyed() {
    this.$bus.$off('open-modal');
  },
  methods: {
    closeModal() {
      this.modalName = '';
      this.showModal = false;
    },
    handleClickModal() {},
    openModal(modalData) {
      this.modalName = modalData.name;
      this.data = modalData.data;
      this.showModal = true;
    }
  }
};
</script>

<style lang="scss">
@import "../../styles/variables/colors.scss";

.overlay {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: rgba($color: $--green, $alpha: 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  width: 80%;
  max-height: 80%;
  min-height: 20%;
  height: auto;
  background-color: $--white;
  border-radius: 6px;

  &__content {
    padding: 10px;
    gap: 10px;
    display: flex;
    flex-direction: column;
  }

  &__title {
    text-align: center;
    font-weight: 600;
  }

  &__footer {
    display: flex;
    justify-content: space-around;
  }
}
</style>