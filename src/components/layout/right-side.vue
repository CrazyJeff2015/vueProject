<template>
    <aside class="right-side">
        <!-- Content Header (Page header) -->
        <section class="content-header">
            <h1 v-html="this.$route.meta.title">Title</h1>
            <!--<ol class="breadcrumb" v-html="this.$route.meta.breadcrumb"></ol>-->
        </section>
        <!-- Main content -->
        <section class="content">
            <slot></slot>
            <!--rightside bar -->
        </section>
        <!-- /.content -->

    </aside>
</template>
<script>
export default {
  name: "right-side",
  data:function () {
    return{
      showError:false
    }
  },
  mounted:function(){

  },
  methods: {


  }
}
</script>

