<template>
    <div>
    <part1></part1>
      <part2></part2>

    </div>
</template>
<script>
  import part1 from "./noticePart1.vue";
  import part2 from "./noticePart2.vue";


  export default {
        name: "",
        mounted: function () {

        },
      components: {
        part1,part2
      },
        methods: {},
        destroyed: function () {

        },
        data: function () {
            return {}
        }
    }
</script>
<style type="text/css" scoped>

</style>


