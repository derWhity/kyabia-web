<template>
  <page-content
    ref="content"
    :pageTitle="pageTitle"
    showReload
    :showAdd="showAdd"
    :loading="loading"
    @reload="loadList"
    @add="$emit('add')"
  >
      <template>
        <div class="resultContent" v-if="listItems && listItems.length == 0">
          <i>{{noItemsMsg}}</i>
        </div>
        <md-table-card class="resultContent" v-if="listItems && listItems.length > 0">
        <md-table v-if="!useList">
          <md-table-body>
            <slot name="tableItems" v-for="item in listItems" :row="item"></slot>
          </md-table-body>
        </md-table>

        <md-list class="custom-list md-triple-line" v-if="useList">
          <slot name="listItems" v-for="item in listItems" :row="item"></slot>
        </md-list>
      </md-table-card>
    </template>
    <slot></slot>
  </page-content>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.resultContent h3 {
  padding: 0 6px 0 6px;
}

@media (min-width: 600px) {
  .resultContent {
    padding: 0 10px 0 10px;
  }

  .resultContent h3 {
    padding: 0;
  }
}

.action {
  padding: 0;
}

</style>

<script>
import _ from 'lodash';
import {getMessageForErrorCode} from '../Errors';
import {unmarshalDatesInArray} from '../Utils';

/**
 * The minimum width for the table result list to appear.
 * Beneath this value, the list layout will be used.
 * @type {Number}
 */
const tableLayoutMinWidth = 1024;

export default {
  name: 'ListPage',
  props: {
    // The title of the page to display
    pageTitle: String,
    // API function to use for listing items
    listApiFunction: Function,
    // Show the add button?
    showAdd: Boolean,
    // Load the list on startup
    loadOnStartup: Boolean,
    // Message to show when there are no items on the list to display
    noItemsMessage: String,
    // Do not reset the message on list reload
    dontResetMessageOnLoad: Boolean,
  },
  data() {
    return {
      loading: false,
      useList: false,
      listItems: null,
    };
  },
  computed: {
    noItemsMsg() {
        return this.noItemsMessage || this.$t('list.Empty');
    },
  },
  mounted: function() {
    global.window.addEventListener('resize', this.onResize);
    if (global.window.innerWidth < tableLayoutMinWidth) {
      this.useList = true;
    }
    if (this.loadOnStartup) {
      this.loadList();
    }
  },
  beforeDestroy: function() {
    global.window.removeEventListener('resize', this.onResize);
  },
  methods: {
    onResize: function() {
      let width = global.window.innerWidth;
      // Shall we switch between list and table mode?
      if (this.useList && width >= tableLayoutMinWidth) {
        this.useList = false;
      } else if (!this.useList && width < tableLayoutMinWidth) {
        this.useList = true;
      }
    },
    loadList: async function() {
      this.loading = true;
      if (!this.dontResetMessageOnLoad) {
        this.removeMessage();
      }
      try {
        let res = await this.listApiFunction();
        if (res.ok) {
          this.listItems = res.data && _.isArray(res.data) && unmarshalDatesInArray(res.data) || [];
          this.$emit('load');
        } else {
          this.showErrorMessage(
            this.$t('list.err.Load'),
            getMessageForErrorCode(res.error),
            res.errorDetails,
            res.error
          );
          this.listItems = [];
        }
      } catch (e) {
        this.showErrorMessage(
            this.$t('list.err.Load'),
            e.message,
            e.stack,
            null
          );
        this.message = e.message;
        this.listItems = [];
      }
      this.loading = false;
    },
    showMessage(title, message, details) {
      if (this.$refs.content) {
        this.$refs.content.showMessage(title, message, details);
      }
    },
    showErrorMessage(title, message, details, code) {
      if (this.$refs.content) {
        this.$refs.content.showErrorMessage(title, message, details, code);
      }
    },
    removeMessage() {
      if (this.$refs.content) {
        this.$refs.content.removeMessage();
      }
    },
  },
};
</script>

