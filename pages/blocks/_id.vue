<template>
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
</template>

<script>
  import axios from '~/plugins/axios'
  import InfoRow from '../../components/InfoRow'
  const moment = require('moment-timezone')

  export default {
    name: 'id',
    components: {InfoRow},
    mounted () {
      this.pushBlockIntoItems(this.block)
      this.isMobile = this.$vuetify.breakpoint.xs
    },
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
    head () {
      return {
        title: `Block ${this.block.height}`
      }
    },
    data () {
      return {
        items: [],
        isMobile: false
      }
    },
    methods: {
      changeTimezone: (time) => {
        return moment.tz(time, 'Asia/Seoul').format('MMMM Do YYYY, h:mm:ss a')
      },
      pushBlockIntoItems (block) {
        this.items.push({title: '블럭 ID', value: block.blockId})
        this.items.push({title: '이전 블럭 ID', value: block.prevBlockId})
        this.items.push({title: '이전 블럭 Hash', value: block.prevBlockHash})
        this.items.push({title: '높이', value: block.height})
        this.items.push({title: '트랜잭션 루트', value: block.txRoot})
        this.items.push({title: 'Merger ID', value: block.mergerId})
        this.items.push({title: 'Chain ID', value: block.chainId})
        this.items.push({title: '버전', value: block.version})
        this.items.push({title: '생성시간', value: this.changeTimezone(block.time)})
        this.items.push({title: '서명자 수', value: this.signers.length})
      }
    }
  }
</script>

<style scoped>
  .block_info__card_title {
    background-color: #00937B;
    color: #F5F5F5;
    font-weight: bold;
  }

  .block_info__card {
    margin: 0 auto;
  }
</style>
