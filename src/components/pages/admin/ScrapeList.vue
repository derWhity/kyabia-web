<template>
  <list-page
    ref="list"
    :pageTitle="$t('scraping.Title')"
    :noItemsMessage="$t('scraping.NoScrapesActive')"
    :listApiFunction="apiFunction"
    showAdd
    loadOnStartup
    dontResetMessageOnLoad
    @load="rescheduleTimeout"
    @add="onAddClick"
  >
    <template slot="tableItems" scope="props">
      <md-table-row :key="props.row.rootDir" :md-item="props.row">
        <md-table-cell width="80px">
          <md-icon>{{getStatusIcon(props.row.status)}}</md-icon>
          <md-tooltip md-direction="bottom" md-delay="300">{{getStatusTranslation(props.row.status)}}</md-tooltip>
        </md-table-cell>
        <md-table-cell>
          {{props.row.rootDir}}
          <md-tooltip md-direction="bottom" md-delay="300">{{$t('scraping.RootDirectory')}}</md-tooltip>
        </md-table-cell>
        <md-table-cell>
          {{getBasename(props.row.currentFile)}}
          <md-tooltip md-direction="bottom" md-delay="300">{{$t('scraping.CurrentFile')}}</md-tooltip>
        </md-table-cell>
        <md-table-cell width="220px" md-numeric>
          <div>
            <md-icon>fiber_new</md-icon> {{props.row.newFiles}}
            <md-icon>edit</md-icon> {{props.row.updatedFiles}}
            <md-icon>search</md-icon> {{props.row.filesScraped}}
          </div>
          <md-tooltip md-direction="bottom" md-delay="300">{{$t('scraping.StatsDescription')}}</md-tooltip>
        </md-table-cell>
        <md-table-cell width="180px" md-numeric>
          {{getTimePassed(props.row.startedAt)}}
          <md-tooltip md-direction="bottom" md-delay="300">{{$t('scraping.RuntimeDesc', { start: props.row.startedAt })}}</md-tooltip>
        </md-table-cell>
      </md-table-row>
    </template>

    <template slot="listItems" scope="props">
      <md-list-item>
        <div class="md-list-text-container">
          <span>
            <md-icon>{{getStatusIcon(props.row.status)}}</md-icon> {{props.row.rootDir}}
          </span>
          <span class="inset">
            <div class="right">
              <md-icon>fiber_new</md-icon> {{props.row.newFiles}}
              <md-icon>edit</md-icon> {{props.row.updatedFiles}}
              <md-icon>search</md-icon> {{props.row.filesScraped}}
            </div>
          </span>
          <p class="inset right"><i>{{$t('scraping.Runtime')}}</i> {{getTimePassed(props.row.startedAt)}} <i>{{props.row.mediumDetail}}</i></p>
        </div>
      </md-list-item>
    </template>

    <template>
      <md-list>
        <md-list-item>
          <md-switch v-model="autoReloadActive" class="md-primary">{{$t('scraping.AutoReload')}}</md-switch>
          <select-folder-dialog
            ref="selectFolder"
            @ok="onFolderSelected"
          >
          </select-folder-dialog>
        </md-list-item>
      </md-list>
    </template>
  </list-page>
</template>

<style scoped>
.right {
  text-align: right;
}
</style>


<script>
import api from '../../../api';
import {getMessageForErrorCode} from '../../../Errors';
import _ from 'lodash';

const statusNames = {
  finished: {
    icon: 'done',
  },
  running: {
    icon: 'rowing',
  },
  queued: {
    icon: 'pause_circle_outline',
  },
  failed: {
    icon: 'warning',
  },
  cancelled: {
    icon: 'remove_circle_outline',
  },
  unknown: {
    icon: 'help_outline',
  },
};

export default {
  name: 'ScrapeList',
  data() {
    return {
      apiFunction: api.listRunningScrapes.bind(api),
      activeTimeout: 0,
      autoReloadActive: true,
    };
  },
  mounted: function() {
    this.startAutoReload();
  },
  beforeDestroy: function() {
    this.stopAutoReload();
  },
  watch: {
    autoReloadActive() {
      this.rescheduleTimeout();
    },
  },
  methods: {
    async timeoutFn() {
      if (this.$refs.list) {
        await this.$refs.list.loadList();
        this.rescheduleTimeout();
      }
    },
    rescheduleTimeout() {
      this.stopAutoReload();
      if (!this.autoReloadActive) {
        return;
      }
      if (!this.$refs.list || !this.$refs.list.listItems || this.allDone(this.$refs.list.listItems)) {
        // Use a slower reload
        this.activeTimeout = window.setTimeout(this.timeoutFn.bind(this), 30000);
      } else {
        // As long something is active, speed things up
        this.activeTimeout = window.setTimeout(this.timeoutFn.bind(this), 1000);
      }
    },
    startAutoReload() {
      // Cleanup any running timeouts for now
      this.stopAutoReload();
      // Auto-Reload every second
      this.activeTimeout = window.setTimeout(this.timeoutFn.bind(this), 1000);
    },
    stopAutoReload() {
      if (this.activeTimeout != 0) {
        window.clearTimeout(this.activeTimeout);
      }
      this.activeTimeout = 0;
    },
    getStatusTranslation(status) {
      let tlKey = `scraping.status.${status}`;
      let translation = this.$t(tlKey);
      return translation == tlKey ? this.$t('scraping.status.unknown') : translation;
    },
    getStatusIcon(status) {
      return statusNames[status].icon || 'help_outline';
    },
    getBasename(fname) {
      const split = fname.split('/');
      return split[split.length-1];
    },
    getTimePassed(dt) {
      if (_.isDate(dt)) {
        let duration = (new Date()).getTime() - dt.getTime();
        let hours = Math.floor(duration / 3600000);
        let minutes = Math.floor((duration - hours * 3600000) / 60000);
        if (hours > 0) {
          return this.$t('scraping.DurationFormatHours', {
            hours: hours,
            minutes: minutes,
            hourLabel: hours == 1 ? this.$t('scraping.DurationHour') : this.$t('scraping.DurationHours'),
            minuteLabel: minutes == 1 ? this.$t('scraping.DurationMinute') : this.$t('scraping.DurationMinutes'),
          });
        } else if (minutes > 0) {
          let n = minutes == 1 ? 'scraping.DurationMinute' : 'scraping.DurationMinutes';
          return this.$t('scraping.DurationFormatMinutes', {minutes: minutes, minuteLabel: n});
        }
        return this.$t('scraping.DurationLessThanOneMinute');
      }
      return this.$t('scraping.DurationNone');
    },
    allDone(list) {
      let done = true;
      _.forEach(list, item => {
        // Do we have an active one
        if (['running', 'waiting'].indexOf(item.status) != -1) {
          done = false;
          return false;
        }
      });
      return done;
    },
    onAddClick() {
      this.$refs.selectFolder.open();
    },
    async onFolderSelected(path) {
      if (path) {
        this.removeMessage();
        this.$refs.list.loading = true;
        try {
          let res = await api.startScrape(path);
          if (res.ok) {
            // Reload the scrape list
            this.$refs.list.loadList();
          } else {
            this.showErrorMessage(
              t('scraping.err.FailedToStart'),
              getMessageForErrorCode(res.error),
              res.errorDetails,
              res.error
            );
          }
        } catch (e) {
          this.showErrorMessage(
              t('scraping.err.FailedToStart'),
              e.message,
              e.stack,
              null
            );
          this.message = e.message;
        }
        this.$refs.list.loading = false;
      }
    },
    showMessage(title, message, details) {
      this.$refs.list.showMessage(title, message, details);
    },
    showErrorMessage(title, message, details, code) {
      this.$refs.list.showErrorMessage(title, message, details, code);
    },
    removeMessage() {
      this.$refs.list.removeMessage();
    },
  },
};
</script>
