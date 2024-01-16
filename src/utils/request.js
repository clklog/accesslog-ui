import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API ? process.env.VUE_APP_BASE_API : "/api", // url = base url + request url
  timeout: 5000, // request timeout
});

service.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = getToken();

    if (store.getters.token) {
      config.headers["X-Token"] = getToken();
      // config.headers['Authorization'] =  'Bearer ' + getToken()
    }
    // 配置诺依框架接口请求
    if (
      window.location.origin == "http://192.168.100.171:9527" ||
      window.location.origin == "http://localhost:9527"
    ) {
      config.headers["Authorization"] =
        "Bearer " +
        "eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6ImI5NDc2NTZhLTVmYTAtNGVhOC1hM2JjLWIyMGJmODgyZTNlNSJ9.ClZFunUTPf2wiK7QwHgnpKti7l4ddfUIsTtyNfgy-tlZk4ATjhuKDpSe-ogen6vTGVHtMkfd5xG4Wx8vtofE6A"
    }else{
      config.headers['Authorization'] =  'Bearer ' + getToken()
    }

    const isMock = config.url.includes("/vue-element-admin/user");
    if ((config.method === "post" || config.method === "put") && !isMock) {
      if (!config.headers["Content-Type"]) {
        config.headers["Content-Type"] = "application/json;";
      }
      config.data = JSON.stringify(config.data);
    }
    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code !== 200) {
      Message({
        message: res.message || "Error",
        type: "error",
        duration: 5 * 1000,
      });
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm(
          "You have been logged out, you can cancel to stay on this page, or log in again",
          "Confirm logout",
          {
            confirmButtonText: "Re-Login",
            cancelButtonText: "Cancel",
            type: "warning",
          }
        ).then(() => {
          store.dispatch("user/resetToken").then(() => {
            location.reload();
          });
        });
      }
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res;
    }
  },
  (error) => {
    console.log("err" + error); // for debug
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
