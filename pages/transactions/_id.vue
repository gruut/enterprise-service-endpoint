<template>
  <div>
    <v-container grid-list-xs>
      <v-card max-width="1000" class="transaction_info__card">
        <v-layout column>
          <v-card-title class="transaction_info__card_title">Transaction</v-card-title>
          <v-divider></v-divider>
          <div>
            <v-layout row v-for="item in items" :key="item.id">
              <v-flex xs3>
                <v-card-text>{{ item.title }}</v-card-text>
              </v-flex>
              <v-flex xs9>
                <v-card-text
                  class="transaction_info__transaction_message"
                  v-if="item.title !== '메세지'"
                >{{ item.value }}</v-card-text>
                <v-card flat v-else>
                  <v-card-text class="transaction_info__transaction_message">{{ item.value }}</v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </div>
        </v-layout>
      </v-card>
    </v-container>
    <block-info :block="block"></block-info>
  </div>
</template>

<script>
import BlockInfo from '../../components/BlockInfo'
import axios from '~/plugins/axios'

export default {
  name: 'id',
  components: { BlockInfo },
  data () {
    return {
      items: []
    }
  },
  asyncData ({ params, error }) {
    return axios
      .get('/api/transactions/' + params.id)
      .then(res => {
        const receivedData = res.data
        receivedData.block.signersCount = receivedData.block.Signers.length

        return {
          transaction: receivedData.transaction,
          requestData: receivedData.requestData,
          block: receivedData.block
        }
      })
      .catch(e => {
        console.log(e)
        error({ statusCode: 404, message: 'Transaction not found' })
      })
  },
  mounted () {
    this.pushTxIntoItem(this.transaction, this.requestData)
  },
  methods: {
    pushTxIntoItem (tx, requestData) {
      this.items.push({
        title: '트랜잭션 ID',
        value: tx.transactionId
      })

      if (requestData) {
        this.items.push({
          title: '메세지',
          value: requestData.data
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$green: #00937b;

.transaction_info__card {
  margin: 0 auto;
}

.transaction_info__card_title {
  background-color: $green;
  color: #f5f5f5;
  font-size: 2rem;
}

.transaction_info__transaction_message {
  word-break: break-all;
}
</style>
