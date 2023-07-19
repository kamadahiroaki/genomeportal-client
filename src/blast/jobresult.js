import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Center } from "@chakra-ui/react";
import { serverUrl } from "../App.js";
import axios from "axios";

const Jobresult = () => {
  const location = useLocation();
  console.log("location.href:", location.href);
  const searchParams = new URLSearchParams(location.search);
  const jobid = searchParams.get("jobid");
  console.log("jobid:", jobid);
  const [text, setText] = useState("connecting...");
  const [htmlContent, setHtmlContent] = useState("");

  if (jobid == null) {
    setText("no such job");
  } else {
    const jobUrl = "/jobResult?jobid=" + jobid;
    const url = serverUrl + jobUrl;

    const timeout = 60;
    const fetchResultInterval = async (sec) => {
      console.log("url:", url);
      await axios
        .get(url)
        .then((res) => {
          console.log("res.data:", res.data);
          if (res.data === "") {
            setText("no such job");
          } else if (res.data.outjson != null) {
            setText(res.data.outjson);
            axios
              .get(serverUrl + "/resultFile?jobid=" + jobid)
              .then((res) => {
                setHtmlContent(res.data);
              })
              .catch((err) => {
                console.log("err:", err);
              });
          } else if (sec > timeout / 2) {
          } else {
            setText("now calculating");
            setTimeout(() => {
              fetchResultInterval(sec * 1.2);
            }, sec * 1000);
          }
        })
        .catch((err) => {
          console.log("err:", err);
        });
    };

    fetchResultInterval(5);
  }

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
  };

  return (
    <div>
      {htmlContent ? (
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      ) : (
        <div>
          <p>Result:</p>
          <p>text:{text}</p>
        </div>
      )}
    </div>
  );
};
export default Jobresult;
