<template>
  <section class="block_info">
    <h1 class="block_info__title">
      Block
    </h1>
    <h2 class="info">
      {{ block.id }}
    </h2>
    <nuxt-link class="button" to="/">
      뒤로가기
    </nuxt-link>
  </section>
</template>

<script>
import axios from '~/plugins/axios'

export default {
  name: 'id',
  asyncData ({ params, error }) {
    return axios.get('/api/blocks/' + params.id)
      .then((res) => {
        return { block: res.data }
      })
      .catch((e) => {
        error({ statusCode: 404, message: 'Block not found' })
      })
  },
  head () {
    return {
      title: `Block ${this.block.id}`
    }
  }
}
</script>

<style scoped>
.block_info__title
{
  margin-top: 30px;
}
.info
{
  font-weight: 300;
  color: #9aabb1;
  margin: 0;
  margin-top: 10px;
}
.button
{
  margin-top: 30px;
}
</style>
