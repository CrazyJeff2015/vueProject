<template>
    <div>
      <el-card class="box-card">
        <el-row>
          <el-col :span="12">
            <h4>  <span>代理总数: </span><span style="color: red" v-text="oNum.agentNum"></span></h4>
          </el-col>
          <el-col :span="12">
            <h4> <span>用户总数: </span><span style="color: red" v-text="oNum.userNum"></span></h4>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>近7天用户数变化</span>
        </div>
        <div id="basicFlotLegend1" class="flotLegend"></div>
        <div id="line-chart1" class="flotChart1"></div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>近15天基本报表</span>
        </div>
        <div id="basicFlotLegend" class="flotLegend"></div>
        <div id="line-chart" class="flotChart1"></div>
      </el-card>
    </div>
</template>
<script>
  import api from '../../request/api';
  import flot from "../../vendors/flotchart/jquery.flot.js"
  import flotresize from "../../assets/js/jquery.flot.resize.js"
  import flottooltip from "../../vendors/flot.tooltip/js/jquery.flot.tooltip.min.js"
  import flotpie from "../../vendors/flotchart/jquery.flot.pie.js"
    export default {
        name: "",
      data: function () {
        return {
          Data:[],
          tableName:[],
          oNum:{},
          aData:[],
          onlineData:[]
        }
      },
        mounted: function () {
          this.dataHandle();
//          this.getOnlie();
          this.getONum()
          this.getAData()
        },
        methods: {
          getAData(){
            var _this = this;
            this.$ajax.get(api.addAgentAndUserStat)
              .then(function (response) {
                _this.aData = response.data.reverse();
                _this.initLine1()
              })
              .catch(function (error) {
                console.log(error);
              });
          },
          getONum(){
            var _this = this;
            this.$ajax.get(api.agentAndUserStat)
              .then(function (response) {
                _this.oNum = response.data;
              })
              .catch(function (error) {
                console.log(error);
              });
          },
            getOnlie(){
              var _this = this;
              this.$ajax.get(api.onlineStat)
                .then(function (response) {
                  _this.onlineData = response.data;

                })
            },
          dataHandle(){
            var _this = this;
            this.$ajax.get(api.getFinList)
              .then(function (response) {
                _this.Data = response.data.data.list.reverse();
                for(var i=0;i<_this.Data.length;i++){
                  for(var k in _this.Data[i]){
                    if(_this.Data[i][k]==null||_this.Data[i][k]==''){
                      _this.Data[i][k] = 0;
                    }
                  }
                }
                _this.tableName = _this.getValue(response.data.data.table)
                _this.initLine()

              })
              .catch(function (error) {
                console.log(error);
              });
          },
          initLine: function () {
            var _this = this;
            $(function () {
              var d1, d2,d3,d4,d5,d6,d7, data, Options;
              d1 = _this.splitData(_this.Data,'way1')
              d2 = _this.splitData(_this.Data,'way2')
              d3 = _this.splitData(_this.Data,'way3')
              d4 = _this.splitData(_this.Data,'all')
              d5 = _this.splitData(_this.Data,'ex')
              d6 = _this.splitData(_this.Data,'tax')
              d7 = _this.splitData(_this.Data,'free')
              data = [{
                label: _this.tableName[1],
                data: d1,
                color: "#ff6894"
              }, {
                label: _this.tableName[2],
                data: d2,
                color: "#ffd4e2"
              },
                {
                  label:_this.tableName[3],
                  data: d3,
                  color: "#ff1a2b"
                },
                {
                  label:_this.tableName[4],
                  data: d4,
                  color: "#ee21ff"
                }
                ,
                {
                  label:_this.tableName[5],
                  data: d5,
                  color: "#f4d534"
                }
                ,
                {
                  label:_this.tableName[6],
                  data: d6,
                  color: "#241fd7"
                }
                ,
                {
                  label:_this.tableName[7],
                  data: d7,
                  color: "#69dde0"
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
          initLine1: function () {
            var _this = this;
            $(function () {
              var d1, d2, data, Options;
              d1 = _this.splitData(_this.aData,'agentNum')
              d2 = _this.splitData(_this.aData,'userNum')
              data = [{
                label: "新增代理数",
                data: d1,
                color: "#69dde0"
              }, {
                label: "新增用户数",
                data: d2,
                color: "#ee21ff"
              }];

              var timeArr = _this.splitTime(_this.aData);
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
                  container: '#basicFlotLegend1',
                  show: true
                },

                tooltip: true,
                tooltipOpts: {
                  content: '%s: %y'
                }

              };

              var holder = $('#line-chart1');

              if (holder.length) {
                $.plot(holder, data, Options);
              }

            });
          },
          getValue: function (obj) {
            var arr = [];
            if(obj==undefined){
              arr = [];
            }else {
              for (var i = 0; i < obj.length; i++) {
                arr.push(obj[i].name)
              }
            }
            return arr;
          },
          splitData: function (data,parameter) {
            var arr = [];
            for (var i = 0; i < data.length; i++) {
              arr.push([i, data[i][parameter]])
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
  .flotLegend tr {
    display: inline;
    margin-right: 10px;
  }

  table, th, td {
    text-align: center;
  }

</style>


