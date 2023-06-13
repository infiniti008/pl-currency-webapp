
<template>
  <div class="settings-page">
    <h3>Settings</h3>
    <hr />
    <p class="settings__item">
      <label for="isStartWithFavorite" class="settings__item-label">
        <span class="text">
          Start With Favorites Only
        </span>
        <input class="checkbox" type="checkbox" id="isStartWithFavorite" v-model="settings.isStartWithFavorite">
      </label>
    </p>
    <p class="settings__item">
      <label for="defaultCountry" class="settings__item-label">
        <span class="text">
          Default Country
        </span>
        <select v-model="settings.defaultCountry" id="defaultCountry" class="settings__item-select">
          <option value="all">ALL</option>
          <option value="by">BY &#127463;&#127486;</option>
          <option value="pl">PL &#127477;&#127473;</option>
        </select>
      </label>
    </p>
  </div>
</template>

<script>
import { getUserSettings, saveSettings } from '../services/api.js';
import buttontsService from '../services/buttons.js';

const { initButtons, updateButtonsByKey } = buttontsService;

export default {
  name: "PageSettings",
  data: () => {
    return {
      settings: {
        isStartWithFavorite: false,
        defaultCountry: ''
      },
      cachedSettings: null
    };
  },
  mounted() {
    this.getUserSettings();
  },
  created() {
    this.$bus.$on('saveSettingsChanges', this.saveSettingsChanges);
    this.$bus.$on('clearSettingsChanges', this.clearSettingsChanges);

    initButtons('PageSettings', this.$store);
  },
  beforeDestroy() {
    this.$bus.$off('saveSettingsChanges');
    this.$bus.$off('clearSettingsChanges');
  },
  watch: {
    hasSettintsChanges(newValue) {
      updateButtonsByKey('PageSettings', this.$store, 'hasSettintsChanges', !newValue);
    }
  },
  computed: {
    hasSettintsChanges() {
      return JSON.stringify(this.settings) !== JSON.stringify(this.cachedSettings);
    }
  },
  methods: {
    async saveSettingsChanges() {
      if (this.hasSettintsChanges) {
        try {
          this.isLoading = true;
          this.$bus.$emit('toggleLoading', true);

          const response = await saveSettings(this.settings);

          this.updateSettings();
        } catch (err) {
          console.log(err);
        } finally {
          this.$bus.$emit('toggleLoading', false);
          this.isLoading = false;
        }
      }
    },
    updateSettings() {
      const settingsStrinfigied = JSON.stringify(this.settings);

      this.cachedSettings = JSON.parse(settingsStrinfigied);
    },
    clearSettingsChanges() {
      if (this.hasSettintsChanges) {
        this.settings = JSON.parse(JSON.stringify(this.cachedSettings));
      }
    },
    async getUserSettings() {
      try {
        this.isLoading = true;
        this.$bus.$emit('toggleLoading', true);

        const response = await getUserSettings();

        this.settings = Object.assign(this.settings, response);

        this.cachedSettings = JSON.parse(JSON.stringify(this.settings));
      } catch (err) {
        console.log(err);
      } finally {
        this.$bus.$emit('toggleLoading', false);
        this.isLoading = false;
      }
    }
  }
};
</script>

<style lang="scss">
.settings-page {
  padding: 10px;
  text-align: center;

  .settings__item {
    padding: 10px;

    &-label {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }

    &-select {
      padding: 4px;
    }

    .checkbox {
      width: 20px;
      height: 20px;
    }

    .text {
      margin-right: 10px;
    }
  }
}
</style>