<template>
  <div class="button-donate-smart">
    <a title="Support me on ko-fi.com" href="https://ko-fi.com/B0B6MF0IM" target="_blank">
      <img src="https://storage.ko-fi.com/cdn/cup-border.png" alt="Ko-fi donations" class="kofiimg">
    </a>
  </div>
</template>

<script>
export default {
  name: 'ButtonDonateSmart',
  data: () => {
    return {};
  }
};
</script>

<style lang="scss">
.button-donate-smart {
  img.kofiimg {
    height: 15px !important;
    width: 22px !important;
    display: initial;
    opacity: 0;
    animation: 5s kofi-wiggle-smart 3s infinite;
  }

  @keyframes kofi-wiggle-smart {
    0% {
      opacity: 1;
      transform: rotate(0) scale(1) translateY(-50px);
    }

    60% {
      transform: rotate(0) scale(1);
      opacity: 0;
    }

    75% {
      transform: rotate(0) scale(1.12);
    }

    80% {
      transform: rotate(0) scale(1.1);
    }

    84% {
      transform: rotate(-10deg) scale(1.1);
    }

    88% {
      transform: rotate(10deg) scale(1.1);
    }

    92% {
      transform: rotate(-10deg) scale(1.1);
    }

    96% {
      transform: rotate(10deg) scale(1.1);
    }

    100% {
      transform: rotate(0) scale(1);
      opacity: 0;
    }
  }
}
</style>