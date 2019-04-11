<template>
  <md-dialog ref="diag">
    <md-dialog-title>{{$t('login.Title')}}</md-dialog-title>
    <form @submit.stop.prevent="doLogin" novalidate>
      <md-dialog-content class="login">
            <md-toolbar class="md-warn" v-if="errorMessage">
              {{errorMessage}}
            </md-toolbar>
              <md-input-container>
                <label>{{$t('login.User')}}</label>
                <md-input v-model="username" ref="usernameField"></md-input>
              </md-input-container>
              <md-input-container md-has-password>
                <label>{{$t('login.Password')}}</label>
                <md-input required type="password" v-model="password"></md-input>
              </md-input-container>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click.native="close">{{$t('misc.Cancel')}}</md-button>
        <md-button class="md-primary md-raised" :disabled="!valid" type="submit">{{$t('login.Login')}}</md-button>
      </md-dialog-actions>
    </form>
  </md-dialog>
</template>

<style scoped>
@media (min-width: 640px) {
  .login {
    min-width: 400px;
  }
}
</style>

<script>
import api from '../api';
import {getMessageForErrorCode} from '../Errors';

export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      username: '',
      password: '',
      errorMessage: '',
    };
  },
  computed: {
    valid: function() {
      return this.username && this.password && this.username.trim();
    },
  },
  methods: {
    open() {
      this.$refs.diag.open();
      window.setTimeout(() => {
        this.$refs.usernameField.$el.focus();
      }, 400);
    },
    close() {
      this.$refs.diag.close();
    },
    async doLogin() {
      this.loading = true;
      this.errorMessage = '';
      try {
        let res = await api.login(this.username, this.password);
        if (res.ok) {
          this.username = '';
          this.password = '';
          this.close();
        } else {
          this.errorMessage = getMessageForErrorCode(res.error);
        }
      } catch(e) {
        this.errorMessage = this.$t('login.err.Unexpected', {err: e.message});
      }
      this.loading = false;
    },
  },
};
</script>
