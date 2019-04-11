<template>
  <md-dialog ref="diag">
    <md-dialog-title>Verzeichnis wählen</md-dialog-title>

    <md-dialog-content>
        <message
          :message="message"
          :details="messageDetails"
          :code="messageCode"
          :title="messageTitle"
          :class="messageCls"
          @close="removeMessage">
        </message>
        <md-list>
          Pfad:
          <md-subheader>{{fullPath}}</md-subheader>
          <div class="loading" v-if="loading">
            <md-spinner md-indeterminate></md-spinner>
          </div>
          <md-list-item v-if="fullPath != '/'" @click.native="up">
            <md-icon>reply</md-icon> <span>..</span>
            <md-divider ></md-divider>
          </md-list-item>
          <md-list-item v-for="folderName in subDirectories" :key="folderName" @click.native="down(folderName)">
            <md-icon>folder_open</md-icon> <span>{{folderName}}</span>
            <md-divider ></md-divider>
          </md-list-item>
        </md-list>
    </md-dialog-content>


    <md-dialog-actions>
      <md-button @click.native="onCloseClick">Abbrechen</md-button>
      <md-button
        class="md-raised md-primary"
        :disabled="!valid"
        @click.native="onOkClick">
        Auswählen
      </md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<style scoped>
.loading {
  width: 100%;
  text-align: center;
}

.pathbar {
  border-style: none;
  background-color: rgba(0, 0, 0, .1);
  padding: 0 5px 0 5px;
}
</style>

<script>
import api from '../../api';
import {getMessageForErrorCode} from '../../Errors';

export default {
  name: 'SelectFolderDialog',
  data() {
    return {
      path: '',
      loading: false,
      subDirectories: [],
      message: null,
      messageDetails: null,
      messageTitle: null,
      messageCode: null,
      messageCls: ['md-warn'],
    };
  },
  computed: {
    valid() {
        return !!(this.path && this.path.trim());
    },
    fullPath() {
      return this.path && this.path.trim() || '/';
    },
  },
  watch: {
    path() {
      if (!this.loading) {
        this.loadSubdirs();
      }
    },
  },
  methods: {
    up() {
      let elements = this.path.split('/').filter(item => (item != '' && item.trim()));
      elements.pop();
      this.path = elements.join('/');
    },
    down(subdir) {
      let elements = this.path.split('/').filter(item => (item != '' && item.trim()));
      elements.push(subdir);
      this.path = elements.join('/');
    },
    async loadSubdirs() {
      this.loading = true;
      this.removeMessage();
      try {
        let res = await api.listDirs(this.fullPath);
        if (res.ok) {
          this.subDirectories = res.data || [];
        } else {
          this.showErrorMessage(
            'Fehler beim Laden der Unterverzeichnisse',
            getMessageForErrorCode(res.error),
            res.errorDetails,
            res.error
          );
          this.subDirectories = [];
        }
      } catch (e) {
        this.showErrorMessage(
            'Fehler beim Laden der Unterverzeichnisse',
            e.message,
            e.stack,
            null
          );
        this.subDirectories = [];
      }
      this.loading = false;
    },
    open: function() {
      this.$refs.diag.open();
      this.loadSubdirs();
    },
    onCloseClick: function() {
      this.$refs.diag.close();
    },
    onOkClick: function() {
      this.$refs.diag.close();
      this.$emit('ok', this.fullPath);
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
