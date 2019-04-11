import Vue from 'vue';
import store from '../store';
import Router from 'vue-router';
import Search from 'components/pages/Search';
import Playlist from 'components/pages/Playlist';

import Events from 'components/pages/admin/Events';
import EventEditor from 'components/pages/admin/EventEditor';
import Videos from 'components/pages/admin/Videos';
import VideoEditor from 'components/pages/admin/VideoEditor';
import Playlists from 'components/pages/admin/Playlists';
import PlaylistEditor from 'components/pages/admin/PlaylistEditor';
import PlaylistEntries from 'components/pages/admin/PlaylistEntries';
import ScrapeList from 'components/pages/admin/ScrapeList';

// Settings
import SettingsMain from 'components/pages/admin/settings/Main';

Vue.use(Router);

const ensureLogin = (to, from, next) => {
  if (!store.getters.loggedIn && ['Search', 'MainPlaylist'].indexOf(to.name) == -1) {
    return next({name: 'Search'});
  }
  next();
};

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Search',
      component: Search,
    },
    {
      path: '/queue',
      name: 'MainPlaylist',
      component: Playlist,
    },
    // Admin stuff
    {
      path: '/events',
      name: 'Events',
      component: Events,
      beforeEnter: ensureLogin,
    },
    {
      path: '/events/:id',
      name: 'EventEditor',
      component: EventEditor,
      beforeEnter: ensureLogin,
    },
    {
      path: '/videos',
      name: 'Videos',
      component: Videos,
      beforeEnter: ensureLogin,
    },
    {
      path: '/videos/:id',
      name: 'VideoEditor',
      component: VideoEditor,
      beforeEnter: ensureLogin,
    },
    {
      path: '/playlists',
      name: 'Playlists',
      component: Playlists,
      beforeEnter: ensureLogin,
    },
    {
      path: '/playlists/:id',
      name: 'PlaylistEditor',
      component: PlaylistEditor,
      beforeEnter: ensureLogin,
    },
    {
      path: '/playlists/:id/entries',
      name: 'PlaylistEntries',
      component: PlaylistEntries,
      beforeEnter: ensureLogin,
    },
    {
      path: '/scrapes',
      name: 'ScrapeList',
      component: ScrapeList,
      beforeEnter: ensureLogin,
    },
    {
      path: '/settings',
      name: 'SettingsMain',
      component: SettingsMain,
      beforeEnter: ensureLogin,
    },
  ],
});
