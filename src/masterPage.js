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

const JobHistoryTable = ({ data, title }) => {
  const [isTableVisible, setIsTableVisible] = useState(false);
  const toggleTableVisibility = () => {
    setIsTableVisible(!isTableVisible);
  };
  return (
    <>
      <Button onClick={toggleTableVisibility} mb="4">
        {isTableVisible ? "Hide " + title : "Show " + title}
      </Button>

      {isTableVisible && (
        <Box
          margin="2"
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="lg"
          minW="fit-content"
        >
          <TableContainer>
            <Table variant="simple">
              <TableCaption placement="top">{title}</TableCaption>
              <Thead>
                <Tr>
                  <Th>Job ID</Th>
                  <Th>Job Title</Th>
                  <Th>Submitted</Th>
                  <Th>ended</Th>
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
                    <Td>
                      {item.ended ? new Date(item.ended).toLocaleString() : ""}
                    </Td>
                    {/* Add more cells with corresponding data properties as needed */}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </>
  );
};

const ViewAllJobs = () => {
  const [jobHistory, setJobHistory] = useState([]);
  const getJobHistory = () => {
    axios
      .get(serverUrl + "/allJobs")
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
        {jobHistory.length > 0 ? (
          <JobHistoryTable data={jobHistory} title={"all jobs"} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
const ViewUnfinishedJobs = () => {
  const [jobHistory, setJobHistory] = useState([]);
  const getJobHistory = () => {
    axios
      .get(serverUrl + "/unfinishedJobs")
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
        {jobHistory.length > 0 ? (
          <JobHistoryTable data={jobHistory} title={"unfinished jobs"} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

const MasterPage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  useEffect(() => {
    axios
      .get(serverUrl + "/api/user")
      .then((res) => {
        console.log("res.data:", res.data);
        setUser(res.data);
        console.log("user:", user);
        if (res.data !== "master") {
          navigate("/mypage");
        }
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
      <ViewAllJobs />
      <ViewUnfinishedJobs />
    </>
  );
};

export { MasterPage };
