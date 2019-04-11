<template>
  <search-page
    ref="search"
    :pageTitle="$t('playlists.Title')"
    :searchApiFunction="apiFunction"
    :searchOnStartup="true"
    showAdd
    @add="createOrUpdatePlaylist(null)"
  >
    <template slot="tableItems" scope="props">
      <md-table-row :key="props.row.id" :md-item="props.row">
        <md-table-cell width="50px">
          <md-icon v-if="props.row.isMain" class="md-primary">
            star
            <md-tooltip md-direction="bottom" md-delay="300">{{$t('playlists.Current')}}</md-tooltip>
          </md-icon>
          <md-icon v-if="props.row.status == 1">
            lock
            <md-tooltip md-direction="bottom" md-delay="300">{{$t('playlists.Locked')}}</md-tooltip>
          </md-icon>
        </md-table-cell>
        <md-table-cell>
          {{props.row.name}}
          <md-tooltip md-direction="bottom" md-delay="300">{{$t('playlists.Name')}}</md-tooltip>
        </md-table-cell>
        <md-table-cell>
          {{props.row.eventName}}
          <md-tooltip md-direction="bottom" md-delay="300">{{$t('playlists.EventName')}}</md-tooltip>
        </md-table-cell>
        <md-table-cell>
          {{props.row.message}}
          <md-tooltip md-direction="bottom" md-delay="300">{{$t('playlists.LockMessage')}}</md-tooltip>
        </md-table-cell>
        <md-table-cell width="100px">
          <md-button
            @click.native="onShowContentsClicked(props.row)"
            class="md-list-action action"
          >
            <md-icon>queue_music</md-icon>
            <md-tooltip md-direction="left">{{$t('playlists.EditEntries')}}</md-tooltip>
          </md-button>
          <md-button @click.native="createOrUpdatePlaylist(props.row)" class="md-list-action action">
            <md-icon>settings</md-icon>
            <md-tooltip md-direction="left">{{$t('playlists.EditDetails')}}</md-tooltip>
          </md-button>
          <md-button @click.native="onDeleteClicked(props.row)" class="md-list-action action">
            <md-icon>delete</md-icon>
            <md-tooltip md-direction="left">{{$t('playlists.Delete')}}</md-tooltip>
          </md-button>
        </md-table-cell>
      </md-table-row>
    </template>
    <template slot="listItems" scope="props">
      <md-list-item>
        <md-icon v-if="props.row.status == 1">lock</md-icon>
        <md-icon v-if="props.row.status == 0">lock_open</md-icon>
        <div class="md-list-text-container">
          <span>
            {{props.row.name}}
          </span>
          <span class="inset">{{props.row.eventName}}</span>
        </div>


      <md-speed-dial md-direction="left" class="md-fab-bottom-right">
          <md-button class="md-fab md-primary" md-fab-trigger>
            <md-icon md-icon-morph>close</md-icon>
            <md-icon>settings</md-icon>
          </md-button>

          <md-button @click.native="onDeleteClicked(props.row)" class="md-fab md-primary md-mini md-clean">
            <md-icon>delete</md-icon>
          </md-button>

          <md-button @click.native="createOrUpdatePlaylist(props.row)" class="md-fab md-primary md-mini md-clean">
            <md-icon>settings</md-icon>
          </md-button>

          <md-button
            @click.native="onShowContentsClicked(props.row)"
            class="md-fab md-primary md-mini md-clean"
          >
            <md-icon >queue_music</md-icon>
          </md-button>

        </md-speed-dial>
      </md-list-item>
    </template>
    <template>
      <md-dialog-confirm
        ref="confirmDelete"
        :md-title="$t('playlists.dialog.delete.Title')"
        :md-content-html="$t('playlists.dialog.delete.Content', {name: selectedPlaylistName})"
        :md-ok-text="$t('misc.Yes')"
        :md-cancel-text="$t('misc.No')"
        @close="onConfirmDeleteClose"
      >
      </md-dialog-confirm>

      <md-snackbar ref="successSnack" md-position="bottom center">
        <span>{{snackMsg}}</span>
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

export default {
  name: 'PlaylistList',
  methods: {
    onShowContentsClicked(row) {
      this.$router.push({name: 'PlaylistEntries', params: {id: row.id}});
    },
    onDeleteClicked(row) {
      this.selectedPlaylist = row;
      this.$refs.confirmDelete.open();
    },
    async onConfirmDeleteClose(type) {
      if (type == 'ok' && this.selectedPlaylist && this.selectedPlaylist.id) {
        try {
          let res = await api.deletePlaylist(this.selectedPlaylist.id);
          if (res.ok) {
            this.$refs.search.performSearch();
          } else {
            this.showErrorMessage(
              'Fehler beim Löschen des Events',
              getMessageForErrorCode(res.error),
              res.errorDetails,
              res.error
            );
          }
        } catch (e) {
          this.showErrorMessage(
              'Fehler beim Löschen des Events',
              e.message,
              e.stack,
              null
            );
        }
      }
    },
    createOrUpdatePlaylist(list) {
      this.$router.push({name: 'PlaylistEditor', params: {id: (list ? list.id : 0)}});
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
      selectedPlaylist: null,
      snackMsg: '',
      apiFunction: api.searchPlaylists.bind(api), // Don't forget to bind the scope ;)
    };
  },
  computed: {
    selectedPlaylistName() {
        return this.selectedPlaylist ?
        this.$t('playlists.FormattedName', {name: this.selectedPlaylist.name, id: this.selectedPlaylist.id}) :
        this.$t('playlists.EmptyName');
    },
  },
};
</script>
