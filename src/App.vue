<template>
    <div id="app">
        <preloader></preloader>
        <router-view></router-view>
    </div>
</template>
<script>
import preloader from "./components/layout/preloader";
import layout1 from "./layout1";
import bootstrap from './vendors/bootstrap/dist/js/bootstrap.min.js';
export default {
    name: 'app',
    components: {
        layout1,
        preloader
    }
}
</script>
<style lang="sass">
@import ./assets/sass/bootstrap/bootstrap.scss
</style>
<!--<style src="./vendors/font-awesome/css/font-awesome.min.css"></style>-->
<!--<style src="./vendors/simple-line-icons/css/simple-line-icons.css"></style>-->

