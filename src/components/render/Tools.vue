<template>
<Teleport to="body">
  <div v-show="isToolsVisible" class="tools">
    <div class="icon" @click="handleClickRenderMode" title="Toggle render frame">R</div>
    <div class="icon" @click="handleClickBodyTransform" title="Toggle Body transform">X</div>
  </div>
</Teleport>
</template>

<script>
import Teleport from 'vue2-teleport';

export default {
  name: "Tools",
  data() {
    return {
      isTransformMode: false,
      isToolsVisible: false
    }
  },
  components: {
    Teleport
  },
  created() {
    const body = document.querySelector('body');
    body.setAttribute('title', 'Click on page and Press ctrl + t to toggle tools');

    body.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 't') {
        this.isToolsVisible = !this.isToolsVisible;
      }
    });
  },
  methods: {
    handleClickRenderMode() {
      const body = document.querySelector('body');
      body.classList.toggle('render');
    },
    handleClickBodyTransform() {
      if (this.isTransformMode) {
        this.disableTransformMode();
      } else {
        this.enableTransformMode();
      }
    },
    enableTransformMode() {
      this.isTransformMode = true;
      const html = document.querySelector('html');
      html.style.width = '100%';
      html.style.height = '100%';

      const body = document.querySelector('body');
      body.style.transform = 'scale(0.47)';
      body.style.position = 'absolute';
      body.style.top = '-53%';
    },
    disableTransformMode() {
      this.isTransformMode = false;
      const html = document.querySelector('html');
      html.style.width = 'initial';
      html.style.height = 'initial';

      const body = document.querySelector('body');
      body.style.transform = 'initial';
      body.style.position = 'relative';
      body.style.top = 'initial';
    }
  }
};
</script>

<style lang="scss" scoped>
.tools {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100px;
  height: 500px;
  background-color: white;
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.5));
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  align-items: center;
  padding: 20px;
  gap: 20px;

  .icon {
    width: 60px;
    height: 60px;
    background-color: white;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 40px;
    filter: drop-shadow(0 0 10px black);
    cursor: pointer;
    animation: all 0.3s ease-in-out;

    &:hover {
      background-color: #eee;
      filter: drop-shadow(0 0 10px green);
    }
  }
}
</style>
