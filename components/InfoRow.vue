<template>
  <div>
    <template v-if="isMobile">
      <v-layout
        column
      >
        <v-flex>
          <v-card-text>
            <slot name="title"></slot>
          </v-card-text>
        </v-flex>
        <v-flex class="info__value--mobile">
          <v-card-text>
            <slot name="value"></slot>
          </v-card-text>
        </v-flex>
      </v-layout>
    </template>
    <template v-else>
      <v-layout
      >
        <v-flex xs5>
          <v-card-text>
            <slot name="title"></slot>
          </v-card-text>
        </v-flex>
        <v-flex xs7>
          <v-card-text class="info__value_text">
            <slot name="value"></slot>
          </v-card-text>
        </v-flex>
      </v-layout>
    </template>
    <v-divider></v-divider>
  </div>
</template>

<script>
  export default {
    name: 'InfoRow',
    props: ['isMobile']
  }
</script>

<style lang="scss" scoped>
  $break-small: 600px;
  
  .info__value--mobile {
    font-size: 10px;
    word-break: break-all;
  }

  .info__value_text {
    font-family: 'Consolas', monospace
  }
</style>
