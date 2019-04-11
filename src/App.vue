<template>
  <div class="phone-viewport container">
    <navigation ref="main-sidebar"></navigation>
    <router-view></router-view>
  </div>
</template>

<script>
import {pagesWithoutLogin} from './Utils';

export default {
  name: 'app',
  watch: {
    '$store.getters.loggedIn': function(loggedIn) {
      if (pagesWithoutLogin.indexOf(this.$route.name) == -1) {
        // Go back to main page
        this.$router.push({name: 'Search'});
      }
    },
  },
  methods: {
    toggleSidenav() {
      this.$refs['main-sidebar'].toggle();
    },
    closeSidenav() {
      this.$refs['main-sidebar'].close();
    },
  },
};
</script>

<style>
/* Hack for the sidenav to be kind-of responsive */

body {
  display: flex;
  overflow: hidden;
  height: 100%;
}

.container {
  box-sizing: content-box;
  padding-left: 0;
  display: flex;
  overflow: hidden;
  flex: 1;
}

@media (min-width: 1280px) {
  .container {
    padding-left: 304px;
    transition: all .4s cubic-bezier(.25,.8,.25,1);
    transition-property: padding-left;
    will-change: padding-left;
  }
}
</style>
