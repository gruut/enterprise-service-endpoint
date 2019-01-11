<template>
  <div>
  <v-container
    grid-list-xs
  >
    <v-card
      max-width="1000"
      class="block_info__card"
    >
      <v-layout
        column
      >
        <v-card-title
          class="block_info__card_title"
        >
          Block #{{ block.height }}
        </v-card-title>
        <div>
          <info-row
            v-for="item in items"
            :is-mobile="isMobile"
            class="block_info__cell"
          >
            <template
              slot="title"
            >
              {{ item.title }}
            </template>
            <template
              slot="value"
            >
              {{ item.value }}
            </template>
          </info-row>
        </div>
      </v-layout>
    </v-card>
  </v-container>
  <v-container
    grid-list-xs
  >
    <v-data-iterator
      :items="txContainer"
      :rows-per-page-items="rowsPerPageItems"
      content-tag="v-layout"
      row
    >
      <v-toolbar
        slot="header"
        class="mb-2"
        color="#00937B"
        dark
        flat
      >
        <v-toolbar-title>Transactions</v-toolbar-title>
      </v-toolbar>
      
      <v-flex
        slot="item"
        slot-scope="props"
        xs12
        sm6
        md4
        lg4
      >
        <nuxt-link class="transaction_info__link" :to="{name: 'transactions-id', params: { id: props.item.id }}">
          <v-card>
            <v-card-title>{{ props.item.name }}</v-card-title>
            <v-divider></v-divider>
            <v-list>
              <v-list-tile>
                ID:
                <v-list-tile-content class="transaction_info__message">
                  <v-list-tile-sub-title class="overflow-hidden">{{ props.item.tx_id }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                Message:
                <v-list-tile-content class="transaction_info__message">
                  <v-list-tile-sub-title class="overflow-hidden">{{ props.item.message }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content class="transaction_info__detail_button">
                  <v-btn flat color="#00937B">
                    상세 보기
                  </v-btn>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </nuxt-link>
      </v-flex>
    </v-data-iterator>
  </v-container>
  </div>
</template>

<script>
  import axios from '~/plugins/axios'
  import InfoRow from '../../components/InfoRow'
  const moment = require('moment-timezone')
  const _ = require('partial-js')

  export default {
    name: 'id',
    components: {InfoRow},
    mounted () {
      this.pushBlockIntoItems(this.block)
      this.pushTransactionsIntoContainer(this.transactions, this.requestData)
      this.isMobile = this.$vuetify.breakpoint.xs
    },
    asyncData ({params, error}) {
      return axios.get('/api/blocks/' + params.id)
        .then((res) => {
          const receivedData = res.data

          return {
            block: receivedData.block,
            transactions: receivedData.transactions,
            signers: receivedData.signers,
            requestData: receivedData.requestData
          }
        })
        .catch((e) => {
          console.log(e)
          error({statusCode: 404, message: 'Block not found'})
        })
    },
    head () {
      return {
        title: `Block ${this.block.height}`
      }
    },
    data () {
      return {
        items: [],
        txContainer: [],
        isMobile: false,
        rowsPerPageItems: [1, 5, 10, 20, 100]
      }
    },
    methods: {
      changeTimezone: (time) => {
        return moment.tz(time, 'Asia/Seoul').format('MMMM Do YYYY, h:mm:ss a')
      },
      pushBlockIntoItems (block) {
        this.items.push({title: '블록 ID', value: block.blockId})
        this.items.push({title: '이전 블록 ID', value: block.prevBlockId})
        this.items.push({title: '이전 블록 Hash', value: block.prevBlockHash})
        this.items.push({title: '높이', value: block.height})
        this.items.push({title: '트랜잭션 루트', value: block.txRoot})
        this.items.push({title: 'Merger ID', value: block.mergerId})
        this.items.push({title: 'Chain ID', value: block.chainId})
        this.items.push({title: '버전', value: block.version})
        this.items.push({title: '생성시간', value: this.changeTimezone(block.time)})
        this.items.push({title: '서명자 수', value: this.signers.length})
      },
      pushTransactionsIntoContainer (transactions, requestData) {
        _.each(transactions, (tx) => {
          const datum = _.find(requestData, (d) => d.transactionId === tx.transactionId)

          let txDatum = {
            name: `Transaction`,
            id: tx.id,
            tx_id: tx.transactionId
          }
          if (datum) {
            txDatum.message = datum.data
          }

          this.txContainer.push(txDatum)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  $green: #00937B;
  
  .block_info__card_title {
    background-color: $green;
    color: #F5F5F5;
    font-weight: bold;
  }

  .block_info__card {
    margin: 0 auto;
  }
  
  .transaction_info__message {
    margin-left: 10px;
  }

  .transaction_info__link {
    text-decoration: none;
  }

  .transaction_info__detail_button {
    align-items: flex-end;
  }
</style>
