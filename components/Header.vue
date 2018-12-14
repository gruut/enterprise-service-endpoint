<template>
  <section class="explorer_header">
    <div class="explorer_header__container">
      <nav class="explorer_header__nav">
        <a class="explorer_header__generate_tx_link">
          <span>
            트랜잭션 생성
          </span>
        </a>
      </nav>
    </div>

    <div class="explorer_header__main_container">
      <div class="explorer_header__container_title">블록 탐색기</div>
      <div class="explorer_header__container_search">

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
  require('vue2-autocomplete-js/dist/style/vue2-autocomplete.css')

  export default {
    name: 'Header',
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
    background-image: linear-gradient(90deg, #00937B 0%, #8BC541 100%);
    box-shadow: rgba(0, 0, 0, 0.5) 0 1px 3px 0;
  }

  .explorer_header__container {
    display: flex;
    height: 4.5rem;
    padding: 0 8rem;
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

  .explorer_header__nav {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .explorer_header__generate_tx_link {
    width: 130px;
    height: 40px;

    display: flex;
    justify-content: center;
    align-items: center;

    text-decoration: none;
    font-weight: bold;
    font-size: 1rem;
    color: #F5F5F5;

    border-radius: 3px;
    border: 2px solid #F5F5F5;

    cursor: pointer;
    transition: all 0.25s ease;
  }
</style>
