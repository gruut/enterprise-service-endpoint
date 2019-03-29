<template>
<v-toolbar class="explorer_header">
  <v-layout align-baseline>
    <router-link to="/" class="explorer_header__title">
      <v-toolbar-title v-text="title"></v-toolbar-title>
    </router-link>
    <v-select
      v-model="selection"
      :items="selections"
      solo
      background-color="transparent"
      color="black"
    ></v-select>
    <div class="explorer_header__search_bar">
     <v-autocomplete v-if="isBlockSearch" v-model="selectForBlock" :search-input.sync="searchForBlock" :items="blocks" class="mx-3" flat solo-inverted hide-details hide-no-data item-text="idAndHeight" label="Block ID, Height" return-object>
        <template slot="item" slot-scope="{ item }">
          <v-list-tile-content v-if="blocks.length > 0">
            <v-list-tile-sub-title v-text="`ID: ${item.blockId}`"></v-list-tile-sub-title>
            <v-list-tile-sub-title v-text="`Height: ${item.height}`"></v-list-tile-sub-title>
          </v-list-tile-content>
        </template>
      </v-autocomplete>
      <v-autocomplete v-else v-model="selectForTransaction" :search-input.sync="searchForTransaction" :items="transactions" class="mx-3" flat solo-inverted hide-details hide-no-data item-text="transactionId" label="Transaction ID" return-object>
        <template slot="item" slot-scope="{ item }">
          <v-list-tile-content v-if="transactions.length > 0">
            <v-list-tile-sub-title v-text="`Transaction ID: ${item.transactionId}`"></v-list-tile-sub-title>
          </v-list-tile-content>
        </template>
      </v-autocomplete>
    </div>
    <v-btn href="/transaction/new" color="success">트랜잭션 생성</v-btn>
  </v-layout>
</v-toolbar>
</template>

<script>
import axios from '~/plugins/axios'
const queryString = require('querystring')
const _ = require('partial-js')

export default {
  name: 'Header',
  data () {
    return {
      blocks: [],
      transactions: [],
      selectForBlock: null,
      searchForBlock: null,
      searchForTransaction: null,
      selectForTransaction: null,
      blockHeight: '',
      title: 'Gruut Enterprise Network',
      selections: ['Block', 'Transaction'],
      selection: 'Block'
    }
  },
  computed: {
    isBlockSearch () {
      return this.selection === 'Block'
    }
  },
  watch: {
    searchForBlock (val) {
      val && this.queryBlocks(val)
    },
    selectForBlock (val) {
      this.$router.push(`/blocks/${val.height}`)
    },
    searchForTransaction (val) {
      val && this.queryTransactions(val)
    },
    selectForTransaction (val) {
      this.$router.push(`/transactions/${val.id}`)
    }
  },
  methods: {
    findBlock (query) {
      const q = queryString.stringify({
        keyword: query
      })

      return axios.get(`/api/blocks/search/?${q}`)
    },
    async queryBlocks (keyword) {
      try {
        const res = await this.findBlock(keyword)
        if (res.status === 200) {
          this.blocks = res.data.blocks

          _.each(this.blocks, block => {
            block.link = `blocks/${block.height}`
            block.idAndHeight = `ID: ${block.blockId} - Height: ${block.height}`
          })
        }
      } catch (error) {
        console.log('error :', error)
      }
    },
    async queryTransactions (transactionId) {
      try {
        const query = queryString.stringify({
          transactionId
        })

        const res = await axios.get(`/api/transactions/?${query}`)
        if (res.status === 200) {
          this.transactions = res.data
        }
      } catch (error) {
        console.log('error :', error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$green: #00937b;
$break-small: 500px;

.explorer_header {
  z-index: 1000;
  background-image: linear-gradient(90deg, #00937b 0%, #8bc541 100%);
  box-shadow: rgba(0, 0, 0, 0.5) 0 1px 3px 0;
}

.explorer_header__search_bar {
  width: 40%;
  margin-top: 5px;
  padding: 5px 5px;
}

.explorer_header__title {
  width: 70%;
  color: #f5f5f5;
  text-decoration: none;
  font-weight: bold;
  font-family: "Ubuntu", sans-serif;

  @media screen and (max-width: $break-small) {
    width: 30%;
  }
}
</style>
