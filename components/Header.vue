<template>
  <v-toolbar class="explorer_header">
    <router-link to="/" class="explorer_header__title">
      <v-toolbar-title  v-text="title">
      </v-toolbar-title>
    </router-link>
    <v-btn href="/transaction/new" color="success">트랜잭션 생성</v-btn>
  </v-toolbar>
</template>

<script>
  import axios from '~/plugins/axios'
  require('vue2-autocomplete-js/dist/style/vue2-autocomplete.css')

  export default {
    name: 'Header',
    data () {
      return {
        blockHeight: '',
        title: 'Gruut Enterprise Network'
      }
    },
    methods: {
      findBlock () {
        axios.get(`/api/blocks/?height=${this.blockHeight}`)
          .then((res) => {
            this.clearInput()
            console.log(res)
            if (res.status === 200) {
              this.$router.push({name: 'blocks-id', params: {id: res.data[0].id}})
            }
          }).catch(e => {
            console.log(e)
          })
      },
      clearInput () {
        this.blockHeight = ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  $green: #00937B;
  $break-small: 500px;

  .explorer_header {
    background-image: linear-gradient(90deg, #00937B 0%, #8BC541 100%);
    box-shadow: rgba(0, 0, 0, 0.5) 0 1px 3px 0;
  }

  .explorer_header__title {
    width: 90%;
    color: #F5F5F5;
    text-decoration: none;
    font-weight: bold;
    font-family: "Ubuntu", sans-serif;

    @media screen and (max-width: $break-small) {
      width: 60%;
    }
  }
</style>
