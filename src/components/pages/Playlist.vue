<template>
  <page-content :pageTitle="$t('wishlist.Title')" showReload @reload="loadData">
    <message
      :message="message"
      :details="messageDetails"
      :code="messageCode"
      :title="messageTitle"
      :class="messageCls"
      @close="removeMessage">
    </message>
    <md-progress md-indeterminate class="loading" :class="{ active: loading }"></md-progress>
    <template>
      <div class="resultContent" v-if="!listContent || listContent.length == 0">
        <i>{{$t('wishlist.NoResults')}}</i>
      </div>
      <md-table-card class="resultContent" v-if="listContent && listContent.length > 0">
        <md-table md-sort="title" md-sort-type="desc" v-if="!useList">
          <md-table-body>
            <md-table-row v-for="(row, rowIndex) in listContent" :key="rowIndex" :md-item="row">
              <md-table-cell width="80px">
                <flag v-bind:lang="row.video.language"></flag>
              </md-table-cell>
              <md-table-cell>{{row.video.title}}</md-table-cell>
              <md-table-cell>{{row.video.artist}}</md-table-cell>
              <md-table-cell>{{row.video.relatedMedium}}</md-table-cell>
              <md-table-cell>{{row.video.mediumDetails}}</md-table-cell>
              <md-table-cell md-numeric>
                {{getTimeString(row.video.duration)}}
                 <md-tooltip>{{$t('wishlist.Duration')}}</md-tooltip>
              </md-table-cell>
              <md-table-cell md-numeric>
                {{getWaitTimeString(row.video.duration)}}
                 <md-tooltip>{{$t('wishlist.WaitTime')}}</md-tooltip>
              </md-table-cell>
              <md-table-cell>{{row.requestedBy}}</md-table-cell>
            </md-table-row>
          </md-table-body>
        </md-table>

        <md-list class="custom-list md-triple-line" v-if="useList">
          <md-list-item v-for="(item, idx) in listContent" :key="idx">

            <flag v-bind:lang="item.video.language"></flag>

            <div class="md-list-text-container">
              <span>
                {{item.video.title}}
              </span>
              <span class="inset">
                {{item.video.artist}}
                <span v-if="item.video.relatedMedium">
                  ({{item.video.relatedMedium}}<template v-if="item.video.mediumDetails">
                  <i>{{item.video.mediumDetails}}</i></template>)
                </span>
              </span>
              <p class="inset">{{getTimeString(item.video.duration)}} | {{getWaitTimeString(item.video.duration)}} | {{item.requestedBy}}</p>
            </div>
          </md-list-item>
        </md-list>
      </md-table-card>
    </template>
  </page-content>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .loading {
  opacity: 0;
  transition: opacity 200ms;
}

.loading.active {
  opacity: 1;
}

.flag {
  height: 16px;
  margin: 0 10px 0 0;
  display: inline-block;
  vertical-align: top;
}
</style>

<script>
import api from '../../api';
import {getMessageForErrorCode} from '../../Errors';
import {getTimeString, getWaitTimeString} from '../../Utils';

/**
 * The minimum width for the table result list to appear.
 * Beneath this value, the list layout will be used.
 * @type {Number}
 */
const tableLayoutMinWidth = 1024;

export default {
  name: 'MainPlaylist',
  data() {
    return {
        loading: false,
        listContent: null,
        useList: false,
    };
  },
  created: function() {
    global.window.addEventListener('resize', this.onResize);
    if (global.window.innerWidth < tableLayoutMinWidth) {
      this.useList = true;
    }
    this.loadData();
  },
  beforeDestroy: function() {
    global.window.removeEventListener('resize', this.onResize);
  },
  methods: {
    loadData: async function() {
      this.currentDuration = 0;
      this.loading = true;
      this.removeMessage();
      try {
        let res = await api.getMainPlaylistEntries();
        if (res.ok) {
          this.currentDuration = 0;
          this.listContent = res.data && res.data.list || [];
        } else {
          this.showErrorMessage(
            this.$t('wishlist.err.Load'),
            getMessageForErrorCode(res.error),
            res.errorDetails,
            res.error
          );
          this.listContent = [];
        }
      } catch (e) {
        this.showErrorMessage(
            this.$t('wishlist.err.Load'),
            e.message,
            e.stack,
            null
          );
        this.message = e.message;
        this.listContent = [];
      }
      this.loading = false;
    },
    getWaitTimeString: function(rowDuration) {
      return getWaitTimeString(this, rowDuration);
    },
    onResize: function() {
      let width = global.window.innerWidth;
      this.currentDuration = 0;
      // Shall we switch between list and table mode?
      if (this.useList && width >= tableLayoutMinWidth) {
        this.useList = false;
      } else if (!this.useList && width < tableLayoutMinWidth) {
        this.useList = true;
      }
    },
    getTimeString: getTimeString,
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
