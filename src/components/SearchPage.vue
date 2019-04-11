<template>
  <page-content
    ref="content"
    :pageTitle="pageTitle"
    showReload
    :showAdd="showAdd"
    :loading="loading"
    @reload="performSearch"
    @add="$emit('add')"
  >
      <form novalidate @submit.stop.prevent="submit" class="searchForm">
        <md-input-container md-inline>
          <md-icon>search</md-icon>
          <label>{{$t('misc.SearchBox')}}</label>
          <md-input type="text" v-model="searchTerm"></md-input>
          <md-button class="md-icon-button" @click.native="resetSearch">
            <md-icon>clear</md-icon>
          </md-button>
        </md-input-container>
      </form>
      <template>
        <div class="resultContent" v-if="searchResult && searchResult.length == 0">
          <i>{{$t('misc.NoResult')}}</i>
        </div>
        <md-table-card class="resultContent" v-if="searchResult && searchResult.length > 0">
        <md-table v-if="!useList">
          <md-table-body>
            <slot name="tableItems" v-for="item in searchResult" :row="item"></slot>
          </md-table-body>
        </md-table>

        <md-list class="custom-list md-triple-line" v-if="useList">
          <slot name="listItems" v-for="item in searchResult" :row="item"></slot>
        </md-list>

        <md-table-pagination
          :md-page-options="[50, 25, 10, 5]"
          :md-size="pageSize"
          :md-total="numRows"
          :md-page="page"
          :md-label="$t('misc.Results')"
          :md-separator="$t('misc.Of')"
          @pagination="onPagination">
        </md-table-pagination>
      </md-table-card>
    </template>
    <slot></slot>
  </page-content>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.searchForm {
  padding: 0 10px 0 10px;
}

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
  name: 'SearchPage',
  props: {
    // The title of the page to display
    pageTitle: String,
    // API function to use for searching
    searchApiFunction: Function,
    // Start a search immediately?
    searchOnStartup: Boolean,
    // Show the add button?
    showAdd: Boolean,
  },
  mounted: function() {
    global.window.addEventListener('resize', this.onResize);
    if (global.window.innerWidth < tableLayoutMinWidth) {
      this.useList = true;
    }
    if (this.searchOnStartup) {
      this.doSearch();
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
    performSearch: async function() {
      /* eslint-disable no-invalid-this */
      this.loading = true;
      this.removeMessage();
      this.numRows = 0;
      try {
        let res = await this.searchApiFunction(this.$data.searchTerm, (this.page-1)*this.pageSize, this.pageSize);
        if (res.ok) {
          this.searchResult = res.data && res.data.list && unmarshalDatesInArray(res.data.list) || [];
          this.numRows = res.data.rows;
        } else {
          this.showErrorMessage(
            this.$t('search.err.Load'),
            getMessageForErrorCode(res.error),
            res.errorDetails,
            res.error
          );
          this.searchResult = [];
        }
      } catch (e) {
        this.showErrorMessage(
            this.$t('search.err.Load'),
            e.message,
            e.stack,
            null
          );
        this.message = e.message;
        this.searchResult = [];
      }
      this.loading = false;
      /* eslint-enable no-invalid-this */
    },
    doSearch: _.debounce(function() {
      /* eslint-disable no-invalid-this */
      // Reset the page because we're searching for a new term
      this.page = 1;
      return this.performSearch();
      /* eslint-enable no-invalid-this */
    },
      500
    ),
    resetSearch: function() {
      this.searchTerm = '';
    },
    onPagination: function(options) {
      /* eslint-disable no-invalid-this */
      this.page = options.page;
      this.pageSize = options.size;
      return this.performSearch();
      /* eslint-enable no-invalid-this */
    },
    showMessage(title, message, details) {
      this.$refs.content.showMessage(title, message, details);
    },
    showErrorMessage(title, message, details, code) {
      this.$refs.content.showErrorMessage(title, message, details, code);
    },
    removeMessage() {
      this.$refs.content.removeMessage();
    },
  },
  watch: {
    searchTerm: function() {
      this.doSearch();
    },
  },
  data() {
    return {
      loading: false,
      useList: false,
      searchTerm: '',
      searchResult: null,
      numRows: 0,
      page: 1,
      pageSize: 50,
    };
  },
};
</script>

