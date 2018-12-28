<template>
  <v-card class="explorer_body">
    <v-card-title class="explorer_body__table_title">
      <span class="explorer_body__table_title_text">BlockChain Explorer</span>
      <v-text-field
        class="explorer_body__table_search"
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="blocks"
      :search="search"
      :rows-per-page-items="rowsPerPageItems"
      class="elevation-1 explorer_body__table"
    >
      <template
        slot="headerCell"
        slot-scope="{ header }"
      >
        <span class="subheading font-weight-bold explorer_body__table_cell--header" v-text="header.text"></span>
      </template>
      <template slot="items" slot-scope="{ item }">
        <td class="text-xs-center">
          <nuxt-link :to="{ name: 'blocks-id', params: { id: item.id }}"
                     class="explorer_body__table_cell explorer_body__table_cell--link">
            {{ item.blockId }}
          </nuxt-link>

        </td>
        <td class="text-xs-center">{{ item.version }}</td>
        <td class="text-xs-center">{{ item.time }}</td>
        <td class="text-xs-center">{{ item.height }}</td>
      </template>
      <v-alert slot="no-results" :value="true" color="error" icon="error">
        Your search for "{{ search }}" found no results.
      </v-alert>

      <template slot="no-data">
        <v-alert :value="true" color="error" icon="warning">
          Sorry, nothing to display here
        </v-alert>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  export default {
    name: 'BlockList',
    props: ['blocks', 'show_more'],
    filters: {
      truncate: (value, size, suffix = '...') => {
        return value.substring(0, size) + suffix
      }
    },
    data () {
      return {
        search: '',
        rowsPerPageItems: [10, 20, 30, 40],
        headers: [
          {
            text: 'Block ID',
            align: 'center',
            sortable: false,
            value: 'blockId'
          },
          {
            text: 'Block Version',
            sortable: false,
            align: 'center',
            value: 'version'
          },
          {
            text: 'Block 생성시간',
            sortable: true,
            align: 'center',
            value: 'createdAt'
          },
          {
            text: 'Block Height',
            sortable: true,
            align: 'center',
            value: 'height'
          }
        ]
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

    font-family: "Ubuntu", sans-serif;
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
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 600;

    @media screen and (max-width: $break-small){
      font-size: 1.5rem;
    }
  }

  .explorer_body__table_search {
    color: $green;
    flex-grow: 0.3;
  }
</style>
