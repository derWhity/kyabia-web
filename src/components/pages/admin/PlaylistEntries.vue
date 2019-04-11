<template>
  <page-content :pageTitle="title" showReload @reload="loadData" showBack>
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
      <div class="resultContent" v-if="listContent && listContent.length <= 1">
        <i>{{$t('playlistEntries.Empty')}}</i>
      </div>
      <md-table-card class="resultContent" v-if="listContent && listContent.length > 1">
        <md-table md-sort="title" md-sort-type="desc" v-if="!useList">
          <md-table-body>
            <template v-for="(row, rowIndex) in listContent">
              <md-table-row
                class="unselectable"
                :md-item="row"
                :draggable="row.id ? 'true' : 'false'"
                :key="rowIndex + '_item'"
                @dragover.native="onDragOver($event, row)"
                @dragleave.native="onDragLeave($event, row)"
                @dragstart.native="onDragStart($event, row)"
                @drop.native="onDrop($event, row)"
                :class="{draggedOver: row.draggedOver}"
              >
                <md-table-cell width="80px" v-if="row.video">
                  <flag v-bind:lang="row.video.language"></flag>
                </md-table-cell>
                <md-table-cell width="80px" v-if="row.video">{{row.video.identifier}}</md-table-cell>
                <md-table-cell v-if="row.video">{{row.video.title}}</md-table-cell>
                <md-table-cell v-if="row.video">{{row.video.artist}}</md-table-cell>
                <md-table-cell v-if="row.video">{{row.video.relatedMedium}}</md-table-cell>
                <md-table-cell v-if="row.video">{{row.video.mediumDetails}}</md-table-cell>
                <md-table-cell v-if="row.video" md-numeric>
                {{getTimeString(row.video.duration)}}
                 <md-tooltip>{{$t('playlistEntries.Duration')}}</md-tooltip>
              </md-table-cell>
              <md-table-cell v-if="row.video" md-numeric>
                {{getWaitTimeString(row.video.duration)}}
                 <md-tooltip>{{$t('playlistEntries.WaitTime')}}</md-tooltip>
              </md-table-cell>
                <md-table-cell v-if="row.video">{{row.requestedBy}}</md-table-cell>
                <md-table-cell width="100px" v-if="row.video">
                  <md-button @click.native="onEditRequesterClicked(row)" class="md-list-action action">
                    <md-icon>edit</md-icon>
                    <md-tooltip md-direction="left">{{$t('playlistEntries.ChangeRequester')}}</md-tooltip>
                  </md-button>
                  <md-button
                    @click.native="onMoveClicked(row)"
                    class="md-list-action action"
                  >
                    <md-icon>compare_arrows</md-icon>
                    <md-tooltip md-direction="left">{{$t('playlistEntries.MoveToOther')}}</md-tooltip>
                  </md-button>
                  <md-button @click.native="onDeleteClicked(row)" class="md-list-action action">
                    <md-icon>delete</md-icon>
                    <md-tooltip md-direction="left">{{$t('playlistEntries.Delete')}}</md-tooltip>
                  </md-button>
                </md-table-cell>
                <md-table-cell colspan="8" v-if="!row.video"></md-table-cell>
              </md-table-row>
            </template>
          </md-table-body>
        </md-table>

        <md-list class="custom-list md-triple-line" v-if="useList">
          <!-- Do not render the placeholder at the end of the list -->
          <md-list-item v-for="(item, idx) in listContent" :key="idx" v-if="item.video">

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
            <md-speed-dial md-direction="left" class="md-fab-bottom-right">
              <md-button class="md-fab md-primary" md-fab-trigger>
                <md-icon md-icon-morph>close</md-icon>
                <md-icon>settings</md-icon>
              </md-button>

              <md-button @click.native="onDeleteClicked(row)" class="md-fab md-primary md-mini md-clean">
                <md-icon>delete</md-icon>
              </md-button>

              <md-button
                @click.native="onMoveClicked(row)"
                class="md-fab md-primary md-mini md-clean"
              >
                <md-icon >compare_arrows</md-icon>
              </md-button>

              <md-button @click.native="onEditRequesterClicked(row)" class="md-fab md-primary md-mini md-clean">
                <md-icon>edit</md-icon>
              </md-button>

            </md-speed-dial>
          </md-list-item>
        </md-list>
      </md-table-card>
    </template>
    <md-dialog-confirm
      ref="confirmDelete"
      :md-title="$t('playlistEntries.dialog.delete.Title')"
      :md-content-html="$t('playlistEntries.dialog.delete.Content')"
      :md-ok-text="$t('misc.Yes')"
      :md-cancel-text="$t('misc.No')"
      @close="onConfirmDeleteClose"
    >
    </md-dialog-confirm>

    <md-dialog-prompt
      :md-title="$t('playlistEntries.dialog.changeRequester.Title')"
      :md-ok-text="$t('misc.Ok')"
      :md-cancel-text="$t('misc.Cancel')"
      @close="onEditRequesterClose"
      v-model="requesterName"
      ref="editRequesterPrompt">
    </md-dialog-prompt>

    <choose-playlist-dialog ref="selectorDiag" @ok="onPlaylistSelected"></choose-playlist-dialog>

    <md-snackbar ref="successSnack" md-position="bottom center">
      <span>{{snackMsg}}</span>
      <md-button class="md-accent" md-theme="light-blue" @click.native="$refs.successSnack.close()">Ok</md-button>
    </md-snackbar>
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

.unselectable td {
  background-color: transparent !important;
}

.draggedOver {
  box-shadow: inset 0px 5px 0px 0px rgb(114, 112, 228);
}

.flag {
  height: 16px;
  margin: 0 10px 0 0;
  display: inline-block;
  vertical-align: top;
}

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
import {getMessageForErrorCode} from '../../../Errors';
import _ from 'lodash';
import {getTimeString, getWaitTimeString} from '../../../Utils';

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
        playlist: null,
        listContent: null,
        useList: false,
        selectedRow: null,
        snackMsg: '',
        messageTitle: null,
        message: null,
        messageCode: null,
        messageDetails: null,
        messageCls: [],
        requesterName: '',
    };
  },
  computed: {
    title() {
      return this.playlist ?
        this.$t('playlistEntries.Title', {name: this.playlist.name}) :
        this.$t('playlistEntries.TitleEmpty');
    },
  },
  watch: {
    '$route': function() {
      this.loadData();
    },
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
    loadPlaylistInfo: async function() {
      let id = Number.parseInt(this.$route.params.id, 10);
      if (!_.isFinite(id)) {
        return;
      }
      this.loading = true;
      try {
        let res = await api.getPlaylist(id);
        if (res.ok) {
          this.playlist = res.data || null;
        } else {
          this.showErrorMessage(
            this.$t('playlistEntries.err.LoadInfo'),
            getMessageForErrorCode(res.error),
            res.errorDetails,
            res.error
          );
          this.playlist = null;
        }
      } catch (e) {
        this.showErrorMessage(
            this.$t('playlistEntries.err.LoadInfo'),
            e.message,
            e.stack,
            null
          );
        this.message = e.message;
        this.playlist = null;
      }
      this.loading = false;
    },
    loadData: async function() {
      let id = Number.parseInt(this.$route.params.id, 10);
      this.currentDuration = 0;
      if (!_.isFinite(id)) {
        this.showErrorMessage(
          this.$t('playlistEntries.err.LoadInfo'),
          this.$t('playlistEntries.err.NoListSelected'),
        );
        return;
      }
      this.loadPlaylistInfo();
      this.loading = true;
      this.removeMessage();
      try {
        let res = await api.getPlaylistEntries(id);
        if (res.ok) {
          this.listContent = res.data && res.data.list || [];
          // Add a dummy row to be able to drag&drop to the end of the list
          this.currentDuration = 0;
          this.listContent.push({});
        } else {
          this.showErrorMessage(
            this.$t('playlistEntries.err.LoadInfo'),
            getMessageForErrorCode(res.error),
            res.errorDetails,
            res.error
          );
          this.listContent = null;
        }
      } catch (e) {
        this.showErrorMessage(
            this.$t('playlistEntries.err.LoadInfo'),
            e.message,
            e.stack,
            null
          );
        this.message = e.message;
        this.listContent = null;
      }
      this.loading = false;
    },
    onResize: function() {
      let width = global.window.innerWidth;
      // Shall we switch between list and table mode?
      this.currentDuration = 0;
      if (this.useList && width >= tableLayoutMinWidth) {
        this.useList = false;
      } else if (!this.useList && width < tableLayoutMinWidth) {
        this.useList = true;
      }
    },
    onDragStart(ev, row) {
      this.selectedRow = row;
    },
    onDragOver(ev, row) {
      const rowIndex = this.listContent.indexOf(row);
      const dragItemIndex = this.listContent.indexOf(this.selectedRow);
      // Cannot be placed before itself and not before its successing row
      if (this.selectedRow != row && dragItemIndex != (rowIndex-1)) {
        ev.preventDefault();
        this.$set(row, 'draggedOver', true);
      }
    },
    onDragLeave(ev, row) {
      this.$set(row, 'draggedOver', false);
    },
    async onDrop(ev, row) {
      this.$set(row, 'draggedOver', false);
      if (_.isFinite(this.selectedRow.id) && this.selectedRow.id > 0) {
        this.loading = true;
        this.removeMessage();
        const other = row && _.isFinite(row.id) ? row.id : 0;
        try {
          let res = await api.placePlaylistEntryBefore(this.selectedRow.id, other);
          if (!res.ok) {
            this.showErrorMessage(
              this.$t('playlistEntries.err.ChangeOrder'),
              getMessageForErrorCode(res.error),
              res.errorDetails,
              res.error
            );
          }
        } catch (e) {
          this.showErrorMessage(
              this.$t('playlistEntries.err.ChangeOrder'),
              e.message,
              e.stack,
              null
            );
          this.message = e.message;
        }
        this.loading = false;
        this.loadData();
      }
    },
    onDeleteClicked(row) {
      this.selectedRow = row;
      this.$refs.confirmDelete.open();
    },
    async onConfirmDeleteClose(type) {
      if (type == 'ok' && this.selectedRow && this.selectedRow.id) {
        try {
          let res = await api.deletePlaylistEntry(this.selectedRow.id);
          if (res.ok) {
            this.showMessage(this.$t('playlistEntries.DeleteSuccessful'));
          } else {
            this.showErrorMessage(
              this.$t('playlistEntries.err.Delete'),
              getMessageForErrorCode(res.error),
              res.errorDetails,
              res.error
            );
          }
        } catch (e) {
          this.showErrorMessage(
              this.$t('playlistEntries.err.Delete'),
              e.message,
              e.stack,
              null
            );
        }
        this.loadData();
      }
    },
    onMoveClicked(row) {
      this.selectedRow = row;
      this.$refs.selectorDiag.open();
    },
    async onPlaylistSelected(playlist) {
      if (playlist && playlist > 0 &&
          this.selectedRow && this.selectedRow.id
        ) {
        this.selectedRow.playlistId = playlist;
        this.removeMessage();
        try {
          let res = await api.updatePlaylistEntry(this.selectedRow.id, this.selectedRow);
          if (res.ok) {
            this.showMessage(this.$t('playlistEntries.MoveSuccessful'));
          } else {
            this.showErrorMessage(
              this.$t('playlistEntries.err.Move'),
              getMessageForErrorCode(res.error),
              res.errorDetails,
              res.error
            );
          }
        } catch (e) {
          this.showErrorMessage(
              this.$t('playlistEntries.err.Move'),
              e.message,
              e.stack,
              null
            );
        }
        this.loadData();
      }
    },
    onEditRequesterClicked(row) {
      this.selectedRow = row;
      this.requesterName = row.requestedBy;
      this.$refs.editRequesterPrompt.open();
    },
    async onEditRequesterClose(ret) {
      if (ret == 'ok' && this.selectedRow && this.selectedRow.id &&
          this.requesterName && this.requesterName.trim()
        ) {
        this.selectedRow.requestedBy = this.requesterName;
        this.removeMessage();
        try {
          let res = await api.updatePlaylistEntry(this.selectedRow.id, this.selectedRow);
          if (res.ok) {
            this.showMessage(this.$t('playlistEntries.ChangeSuccessful'));
          } else {
            this.showErrorMessage(
              this.$t('playlistEntries.err.Change'),
              getMessageForErrorCode(res.error),
              res.errorDetails,
              res.error
            );
          }
        } catch (e) {
          this.showErrorMessage(
              this.$t('playlistEntries.err.Change'),
              e.message,
              e.stack,
              null
            );
        }
        this.loadData();
      }
    },
    getTimeString: getTimeString,
    getWaitTimeString: function(rowDuration) {
      return getWaitTimeString(this, rowDuration);
    },
    showMessage(message) {
      this.snackMsg = message;
      this.$refs.successSnack.open();
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
