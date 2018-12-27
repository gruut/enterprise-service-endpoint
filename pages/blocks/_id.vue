<template>
  <section class="block_info">
    <div class="block_info__title">
      Block #{{ block.height }}
    </div>
    <div class="block_info__table">
      <div class="block_info__table_row">
        <div class="block_info__table_cell">블럭 ID</div>
        <div class="block_info__table_cell block_info__table_cell--truncate">{{ block.blockId }}</div>
      </div>

      <div class="block_info__table_row">
        <div class="block_info__table_cell">높이</div>
        <div class="block_info__table_cell">{{ block.height }}</div>
      </div>

      <div class="block_info__table_row">
        <div class="block_info__table_cell">트랜잭션 루트</div>
        <div class="block_info__table_cell block_info__table_cell--truncate">{{ block.txRoot }}</div>
      </div>

      <div class="block_info__table_row">
        <div class="block_info__table_cell">Merger ID</div>
        <div class="block_info__table_cell">{{ block.mergerId }}</div>
      </div>

      <div class="block_info__table_row">
        <div class="block_info__table_cell">Merger 서명</div>
        <div class="block_info__table_cell">{{ block.mergerSignature }}</div>
      </div>

      <div class="block_info__table_row">
        <div class="block_info__table_cell">버전</div>
        <div class="block_info__table_cell">{{ block.version }}</div>
      </div>

      <div class="block_info__table_row">
        <div class="block_info__table_cell">생성시간</div>
        <div class="block_info__table_cell">{{ block.time | changeTimezone() }}</div>
      </div>

      <div v-if="signers.length > 0" class="block_info__table_row">
        <div class="block_info__table_cell">서명자 수</div>
        <div class="block_info__table_cell">{{ signers.length }}</div>
      </div>
    </div>

    <div v-if="transactions.length > 0">
      <div class="block_info__title">
        Transactions
      </div>
      <div class="block_info__table">
        <div v-for="transaction in transactions" class="block_info__table_row">
          <div class="block_info__table_cell">트랜잭션 ID</div>
          <div class="block_info__table_cell block_info__table_cell--truncate">{{ transaction.transactionId }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import axios from '~/plugins/axios'
  const moment = require('moment-timezone')

  export default {
    name: 'id',
    asyncData ({params, error}) {
      return axios.get('/api/blocks/' + params.id)
        .then((res) => {
          const receivedData = res.data

          return {
            block: receivedData.block,
            transactions: receivedData.transactions,
            signers: receivedData.signers
          }
        })
        .catch((e) => {
          console.log(e)
          error({statusCode: 404, message: 'Block not found'})
        })
    },
    filters: {
      changeTimezone: (time) => {
        return moment.tz(time, 'Asia/Seoul').format('MMMM Do YYYY, h:mm:ss a')
      }
    },
    head () {
      return {
        title: `Block ${this.block.height}`
      }
    }
  }
</script>

<style lang="scss" scoped>
  $green: #00937B;
  $break-small: 600px;

  .block_info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 3rem;
  }

  .block_info__title {
    text-align: center;
    margin-top: 30px;
    font-size: 2rem;
    font-weight: 300;

    @media screen and (max-width: $break-small){
      font-size: 1.6rem;
    }
  }

  .block_info__table {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding-top: 2rem;
    font-family: "Ubuntu", sans-serif;
    font-size: 1.5rem;

    @media screen and (max-width: $break-small){
      width: 95%;
      align-items: center;
    }
  }

  .block_info__table_row {
    display: flex;
    width: 100%;
    background-color: rgba(200, 200, 200, 0.05);
    padding: 1rem 2rem;

    @media screen and (max-width: $break-small){
      padding: 0.5rem 1rem;
    }
  }

  .block_info__table_row:nth-child(odd) {
    background-color: rgba($green, 0.2);
  }

  .block_info__table_cell {
    flex-grow: 1;
    flex-basis: 100%;
    font-size: 1rem;

    @media screen and (max-width: $break-small){
      font-size: 0.6rem;
    }
  }

  .block_info__table_cell:nth-child(even) {
    flex-grow: 1;
    text-align: center;
  }

  .block_info__table_cell--truncate {
    @media screen and (max-width: $break-small){
      font-size: 7px;
    }
  }
</style>
