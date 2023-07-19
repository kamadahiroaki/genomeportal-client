import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Box, Flex, Spacer, Button, Text } from "@chakra-ui/react";
import { LoginButton, LogoutButton } from "./login";
import { MypageButton } from "./mypage";
import { buildQueries } from "@testing-library/react";
import { serverUrl } from "./App.js";

const Header = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  useEffect(() => {
    axios.get(serverUrl + "/api/user").then((res) => {
      setEmail(res.data);
    });
  }, []);

  return (
    <div>
      <Flex alignItems="flex-start" width="100%">
        <Box>
          <Text fontSize="3xl" color="blue.600" fontWeight="semibold" ml="2">
            Genome Portal
          </Text>
        </Box>
        <Spacer />
        <Box m="1">
          <Button
            colorScheme="blue"
            onClick={() => {
              navigate("/");
            }}
          >
            Top
          </Button>
        </Box>
        <Box m="1">
          <Button
            colorScheme="purple"
            onClick={() => {
              navigate("/blast/blastn");
            }}
          >
            BLAST
          </Button>
        </Box>
        {email === "" ? (
          <div />
        ) : (
          <Box m="1">
            <MypageButton />
          </Box>
        )}
        <Box m="1">{email === "" ? <LoginButton /> : <LogoutButton />}</Box>
      </Flex>
    </div>
  );
};

const Footer = () => {
  return (
    <div>
      <h1>Footer</h1>
    </div>
  );
};

export { Header, Footer };
