<template>
  <section class="explorer_body">
    <div class="explorer_body__table">
      <div class="explorer_body__table_row">
        <div class="explorer_body__table_cell">Block ID</div>
        <div class="explorer_body__table_cell">Block Version</div>
        <div class="explorer_body__table_cell">Block 생성시간</div>
        <div class="explorer_body__table_cell">크기(KB)</div>
      </div>
      <div v-for="(block, index) in blocks" :key="index" class="explorer_body__table_row">
        <nuxt-link :to="{ name: 'blocks-id', params: { id: block.id }}" class="explorer_body__table_cell explorer_body__table_cell--link">
          {{ block.id }}
        </nuxt-link>
        <div class="explorer_body__table_cell">{{ block.version }}</div>
        <div class="explorer_body__table_cell explorer_body__table_cell--time">{{ block.time }}</div>
        <div class="explorer_body__table_cell">{{ block.size }}</div>
      </div>
    </div>
    <nuxt-link v-if="show_more" to="/blocks" class="explorer_body__blocks_index">
      <button type="button" class="explorer_body__blocks_button">더보기</button>
    </nuxt-link>
  </section>
</template>

<script>
  export default {
    name: 'BlockList',
    props: ['blocks', 'show_more']
  }
</script>

<style scoped>
  .explorer_body {
    background-color: #efefef;
    min-height: 500px;
    padding-bottom: 2rem;
  }

  .explorer_body__table {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 2rem;
    font-family: "Ubuntu", sans-serif;
    font-size: 1.5rem;
  }

  .explorer_body__table_row {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 80%;
    background-color: white;
    padding: 1rem 2rem;
  }

  .explorer_body__table_row:nth-child(1) {
    background-color: rgb(65, 150, 100);
  }

  .explorer_body__table_row:nth-child(even) {
    background-color: rgb(248, 248, 248);
  }

  .explorer_body__table_cell {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-basis: 100%;
  }

  .explorer_body__table_cell--link {
    color: rgb(65, 150, 144);
    text-decoration: none;
  }

  .explorer_body__blocks_index {
    display: block;
    text-decoration: none;
    margin-top: 2rem;
    text-align: center;
  }

  .explorer_body__blocks_button {
    width: auto;
    font-size: 1.5rem;
    padding: 0.8rem 1.5rem;
    color: rgb(65, 150, 144);
    background-color: rgb(255, 255, 255);
    border: 0.5px solid rgba(150, 150, 150, 0.5);
    border-image: initial;
    transition: color, background-color 0.5s;
  }

  .explorer_body__blocks_button:hover {
    background-color: rgba(65, 150, 144, 1);
    color: #ffffff;
    cursor: pointer;
  }

  .explorer_body__table_cell--time {
    font-size: 0.8rem;
  }
</style>
