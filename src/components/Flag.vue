<template>
  <div class="flag" v-bind:class="[langClass]">
    <md-tooltip>{{langName}}</md-tooltip>
  </div>
</template>

<script>
import {getLocaleName} from '../Utils';

export default {
  name: 'Flag',
  props: ['lang'],
  data() {
    return {};
  },
  computed: {
    langClass: function() {
      return `flag-${this.lang ? this.lang.toLowerCase() : 'unknown'}`;
    },
    langName: function() {
      return getLocaleName(this.lang.toLowerCase());
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.flag {
  width: 24px;
  height: 16px;
  background-repeat: no-repeat;
  background-size: 24px 16px;
  border-width: 1px;
  border-color: #CCCCCC;
  border-style: solid;
  border-radius: 4px;
}

.flag-unknown {
}

/* Arabic */
.flag-ar {
  background-image: url(/static/img/flags/ar.png);
}

/* Bulgarian */
.flag-bg {
  background-image: url(/static/img/flags/bg.png);
}

/* Bosnian */
.flag-bs {
  background-image: url(/static/img/flags/bs.png);
}

/* Czech */
.flag-cs {
  background-image: url(/static/img/flags/cs.png);
}

/* Danish */
.flag-da {
  background-image: url(/static/img/flags/da.png);
}

/* German */
.flag-de {
  background-image: url(/static/img/flags/de.png);
}

/* Greek */
.flag-el {
  background-image: url(/static/img/flags/el.png);
}

/* English */
.flag-en {
  background-image: url(/static/img/flags/en.png);
}

/* Estonian */
.flag-et {
  background-image: url(/static/img/flags/et.png);
}

/* Spanish */
.flag-es {
  background-image: url(/static/img/flags/es.png);
}

/* Finnish */
.flag-fi {
  background-image: url(/static/img/flags/fi.png);
}

/* French */
.flag-fr {
  background-image: url(/static/img/flags/fr.png);
}

/* Irish */
.flag-ga {
  background-image: url(/static/img/flags/ga.png);
}

/* Hungarian */
.flag-hu {
  background-image: url(/static/img/flags/hu.png);
}

/* Italian */
.flag-it {
  background-image: url(/static/img/flags/it.png);
}

/* Icelandic */
.flag-is {
  background-image: url(/static/img/flags/is.png);
}

/* Japanese */
.flag-ja {
  background-image: url(/static/img/flags/jp.png);
}

/* Korean */
.flag-ko {
  background-image: url(/static/img/flags/ko.png);
}

/* Lithuanian */
.flag-lt {
  background-image: url(/static/img/flags/lt.png);
}

/* Dutch */
.flag-nl {
  background-image: url(/static/img/flags/nl.png);
}

/* Norwegian */
.flag-no {
  background-image: url(/static/img/flags/no.png);
}

/* Polish */
.flag-pl {
  background-image: url(/static/img/flags/pl.png);
}

/* Portuguese */
.flag-pt {
  background-image: url(/static/img/flags/pt.png);
}

/* Romanian */
.flag-ro {
  background-image: url(/static/img/flags/ro.png);
}

/* Russian */
.flag-ru {
  background-image: url(/static/img/flags/ru.png);
}

/* Slovak */
.flag-sk {
  background-image: url(/static/img/flags/sk.png);
}

/* Slovene */
.flag-sl {
  background-image: url(/static/img/flags/sl.png);
}

/* Serbian */
.flag-sr {
  background-image: url(/static/img/flags/sr.png);
}

/* Swedish */
.flag-sv {
  background-image: url(/static/img/flags/sv.png);
}

/* Thai */
.flag-th {
  background-image: url(/static/img/flags/th.png);
}

/* Turkish */
.flag-tr {
  background-image: url(/static/img/flags/tr.png);
}

/* Vietnamese */
.flag-vi {
  background-image: url(/static/img/flags/vi.png);
}

/* Chinese */
.flag-zh {
  background-image: url(/static/img/flags/zh.png);
}

</style>
