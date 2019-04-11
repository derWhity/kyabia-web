<template>
  <md-dialog ref="diag">
    <md-dialog-title>{{$t('choosePlaylist.Title')}}</md-dialog-title>

    <md-dialog-content>
      <template>
        <message
          :message="message"
          :details="messageDetails"
          :code="messageCode"
          :title="messageTitle"
          :class="messageCls"
          @close="removeMessage">
        </message>
        <form novalidate @submit.stop.prevent="onOkClick" v-if="playlists">
          {{promptRequester ? $t('choosePlaylist.ContentWithRequester') : $t('choosePlaylist.Content')}}
          <md-input-container>
            <label>{{$t('choosePlaylist.Playlist')}}</label>
            <md-select v-model="selectedPlaylist" required>
              <md-option v-for="row in playlists" :key="row.id" :value="row.id">
                {{row.name}}<template v-if="row.eventName"> (Event: {{row.eventName}})</template>
              </md-option>
            </md-select>
          </md-input-container>
          <template v-if="promptRequester">
            <md-input-container>
              <label>{{$t('choosePlaylist.RequesterName')}}</label>
              <md-input v-model="requester" required></md-input>
            </md-input-container>
          </template>
        </form>
      </template>
    </md-dialog-content>

    <md-dialog-actions>
      <md-button @click.native="onCloseClick">{{$t('misc.Cancel')}}</md-button>
      <md-button
        class="md-raised md-primary"
        :disabled="!valid"
        @click.native="onOkClick">
        {{$t('choosePlaylist.ChoosePlaylist')}}
      </md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import api from '../api';
import {getMessageForErrorCode} from '../Errors';

export default {
  name: 'ChoosePlaylistDialog',
  props: {
    promptRequester: Boolean,
  },
  data() {
    return {
      loading: false,
      playlists: null,
      requester: null,
      selectedPlaylist: null,
      message: null,
      messageDetails: null,
      messageTitle: null,
      messageCode: null,
      messageCls: ['md-warn'],
    };
  },
  computed: {
    valid: function() {
      return !!(this.selectedPlaylist && (!this.promptRequester || this.requester));
    },
  },
  methods: {
    async loadPlaylists() {
      this.playlists = null;
      this.loading = true;
      this.removeMessage();
      try {
        let res = await api.searchPlaylists();
        if (res.ok) {
          this.playlists = res.data && res.data.list || [];
        } else {
          this.showErrorMessage(
            this.$t('choosePlaylist.err.LoadPlaylists'),
            getMessageForErrorCode(res.error),
            res.errorDetails,
            res.error
          );
        }
      } catch (e) {
        this.showErrorMessage(
            this.$t('choosePlaylist.err.LoadPlaylists'),
            e.message,
            e.stack,
            null
          );
      }
      this.loading = false;
    },
    open() {
      this.$refs.diag.open();
      this.loadPlaylists();
    },
    onCloseClick() {
      this.$refs.diag.close();
    },
    onOkClick() {
      if (this.valid) {
        this.$refs.diag.close();
        this.$emit('ok', this.selectedPlaylist, this.requester);
      }
    },
    showMessage(title, message, details) {
      this.messageTitle = title;
      this.message = message;
      this.messageCode = null;
      this.messageDetails = details;
      this.messageCls = ['md-accent'];
    },
    showErrorMessage(title, message, details, code) {
      this.messageTitle = title;
      this.message = message;
      this.messageCode = code;
      this.messageDetails = details;
      this.messageCls = ['md-warn'];
    },
    removeMessage() {
      this.messageTitle = null;
      this.message = null;
      this.messageCode = null;
      this.messageDetails = null;
      this.messageCls = [];
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
