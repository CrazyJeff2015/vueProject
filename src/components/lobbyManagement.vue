<template>
  <div>
    <el-collapse value="1">
      <el-collapse-item v-for="item in data" :name="item.name" :title="item.name">
       <ul>
         <li v-for="item in item.list">
           <div v-text="item.name"></div>
           <ul>
             <li>type:<span  v-text="item.param.type"></span></li>
             <li>count:<span v-text="item.param.count"></span></li>
             <li>gid:<span v-text="item.param.gid"></span></li>
             <li>spend:<span v-text="item.param.spend"></span></li>
           </ul>
         </li>
       </ul>
      </el-collapse-item>
    </el-collapse>

  </div>
</template>
<script>
  import api from '../request/api';
  export default {
    name: "",
    data: function () {
      return {
        data: []
      }
    },
    mounted: function () {
      this.getData()
    },
    methods: {
      getData(){
        let _this = this;
        this.$ajax.get(api.lobbyList).then(function (response) {
          console.log(response.data)
          _this.data = response.data.task;
        })
      }
    },
    destroyed: function () {

    },

  }
</script>
<style type="text/css" scoped>

</style>


