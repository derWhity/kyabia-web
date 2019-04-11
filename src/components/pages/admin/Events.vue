<template>
  <search-page
    ref="search"
    :pageTitle="$t('events.Title')"
    :searchApiFunction="apiFunction"
    :searchOnStartup="true"
    showAdd
    @add="onAddClicked"
  >
    <template slot="tableItems" scope="props">
      <md-table-row :key="props.row.id" :md-item="props.row">
        <md-table-cell width="50px">
          <template v-if="currentEvent == props.row.id">
            <md-icon class="md-primary">star</md-icon>
            <md-tooltip md-direction="bottom" md-delay="300">{{$t('events.ActiveEvent')}}</md-tooltip>
          </template>
          <template v-if="currentEvent != props.row.id">
            <md-icon class="md-primary">star_border</md-icon>
            <md-tooltip md-direction="bottom" md-delay="300">{{$t('events.InactiveEvent')}}</md-tooltip>
          </template>
        </md-table-cell>
        <md-table-cell>
          {{props.row.name}}
          <md-tooltip md-direction="bottom" md-delay="300">{{$t('events.Name')}}</md-tooltip>
        </md-table-cell>
        <md-table-cell>
          {{props.row.description}}
          <md-tooltip md-direction="bottom" md-delay="300">{{$t('events.Description')}}</md-tooltip>
        </md-table-cell>
        <md-table-cell>
          {{props.row.startsAt.toLocaleDateString('de-DE')}} -
          {{props.row.endsAt.toLocaleDateString('de-DE')}}
          <md-tooltip md-direction="bottom" md-delay="300">{{$t('events.Validity')}}</md-tooltip>
        </md-table-cell>
        <md-table-cell width="100px">
          <md-button @click.native="onEditClicked(props.row)" class="md-list-action action">
            <md-icon>mode_edit</md-icon>
            <md-tooltip md-direction="left">{{$t('events.EditEvent')}}</md-tooltip>
          </md-button>
          <md-button
            @click.native="onSetActiveClicked(props.row)"
            class="md-list-action action"
            :disabled="currentEvent == props.row.id"
          >
            <md-icon v-if="currentEvent != props.row.id">star</md-icon>
            <md-tooltip md-direction="left">{{$t('events.Activate')}}</md-tooltip>
          </md-button>
          <md-button @click.native="onDeleteClicked(props.row)" class="md-list-action action">
            <md-icon>delete</md-icon>
            <md-tooltip md-direction="left">{{$t('events.Delete')}}</md-tooltip>
          </md-button>
        </md-table-cell>
      </md-table-row>
    </template>
    <template slot="listItems" scope="props">
      <md-list-item>
        <div class="md-list-text-container">
          <span>
            {{props.row.name}}
          </span>
          <span class="inset">{{props.row.description}}</span>
          <p class="inset">
            {{props.row.startsAt.toLocaleDateString('de-DE')}} -
            {{props.row.endsAt.toLocaleDateString('de-DE')}}
          </p>
        </div>
        <md-speed-dial md-direction="left" class="md-fab-bottom-right">
          <md-button class="md-fab md-primary" md-fab-trigger>
            <md-icon md-icon-morph>close</md-icon>
            <md-icon>settings</md-icon>
          </md-button>

          <md-button @click.native="onDeleteClicked(props.row)" class="md-fab md-primary md-mini md-clean">
            <md-icon>delete</md-icon>
          </md-button>

          <md-button
            @click.native="onSetActiveClicked(props.row)"
            class="md-fab md-primary md-mini md-clean"
            :disabled="currentEvent == props.row.id"
          >
            <md-icon v-if="currentEvent != props.row.id">star</md-icon>
            <md-tooltip md-direction="left">{{$t('events.Activate')}}</md-tooltip>
          </md-button>

          <md-button @click.native="onEditClicked(props.row)" class="md-fab md-primary md-mini md-clean">
            <md-icon>mode_edit</md-icon>
          </md-button>

        </md-speed-dial>
      </md-list-item>
    </template>
    <template>
      <md-dialog-confirm
        ref="confirmActive"
        :md-title="$t('events.dialog.activate.Title')"
        :md-content-html="$t('events.dialog.activate.Content', {current: currentEventName})"
        :md-ok-text="$t('misc.Yes')"
        :md-cancel-text="$t('misc.No')"
        @close="onConfirmActiveClose"
      >
      </md-dialog-confirm>
      <md-dialog-confirm
        ref="confirmDelete"
        :md-title="$t('events.dialog.delete.Title')"
        :md-content-html="$t('events.dialog.delete.Content', {current: currentEventName})"
        :md-ok-text="$t('misc.Yes')"
        :md-cancel-text="$t('misc.No')"
        @close="onConfirmDeleteClose"
      >
      </md-dialog-confirm>
    </template>
  </search-page>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.action {
  padding: 0;
}

.md-speed-dial i.md-icon {
    position: absolute !important;
    top: 16px;
    left: 16px;
}

.md-speed-dial .md-mini i.md-icon {
    position: absolute !important;
    top: 8px;
    left: 8px;
}
</style>

<script>
import api from '../../../api';
// import {getMessageForErrorCode} from '../../Errors';

export default {
  name: 'EventList',
  computed: {
    currentEventName: function() {
      return this.currentEvent && this.currentEvent.name || '';
    },
  },
  mounted: function() {
    this.loadCurrentEvent();
  },
  watch: {
    '$route'() {
      this.loadCurrentEvent();
    },
  },
  methods: {
    async loadCurrentEvent() {
      try {
        let res = await api.getActiveEvent();
        if (res.ok) {
          this.currentEvent = res.data && res.data.id || 0;
        } else {
          if (res.error == 'NO_EVENT_SELECTED') {
            // No error to display here
            this.currentEvent = 0;
            return;
          }
          this.showErrorMessage(
            this.$t('events.err.LoadActive'),
            getMessageForErrorCode(res.error),
            res.errorDetails,
            res.error
          );
        }
      } catch (e) {
        this.showErrorMessage(
            this.$t('events.err.LoadActive'),
            e.message,
            e.stack,
            null
          );
      }
    },
    onAddClicked() {
      this.$router.push({name: 'EventEditor', params: {id: 'new'}});
    },
    onEditClicked(row) {
      this.$router.push({name: 'EventEditor', params: {id: row.id}});
    },
    onDeleteClicked(row) {
      this.selectedEvent = row;
      this.$refs.confirmDelete.open();
    },
    async onConfirmDeleteClose(type) {
      if (type == 'ok' && this.selectedEvent && this.selectedEvent.id) {
        try {
          let res = await api.deleteEvent(this.selectedEvent.id);
          if (res.ok) {
            this.$refs.search.performSearch();
            this.loadCurrentEvent();
          } else {
            this.showErrorMessage(
              this.$t('events.err.Delete'),
              getMessageForErrorCode(res.error),
              res.errorDetails,
              res.error
            );
          }
        } catch (e) {
          this.showErrorMessage(
              this.$t('events.err.Delete'),
              e.message,
              e.stack,
              null
            );
        }
      }
    },
    /**
     * Makes the selected event the active one
     *
     * @param  {Object} row   The data describing the selected event
     */
    onSetActiveClicked(row) {
      this.selectedEvent = row;
      this.$refs.confirmActive.open();
    },
    async onConfirmActiveClose(type) {
      if (type == 'ok' && this.selectedEvent && this.selectedEvent.id) {
        try {
          let res = await api.chooseActiveEvent(this.selectedEvent.id);
          if (res.ok) {
            this.loadCurrentEvent();
          } else {
            this.showErrorMessage(
              this.$t('events.err.Activate'),
              getMessageForErrorCode(res.error),
              res.errorDetails,
              res.error
            );
          }
        } catch (e) {
          this.showErrorMessage(
              this.$t('events.err.Activate'),
              e.message,
              e.stack,
              null
            );
        }
      }
    },
    showMessage(title, message, details) {
      if (this.$refs.search) {
        this.$refs.search.showMessage(title, message, details);
      }
    },
    showErrorMessage(title, message, details, code) {
      if (this.$refs.search) {
        this.$refs.search.showErrorMessage(title, message, details, code);
      }
    },
    removeMessage() {
      if (this.$refs.search) {
        this.$refs.search.removeMessage();
      }
    },
  },
  data() {
    return {
      selectedEvent: null,
      currentEvent: 0, // ID of the current event
      apiFunction: api.searchEvents.bind(api), // Don't forget to bind the scope ;)
    };
  },
};
</script>
