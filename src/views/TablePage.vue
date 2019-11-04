<template>
  <div class='tablePage'>
    <!-- <h4>Table page</h4> -->
    <expansible-table />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ExpansibleTable from '../components/ExpansibleTable.vue';

export default Vue.extend({
  name: 'table-page',
  components: {
    ExpansibleTable
  }
})
</script>

<style lang="scss" scoped>
.tablePage {
  margin: 2rem;
}
</style>
