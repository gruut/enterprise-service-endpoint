<template>
  <section class="block_info">
    <div class="block_info__title">
      Block #{{ block.id }}
    </div>
    <div class="block_info__table">
      <div v-for="(value, key) in block" :key="index" class="block_info__table_row">
        <div class="block_info__table_cell">{{ key }}</div>
        <div class="block_info__table_cell">{{ value }}</div>
      </div>
    </div>
  </section>
</template>

<script>
  import axios from '~/plugins/axios'

  export default {
    name: 'id',
    asyncData ({params, error}) {
      return axios.get('/api/blocks/' + params.id)
        .then((res) => {
          return {block: res.data}
        })
        .catch((e) => {
          error({statusCode: 404, message: 'Block not found'})
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
  .block_info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 3rem;
  }

  .block_info__title {
    text-align: left;
    margin-top: 30px;
    font-size: 2rem;
    font-weight: 300;
  }

  .block_info__table {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding-top: 2rem;
    font-family: "Ubuntu", sans-serif;
    font-size: 1.5rem;
  }

  .block_info__table_row {
    display: flex;
    width: 100%;
    background-color: rgba(200, 200, 200, 0.05);
    padding: 1rem 2rem;
  }

  .block_info__table_row:nth-child(odd) {
    background-color: rgba(65, 150, 100, 0.2);
  }

  .block_info__table_cell {
    flex-grow: 1;
    flex-basis: 100%;

    font-size: 1rem;
  }

  .block_info__table_cell:nth-child(even) {
    flex-grow: 1;
  }
</style>
