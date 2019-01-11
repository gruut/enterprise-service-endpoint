<template>
  <v-container
    grid-list-xs
  >
    <v-card
      max-width="1000"
      class="transaction_info__card"
    >
      <v-layout
        column
      >
        <v-card-title
          class="transaction_info__card_title"
        >
          Transaction
        </v-card-title>
        <v-divider></v-divider>
        <div>
          <v-layout
            row
            v-for="item in items"
          >
            <v-flex
              xs3
            >
              <v-card-text>
                {{ item.title }}
              </v-card-text>
            </v-flex>
            <v-flex
              xs9
            >
              <v-card-text class="transaction_info__transaction_message" v-if="item.title !== '메세지'">
                {{ item.value }}
              </v-card-text>
              <v-card
                flat
                v-else
              >
                <v-card-text class="transaction_info__transaction_message">
                  {{ item.value }}
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </div>
      </v-layout>
    </v-card>
  </v-container>
</template>

<script>
  import InfoRow from '../../components/InfoRow'
  import axios from '~/plugins/axios'

  export default {
    name: 'id',
    components: {InfoRow},
    data () {
      return {
        items: []
      }
    },
    asyncData ({params, error}) {
      return axios.get('/api/transactions/' + params.id)
        .then((res) => {
          const receivedData = res.data

          return {
            transaction: receivedData.transaction,
            requestData: receivedData.requestData
          }
        }).catch((e) => {
          console.log(e)
          error({statusCode: 404, message: 'Transaction not found'})
        })
    },
    mounted () {
      this.pushTxIntoItem(this.transaction, this.requestData)
    },
    methods: {
      pushTxIntoItem (tx, requestData) {
        this.items.push(
          {
            title: '트랜잭션 ID',
            value: tx.transactionId
          }
        )

        if (requestData) {
          this.items.push(
            {
              title: '메세지',
              value: requestData.data
            }
          )
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  $green: #00937B;
  
  .transaction_info__card {
    margin: 0 auto;
  }

  .transaction_info__card_title {
    background-color: $green;
    color: #F5F5F5;
    font-size: 2rem;
  }

  .transaction_info__transaction_message {
    word-break: break-all;
  }
</style>
