<template>
  <div class="contact">
    <div v-if="formatedResponseMessage" class="contact__server-response" :class="responseStatus ? 'contact__server-response--ok' : 'contact__server-response--error'">
      {{ formatedResponseMessage }}
    </div>
    
    <br>
    <h3>You can only send 1 message within 24 hours</h3>
    <br>
    <p>
      Message (English and Russian are acceptable):
    </p>
    <textarea v-model="message" rows="10" maxlength="300" placeholder="Limit 300 symbols..." />
  </div>
</template>

<script>
import { sendMessage } from '../services/api.js';
import buttontsService from '../services/buttons.js';

const { initButtons, updateButtonsByKey } = buttontsService;

export default {
  name: 'PageContact',
  data: () => {
    return {
      message: '',
      responseMessage: '',
      responseStatus: false
    };
  },
  created() {
    initButtons('PageContact', this.$store);

    this.$bus.$on('saveMessageChanges', this.saveMessageChanges);
    this.$bus.$on('clearMessageChanges', this.clearMessageChanges);
  },
  beforeDestroy() {
    this.$bus.$off('saveMessageChanges');
    this.$bus.$off('clearMessageChanges');
  },
  watch: {
    message(newValue) {
      updateButtonsByKey('PageContact', this.$store, 'message', !newValue);
    }
  },
  computed: {
    formatedResponseMessage() {
      const splittedMessage = this.responseMessage.split('|');

      if (splittedMessage.length === 2) {
        splittedMessage[1] = new Date(parseInt(splittedMessage[1])).toLocaleString();
        return splittedMessage.join('');
      }
      return this.responseMessage;
    }
  },
  methods: {
    async saveMessageChanges() {
      console.log('saveMessageChanges');
      if (this.message.length > 0) {
        try {
          this.isLoading = true;
          this.$bus.$emit('toggleLoading', true);

          const response = await sendMessage(this.message);
          this.responseMessage = response.message;
          this.responseStatus = response.status;
          if (this.responseStatus) {
            this.message = '';
          }
        } catch (err) {
          console.log(err);
        } finally {
          this.$bus.$emit('toggleLoading', false);
          this.isLoading = false;
        }
      }
    },
    clearMessageChanges() {
      this.message = '';
      this.responseMessage = '';
      this.responseStatus = false;
    }
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

  hr {
    width: 100%;
  }

  textarea {
    margin-top: 5px;
    resize: none;
    width: 100%;
    padding: 4px;
  }

  &__server-response {
    width: 100%;
    text-align: center;
    padding: 6px;

    &--ok {
      color: green;
      border-bottom: 1px solid green;
    }

    &--error {
      color:  red;
      border-bottom: 1px solid red;
    }
  }
}
</style>