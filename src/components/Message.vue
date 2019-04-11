<template>
  <md-card v-if="message">
    <md-card-header>
      <md-card-header-text>
        <div class="md-title">{{title}}</div>
        <div class="md-subhead" v-if="code">{{code}}</div>
      </md-card-header-text>

      <md-button class="md-icon-button" @click.native="$emit('close')">
        <md-icon>highlight_off</md-icon>
        <md-tooltip md-direction="left">{{$t('misc.Close')}}</md-tooltip>
      </md-button>
    </md-card-header>

    <md-card-content>
      <md-card-area>
        {{message}}
      </md-card-area>
      <pre v-if="details && $store.getters.loggedIn">{{JSON.stringify(details, null, 4)}}</pre>
    </md-card-content>

  </md-card>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
pre {
  margin: 0;
  padding: 5px;
  background-color: rgba(0,0,0, 0.2);
  word-wrap: auto;
  overflow: scroll;
}
</style>

<script>
export default {
  name: 'Message',
  props: ['message', 'details', 'code', 'title'],
  data() {
    return {};
  },
};
</script>
