<template>
  <section class="explorer_body">
    <div class="explorer_body__table">
      <div class="explorer_body__table_row">
        <div class="explorer_body__table_cell explorer_body__table_cell--header">Block ID</div>
        <div class="explorer_body__table_cell explorer_body__table_cell--header">Block Version</div>
        <div class="explorer_body__table_cell explorer_body__table_cell--header explorer_body__table_cell--time">Block 생성시간</div>
        <div class="explorer_body__table_cell explorer_body__table_cell--header">Block Height</div>
      </div>
      <div v-for="(block, index) in blocks" :key="index" class="explorer_body__table_row">
        <nuxt-link :to="{ name: 'blocks-id', params: { id: block.id }}"
                   class="explorer_body__table_cell explorer_body__table_cell--link">
          {{ block.blockId | truncate(10) }}
        </nuxt-link>
        <div class="explorer_body__table_cell">{{ block.version }}</div>
        <div class="explorer_body__table_cell explorer_body__table_cell--time">{{ block.time }}</div>
        <div class="explorer_body__table_cell">{{ block.height }}</div>
      </div>
    </div>
    <nuxt-link v-if="show_more" to="/blocks" class="explorer_body__blocks_index">
      <button v-if="blocks.length > 0" type="button" class="explorer_body__blocks_button">더보기</button>
    </nuxt-link>
  </section>
</template>

<script>
  export default {
    name: 'BlockList',
    props: ['blocks', 'show_more'],
    filters: {
      truncate: (value, size, suffix = '...') => {
        return value.substring(0, size) + suffix
      }
    }
  }
</script>

<style lang="scss" scoped>
  $green: #00937B;
  $break-small: 600px;

  .explorer_body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: #ffffff;
    min-height: 800px;
    padding-bottom: 2rem;

    @media screen and (max-width: $break-small){
      min-height: 300px;
    }
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

  .explorer_body__table_row:nth-child(even) {
    background-color: rgb(248, 248, 248);
  }

  .explorer_body__table_row:nth-child(1) {
    background-color: $green;
  }

  .explorer_body__table_cell {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-grow: 1;
    flex-basis: 0;
    margin-right: 1rem;

    @media screen and (max-width: $break-small){
      font-size: 0.6rem;
    }
  }

  .explorer_body__table_cell--link {
    color: $green;
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .explorer_body__blocks_index {
    display: block;
    text-decoration: none;
    margin-top: 2rem;
    text-align: center;
  }

  .explorer_body__blocks_button:hover {
    background-color: $green;
    color: #ffffff;
    cursor: pointer;
  }

  .explorer_body__blocks_button {
    outline: none;
    height: 40px;
    text-align: center;
    width: 130px;
    border-radius: 40px;
    background: #fff;
    border: 2px solid $green;
    color: $green;
    letter-spacing: 1px;
    text-shadow: none;
    font: {
      size: 1rem;
      weight: bold;
    }
    cursor: pointer;
    transition: all 0.25s ease;
    &:hover {
      color: white;
      background: $green;
    }
    &:active {
      //letter-spacing: 2px;
      letter-spacing: 2px;
    }

    @media screen and (max-width: $break-small){
      width: 100px;
      height: 30px;
      font-size: 0.8rem;
    }
  }

  .explorer_body__table_cell--header {
    color: #ffffff;
    font-size: 1.2rem;

    @media screen and (max-width: $break-small){
      text-align: center;
      font-size: 0.8rem;
    }
  }

  .explorer_body__table_cell--time {
    font-size: 1rem;
    flex-grow: 3;
    flex-basis: 0;

    @media screen and (max-width: $break-small){
      font-size: 0.8rem;
      text-align: center;
    }
  }
</style>
