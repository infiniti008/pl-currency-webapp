<template>
<div class="overlay">
  <div class="spinner">
    <div></div>
    <div></div>
    <div></div>
  </div>
</div>
</template>

<script>
export default {
  name: "Spinner"
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
  background-color: rgba($color: $--green, $alpha: 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.spinner div {
  display: inline-block;
  position: absolute;
  left: 8px;
  width: 16px;
  background: $--yellow;
  animation: spinner 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
}
.spinner div:nth-child(1) {
  left: 8px;
  animation-delay: -0.24s;
}
.spinner div:nth-child(2) {
  left: 32px;
  animation-delay: -0.12s;
}
.spinner div:nth-child(3) {
  left: 56px;
  animation-delay: 0;
}
@keyframes spinner {
  0% {
    top: 8px;
    height: 64px;
  }
  50%, 100% {
    top: 24px;
    height: 32px;
  }
}
</style>