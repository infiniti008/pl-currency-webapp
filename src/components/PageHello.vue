<template>
  <div class="hello-page">
    <h3>Thank you for using the bot.</h3>
    <hr />
    <p>
      <ul>
        <li>
          To view active subscriptions, click on "List".
        </li>
        <li>
          To add a new subscription, click on "Edit".
        </li>
        <li>
          To delete a subscription, click on the "X" button next to the subscription you want to remove.
        </li>
      </ul>
    </p>
    <hr />
  </div>
</template>

<script>
export default {
  name: "PageHello",
  data: () => {
    return {};
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