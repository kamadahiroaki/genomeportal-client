import axios from "axios";
import { serverUrl } from "../App.js";

const getNuclDatabaseList = () => {
  return axios
    .get(serverUrl + "/api/nuclDatabaseList")
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log("err:", err);
      throw err;
    });
};
const getProtDatabaseList = () => {
  return axios
    .get(serverUrl + "/api/protDatabaseList")
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log("err:", err);
      throw err;
    });
};
export { getNuclDatabaseList, getProtDatabaseList };
