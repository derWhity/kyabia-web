<template>
  <md-sidenav class="main-sidebar md-left md-fixed" md-swipeable ref="sidebar">
    <md-whiteframe md-tag="md-toolbar" md-elevation="1" class="logo-header md-medium">
      <div class="md-toolbar-container">
      </div>
    </md-whiteframe>
    <md-list>
      <md-list-item>
        <router-link exact to="/">
          <md-icon>search</md-icon>
          <span>{{$t('nav.Search')}}</span>
        </router-link>
      </md-list-item>
      <md-list-item>
        <router-link exact to="/queue">
          <md-icon>list</md-icon>
          <span>{{$t('nav.EventPlaylist')}}</span>
        </router-link>
      </md-list-item>
      <template v-if="$store.getters.loggedIn">
        <md-divider></md-divider>
        <md-subheader>{{$t('nav.section.Admin')}}</md-subheader>
        <md-list-item>
          <router-link to="/events">
            <md-icon>stars</md-icon>
            <span>{{$t('nav.Events')}}</span>
          </router-link>
        </md-list-item>
        <md-list-item>
          <router-link exact to="/videos">
            <md-icon>theaters</md-icon>
            <span>{{$t('nav.Videos')}}</span>
          </router-link>
        </md-list-item>
        <md-list-item>
          <router-link to="/playlists">
            <md-icon>list</md-icon>
            <span>{{$t('nav.Playlists')}}</span>
          </router-link>
        </md-list-item>
        <md-list-item>
          <router-link exact to="/scrapes">
            <md-icon>note_add</md-icon>
            <span>{{$t('nav.Scraping')}}</span>
          </router-link>
        </md-list-item>
        <md-list-item>
          <router-link to="/settings">
            <md-icon>settings</md-icon>
            <span>{{$t('nav.Settings')}}</span>
          </router-link>
        </md-list-item>
      </template>
    </md-list>
  </md-sidenav>
</template>

<script>
export default {
  name: 'navigation',
  data() {
    return {};
  },
  watch: {
    '$route': function() {
      this.close();
    },
  },
  methods: {
    toggle: function() {
      this.$refs['sidebar'].toggle();
    },
    close: function() {
      this.$refs['sidebar'].close();
    },
  },
};
</script>

<style>

.logo-header {
  background-image: url(/static/img/logo1x.png);
  background-size: 128px 128px;
  background-repeat: no-repeat;
  background-position: 0 8px;
}

@media only screen and (-webkit-min-device-pixel-ratio: 2) {
  .logo-header {
    background-image: url(/static/img/logo2x.png);
  }
}

@media only screen and (-webkit-min-device-pixel-ratio: 3) {
  .logo-header {
    background-image: url(/static/img/logo3x.png);
  }
}

@media (min-width: 1280px) {
  .md-sidenav.md-left.main-sidebar .md-sidenav-content {
    top: 0;
    pointer-events: auto;
    transform: translate3d(0, 0, 0);
    border-right-style: solid;
    border-right-width: 1px;
    border-right-color: #888;
  }

  .md-sidenav.main-sidebar .md-backdrop {
    opacity: 0;
    pointer-events: none;
  }
}

</style>
