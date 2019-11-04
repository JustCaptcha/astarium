<template>
  <v-app>
    <header>
      <v-app-bar app>
        <v-toolbar-title class="headline text-uppercase">
          <span class="font-weight-light">Expansible Table</span>
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
