import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const serverUrl = process.env.REACT_APP_SERVER_URL;

function App() {
  const navigate = useNavigate();

  const [data, setData] = useState("");
  useEffect(() => {
    axios.get(serverUrl + "/api/data").then((res) => {
      setData(res.data.message);
    });
  }, []);

  const [email, setEmail] = useState("");
  useEffect(() => {
    axios.get(serverUrl + "/api/user").then((res) => {
      console.log("res.data:", res.data);
      setEmail(res.data);
    });
  }, []);

  return (
    <>
      <p>Response from Express API:{data}</p>
      <p>Response from Express API:{email}</p>
    </>
  );
}

export { App, serverUrl };
