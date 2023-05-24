<template>
  <div class="contact">
    Message
  </div>
</template>

<script>
import config from '../models/config.js';
import buttontsService from '../services/buttons.js';

const { initButtons } = buttontsService;

export default {
  name: 'PageContact',
  data: () => {
    return {
      message: '',
    };
  },
  created() {
    // initButtons('PageContact', this.$store);
  }
}
</script>

<style lang="scss">
@import '../styles/variables/colors.scss';

.contact {
  padding: 0px 6px 10px;
  height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
}
</style>