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
import {
  TableContainer,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
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

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  console.log("parts:", parts);
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
};

const JobHistoryTable = ({ data }) => {
  return (
    <Box
      margin="2"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="lg"
      minW="fit-content"
    >
      <TableContainer>
        <Table variant="simple">
          <TableCaption placement="top">Job History</TableCaption>
          <Thead>
            <Tr>
              <Th>Job ID</Th>
              <Th>Job Title</Th>
              <Th>Submitted</Th>
              {/* Add more headers as needed */}
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item, index) => (
              <Tr key={index}>
                <Td fontFamily="Consolas, monospace">
                  <Link
                    to={`${serverUrl}/blast/jobresult?jobid=${item.jobid}`}
                    className="link"
                  >
                    {item.jobid}
                  </Link>
                </Td>
                <Td>{JSON.parse(item.injson).jobTitle}</Td>
                <Td>{new Date(item.submitted).toLocaleString()}</Td>
                {/* Add more cells with corresponding data properties as needed */}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
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
        {jobHistory.length > 0 ? <JobHistoryTable data={jobHistory} /> : <></>}
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
      <ViewJobHistory />
    </>
  );
};

export { Mypage, MypageButton };
