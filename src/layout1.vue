<template>
  <div>
    <clear_header></clear_header>
    <div class="wrapper row-offcanvas row-offcanvas-left">
      <left_side></left_side>
      <right_side>
        <router-view v-if="ifRefresh"></router-view>
      </right_side>
    </div>
  </div>
</template>
<script>
  import clear_header from "./components/layout/clear_header";
  import left_side from "./components/layout/left-side";
  import right_side from "./components/layout/right-side";
  import niceScroll from './vendors/jquery.nicescroll/jquery.nicescroll.min.js';
  import metisMenu from './assets/js/metisMenu.js';
  import left_menu from './assets/js/custom_js/leftmenu.js';
  import rightside_bar from './assets/js/custom_js/rightside_bar.js';
  export default {
    name: 'layout1',
    components: {
      clear_header,
      left_side,
      right_side
    },
    computed: {
        ifRefresh:function () {
          return this.$store.state.fresh.ifRefresh;
        }
    },
    mounted: function () {

      function _fix() {
        //Get window height and the wrapper height
        var height = $(window).height() - $("body > .header").height();
        $(".wrapper").css("min-height", height + "px");
        var content = $(".wrapper").height();
        //If the wrapper height is greater than the window
        if ($(window).width() > 992) {
          if (content > height) {
            //then set sidebar height to the wrapper
            $(".left-side, html, body").css("min-height", content + "px");
          } else {
            //Otherwise, set the sidebar to the height of the window
            $(".left-side, html, body").css("min-height", height + "px");
          }
        } else {
          if (content > height) {
            //then set sidebar height to the wrapper
            $(".left-side, html, body").css("min-height", content + 1 + "px");
          } else {
            //Otherwise, set the sidebar to the height of the window
            $(".left-side, html, body").css("min-height", height + 1 + "px");
          }
        }
      }

      //Fire upon load Clear
      _fix();
      //Fire when wrapper is resized
      $(".wrapper").on('resize', function () {
        _fix();
        fix_sidebar();
      });

      //Fix the fixed layout sidebar scroll bug
      fix_sidebar();

      function fix_sidebar() {
        //Make sure the body tag has the .fixed class
        if (!$("body").hasClass("fixed")) {
          return;
        }
        //Add slimscroll
            $(".sidebar").slimscroll({
                height: ($(window).height() - $(".header").height()) + "px",
                color: "rgba(0,0,0,0.2)"
            });
      }

      // left full width code e

    },
    methods: {

    },
  }
</script>
<style src="./assets/css/custom_css/metisMenu.css"></style>
<style lang="sass">
  @import ./assets/sass/custom.scss
</style>
