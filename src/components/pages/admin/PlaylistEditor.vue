<template>
  <page-content
    :pageTitle="$t('playlistEditor.Title')"
    showBack
    ref="content"
    :loading="loading"
  >
    <form novalidate @submit.stop.prevent="submit" class="editorForm" v-if="model">
      <md-input-container>
        <label>{{$t('playlistEditor.fldName')}}</label>
        <md-input v-model="model.name"></md-input>
      </md-input-container>
      <md-checkbox v-model="locked" class="md-primary">{{$t('playlistEditor.fldLocked')}}</md-checkbox>
      <md-input-container>
        <label>{{$t('playlistEditor.fldLockMessage')}}</label>
        <md-textarea v-model="model.message"></md-textarea>
      </md-input-container>
      <md-button class="md-primary md-raised" type="submit" :disabled="!valid || loading">
        {{$t('playlistEditor.Save')}}
      </md-button>
    </form>
  </page-content>
</template>

<style scoped>

input[readonly] {
  color: rgba(0, 0, 0, .54);
}

.editorForm {
  padding: 0 10px 0 10px;
}

.inline {
  display: inline-block;
}

.input {
  margin: 7px 5px 0 0;
}

.md-input-container .flagged {
  left: 30px;
}

.md-input-container.md-has-value .flagged {
  left: 0;
}
</style>

<script>
import {unmarshalDates, getLanguageList} from '../../../Utils';
import {getMessageForErrorCode} from '../../../Errors';
import api from '../../../api';

export default {
  name: 'PlaylistDetailsEditor',
  data: function() {
    return {
      loading: false,
      model: null,
      languages: getLanguageList(),
    };
  },
  computed: {
    valid: function() {
      return this.model &&
        this.model.name && this.model.name.trim();
    },
    locked: {
        get: function() {
            return this.model && this.model.status == 1;
        },
        set: function(value) {
            if (this.model) {
                this.model.status = value ? 1 : 0;
            }
        },
    },
  },
  watch: {
    '$route'() {
      this.loadData();
    },
  },
  mounted: function() {
    this.loadData();
  },
  methods: {
    async loadData() {
      let id = this.$route.params.id;
      if (!id || !_.isFinite(Number.parseInt(id, 10)) || id <= 0) {
        this.model = {
            name: '',
            status: 0,
            message: '',
        };
        return;
      }
      this.model = null;

      this.loading = true;
      this.removeMessage();
      try {
        let res = await api.getPlaylist(id);
        if (res.ok) {
          this.model = res.data && unmarshalDates(res.data) || [];
        } else {
          this.showErrorMessage(
            this.$t('playlistEditor.err.Load'),
            getMessageForErrorCode(res.error),
            res.errorDetails,
            res.error
          );
        }
      } catch (e) {
        this.showErrorMessage(
            this.$t('playlistEditor.err.Load'),
            e.message,
            e.stack,
            null
          );
      }
      this.loading = false;
    },
    async submit() {
      if (!this.valid) {
        return;
      }
      this.loading = true;
      this.removeMessage();
      try {
        let res;
        if (this.model && this.model.id) {
        res = await api.updatePlaylist(this.model.id, this.model);
        } else {
        res = await api.createPlaylist(this.model);
        }
        if (res.ok) {
          this.$router.push({name: 'Playlists'});
        } else {
          this.showErrorMessage(
            this.$t('playlistEditor.err.Save'),
            getMessageForErrorCode(res.error),
            res.errorDetails,
            res.error
          );
        }
      } catch (e) {
        this.showErrorMessage(
            this.$t('playlistEditor.err.Save'),
            e.message,
            e.stack,
            null
          );
      }
      this.loading = false;
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
