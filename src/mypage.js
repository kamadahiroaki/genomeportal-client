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
import { serverUrl } from "./App.js";

const MypageButton = () => {
  const navigate = useNavigate();
  return (
    <Button
      colorScheme="pink"
      onClick={() => {
        navigate("mypage");
      }}
    >
      MyPage
    </Button>
  );
};

const Mypage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  useEffect(() => {
    axios.get(serverUrl + "/api/user").then((res) => {
      console.log("res.data:", res.data);
      setUser(res.data);
      console.log("user:", user);
      if (!res.data) {
        navigate("/login");
      }
    });
  }, []);

  return <>Hello, {user}!</>;
};

export { Mypage, MypageButton };
