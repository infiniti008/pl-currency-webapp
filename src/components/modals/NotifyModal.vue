<template>
  <div class="modal__content">
    <div class="modal__title">
      {{ modalTitle }}
    </div>
    <div class="modal__body" v-html="modalContent" />
    <div class="modal__footer">
      <Button theme="red" @click="$emit('close')">
        Закрыть
      </Button>
    </div>
  </div>
</template>

<script>
import Button from '../ui/Button.vue';

export default {
    name: "NotifyModal",
    props: {
      data: {
        type: Object,
        required: true,
      },
    },
    components: { Button },
    computed: {
      modalContent() {
        return this.data.content || '';
      },
      modalTitle() {
        return this.data.title || 'Уведомление';
      }
    }
};
</script>

<style lang="scss">
@import "../../styles/variables/colors.scss";

</style>