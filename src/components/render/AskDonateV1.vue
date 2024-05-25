<template>
  <main v-if="data" class="page">
    <h2>
      Please support the App
    </h2>
    <div class="image-qr">
      <img
        src="/src/assets/qr.png">
    </div>
    <div class="image-label">
      <img
        src="/src/assets/kofi.png"
        alt="" srcset="">
    </div>
  </main>
  <H2 v-else>LOADING DATA</H2>
</template>

<script>
import { templateMixin } from './templateMixin.js';

export default {
  name: "AskDonateV1",
  mixins: [templateMixin],
  props: {
    id: {
      type: String,
      required: true
    }
  },
  async created() {
    await this.loadData();

    this.$nextTick(() => {
      this.setReady();
    });
  },
  mounted() {
    const body = document.querySelector('body');
    body.classList.add('ask-donate-v1');
  },
  beforeDestroy() {
    const body = document.querySelector('body');
    body.classList.remove('ask-donate-v1');
  }
};
</script>

<style lang="scss">
body.ask-donate-v1 {
  padding: 10px;
  margin: 0;
  font-weight: 700;
  width: 500px;
  height: 500px;
  box-sizing: border-box;
  background-color: white;
  position: relative;
  color: black;

  h2 {
    text-align: center;
    font-size: 35px;
    margin: 0;
  }

  .image-qr {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .image-label {
    width: 100%;
    display: flex;
    justify-content: center;
    height: 101px;
  }
}
</style>
