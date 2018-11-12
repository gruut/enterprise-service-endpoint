<template>
  <section class="explorer_header">
    <div class="explorer_header__container">
      <router-link to="/" class="explorer_header__home_link">
        <!--<img src="https://gruut.net/images/gruut_logo_small.png" alt="Gruut Networks" class="explorer_header__logo_image">-->
      </router-link>
    </div>

    <div class="explorer_header__main_container">
      <div class="explorer_header__container_title">블록 탐색기</div>
      <div class="explorer_header__container_search">
        <!-- TODO: autocomplete 나중에 구현 -->
        <!--<autocomplete-->
        <!--url="/api/blocks"-->
        <!--anchor="height"-->
        <!--placeholder="Block height를 입력해주세요."-->
        <!--:on-select="getData"-->

        <!--className="explorer_header__container_search_textarea"-->
        <!--&gt;</autocomplete>-->
        <input v-model="blockHeight" @change="findBlock"
               placeholder="Block height를 입력해주세요"
               input="text"
               v-on:keyup.enter="findBlock"
               class="explorer_header__container_search_textarea">
        <div class="explorer_header__container_search_button" v-on:click="findBlock">
          <i class="fa fa-search"></i>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  // import Autocomplete from 'vue2-autocomplete-js'
  require('vue2-autocomplete-js/dist/style/vue2-autocomplete.css')

  export default {
    name: 'Header',
    // components: {Autocomplete},
    data () {
      return {
        blockHeight: ''
      }
    },
    methods: {
      findBlock () {
        console.log(this.blockHeight)
        this.$router.push({name: 'blocks-id', params: {id: this.blockHeight}})
      },
      clearInput () {
        this.blockHeight = ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  $green: #00937B;

  .explorer_header {
    justify-content: center;
    background-image: linear-gradient(90deg, #00937B 0%, #8BC541 100%);
    box-shadow: rgba(0, 0, 0, 0.5) 0 1px 3px 0;
  }

  .explorer_header__container {
    width: 100%;
    height: 4.5rem;
    padding: 0 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .explorer_header__home_link {
    font-size: 1.5rem;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: bold;
    color: #F5F5F5;
    text-decoration: none;
  }

  .explorer_header__main_container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .explorer_header__container_title {
    color: #F5F5F5;
    font-size: 2.5rem;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 600;
  }

  .explorer_header__container_search {
    width: 45%;
    height: 3rem;
    display: flex;
    margin: 2rem 0;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    box-shadow: rgba(0, 0, 0, 0.5) 0 1px 1px 0;
    border-radius: 0.5rem;
  }

  .explorer_header__container_search_textarea {
    display: block;
    width: 100%;
    height: 100%;
    border: none;
    font-size: 1rem;
    padding: 0 1.4rem;
    font-family: "Source Sans Pro", sans-serif;
  }

  .explorer_header__container_search_button {
    display: flex;
    justify-content: center;
    align-items: center;

    width: auto;
    height: 100%;

    padding: 1rem;
    border: none;
    box-sizing: border-box;
    background: rgb(255, 202, 0);

    font-weight: bold;
    font-size: 1.5rem;
  }

  .explorer_header__logo_image {
    max-width: 40px;
    margin-top: 2rem;
  }
</style>
