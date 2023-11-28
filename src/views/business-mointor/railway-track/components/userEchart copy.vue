<template>
  <div style="margin-top: 30px; display: flex; justify-content: center">
    <div style="width: 80%">
      <div id="showTreeEcharts" class="showTreeEcharts"></div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import { getSessionListApi } from "@/api/trackingapi/business";
export default {
  data() {
    return {
      sessionList: [],
      sessionEchart: [],
      data: [
        {
          name: "用户(12345678)",
          children: [
            {
              name: "参拍申请(2023-01-01)",
              children: [
                {
                  name: "激活(2023-02-02)",
                  children: [
                    {
                      name: "激活(2023-03-02)",
                    },
                  ],
                },
                {
                  name: "激活(2023-02-02)",
                },
              ],
            },
            {
              name: "参拍申请(2023-02-01)",
              children: [
                {
                  name: "激活(2023-02-02)",
                  children: [
                    {
                      name: "拍卖登记(2023-03-02)",
                      children: [
                        {
                          name: "拍卖登记(2023-03-02)",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "参拍申请(2023-03-01)",
              children: [
                {
                  name: "激活(2023-02-02)",
                  children: [
                    {
                      name: "拍卖登记(2023-03-02)",
                      children: [
                        {
                          name: "拍卖登记(2023-03-02)",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
  },
  mounted() {
  },
  methods: {
    sessionListEvent(val) {
      val.applicationCode = "cnb.mgt";
      getSessionListApi(val).then((res) => {
        if (res.code == 200) {
          this.sessionList = [];
          res.data.map((item) => {
            if (item.sessionId) {
              // item.items =item.items.concat(item.items)
              // item.items =item.items.concat(item.items) 
              this.sessionList.push(item);
            }
          });
          // 处理成功的数据
          this.sessionList = this.sessionList
            .map((session) => {
              session.items = session.items.filter((item) => {
                return item.eventStatus === "成功";
              });
              return session;
            })
            .filter((session) => session.items.length > 0);

          // 处理成children的数据
          let array = [
            {
              name: "用户" + "(" + val.whoId + ")",
              itemStyle: {
                borderColor: "#2C7BE5",
              },
              children: [],
            },
          ];
          // this.sessionList.forEach((item) => {
          //   item.children = item.items;
          //   item.children.map((val,val_index) => {
          //     val.name = val.eventName + "(" + val.statDate + ")";
          //     val.children = []
          //     // array[0].children.push(val);
          //     // if (condition) {

          //     // }
          //   });
          //   //  this.childrenEvent(item.children)
          //   //  abc = this.childrenEvent(item.children)
          //   delete item.items;
          // });
          //只有二级的效果
          // this.sessionList.forEach((item,index) => {
          //   item.items.map((val, val_index) => {
          //     val.name = val.eventName + "(" + val.statDate + ")";
          //   });
          //   console.log(item.items)
          // });
          this.sessionList.forEach((session,index) => {
              var item = session.items[0];
              array[0].children.push({name:item.eventName + "(" + item.statDate + ")", children: []});
              if(session.items.length>1){
               this.makeNested(session.items,array[0].children[index],1);
              }
          })
          // console.log(array)
           

          this.sessionEchart = array;
          this.showTreeEchartsEcharts();
          // console.log(this.sessionEchart, "处理之后的数据");
        }
      });
    },
    makeNested(items,item,index) {
      item.children.push({name:items[index].eventName + "(" + items[index].statDate + ")", children: []})
      if(index+1<items.length){
        this.makeNested(items,item.children[0],index+1);
      }
    },

    //  js 递归处理  children: [
    //           {
    //             name: "2343",

    //           },
    //           {
    //             eventCategory: "",
    //             eventStatus: "成功",
    //             eventObjectType: "参拍申请2",
    //           },
    //         ],
    //        变成 children: [
    //                 {
    //                   eventCategory: "",
    //                   eventStatus: "成功",

    //                   eventObjectType: "参拍申请1",
    //                   children: [
    //                     {
    //                       eventCategory: "",
    //                       eventStatus: "成功",

    //                       eventObjectType: "参拍申请1",
    //                     },
    //                   ],
    //                 },
    //           ],这种数据结构
    //  js 递归处理  children: [
    //           {
    //             name: "2343",
    //           },
    //           {
    //             name: "2343",
    //           },
    //           {
    //             name: "2343",
    //           },
    //         ],
    //        变成 children: [
    //                 {
    //                   name: "2343",
    //                   children: [
    //                     {
    //                       name: "2343",
    //                       children: [
    //                         {
    //                           name: "2343",
    //                         },
    //                       ],
    //                     },
    //                   ],
    //                 },
    //           ],这种数据结构

    childrenEvent(obj) {
      //  unction transform(obj) {
      // const newObj = {
      //   eventCategory: obj.eventCategory,
      //   eventStatus: obj.eventStatus,
      //   eventObjectType: obj.eventObjectType,
      // };
      // if (obj.children) {
      //   newObj.children = obj.children.map(this.childrenEvent());
      // }
      // return newObj;
      //  children: [
      //   {
      //     eventCategory: "",
      //     eventStatus: "成功",
      //     eventObjectType: "参拍申请1",
      //   },
      //   {
      //     eventCategory: "",
      //     eventStatus: "成功",
      //     eventObjectType: "参拍申请2",
      //   },
      //   {
      //     eventCategory: "",
      //     eventStatus: "成功",
      //     eventObjectType: "参拍申请2",
      //   },
      // ],
      // children: [
      //   {
      //     eventCategory: "",
      //     eventStatus: "成功",
      //     eventObjectType: "参拍申请1",
      //   },
      //   children:[
      //   {
      //     eventCategory: "",
      //     eventStatus: "成功",
      //     eventObjectType: "参拍申请2",
      //   },
      //   children:[
      //   {
      //     eventCategory: "",
      //     eventStatus: "成功",
      //     eventObjectType: "参拍申请2",
      //   },
      //   ],
      //   ],
      // ],
      // 包含sessionId父级的结果
      // this.sessionList.forEach((item) => {
      //   item.children = item.items;
      //   item.children.map((val, val_index) => {
      //     val.itemStyle = {
      //       borderColor: "#2C7BE5",
      //     };
      //     val.name = val.eventName + "(" + val.statDate + ")";
      //     if (val_index == 0) {
      //       item.name = val.eventName + "(" + val.statDate + ")";
      //       item.itemStyle = {
      //       borderColor: "#2C7BE5",
      //     };
      //     }
      //   });
      //   array[0].children.push(item);
      //   delete item.items;
      // });
      // }
    },
    showTreeEchartsEcharts() {
      const mulColumnZZTData = {
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove",
        },
        grid: {
          top: "1%",
          left: "5%",
          bottom: "1%",
          right: "15%",
        },
        series: [
          {
            type: "tree",
            itemStyle: {
              color: "#2C7BE5",
            },
            data: this.sessionEchart,

            top: "1%",
            left: "15%",
            bottom: "1%",
            right: "15%",
            symbolSize: 7,
            label: {
              color: "#4D4D4D",
              position: "left",
              verticalAlign: "middle",
              align: "right",
              fontSize: 9,
            },
            leaves: {
              label: {
                position: "right",
                verticalAlign: "middle",
                align: "left",
              },
            },
            emphasis: {
              focus: "descendant",
            },
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750,
          },
        ],
      };

      const showTreeEcharts = echarts.init(
        document.getElementById("showTreeEcharts")
      );
      showTreeEcharts.setOption(mulColumnZZTData);
      window.addEventListener("resize", () => {
        if (showTreeEcharts) {
          showTreeEcharts.resize();
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
#showTreeEcharts {
  width: 100%;
  height: 300px;
}
</style>
