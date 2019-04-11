<template>
  <div class="page-content">
    <md-whiteframe md-tag="md-toolbar" md-elevation="1" class="main-header">
      <div class="md-toolbar-container">
        <md-button class="md-icon-button nav-trigger" @click.native="toggleSidenav">
          <md-icon>menu</md-icon>
        </md-button>
        <md-button class="md-icon-button" v-if="showBack" @click.native="$router.go(-1)">
          <md-icon>chevron_left</md-icon>
        </md-button>

        <div class="md-title pageTitle" style="flex: 1;">{{ pageTitle }}</div>
        <md-button class="md-icon-button" v-if="showAdd" @click.native="$emit('add')">
          <md-icon>note_add</md-icon>
        </md-button>
        <md-button class="md-icon-button" v-if="showReload" @click.native="$emit('reload')">
          <md-icon>autorenew</md-icon>
        </md-button>
        <language-menu></language-menu>
        <user-menu></user-menu>
      </div>
    </md-whiteframe>
    <div class="mainContent">
      <message
        :message="message"
        :details="messageDetails"
        :code="messageCode"
        :title="messageTitle"
        :class="messageCls"
        @close="removeMessage">
      </message>
      <md-progress md-indeterminate class="loading" :class="{ active: loading }"></md-progress>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>

  .pageTitle {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .page-content {
    min-height: 100%;
    max-height: 100%;
    flex: 1;
    display: flex;
    overflow: hidden;
    flex-flow: column
  }

  .mainContent {
    flex: 1;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  .main-header {
    z-index: 2;
    color: #fff !important;
    overflow: hidden;
  }

  @media (min-width: 1281px) {
    .nav-trigger {
      display: none;
    }

    .md-title {
      margin-left: 8px;
    }
  }

  .md-title {
    flex: 1;
  }

  .loading {
    opacity: 0;
    transition: opacity 200ms;
  }

  .loading.active {
    opacity: 1;
  }

</style>

<script>
  export default {
    props: {
      pageTitle: String,
      showReload: Boolean,  // Show Reload button?
      showAdd: Boolean,     // Show Add button?
      showBack: Boolean,    // Show Back button?
      loading: Boolean,
    },
    data: function() {
      return {
        message: null,
        messageDetails: null,
        messageTitle: null,
        messageCode: null,
        messageCls: ['md-warn'],
      };
    },
    methods: {
      toggleSidenav() {
        this.$root.toggleSidenav();
      },
      showMessage(title, message, details) {
        this.messageTitle = title;
        this.message = message;
        this.messageCode = null;
        this.messageDetails = details;
        this.messageCls = ['md-accent'];
      },
      showErrorMessage(title, message, details, code) {
        this.messageTitle = title;
        this.message = message;
        this.messageCode = code;
        this.messageDetails = details;
        this.messageCls = ['md-warn'];
      },
      removeMessage() {
        this.messageTitle = null;
        this.message = null;
        this.messageCode = null;
        this.messageDetails = null;
        this.messageCls = [];
      },
    },
    mounted() {
      document.title = this.pageTitle + ' - Kyabia';
    },
  };
</script>
