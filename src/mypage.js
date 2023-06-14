import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";
import { LoginButton, LogoutButton } from "./login";

const Mypage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  useEffect(() => {
    axios.get("/api/user").then((res) => {
      console.log("res.data:", res.data);
      setUser(res.data);
      if (!user) {
        navigate("/login");
      }
    });
  }, []);

  return (
    <>
      Hello, {user}!
      <LogoutButton />
    </>
  );
};

export default Mypage;
