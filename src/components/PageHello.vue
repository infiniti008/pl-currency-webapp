<template>
  <div class="hello-page">
    <h3>Спасибо что воспользовались ботом</h3>
    <hr />
    <p>
      <ul>
        <li>
          Чтобы увидеть активные подписки нажмите на "Список".
        </li>
        <li>
          Чтобы добавить новую подписку нажмите на "Изменить".
        </li>
        <li>
          Чтобы удалить подписку, нажмите "Х" на подписке, которую необходимо удалить.
        </li>
      </ul>
    </p>
    <hr />
    <p>Screen width = {{ screenWidth }}px</p>
  </div>
</template>

<script>
export default {
  name: "PageHello",
  data: () => {
    return {
      screenWidth: window.innerWidth
    };
  },
};
</script>

<style lang="scss">
.hello-page {
  padding: 10px;
  p {
    margin-top: 10px;
    margin-bottom: 10px;
    padding-left: 20px;
  }
}
</style>