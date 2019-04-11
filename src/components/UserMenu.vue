<template>
  <md-menu md-size="3" md-direction="bottom left" :md-align-trigger="true">
    <md-button md-menu-trigger class="md-icon-button">
      <md-icon v-if="!$store.getters.loggedIn">lock_outline</md-icon>
      <md-icon v-if="$store.getters.loggedIn">lock_open</md-icon>
    </md-button>

    <md-menu-content>
      <md-menu-item v-if="$store.getters.loggedIn" :disabled="true">
        <md-icon>account_box</md-icon>
        <span>{{$store.getters.userFullName}}</span>
      </md-menu-item>
      <md-menu-item v-if="!$store.getters.loggedIn" @click.native="openLogin">
        <md-icon>lock_open</md-icon>
        <span>{{$t('user.LogIn')}}</span>
      </md-menu-item>

      <md-menu-item v-if="$store.getters.loggedIn" @click.native="logout">
        <md-icon>lock_outline</md-icon>
        <span>{{$t('user.LogOut')}}</span>
      </md-menu-item>
    </md-menu-content>
    <login ref="loginDialog"></login>
  </md-menu>
</template>

<style scoped>
</style>

<script>
import {REMOVE_SESSION} from '../store';

export default {
  name: 'UserMenu',
  data() {
    return {
    };
  },
  methods: {
    openLogin() {
      this.$refs.loginDialog.open();
    },
    logout() {
      this.$store.commit(REMOVE_SESSION);
    },
  },
};
</script>
