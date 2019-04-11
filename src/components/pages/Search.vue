<template>
  <search-page ref="search" :pageTitle="$t('search.Title')" :searchApiFunction="apiFunction" :searchOnStartup="true">
    <template slot="tableItems" scope="props">
      <md-table-row :key="props.row.sha512" :md-item="props.row">
        <md-table-cell width="80px">
          <flag v-bind:lang="props.row.language"></flag>
        </md-table-cell>
        <md-table-cell>{{props.row.title}}</md-table-cell>
        <md-table-cell>{{props.row.artist}}</md-table-cell>
        <md-table-cell>{{props.row.relatedMedium}}</md-table-cell>
        <md-table-cell>{{props.row.mediumDetail}}</md-table-cell>
        <md-table-cell md-numeric>
                {{getTimeString(props.row.duration)}}
                 <md-tooltip>{{$t('search.Duration')}}</md-tooltip>
              </md-table-cell>
        <md-table-cell>
          <md-button v-if="!locked" @click.native="onAddClicked(props.row)" class="md-list-action action">
            <md-icon>playlist_add</md-icon>
            <md-tooltip md-direction="left">{{$t('search.MakeAWish')}}</md-tooltip>
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
          <p class="inset">{{props.row.relatedMedium}} <i>{{props.row.mediumDetail}}</i></p>
        </div>
        <md-button class="md-list-action action" @click.native="onAddClicked(props.row)">
          <md-icon>playlist_add</md-icon>
        </md-button>
      </md-list-item>
    </template>
    <template>
      <request-video-dialog :video="selectedVideo" ref="selectorDiag" @ok="onWishMade"></request-video-dialog>
      <md-snackbar ref="successSnack" md-position="bottom center">
        <span>{{$t('search.WishSuccessful')}}</span>
        <md-button class="md-accent" md-theme="light-blue" @click.native="$refs.successSnack.close()">Ok</md-button>
      </md-snackbar>
    </template>
  </search-page>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.action {
  padding: 0;
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
import {getTimeString} from '../../Utils';

export default {
  name: 'search',
  methods: {
    onAddClicked: function(data) {
      this.selectedVideo = data;
      this.$refs.selectorDiag.open();
    },
    onWishMade: async function(video, requester) {
      if (requester && requester.trim()) {
        this.$refs.search.removeMessage();
        try {
          let res = await api.makeWish(video.sha512, requester);
          if (res.ok) {
            this.$refs.successSnack.open();
          } else {
            this.$refs.search.showErrorMessage(
              this.$t('search.err.MakeAWish'),
              getMessageForErrorCode(res.error),
              res.errorDetails,
              res.error
            );
          }
        } catch(e) {
          this.showErrorMessage(
            this.$t('search.err.MakeAWish'),
            e.message,
            e.stack,
            null
          );
        }
      }
    },
    getTimeString: getTimeString, // Make it available for the template
    loadSearchResults: async function(term, offset, limit) {
      // Load the info about the main playlist
      let message = '';
      try {
        let data = await api.getMainPlaylist();
        let list = data.data;
        this.locked = list && list.status == 1;
        message = list && list.message || '';
        if ((!message || !message.trim()) && this.locked) {
          // Show a default lock message
          message = this.$t('search.DefaultLockMessage');
        }
      } catch (e) {
        this.locked = true;
      }
      let res = await api.searchVideos(term, offset, limit);
      // Show a message
      if (message && message.trim()) {
        this.$refs.search.showMessage(this.$t('misc.Info'), message);
      }
      return res;
    },
  },
  data() {
    return {
      selectedVideo: null,
      locked: false,
      apiFunction: this.loadSearchResults.bind(this),
    };
  },
};
</script>
