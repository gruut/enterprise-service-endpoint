<template>
  <v-card class="explorer_body">
    <v-card-title class="explorer_body__table_title">
      <span class="explorer_body__table_title_text">BlockChain Explorer</span>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="blocks"
      :total-items="totalItemsCount"
      :loading="paginationLoading"
      :pagination.sync="pagination"
      :rows-per-page-items="rowsPerPageItems"
      class="elevation-1 explorer_body__table"
    >
      <template slot="headerCell" slot-scope="{ header }">
        <span
          class="subheading font-weight-bold explorer_body__table_cell--header"
          v-text="header.text"
        ></span>
      </template>
      <template slot="items" slot-scope="{ item }">
        <td
          :class="{'explorer_body__table_cell--new': item.isActive}"
          class="text-xs-center"
        >
          <nuxt-link
              :to="{ name: 'blocks-id', params: { id: item.id }}"
              class="explorer_body__table_cell explorer_body__table_cell--link"
          >{{ item.height }}
          </nuxt-link>
        </td>
        <td
          :class="{'explorer_body__table_cell--new': item.isActive}"
          class="text-xs-center"
        >{{ item.time }}</td>
        <td :class="{'explorer_body__table_cell--new': item.isActive}" class="text-xs-center">{{ item.transactionCount }}</td>
        <td :class="{'explorer_body__table_cell--new': item.isActive}" class="text-xs-center">{{ item.mergerId }}</td>
        <td
          class="explorer_body__table_cell--id"
          :class="{'explorer_body__table_cell--new': item.isActive}"
        >
          {{ item.blockId }}
        </td>
      </template>
      <template slot="no-data">
        <v-alert :value="true" icon="warning">Sorry, nothing to display</v-alert>
      </template>
    </v-data-table>
    <v-bottom-nav class="pa-3 text-xs-center" color="#00937b">
      <div class="explorer_body__table_bottom_text--white">
        ※ 주의 : 테스트넷에 저장된 데이터는 테스트 도중 또는 완료 후에 삭제될 수도 있습니다. 구글 플레이스토어에서
        <a
          class="explorer_body__table_bottom_text--white"
          href="#"
        >'Gruut Signer'</a>를 받아 서명자로도 참여해보세요.
      </div>
    </v-bottom-nav>
  </v-card>
</template>

<script>
import axios from '~/plugins/axios'
const moment = require('moment')
const _ = require('partial-js')

export default {
  name: 'blocks',
  filters: {
    truncate: (value, size, suffix = '...') => {
      return value.substring(0, size) + suffix
    }
  },
  data () {
    return {
      blocks: [],
      timer: '',
      totalItemsCount: 0,
      pagination: {
        sortBy: 'height',
        descending: true
      },
      paginationLoading: false,
      rowsPerPageItems: [5, 10, 20, 30],
      headers: [
        {
          text: 'Block Height',
          sortable: false,
          value: 'height',
          align: 'center'
        },
        {
          text: 'Block 생성시간',
          sortable: false,
          value: 'createdAt',
          align: 'center'
        },
        {
          text: 'Transaction 개수',
          sortable: false,
          align: 'center'
        },
        {
          text: 'Merger ID',
          sortable: false,
          align: 'center'
        },
        {
          text: 'Block ID',
          sortable: false,
          align: 'center'
        }
      ]
    }
  },
  mounted () {
    this.timer = setInterval(this.checkNewBlock, 5000)
  },
  watch: {
    pagination: {
      handler () {
        this.getBlocksFromApi().then(data => {
          this.blocks = data.blocks
          this.totalItemsCount = data.totalBlocksCount
        })
      },
      deep: true
    }
  },
  methods: {
    getBlocksFromApi () {
      this.paginationLoading = true
      return new Promise(async (resolve, reject) => {
        const { page, rowsPerPage } = this.pagination
        let { data } = await axios.get(
          `/api/blocks/?page=${page}&rows=${rowsPerPage}`
        )
        data.blocks.forEach(block => {
          let time = moment(block.time).format('MMMM Do YYYY, h:mm:ss a')
          time += ` (${moment(block.time).fromNow()})`
          block.time = time
        })
        setTimeout(() => {
          this.paginationLoading = false
          resolve({ blocks: data.blocks, totalBlocksCount: data.totalBlocksCount })
        }, 1000)
      })
    },
    checkNewBlock: async function () {
      const data = await this.getBlocksFromApi()
      const newBlocks = data.blocks

      _.go(
        newBlocks,
        newBlocks => {
          const oldBlockHeights = _.map(this.blocks, d => d.height)
          const newBlockHeights = _.map(newBlocks, d => d.height)

          return _.difference(newBlockHeights, oldBlockHeights)
        },
        newHeights => {
          _.each(newHeights, h => {
            const newBlockIndex = _.findIndex(newBlocks, b => {
              return b.height === h
            })

            if (newBlockIndex !== -1) {
              newBlocks[newBlockIndex].isActive = true
              this.blocks = newBlocks
              this.totalItemsCount = data.totalBlocksCount
            }
          })
        }
      )
    }
  },

  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="scss" scoped>
$green: #00937b;
$break-small: 600px;

.explorer_body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: #ffffff;
  padding-bottom: 2rem;
}

.explorer_body__table {
  width: 90%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  font-family: "Ubuntu", monospace;
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
  @media screen and (max-width: $break-small) {
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

  @media screen and (max-width: $break-small) {
    width: 100px;
    height: 30px;
    font-size: 0.8rem;
  }
}

.explorer_body__table_cell--header {
  font-size: 1.2rem;

  @media screen and (max-width: $break-small) {
    font-size: 0.8rem;
  }
}

.explorer_body__table_cell--time {
  font-size: 1rem;
  flex-grow: 3;
  flex-basis: 0;

  @media screen and (max-width: $break-small) {
    font-size: 0.8rem;
    text-align: center;
  }
}

.explorer_body__table_title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  width: 85%;
}

.explorer_body__table_title_text {
  color: $green;
  font-size: 1.7rem;
  font-weight: 600;

  @media screen and (max-width: $break-small) {
    font-size: 1.5rem;
  }
}

@keyframes newBlock {
  from {
    background-color: rgba($green, 0.5);
  }
  to {
    background-color: transparent;
  }
}
.explorer_body__table_cell--new {
  animation: newBlock 3s;
}

.explorer_body__table_cell--id {
  text-align: center;
  font-family: monospace;
}

.explorer_body__table_bottom_text--white {
  color: white;
}
</style>
