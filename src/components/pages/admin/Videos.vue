<template>
  <search-page ref="search" :pageTitle="$t('videos.Title')" :searchApiFunction="apiFunction" :searchOnStartup="true">
    <template slot="tableItems" scope="props">
      <md-table-row :key="props.row.sha512" :md-item="props.row">
        <md-table-cell width="80px">
          <flag v-bind:lang="props.row.language"></flag>
        </md-table-cell>
        <md-table-cell>
            {{props.row.title}}
            <md-tooltip>{{props.row.fileName}}</md-tooltip>
        </md-table-cell>
        <md-table-cell>
            {{props.row.artist}}
            <md-tooltip>{{$t('videos.Artist')}}</md-tooltip>
        </md-table-cell>
        <md-table-cell class="nowrap">
            {{props.row.relatedMedium}}<br/>
            {{props.row.mediumDetail}}
            <md-tooltip>{{$t('videos.RelatedMedium')}}</md-tooltip>
        </md-table-cell>
        <md-table-cell md-numeric>
            {{getTimeString(props.row.duration)}}
            <md-tooltip>{{$t('videos.Duration')}}</md-tooltip>
        </md-table-cell>
        <md-table-cell v-if="props.row.videoFormat !== undefined" class="nowrap">
            {{props.row.videoFormat}} @ {{props.row.width}}x{{props.row.height}}<br/>
            {{props.row.audioFormat}} @ {{getBitrateString(props.row.audioBitrate)}}
            <md-tooltip>{{$t('videos.FormatInfo')}}</md-tooltip>
        </md-table-cell>
        <md-table-cell md-numeric>
            {{props.row.numRequested}}
            <md-tooltip>{{$t('videos.NumWishes')}}</md-tooltip>
        </md-table-cell>
        <md-table-cell width="50">
          <md-button @click.native="onAddClicked(props.row)" class="md-list-action action">
            <md-icon>playlist_add</md-icon>
            <md-tooltip md-direction="left">{{$t('videos.AddToPlaylist')}}</md-tooltip>
          </md-button>
          <md-button
            @click.native="onEditClicked(props.row)"
            class="md-list-action action"
          >
            <md-icon>mode_edit</md-icon>
            <md-tooltip md-direction="left">{{$t('videos.Edit')}}</md-tooltip>
          </md-button>
          <md-button @click.native="onDeleteClicked(props.row)" class="md-list-action action">
            <md-icon>delete</md-icon>
            <md-tooltip md-direction="left">{{$t('videos.Delete')}}</md-tooltip>
          </md-button>
        </md-table-cell>
      </md-table-row>
    </template>
    <template slot="listItems" scope="props">
      <md-list-item>
        <flag v-bind:lang="props.row.language"></flag>
        <div class="md-list-text-container">
          <span>
            {{props.row.title}}
          </span>
          <span class="inset">{{props.row.artist}}</span>
          <p class="inset">{{props.row.relatedMedium}} <i>{{props.row.mediumDetails}}</i></p>
        </div>
        <md-speed-dial md-direction="left" class="md-fab-bottom-right">
          <md-button class="md-fab md-primary" md-fab-trigger>
            <md-icon md-icon-morph>close</md-icon>
            <md-icon>settings</md-icon>
          </md-button>

          <md-button class="md-fab md-primary md-mini md-clean" @click.native="onDeleteClicked(props.row)">
            <md-icon>delete</md-icon>
          </md-button>

          <md-button class="md-fab md-primary md-mini md-clean" @click.native="onEditClicked(props.row)">
            <md-icon>mode_edit</md-icon>
          </md-button>

          <md-button class="md-fab md-primary md-mini md-clean" @click.native="onAddClicked(props.row)">
            <md-icon>playlist_add</md-icon>
          </md-button>

        </md-speed-dial>
      </md-list-item>
    </template>
    <template>
      <choose-playlist-dialog ref="selectorDiag" @ok="onPlaylistSelected" promptRequester></choose-playlist-dialog>
      <md-snackbar ref="successSnack" md-position="bottom center">
        <span>{{$t('videos.AddToPlaylistSuccessful')}}</span>
        <md-button class="md-accent" md-theme="light-blue" @click.native="$refs.successSnack.close()">Ok</md-button>
      </md-snackbar>
      <md-dialog-confirm
        ref="confirmDelete"
        :md-title="$t('videos.dialog.delete.Title')"
        :md-content-html="$t('videos.dialog.delete.Content', {name: currentVideoName})"
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

.nowrap {
    white-space: nowrap;
}

.details {
    color: #888;
}

.flag {
  height: 16px;
  margin: 0 10px 0 0;
  display: inline-block;
  vertical-align: top;
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
import _ from 'lodash';
import {getMessageForErrorCode} from '../../../Errors';

export default {
  name: 'Videos',
  methods: {
    getBitrateString: function(data) {
        if (_.isFinite(data)) {
            // Megabit?
            if (data / (1000 * 1000) > 1) {
                return _.round(data/ (1000 * 1000), 2) + ' ' + this.$t('videos.Mbps');
            }
            // Kilobit?
            if ((data / 1000) > 1) {
                return _.round(data / 1000, 2) + ' ' + this.$t('videos.Kbps');
            }
            // Bit
        }
        return '-';
    },
    getTimeString: function(data) {
        data = data / 1000000000;
        let str = '';
        let hours = Math.floor(data / 3600);
        if (hours > 0) {
            str += _.padStart(hours, 2, '0') + ':';
        }
        data = data - (hours * 3600);
        let minutes = Math.floor((data / 60));
        if (str || minutes) {
            str += _.padStart(minutes, 2, '0') + ':';
        }
        data = data - (minutes * 60);
        // Seconds
        str += _.padStart(Math.round(data), 2, '0');
        return str;
    },
    onAddClicked: function(data) {
      this.selectedVideo = data;
      this.$refs.selectorDiag.open();
    },
    onPlaylistSelected: async function(playlist, requester) {
      if (playlist && playlist > 0 &&
          requester && requester.trim() &&
          this.selectedVideo && this.selectedVideo.sha512
        ) {
        this.removeMessage();
        let res = await api.addPlaylistEntry(playlist, this.selectedVideo.sha512, requester);
        if (res.ok) {
          this.$refs.successSnack.open();
          this.$refs.search.performSearch();
        } else {
          this.$refs.search.showErrorMessage(
            this.$t('videos.err.AddToPlaylist'),
            getMessageForErrorCode(res.error),
            res.errorDetails,
            res.error
          );
        }
      }
    },
    onEditClicked: function(row) {
      this.$router.push({name: 'VideoEditor', params: {id: row.sha512}});
    },
    onDeleteClicked: function(data) {
      this.selectedVideo = data;
      this.$refs.confirmDelete.open();
    },
    onConfirmDeleteClose: async function(type) {
      if (type == 'ok' && this.selectedVideo && this.selectedVideo.sha512) {
        try {
          let res = await api.deleteVideo(this.selectedVideo.sha512);
          if (res.ok) {
            this.$refs.search.performSearch();
          } else {
            this.showErrorMessage(
              this.$t('videos.err.Delete'),
              getMessageForErrorCode(res.error),
              res.errorDetails,
              res.error
            );
          }
        } catch (e) {
          this.showErrorMessage(
              this.$t('videos.err.Delete'),
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
      selectedVideo: null,
      apiFunction: api.searchVideos.bind(api), // Don't forget to bind the scope ;)
    };
  },
  computed: {
    currentVideoName: function() {
      return this.selectedVideo ?
      this.$t('videos.NameFormat', {artist: this.selectedVideo.artist, title: this.selectedVideo.title}) :
      this.$t('videos.NameNone');
    },
  },
};
</script>
