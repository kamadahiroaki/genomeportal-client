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

const LoginForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post("/api/login", { email, password })
      .then((res) => {
        console.log(res);
        navigate("/mypage");
        window.location.reload();
      })
      .catch((err) => {
        alert("login error");
      });
    setEmail("");
    setPassword("");
  };

  const handleSignup = (e) => {
    e.preventDefault();
    // Perform login logic here
    axios
      .post("/api/signup", { email, password })
      .then((res) => {
        console.log(res);
        if (res.data === "signup error") {
          alert("signup error");
          return;
        }
        axios
          .post("/api/login", { email, password })
          .then((res) => {
            navigate("/mypage");
            window.location.reload();
          })
          .catch((err) => {
            console.log(err);
            navigate("/");
          });
      })
      .catch((err) => {
        alert("signup error");
      });
    setEmail("");
    setPassword("");
  };

  return (
    <Box maxWidth="md" mx="auto" mt={8} p={4}>
      <Stack spacing={4}>
        <FormControl id="email">
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Button colorScheme="twitter" type="submit" onClick={handleLogin}>
          Log In
        </Button>
        <Button colorScheme="green" type="submit" onClick={handleSignup}>
          Sign Up
        </Button>
      </Stack>
    </Box>
  );
};

const LoginButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };
  const handleLogin = () => {
    navigate("/login");
  };
  return (
    <Button colorScheme="twitter" onClick={handleLogin}>
      Login
    </Button>
  );
};
const LogoutButton = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    axios.get("/api/logout").then((res) => {
      console.log(res);
      navigate("/");
      window.location.reload();
    });
  };
  return (
    <Button colorScheme="orange" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export { LoginForm, LoginButton, LogoutButton };
