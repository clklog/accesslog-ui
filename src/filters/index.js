// import parseTime, formatTime and set to filter
// export { parseTime, formatTime } from "@/utils";

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label;
  }
  return time + label + "s";
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time);
  if (between < 3600) {
    return pluralize(~~(between / 60), " minute");
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), " hour");
  } else {
    return pluralize(~~(between / 86400), " day");
  }
}
export function percentage(s) {
  if (s) {
    return (s * 100).toFixed(2) + "%";
  }
  return "--";
}
export function percenTable(s) {
  if (s) {
    return (s * 100).toFixed(2) + "%";
  }
  return 0;
}

export function formatTime(seconds) {
  if (seconds) {
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds - hours * 3600) / 60);
    var seconds = seconds - hours * 3600 - minutes * 60;

    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return hours + ":" + minutes + ":" + seconds;
  }
  return "--";
}
export function localIp() {
  if (
    window.location.origin == "http://192.168.100.171:9527" ||
    window.location.origin == "http://localhost:9527"
  ) {
    return true;
  } else {
    return false;
  }
}
// 获取本月日期
export function formatMonth() {
  const firstDayOfThisMonth = new Date();
  firstDayOfThisMonth.setDate(1);

  // 获取本月最后一天
  const lastDayOfThisMonth = new Date();
  lastDayOfThisMonth.setMonth(lastDayOfThisMonth.getMonth() + 1);
  lastDayOfThisMonth.setDate(0);

  // 获取上个月第一天
  const firstDayOfLastMonth = new Date();
  firstDayOfLastMonth.setMonth(firstDayOfLastMonth.getMonth() - 1);
  firstDayOfLastMonth.setDate(1);

  // 获取上个月最后一天
  const lastDayOfLastMonth = new Date();
  lastDayOfLastMonth.setDate(0);
  let toMonthFirst = `${firstDayOfThisMonth.getFullYear()}-${
    firstDayOfThisMonth.getMonth() + 1
  }-${firstDayOfThisMonth.getDate()}`;
  let toMonthLast = `${lastDayOfThisMonth.getFullYear()}-${
    lastDayOfThisMonth.getMonth() + 1
  }-${lastDayOfThisMonth.getDate()}`;

  let nextMonthFirst = `${firstDayOfLastMonth.getFullYear()}-${
    firstDayOfLastMonth.getMonth() + 1
  }-${firstDayOfLastMonth.getDate()}`;

  let nextMonthLast = `${lastDayOfLastMonth.getFullYear()}-${
    lastDayOfLastMonth.getMonth() + 1
  }-${lastDayOfLastMonth.getDate()}`;
  return [toMonthFirst, toMonthLast, nextMonthFirst, nextMonthLast];
}
// // 获取本周和上周日期
export function formatWeek() {
  let currentDate = new Date();
  let firstDayOfWeek = new Date(
    currentDate.getTime() - (currentDate.getDay() - 1) * 86400000
  ); // 86400000 毫秒数表示一天
  let lastDayOfWeek = new Date(
    currentDate.getTime() - (currentDate.getDay() - 1) * 86400000 + 6 * 86400000
  ); // 86400000 毫秒数表示一天
  let lastWeekFirstDay = new Date(firstDayOfWeek.getTime() - 7 * 86400000);
  let lastWeekLastDay = new Date(firstDayOfWeek.getTime() - 86400000);
  // 格式化日期字符串
  function formatDate(date) {
    let year = date.getFullYear();
    let month =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return year + "-" + month + "-" + day;
  }
  return [
    formatDate(firstDayOfWeek),
    formatDate(lastDayOfWeek),
    formatDate(lastWeekFirstDay),
    formatDate(lastWeekLastDay),
  ];
}
// 获取今日和昨日
export function formatToday() {
  var nowTime = new Date();
  var year = nowTime.getFullYear();
  var month = nowTime.getMonth() + 1;
  var toDay = nowTime.getDate();
  nowTime.setDate(nowTime.getDate() - 1);
  var yesterday = nowTime.getDate();
  let todayDate = year + "-" + month + "-" + toDay;
  let yesterdayDate = year + "-" + month + "-" + yesterday;
  return [todayDate, todayDate, yesterdayDate, yesterdayDate];
}
// 获取前一天日期
export function getYesterday(date) {
  // const yesterday = new Date(date);
  // yesterday.setDate(yesterday.getDate() - 1);
  // const a = yesterday.toLocaleDateString("zh-CN").replace(/\//g, "-");
  // return a;
  let inputDate = new Date(date);
  let previousDate = new Date(inputDate);
  previousDate.setDate(inputDate.getDate() - 1);
  let prevYear = previousDate.getFullYear();
  let prevMonth = previousDate.getMonth() + 1; 
  let prevDay = previousDate.getDate();
  prevMonth = prevMonth < 10 ? '0' + prevMonth : prevMonth;
  prevDay = prevDay < 10 ? '0' + prevDay : prevDay;
  return prevYear + '-' + prevMonth + '-' + prevDay;
}
// 获取上一月日期
export function getLastMonthDate(dateString) {
  const date = new Date(dateString);
  let lastYear = date.getFullYear();
  let lastMonth = date.getMonth();
  if (lastMonth < 0) {
    lastYear--;
    lastMonth = 1;
  }
  const lastDate = new Date(lastYear, lastMonth);
  return lastDate.toISOString().slice(0, 7) + "-01";
}
export function getLastDayOfMonth(dateString) {
  let date = new Date(dateString);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;

  date.setMonth(month);
  date.setDate(0);
  if (month == 12) {
    year++;
  }
  if (0 < month && month < 10) {
    month = "0" + month;
  }
  return year + "-" + month + "-" + date.getDate();
}

export function convertMB(limit) {
  if (limit) {
    return (limit / (1024 * 1024)).toFixed(2);
  } else {
    return 0;
  }
}
export function conver(limit) {
  if (limit) {
    var size = "";
    if (limit < 0.1 * 1024) {
      //如果小于0.1KB转化成B
      size = limit.toFixed(2) + "B";
    } else if (limit < 0.1 * 1024 * 1024) {
      //如果小于0.1MB转化成KB
      size = (limit / 1024).toFixed(2) + "KB";
    } else if (limit < 0.1 * 1024 * 1024 * 1024) {
      //如果小于0.1GB转化成MB
      size = (limit / (1024 * 1024)).toFixed(2) + "MB";
    } else {
      //其他转化成GB
      size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
    }
    var sizestr = size + "";
    var len = sizestr.indexOf(".");
    var dec = sizestr.substr(len + 1, 2);
    if (dec == "00") {
      //当小数点后为00时 去掉小数部分
      return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
    }
    return sizestr;
  } else {
    return "--";
  }
}
// 去除空字符串的问题
export function emptyString(s, list) {
  return list.split(s).filter((item) => item != "");
}

// 统一处理业务数据
export function filterBusinessList(
  businessListData,
  busiCode,
  stepCode,
  location,
  status
) {
  let filterList = {};
  businessListData.map((item) => {
    if (item.busiCode == busiCode && item.stepCode == stepCode) {
      if (item.summary) {
        item.summary.map((val) => {
          if (val.status == status) {
            return (filterList = val);
          }
        });
      }
    }
  });
  return filterList || {};
}
// 调试空值
export function filterBusinessListV2(
  businessListData,
  busiCode,
  stepCode,
  location,
  status
) {
  let filterList = {};
  businessListData.map((item) => {
    if (item.busiCode == busiCode && item.stepCode == stepCode) {
      if (item.summary) {
        item.summary.map((val) => {
          if (val.status == status) {
            if (val.items) {
              val.items.map((e) => {
                if (location == "") {
                  return (filterList = val);
                } else {
                  if (e.location == location) {
                    return (filterList = e);
                  }
                }
              });
              // val.items.map((e) => {
              //   if (e.location == location) {
              //     return (filterList = e);
              //   } else {
              //     return {};
              //   }
              // });
            }
          }
        });
      }
    }
  });
  return filterList || {};
}
// export function filterBusinessListV2(
//   businessListData,
//   busiCode,
//   stepCode,
//   location,
//   status
// ) {
//   let filterList = {};
//   businessListData.map((item) => {
//     if (item.busiCode == busiCode && item.stepCode == stepCode) {
//       if (item.summary) {
//         item.summary.map((val) => {
//           if (val.status == status) {
//             // return (filterList = val);
//             if (val.items) {
//               val.items.map(e =>{
//                 if (e.location == location) {
//                   return (filterList = e);
//                 }else{
//                   return {}
//                 }
//               })
//             }
//           }
//         });
//       }
//     }
//   });
//   return filterList || {};
// }
// 过滤监控面板业务数据
export function filterBusinessCount(val) {
  // if(val){
  if (val.items && val.items.length > 0) {
    return val.items[0].count;
  } else {
    return 0;
  }
  // }else{
  //   return 0;
  // }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1e18, symbol: "E" },
    { value: 1e15, symbol: "P" },
    { value: 1e12, symbol: "T" },
    { value: 1e9, symbol: "G" },
    { value: 1e6, symbol: "M" },
    { value: 1e3, symbol: "k" },
  ];
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (
        (num / si[i].value)
          .toFixed(digits)
          .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[i].symbol
      );
    }
  }
  return num.toString();
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0)
    .toString()
    .replace(/^-?\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","));
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
