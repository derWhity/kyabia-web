// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import App from './App';
import router from './router';
import store from './store';
import Promise from 'promise-polyfill';

// Material design setup
import Material from 'vue-material';
Vue.use(Material);

// I18n
import {translations as tlDe} from 'i18n/de.js';
import {translations as tlEn} from 'i18n/en.js';

Vue.use(VueI18n);
const messages = {
    de: tlDe,
    en: tlEn,
};
const i18n = new VueI18n({
    locale: window.navigator.language.split('-')[0] || 'en',
    fallbackLocale: 'en',
    messages,
});

// Promise polyfill
if (!window.Promise) {
  window.Promise = Promise;
}

// Conponents
import PageContent from './components/PageContent';
import SearchPage from './components/SearchPage';
import Navigation from './components/Navigation';
import Message from './components/Message';
import Flag from './components/Flag';
import UserMenu from './components/UserMenu';
import Login from './components/Login';
import RequestVideoDialog from './components/RequestVideoDialog';
import Datepicker from 'vuejs-datepicker';
import ChoosePlaylistDialog from './components/ChoosePlaylistDialog';
import ListPage from './components/ListPage';
import SelectFolderDialog from './components/dialogs/SelectFolder';
import {init as errorInit} from './Errors';
import {init as utilInit} from './Utils';


Vue.component('page-content', PageContent);
Vue.component('search-page', SearchPage);
Vue.component('list-page', ListPage);
Vue.component('navigation', Navigation);
Vue.component('message', Message);
Vue.component('flag', Flag);
Vue.component('request-video-dialog', RequestVideoDialog);
Vue.component('user-menu', UserMenu);
Vue.component('login', Login);
Vue.component('datepicker', Datepicker);
Vue.component('choose-playlist-dialog', ChoosePlaylistDialog);
Vue.component('select-folder-dialog', SelectFolderDialog);

Vue.material.registerTheme({
    default: {
        primary: {
            color: 'indigo',
            hue: 600,
        },
        accent: 'brown',
    },
});

errorInit(i18n);
utilInit(i18n);

let Application = Vue.component('app', App);
/* eslint-disable no-new */
new Application({
    i18n,
    el: '#app',
    router,
    store,
});
