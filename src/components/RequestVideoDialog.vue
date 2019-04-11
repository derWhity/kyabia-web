<template>
  <md-dialog ref="diag">
    <md-dialog-title>{{$t('makeAWish.Title')}}</md-dialog-title>

    <md-dialog-content>
      {{$t('makeAWish.Content')}}
      <md-input-container>
        <label>{{$t('makeAWish.fldName')}}</label>
        <md-input v-model="requester" required></md-input>
      </md-input-container>
      {{$t('makeAWish.SelectedTitle')}}
      <template v-if="video">
        <md-list class="custom-list md-triple-line video">
          <md-list-item>
            <flag v-bind:lang="video.language"></flag>

            <div class="md-list-text-container">
              <span>
                {{video.title}}
              </span>
              <span class="inset">{{video.artist}}</span>
              <p class="inset">{{video.relatedMedium}} <i>{{video.mediumDetails}}</i></p>
            </div>
          </md-list-item>
        </md-list>
      </template>
    </md-dialog-content>

    <md-dialog-actions>
      <md-button @click.native="onCloseClick">{{$t('misc.Cancel')}}</md-button>
      <md-button
        class="md-raised md-primary"
        :disabled="!requester || !requester.trim()"
        @click.native="onOkClick">
        {{$t('makeAWish.MakeAWish')}}
      </md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
export default {
  name: 'RequestVideoDialog',
  props: ['video'],
  data() {
    return {
      requester: '',
    };
  },
  methods: {
    open: function() {
      this.$refs.diag.open();
    },
    onCloseClick: function() {
      this.$refs.diag.close();
    },
    onOkClick: function() {
      this.$refs.diag.close();
      this.$emit('ok', this.video, this.requester);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.video {
  border-style: solid;
  border-width: 1px;
  border-color: #ccc;
  padding: 0;
  margin: 4px 0;
}

.flag {
  height: 16px;
  margin: 0 10px 0 0;
  display: inline-block;
  vertical-align: top;
}

</style>
