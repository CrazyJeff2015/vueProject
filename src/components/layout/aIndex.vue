<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>近15天数据统计</span>
      </div>
      <div id="basicFlotLegend" class="flotLegend"></div>
      <div id="line-chart" class="flotChart1"></div>
    </el-card>
      <el-row>
        <el-col :span="12">
          <notice :index="1"></notice>
        </el-col>
        <el-col :span="12">
          <agentMes :index="1"></agentMes>
        </el-col>
      </el-row>
  </div>
</template>
<script>
  import api from '../../request/api';
  import flot from "../../vendors/flotchart/jquery.flot.js"
  import flotresize from "../../assets/js/jquery.flot.resize.js"
  import flottooltip from "../../vendors/flot.tooltip/js/jquery.flot.tooltip.min.js"
  import flotpie from "../../vendors/flotchart/jquery.flot.pie.js"
  import notice from "../notice.vue"
  import agentMes from './../smallCom/agentMes.vue';
    export default {
      name: "",
      components: {
        notice,agentMes
      },
      data: function () {
        return {


          Data:[],
        }
      },
        mounted: function () {

          this.dataHandle();
//          var b = new Date('2017-11-24T16:00:00.000Z');
//          console.log(b)
//          var a = this.dataFormat(b, "yyyy-MM-dd hh:mm:ss");
//           console.log(a)

        },
        methods: {

          dataHandle(){
            var _this = this;
            this.$ajax.get(api.aEchat)
              .then(function (response) {
                _this.Data = response.data.reverse();
                _this.initLine()

              })
              .catch(function (error) {
                console.log(error);
              });
          },
          initLine: function () {
            var _this = this;
            $(function () {
              var d1, d2,d3, data, Options;
              d1 = _this.splitData(_this.Data)

              d2 = _this.splitSoleData(_this.Data)
              d3 = _this.splitCountData(_this.Data)
              data = [{
                label: "佣金变化",
                data: d1,
                color: "#66cc99"
              }, {
                label: "占成变化",
                data: d2,
                color: "#f0ad4e"
              },
                {
                  label: "变化总计",
                  data: d3,
                  color: "#03A9F4"
                }];

              var timeArr = _this.splitTime(_this.Data);
              Options = {
                xaxis: {
                  ticks: timeArr,
                  min: 0,
                  max: timeArr.length,
                },
                yaxis: {},
                series: {
                  lines: {
                    show: true,
                    fill: false,
                    lineWidth: 2
                  },
                  points: {
                    show: true,
                    radius: 4.5,
                    fill: true,
                    fillColor: "#ffffff",
                    lineWidth: 2
                  }
                },
                grid: {
                  hoverable: true,
                  clickable: false,
                  borderWidth: 0
                },
                legend: {
                  container: '#basicFlotLegend',
                  show: true
                },

                tooltip: true,
                tooltipOpts: {
                  content: '%s: %y'
                }

              };

              var holder = $('#line-chart');

              if (holder.length) {
                $.plot(holder, data, Options);
              }

            });
          },
          parseParam: function (param) {
            let paramStr = "";
            for (var k in param) {
              if (param[k] != "" || typeof(param[k]) == "number") {
                paramStr += '&' + k + '=' + param[k]
              }
            }
            return paramStr;

          },
          splitData: function (data) {
            var arr = [];
            for (var i = 0; i < data.length; i++) {
              arr.push([i, data[i].commissionCount])
            }
            return arr;
          },
          splitSoleData: function (data) {
            var arr = [];
            for (var i = 0; i < data.length; i++) {
              arr.push([i, data[i].soleCommissionCount])
            }
            return arr;
          },
          splitCountData: function (data) {
            var arr = [];
            for (var i = 0; i < data.length; i++) {
                var count = Number(data[i].commissionCount) + Number(data[i].soleCommissionCount)
                arr.push([i, count])
            }
            return arr;
          },

          splitTime: function (data) {
            var arr = [];
            for (var i = 0; i < data.length; i++) {
                var date = data[i].date.substr(5)
              arr.push([i,date])
            }
            return arr;
          },
        },
        destroyed: function () {

        },

    }
</script>
<style src="../../assets/css/custom_css/flot_charts.css"></style>
<style>
  g.nv-background {
    opcity: 0;
    fill: #fff;
    fill-opacity: 0;
  }
  .nvd3 .nv-axis line {
    stroke: #e5e5e5;
  }
  /*#line-chart .flot-x-axis .flot-tick-label.tickLabel {*/
    /*transform: rotate(-45deg);*/
    /*-webkit-transform:rotate(-45deg);*/
    /*-moz-transform:rotate(-45deg);*/
    /*-ms-transform:rotate(-45deg);*/
    /*margin-top: 30px;*/
  /*}*/
  table, th, td {
    text-align: center;
  }

</style>


