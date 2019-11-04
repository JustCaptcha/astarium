<template>
  <layout></layout>
</template>

<script lang="ts">
import Vue from "vue";
import HelloWorld from "./components/HelloWorld.vue";
import Layout from "./components/Layout.vue";

export default Vue.extend({
  name: "App",
  components: {
    Layout
  },
  data: () => ({
    //
  })
});
</script>
