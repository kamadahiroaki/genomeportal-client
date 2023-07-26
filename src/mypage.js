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
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { serverUrl } from "./App.js";
import { use } from "passport";

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

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  console.log("parts:", parts);
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
};

const TableComponent = ({ data }) => {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Job ID</Th>
          <Th>Submitted</Th>
          {/* Add more headers as needed */}
        </Tr>
      </Thead>
      <Tbody>
        {data.map((item, index) => (
          <Tr key={index}>
            <Td>{item.jobid}</Td>
            <Td>{item.submitted}</Td>
            {/* Add more cells with corresponding data properties as needed */}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

const ViewJobHistory = () => {
  const [jobHistory, setJobHistory] = useState([]);
  const getJobHistory = () => {
    axios
      .get(serverUrl + "/usersJobs")
      .then((res) => {
        console.log("jobHistory:", res.data);
        setJobHistory(res.data);
      })
      .catch((err) => {
        console.log("err:", err);
      });
  };
  useEffect(() => {
    getJobHistory();
  }, []);
  return (
    <div>
      <div>
        {jobHistory.length > 0 ? <TableComponent data={jobHistory} /> : <></>}
      </div>
    </div>
  );
};

const Mypage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  useEffect(() => {
    axios
      .get(serverUrl + "/api/user")
      .then((res) => {
        console.log("res.data:", res.data);
        setUser(res.data);
        console.log("user:", user);
        if (!res.data) {
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log("err:", err);
        navigate("/");
      });
  }, []);

  return (
    <>
      Hello, {user}!
      <ViewJobHistory />
    </>
  );
};

export { Mypage, MypageButton };
