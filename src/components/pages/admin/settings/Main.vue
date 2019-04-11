<template>
  <page-content
    :pageTitle="$t('settings.Title')"
    ref="content"
    :loading="loading"
    :showReload="true"
    @reload="loadData()"
  >
    <md-card>
      <md-card-header>
        <div class="md-title">{{$t('settings.ip.Title')}}</div>
        <div class="md-subhead">
          {{$t('settings.ip.Subtitle')}}
        </div>
      </md-card-header>
      <md-card-actions>
        <md-button @click.native="addClicked()">
          <md-icon>add</md-icon>
          {{$t('settings.ip.Add')}}
        </md-button>
      </md-card-actions>
      <md-divider></md-divider>
      <md-card-content>

        <md-list>
          <md-list-item v-for="entry in whitelist" :key="entry">
            <span>{{entry}}</span>
            <md-button class="md-icon-button md-list-action">
              <md-icon @click.native="deleteClicked(entry)">delete</md-icon>
            </md-button>
            <md-divider></md-divider>
          </md-list-item>
        </md-list>
      </md-card-content>
    </md-card>
    <md-dialog-confirm
      :md-title="$t('settings.ip.ConfirmDeleteTitle')"
      :md-content-html="$t('settings.ip.ConfirmDelete', {ip: selectedIp})"
      :md-ok-text="$t('misc.Yes')"
      :md-cancel-text="$t('misc.No')"
      @close="onDeleteClose"
      ref="deleteConfirm">
    </md-dialog-confirm>
    <md-dialog-prompt
      :md-title="$t('settings.ip.dialog.add.Title')"
      :md-ok-text="$t('misc.Add')"
      :md-cancel-text="$t('misc.Cancel')"
      :md-content="$t('settings.ip.dialog.add.Description')"
      v-model="selectedIp"
      :md-input-placeholder="$t('settings.ip.dialog.add.Prompt')"
      @close="onAddClose"
      ref="addPrompt">
    </md-dialog-prompt>
  </page-content>
</template>

<style scoped>

</style>

<script>
import {getMessageForErrorCode} from '../../../../Errors';
import api from '../../../../api';

export default {
  name: 'SettingsMain',
  data: function() {
    return {
      whitelist: [],
      loading: false,
      selectedIp: '',
    };
  },
  mounted: function() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.whitelist = [];
      this.loading = true;
      this.removeMessage();
      try {
        let res = await api.getWhitelistedIps();
        if (res.ok) {
          if (_.isArray(res.data)) {
            this.whitelist = res.data.sort();
          }
        } else {
          this.showErrorMessage(
            this.$t('settings.ip.err.Load'),
            getMessageForErrorCode(res.error),
            res.errorDetails,
            res.error
          );
        }
      } catch (e) {
        this.showErrorMessage(
            this.$t('settings.ip.err.Load'),
            e.message,
            e.stack,
            null
          );
      }
      this.loading = false;
    },
    deleteClicked(ipAddr) {
      this.selectedIp = ipAddr;
      this.$refs.deleteConfirm.open();
    },
    async onDeleteClose(choice) {
      if (choice === 'ok') {
        this.loading = true;
        try {
          let res = await api.removeIpFromWhitelist(this.selectedIp);
          if (res.ok) {
            this.selectedIp = '';
            this.loadData();
          } else {
            this.showErrorMessage(
              this.$t('settings.ip.err.Remove'),
              getMessageForErrorCode(res.error),
              res.errorDetails,
              res.error
            );
          }
        } catch (e) {
          this.showErrorMessage(
            this.$t('settings.ip.err.Remove'),
            e.message,
            e.stack,
            null
          );
        }
        this.loading = false;
      }
    },
    addClicked() {
      this.$refs.addPrompt.open();
    },
    async onAddClose(choice) {
      if (choice === 'ok') {
        this.loading = true;
        try {
          let res = await api.addIpToWhitelist(this.selectedIp);
          if (res.ok) {
            this.selectedIp = '';
            this.loadData();
          } else {
            this.showErrorMessage(
              this.$t('settings.ip.err.Add'),
              getMessageForErrorCode(res.error),
              res.errorDetails,
              res.error
            );
          }
        } catch (e) {
          this.showErrorMessage(
            this.$t('settings.ip.err.Add'),
            e.message,
            e.stack,
            null
          );
        }
        this.loading = false;
      }
    },
    showMessage(title, message, details) {
      this.$refs.content.showMessage(title, message, details);
    },
    showErrorMessage(title, message, details, code) {
      this.$refs.content.showErrorMessage(title, message, details, code);
    },
    removeMessage() {
      this.$refs.content.removeMessage();
    },
  },
};
</script>
