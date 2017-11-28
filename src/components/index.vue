<template>
  <div>
    <section class="main">
      <h2 class="cs-text">
        <span class="cs-text-cut"><span class="word1">Welcome</span> </span>
        <span class="cs-text-mid">User</span>
        <span class="cs-text-cut"><span class="word1">Welcome</span> </span>
      </h2>
    </section>
  </div>
</template>
<script>

  export default {
    name: 'index',
    mounted: function () {

    },
    destroyed: function () {

    },
    data(){
        return{

        }
    }
  }
</script>
<style scoped>


  .main {
    width: 90%;
    margin: 0 auto;
    position: relative;
    z-index: 22;
  }


  .cs-text {
    width: 645px;
    margin: 120px auto 30px;
    cursor: default;
  }

  .cs-text {
    width: 645px;
    margin: 120px auto 30px;
    cursor: default;
  }

  .cs-text > span {
    display: block;
    -webkit-backface-visibility: hidden;
  }

  .cs-text-cut {
    width: 100%;
    height: 90px;
    overflow: hidden;
    -webkit-transition: all 0.4s ease-in-out;
    -moz-transition: all 0.4s ease-in-out;
    -o-transition: all 0.4s ease-in-out;
    -ms-transition: all 0.4s ease-in-out;
    transition: all 0.4s ease-in-out;
  }

  .cs-text-cut:first-child {
    border-top: 1px solid rgba(255, 255, 255, 0.5);
  }

  .cs-text-cut:last-child {
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  }

  .cs-text-cut span {
    display: block;
    line-height: 180px;
    color: #888;
    font-size: 110px;
    font-weight: 400;
    text-transform: uppercase;
    text-align: center;
    margin-top: 6px;
    font-family: 'Sancreek', cursive;
    text-shadow: 7px 2px 0 #ccc;
  }

  .cs-text-cut:last-child span {
    margin-top: -84px;
  }

  .cs-text-mid {
    font-family: 'Raleway', sans-serif;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 50px;
    letter-spacing: 50px;
    line-height: 50px;
    text-indent: 160px;
    position: absolute;
    top: 50%;
    margin-top: -25px;
    color:#666;
    text-shadow: 0 0 0 #ccc;
    opacity: 0;
    transform: scale(0.5);
    transition: all 0.4s ease-in-out 0s;
  }

  .cs-text:hover .cs-text-cut:first-child {
    -webkit-transform: translateY(-25px);
    -moz-transform: translateY(-25px);
    -o-transform: translateY(-25px);
    -ms-transform: translateY(-25px);
    transform: translateY(-25px);
    opacity: 0.5;
  }

  .cs-text:hover .cs-text-cut:last-child {
    -webkit-transform: translateY(25px);
    -moz-transform: translateY(25px);
    -o-transform: translateY(25px);
    -ms-transform: translateY(25px);
    transform: translateY(25px);
    opacity: 0.5;
  }

  .cs-text:hover .cs-text-mid {
    -webkit-transition-delay: 0.3s;
    -moz-transition-delay: 0.3s;
    -o-transition-delay: 0.3s;
    -ms-transition-delay: 0.3s;
    transition-delay: 0.3s;
    opacity: 1;
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    -o-transform: scale(1);
    -ms-transform: scale(1);
    transform: scale(1);
  }
</style>

