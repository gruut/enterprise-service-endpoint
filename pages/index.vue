<template>
  <block-list :blocks="blocks.slice(0, 8)" :show_more="true"></block-list>
</template>

<script>
  import axios from '~/plugins/axios'
  import BlockList from '~/components/BlockList.vue'
  const moment = require('moment')

  export default {
    head () {
      return {
        title: 'Gruut Enterprise Network'
      }
    },

    data () {
      return {
        blocks: []
      }
    },

    async asyncData () {
      let {data} = await axios.get('/api/blocks')
      data.forEach(block => {
        block.time = moment(block.time).format('MMMM Do YYYY, h:mm:ss a')
      })
      return {blocks: data}
    },

    components: {
      'block-list': BlockList
    }
  }
</script>

<style scoped>

</style>
