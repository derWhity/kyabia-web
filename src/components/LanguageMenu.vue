<template>
  <md-menu md-size="3" md-direction="bottom left" :md-align-trigger="true" class="langMenu">
    <md-button md-menu-trigger class="md-icon-button">
      <flag v-bind:lang="$i18n.locale" class="inline"></flag>
    </md-button>

    <md-menu-content>
      <md-menu-item v-for="row in $i18n.availableLocales" :key="row" :value="row" @click.native="chooseLang(row)">
        <span><flag v-bind:lang="row" class="inline"></flag> {{getLocaleName(row)}}</span>
      </md-menu-item>
    </md-menu-content>
    <login ref="loginDialog"></login>
  </md-menu>
</template>

<style scoped>
.inline {
  display: inline-block;
}

.langMenu {
  margin-top: 8px;
}
</style>

<script>
import {getLocaleName} from '../Utils';

export default {
  name: 'LanguageMenu',
  data() {
    return {
      languages: availableLanguages,
    };
  },
  methods: {
    getLocaleName: getLocaleName,
    chooseLang(newLocale) {
      this.$i18n.locale = newLocale;
    },
  },
};
</script>
