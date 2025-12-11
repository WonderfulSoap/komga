<template>
  <v-toolbar flat
             :color="color"
             :class="['sticky-bar', {'sticky-bar--wrap': wrapContent}]"
             :style="barStyle"
             :elevation="elevation"
  >
    <slot/>
  </v-toolbar>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ToolbarSticky',
  computed: {
    barStyle (): any {
      if (['xs', 'sm'].includes(this.$vuetify.breakpoint.name.toString())) {
        return { 'top': '56px' }
      } else {
        return { 'top': '64px' }
      }
    },
  },
  props: {
    elevation: {
      type: Number,
      default: undefined,
    },
    color: {
      type: String,
      default: 'contrast-1',
    },
    wrapContent: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style scoped>
.sticky-bar {
  position: -webkit-sticky;
  position: sticky;
  z-index: 2
}
.sticky-bar--wrap :deep(.v-toolbar__content) {
  flex-wrap: wrap;
  height: auto !important;
}
.sticky-bar--wrap {
  height: auto !important;
  min-height: 0;
}
</style>
