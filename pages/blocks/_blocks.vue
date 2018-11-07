<template>
  <block-list :blocks="blocks" :show_more="false"></block-list>
</template>

<script>
  import BlockList from '~/components/BlockList.vue'
  import axios from '~/plugins/axios'
  const moment = require('moment')

  export default {
    name: '_blocks.vue',
    components: {
      'block-list': BlockList
    },
    data () {
      return {
        'blocks': ''
      }
    },

    async asyncData () {
      let {data} = await axios.get('/api/blocks')
      data.forEach(block => {
        block.time = moment(block.time).format('MMMM Do YYYY, h:mm:ss a')
      })
      return {blocks: data}
    }
  }
</script>

<style scoped>

</style>
