<template>
  <v-app>
    <header>
      <v-app-bar app>
        <v-toolbar-title class="headline text-uppercase">
          <img class="logo" src="../assets/astarium.svg">
          <span class="font-weight-light">Astarium</span>
        </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    </header>

    <main>
      <v-content>
        <router-view></router-view>
      </v-content>
    </main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'layout',
  components: {
  }
})
</script>

<style lang="scss" scoped>
.logo {
  width: 2.5rem;
  height: 2.5rem;
  margin-right: 1rem;
}
</style>
