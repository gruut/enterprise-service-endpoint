<template>
<v-toolbar class="explorer_header">
  <v-layout align-baseline>
    <router-link to="/" class="explorer_header__title">
      <v-toolbar-title v-text="title"></v-toolbar-title>
    </router-link>
    <div class="explorer_header__search_bar">
      <v-autocomplete v-model="select" :search-input.sync="search" :items="blocks" class="mx-3" flat solo-inverted hide-details hide-no-data item-text="idAndHeight" label="Block ID, Height" return-object>
        <template slot="item" slot-scope="{ item }">
          <v-list-tile-content v-if="blocks.length > 0">
            <v-list-tile-sub-title v-text="`ID: ${item.blockId}`"></v-list-tile-sub-title>
            <v-list-tile-sub-title v-text="`Height: ${item.height}`"></v-list-tile-sub-title>
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
      select: null,
      search: null,
      blockHeight: '',
      title: 'Gruut Enterprise Network'
    }
  },
  watch: {
    search (val) {
      val && this.queryBlocks(val)
    },
    select (val) {
      this.$router.push(`/blocks/${val.height}`)
    }
  },
  methods: {
    findBlock (query) {
      const q = queryString.stringify({
        keyword: query
      })

      return axios.get(`/api/blocks/?${q}`)
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
