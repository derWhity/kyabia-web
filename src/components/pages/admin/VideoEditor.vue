<template>
  <page-content
    :pageTitle="$t('videoEditor.Title')"
    showBack
    ref="content"
    :loading="loading"
  >
    <form novalidate @submit.stop.prevent="submit" class="editorForm" v-if="model">
      <md-input-container>
        <label>{{$t('videoEditor.fldFilename')}}</label>
        <md-input readonly v-model="model.fileName"></md-input>
      </md-input-container>
      <md-input-container>
        <flag :lang="model.language" class="input"></flag>
        <label class="flagged">{{$t('videoEditor.fldLanguage')}}</label>
        <md-select v-model="model.language">
          <md-option v-for="lang in languages" :value="lang.locale" :key="lang.locale">
            <flag :lang="lang.locale" class="inline"></flag>
            <span>{{lang.name}}</span>
          </md-option>
        </md-select>
      </md-input-container>
      <md-input-container>
        <label>{{$t('videoEditor.fldArtist')}}</label>
        <md-input v-model="model.artist" required></md-input>
      </md-input-container>
      <md-input-container>
        <label>{{$t('videoEditor.fldTitle')}}</label>
        <md-input v-model="model.title" required></md-input>
      </md-input-container>
      <md-input-container>
        <label>{{$t('videoEditor.fldDescription')}}</label>
        <md-textarea v-model="model.description"></md-textarea>
      </md-input-container>
      <md-input-container>
        <label>{{$t('videoEditor.fldRelatedMedium')}}</label>
        <md-input v-model="model.relatedMedium"></md-input>
      </md-input-container>
      <md-input-container>
        <label>{{$t('videoEditor.fldMediumDetail')}}</label>
        <md-input v-model="model.mediumDetail"></md-input>
      </md-input-container>
      <md-button class="md-primary md-raised" type="submit" :disabled="!valid || loading">
        {{$t('videoEditor.Save')}}
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
  name: 'VideoEditor',
  loading: false,
  model: null,
  languages: null,
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
        this.model.artist && this.model.artist.trim && this.model.artist.trim() &&
        this.model.title && this.model.title.trim && this.model.title.trim();
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
      if (!id) {
        this.showErrorMessage(
          this.$t('videoEditor.err.Load'),
          this.$t('videoEditor.err.NoVideoSelected')
        );
        return;
      }
      this.model = null;

      this.loading = true;
      this.removeMessage();
      try {
        let res = await api.getVideo(id);
        if (res.ok) {
          this.model = res.data && unmarshalDates(res.data) || [];
        } else {
          this.showErrorMessage(
            this.$t('videoEditor.err.Load'),
            getMessageForErrorCode(res.error),
            res.errorDetails,
            res.error
          );
        }
      } catch (e) {
        this.showErrorMessage(
            this.$t('videoEditor.err.Load'),
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
        let res = await api.updateVideo(this.model.sha512, this.model);
        if (res.ok) {
          this.$router.push({name: 'Videos'});
        } else {
          this.showErrorMessage(
            this.$t('videoEditor.err.Save'),
            getMessageForErrorCode(res.error),
            res.errorDetails,
            res.error
          );
        }
      } catch (e) {
        this.showErrorMessage(
            this.$t('videoEditor.err.Save'),
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
