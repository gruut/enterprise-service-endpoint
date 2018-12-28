<template>
  <div
    class="explorer_parallax"
  >
    <div class="explorer_parallax__container">
      <video class="explorer_parallax__video" autoplay loop muted>
        <source type="video/mp4" src="../static/main_video.mp4"></source>
      </video>
      <div
        class="explorer_parallax__heading"
      >
        <div class="explorer_parallax__heading_container">
          <img class="explorer_parallax__image" src="../static/gruut_new_logo.png"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MyParallax'
  }
</script>

<style lang="scss" scoped>
  $extra-small: 640px;
  $medium: 960px;

  .explorer_parallax {
    width: 100%;
    height: 25%;
  }

  .explorer_parallax__container {
    position: relative;
    overflow: hidden;

    height: 100%;
  }

  .explorer_parallax__video {
    display: flex;

    width: 100%;
    height: auto;
    position: relative;

    color: #fff;
    z-index: 1;

    -webkit-filter: blur(10px);
    -moz-filter: blur(10px);
    -o-filter: blur(10px);
    -ms-filter: blur(10px);
    filter: blur(10px);
  }

  .explorer_parallax__heading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;

    text-align: center;
    z-index: 1000;
  }

  .explorer_parallax__heading_container {
    display: flex;
    flex-direction: column;
  }

  .explorer_parallax__image {
    @media screen and (max-height: $medium) {
      height: 100px;
    }
  }
</style>