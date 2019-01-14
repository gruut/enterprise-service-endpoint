<template>
  <div>
    <block-info :block="block"></block-info>
    <v-container grid-list-xs>
      <v-data-iterator
        :items="txContainer"
        :rows-per-page-items="rowsPerPageItems"
        content-tag="v-layout"
        row
        wrap
      >
        <v-toolbar slot="header" class="mb-2" color="#00937B" dark flat>
          <v-toolbar-title>Transactions</v-toolbar-title>
        </v-toolbar>

        <v-flex slot="item" slot-scope="props" xs12 sm6 md4 lg4>
          <v-card>
            <v-card-title>{{ props.item.name }}</v-card-title>
            <v-divider></v-divider>
            <v-list>
              <v-list-tile>ID:
                <v-list-tile-content class="transaction_info__message">
                  <v-list-tile-sub-title class="overflow-hidden">{{ props.item.tx_id }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile v-if="props.item.message">Message:
                <v-list-tile-content class="transaction_info__message">
                  <v-list-tile-sub-title class="overflow-hidden">{{ props.item.message }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content class="transaction_info__detail_button">
                  <nuxt-link
                    class="transaction_info__link"
                    :to="{name: 'transactions-id', params: { id: props.item.id }}"
                  >
                    <v-btn flat color="#00937B">상세 보기</v-btn>
                  </nuxt-link>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
      </v-data-iterator>
    </v-container>
  </div>
</template>

<script>
import axios from '~/plugins/axios'
import BlockInfo from '../../components/BlockInfo'

const _ = require('partial-js')

export default {
  name: 'id',
  components: {BlockInfo},
  mounted () {
    this.pushTransactionsIntoContainer(this.transactions, this.requestData)
  },
  asyncData ({ params, error }) {
    return axios
      .get('/api/blocks/' + params.id)
      .then(res => {
        const receivedData = res.data

        receivedData.block.signersCount = receivedData.signers.length
        return {
          block: receivedData.block,
          transactions: receivedData.transactions,
          requestData: receivedData.requestData
        }
      })
      .catch(e => {
        console.log(e)
        error({ statusCode: 404, message: 'Block not found' })
      })
  },
  head () {
    return {
      title: `Block ${this.block.height}`
    }
  },
  data () {
    return {
      txContainer: [],
      isMobile: false,
      rowsPerPageItems: [3, 10, 20, 100]
    }
  },
  methods: {
    pushTransactionsIntoContainer (transactions, requestData) {
      _.each(transactions, tx => {
        const datum = _.find(
          requestData,
          d => d.transactionId === tx.transactionId
        )

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
$green: #00937b;

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
