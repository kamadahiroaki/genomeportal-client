import logo from "./logo.svg";
import "./App.css";
import React, { useState, useRef, useEffect } from "react";
import { Container } from "@chakra-ui/react";
import { Select, Textarea, Button } from "@chakra-ui/react";
import axios from "axios";
import { ulid } from "ulid";
import { useNavigate } from "react-router-dom";
import { LoginForm, LoginButton, LogoutButton } from "./login";

const serverUrl = "http://localhost:8080";

const Blast = ({ handleClick }) => {
  return (
    <>
      <div>
        <label>
          <Button onClick={handleClick} colorScheme="blue" size="lg">
            BLAST
          </Button>
        </label>
      </div>
    </>
  );
};

const Login = ({ handleClick }) => {
  return (
    <>
      <div>
        <label>
          <Button onClick={handleClick} colorScheme="blue" size="lg">
            LOGIN
          </Button>
        </label>
      </div>
    </>
  );
};

function App() {
  const navigate = useNavigate();

  const [data, setData] = useState("");
  useEffect(() => {
    axios.get("/api/data").then((res) => {
      setData(res.data.message);
    });
  }, []);

  const [email, setEmail] = useState("");
  useEffect(() => {
    axios.get("/api/user").then((res) => {
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
