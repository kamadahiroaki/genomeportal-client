import React, { useState } from "react";
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
    axios.post("/api/login", { email, password }).then((res) => {
      console.log(res);
      navigate("/mypage");
    });
    setEmail("");
    setPassword("");
  };

  const handleSignup = (e) => {
    e.preventDefault();
    // Perform login logic here
    axios.post("/api/signup", { email, password }).then((res) => {
      console.log(res);
      navigate("/");
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
        <Button colorScheme="blue" type="submit" onClick={handleLogin}>
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
    <Button colorScheme="blue" onClick={handleLogin}>
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
