<template>
  <page-content
    ref="content"
    :pageTitle="$t('eventEditor.Title')"
    :loading="loading"
    showBack
  >
    <form novalidate @submit.stop.prevent="submit" v-if="model" class="eventEditoForm">
      <md-input-container>
        <label>{{$t('eventEditor.fldName')}}</label>
        <md-input v-model="model.name" maxlength="50" required></md-input>
      </md-input-container>
      <md-input-container>
        <label>{{$t('eventEditor.fldDescription')}}</label>
        <md-textarea v-model="model.description"></md-textarea>
      </md-input-container>
      <div class="md-input-container md-theme-default md-has-value">
        <label>{{$t('eventEditor.fldStart')}}</label>
        <datepicker
          class="md-input"
          format="d. MMMM yyyy"
          v-model="model.startsAt"
          :disabled="{from: model.endsAt}"
          :language="$i18n.locale"
          v-if="model"
        >
        </datepicker>
      </div>
      <div class="md-input-container md-theme-default md-has-value">
        <label>{{$t('eventEditor.fldEnd')}}</label>
        <datepicker
          class="md-input"
          format="d. MMMM yyyy"
          v-model="model.endsAt"
          :disabled="{to: model.startsAt}"
          :language="$i18n.locale"
          v-if="model"
        >
        </datepicker>
      </div>
      <md-button class="md-primary md-raised" type="submit" :disabled="!valid || loading">{{$t('eventEditor.Save')}}</md-button>
    </form>
  </page-content>
</template>

<style scoped>
.eventEditoForm {
  padding: 0 10px 0 10px;
}
</style>

<script>
import {unmarshalDates} from '../../../Utils';
import {getMessageForErrorCode} from '../../../Errors';
import api from '../../../api';

export default {
  name: 'EventEditor',
  data() {
    return {
      loading: false,
      model: null,
    };
  },
  computed: {
    valid: function() {
      return this.model && this.model.name && this.model.name.trim() &&
        _.isDate(this.model.startsAt) && _.isDate(this.model.endsAt);
    },
  },
  mounted: function() {
    this.loadData();
  },
  watch: {
    '$route'() {
      this.loadData();
    },
  },
  methods: {
    loadData: async function() {
      let id = Number.parseInt(this.$route.params.id, 10);
      this.model = null;
      if (!_.isFinite(id)) {
        // No need to load - we don't have a valid model ID so we're creating a new one
        let start = new Date();
        start.setMilliseconds(0);
        start.setSeconds(0);
        start.setMinutes(0);
        start.setHours(0);
        let end = new Date(start.getTime());
        end.setDate(end.getDate()+1);
        this.model = {
          name: '',
          description: '',
          startsAt: start,
          endsAt: end,
        };
        return;
      }
      this.loading = true;
      this.removeMessage();
      try {
        let res = await api.getEvent(id);
        if (res.ok) {
          this.model = res.data && unmarshalDates(res.data) || [];
        } else {
          this.showErrorMessage(
            this.$t('eventEditor.err.Load'),
            getMessageForErrorCode(res.error),
            res.errorDetails,
            res.error
          );
        }
      } catch (e) {
        this.showErrorMessage(
            this.$t('eventEditor.err.Load'),
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
      let res;
      let errorTitle;
      this.loading = true;
      this.removeMessage();
      // Normalize the start and end dates so that we have full days on the server
      this.model.startsAt.setMilliseconds(0);
      this.model.startsAt.setSeconds(0);
      this.model.startsAt.setMinutes(0);
      this.model.startsAt.setHours(0);
      this.model.endsAt.setMilliseconds(999);
      this.model.endsAt.setSeconds(59);
      this.model.endsAt.setMinutes(59);
      this.model.endsAt.setHours(23);
      try {
        if (this.model.id > 0) {
          errorTitle = this.$t('eventEditor.err.Update');
          res = await api.updateEvent(this.model.id, this.model);
        } else {
          errorTitle = this.$t('eventEditor.err.Create');
          res = await api.createEvent(this.model);
        }
        if (res.ok) {
          this.$router.push({name: 'Events'});
        } else {
          this.showErrorMessage(
            errorTitle,
            getMessageForErrorCode(res.error),
            res.errorDetails,
            res.error
          );
        }
      } catch (e) {
        this.showErrorMessage(
            errorTitle,
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
