<template>
  <v-app>
    <my-header/>
    <v-content class="content">
      <my-parallax>
      </my-parallax>
      <v-container fluid>
        <nuxt/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import Header from '~/components/Header.vue'
  import MyParallax from '~/components/MyParallax.vue'
  import Footer from '~/components/Footer.vue'

  export default {
    components: {
      'my-header': Header,
      'my-parallax': MyParallax,
      'my-footer': Footer
    }
  }
</script>

<style scoped>
  .content {
    height: 500px;
    background: white;
  }
</style>
