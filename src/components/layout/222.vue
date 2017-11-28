<template>

  <el-menu
    v-if="showMenu"
    router
    unique-opened
    ref="navbar"
    :default-active="onRoutes"
    @select="selectMenu">

    <nav-item
      v-for="(item, n) in newData"
      :item="item"
      :navIndex="String(n)"
      :key="n">
    </nav-item>
  </el-menu>


</template>
<script>
  import navItem from './333.vue'
  export default {
    components: {
      navItem
    },
    mounted: function () {
      this.dataChange();
    },
    data(){
      return {
        showMenu: false,
        data: [{
          "MenuID": "CO100000",
          "ParentID": "0",
          "MenuName": "销售管理",
          "Images": "note_pin.png",
          "MenuUrl": ""
        }, {
          "MenuID": "PO100000",
          "ParentID": "0",
          "MenuName": "采购管理",
          "Images": "note_pin.png",
          "MenuUrl": ""
        }, {
          "MenuID": "PJ100000",
          "ParentID": "0",
          "MenuName": "工程管理",
          "Images": "note_pin.png",
          "MenuUrl": ""
        }, {
          "MenuID": "ST100000",
          "ParentID": "0",
          "MenuName": "仓库管理",
          "Images": "note_pin.png",
          "MenuUrl": ""
        }, {
          "MenuID": "PD100000",
          "ParentID": "0",
          "MenuName": "生产管理",
          "Images": "note_pin.png",
          "MenuUrl": ""
        }, {
          "MenuID": "RP100000",
          "ParentID": "0",
          "MenuName": "商业智能",
          "Images": "note_pin.png",
          "MenuUrl": ""
        }, {
          "MenuID": "BS100000",
          "ParentID": "0",
          "MenuName": "公共资料",
          "Images": "note_pin.png",
          "MenuUrl": ""
        }, {
          "MenuID": "SY100000",
          "ParentID": "0",
          "MenuName": "系统管理",
          "Images": "note_pin.png",
          "MenuUrl": ""
        }, {
          "MenuID": "BS100101",
          "ParentID": "BS100000",
          "MenuName": "部门",
          "Images": "",
          "MenuUrl": "/Base/Department/Index"
        }, {
          "MenuID": "CO100100",
          "ParentID": "CO100000",
          "MenuName": "报价管理",
          "Images": "note_pin.png",
          "MenuUrl": ""
        }, {
          "MenuID": "CO100200",
          "ParentID": "CO100000",
          "MenuName": "订单管理",
          "Images": "note_pin.png",
          "MenuUrl": ""
        }, {
          "MenuID": "CO100101",
          "ParentID": "CO100100",
          "MenuName": "报价单",
          "Images": "",
          "MenuUrl": "/Admin/Feddy/Index"
        }, {
          "MenuID": "RP100010",
          "ParentID": "RP100000",
          "MenuName": "外协地图",
          "Images": "",
          "MenuUrl": "/Analysis/OpaMap/OpaMap"
        }, {
          "MenuID": "RP100020",
          "ParentID": "RP100000",
          "MenuName": "地图链",
          "Images": "",
          "MenuUrl": "/Analysis/PurMap/Index"
        }, {
          "MenuID": "SY100001",
          "ParentID": "SY100000",
          "MenuName": "基本参数",
          "Images": "",
          "MenuUrl": ""
        }, {
          "MenuID": "SY100010",
          "ParentID": "SY100000",
          "MenuName": "菜单授权",
          "Images": "",
          "MenuUrl": "/System/MenuLimits/Index"
        }, {
          "MenuID": "SY100020",
          "ParentID": "SY100000",
          "MenuName": "用户管理",
          "Images": "",
          "MenuUrl": "/System/User/Index"
        }, {
          "MenuID": "SY100030",
          "ParentID": "SY100000",
          "MenuName": "用户权限",
          "Images": "",
          "MenuUrl": "/System/UserLimits/Index"
        }],
        newData: [],

      }
    },
    computed: {
      onRoutes(){
        return this.$route.path
      }
    },

    methods: {
      dataChange(){
        var arr = [];
        var arr2 = [];
        var arr3 = [];
        console.log(this.data.length)
        for (var i = 0; i < this.data.length; i++) {
          if (this.data[i].ParentID == '0') {
            arr.push(this.data[i])
          } else {
            arr2.push(this.data[i])
          }
        }
        arr3 = arr2;
        for (var j = 0; j < arr.length; j++) {
          for (var z = 0; z < arr2.length; z++) {
            if (arr2[z].ParentID == arr[j].MenuID) {
              arr[j].child == undefined ? (arr[j].child = [], arr[j].child.push(arr2[z])) : (arr[j].child.push(arr2[z]))
            }
          }
        }
        for (var o = 0; o < arr3.length; o++) {
          for (var b = 0; b < arr.length; b++) {
            if (arr[b].child != undefined) {
              for (var h = 0; h < arr[b].child.length; h++) {
                if (arr3[o].ParentID == arr[b].child[h].MenuID) {
                  console.log(arr[b].child[h].MenuID)
                  arr[b].child[h].child == undefined ? (arr[b].child[h].child = [], arr[b].child[h].child.push(arr3[o])) : (arr[b].child[h].child.push(arr3[o]))
                }
              }
            }
          }
        }
        console.log(arr3)
        this.newData = arr;
        this.showMenu = true;
        console.log(arr)
      },
      selectMenu(index, indexPath){
        /**
         * 在选择父级菜单时自动关闭其下所有子菜单
         * 选择时获取点击菜单的父级index，并计算得到该index在已打开菜单中的索引值，
         * 关闭位于当前打开菜单中该索引值之后的全部菜单
         */
          // 获取当前打开的所有菜单
        let openMenu = this.$refs.navbar.openedMenus.concat([])
        // 获取点击菜单的父级index，如果当前点击的是根节点，则直接关闭所有打开菜单
        let nowMenuPath = indexPath.length > 1 ? indexPath[indexPath.length - 2] : ""
        if (nowMenuPath) {
          // 获取父级index在数组中索引，关闭其后所有的菜单
          let menuIndex = openMenu.indexOf(nowMenuPath)
          openMenu = openMenu.slice(menuIndex + 1)
        }
        openMenu = openMenu.reverse()
        openMenu.forEach((ele) => {
          this.$refs.navbar.closeMenu(ele)
        })
      }
    }

  }
</script>



