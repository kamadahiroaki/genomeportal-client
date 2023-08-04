import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Center, Flex, Box, Text, Divider } from "@chakra-ui/react";
import { serverUrl } from "../App.js";
import axios from "axios";

const Jobresult = () => {
  const location = useLocation();
  console.log("location.href:", location.href);
  const searchParams = new URLSearchParams(location.search);
  const jobid = searchParams.get("jobid");
  console.log("jobid:", jobid);
  const [text, setText] = useState("connecting...");
  const [resdata, setResdata] = useState("");
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    if (jobid == null) {
      setText("no such job");
    } else {
      const jobUrl = "/jobResult?jobid=" + jobid;
      const url = serverUrl + jobUrl;

      const timeout = 3600 * 24 * 7;
      const fetchResultInterval = async (sec) => {
        console.log("url:", url);
        await axios
          .get(url)
          .then((res) => {
            console.log("res.data:", res.data);
            setResdata(res.data);
            if (res.data === "") {
              setText("Job ID: " + jobid + " does not exist");
            } else {
              setResdata(res.data);

              if (res.data.ended != null) {
                setResdata(res.data);
                setText(res.data.outjson);
                axios
                  .get(serverUrl + "/resultFile?jobid=" + jobid)
                  .then((res) => {
                    setHtmlContent(res.data);
                  })
                  .catch((err) => {
                    console.log("err:", err);
                  });
              } else if (sec > timeout) {
                setText("Please visit later");
              } else {
                setText("Now calculating");
                setTimeout(() => {
                  fetchResultInterval((sec + 5) * 1.2);
                }, sec * 1000);
              }
            }
          })
          .catch((err) => {
            console.log("err:", err);
          });
      };

      fetchResultInterval(5);
    }
  }, [jobid]);

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
  };

  return (
    <div>
      {htmlContent ? (
        <div>
          <DataTable {...resdata} />
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
      ) : (
        <div>
          <p>{text}</p>
          {resdata ? (
            <div>
              <p>
                Job {jobid} submitted at :{" "}
                {new Date(resdata.submitted).toLocaleString()}
              </p>
              <p>
                Time since submission :{" "}
                {Math.round((new Date() - new Date(resdata.submitted)) / 1000)}{" "}
                seconds
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

const TableItem = ({ label, value }) => {
  return (
    <Flex alignItems="center" p="2">
      <Box w="300px">
        <Text fontWeight="bold">{label}</Text>
      </Box>
      <Box>
        <Text>{value}</Text>
      </Box>
    </Flex>
  );
};

const DataTable = (resdata) => {
  const injson = JSON.parse(resdata.injson);
  const [isTableVisible, setIsTableVisible] = useState(false);

  const toggleTableVisibility = () => {
    setIsTableVisible((prevIsTableVisible) => !prevIsTableVisible);
  };

  return (
    <Box p="4">
      <Button onClick={toggleTableVisibility} mb="4">
        {isTableVisible ? "Hide job description" : "Show job description"}
      </Button>

      {isTableVisible && (
        <>
          <TableItem label="ID" value={resdata.jobid} />
          <TableItem
            label="Submitted"
            value={new Date(resdata.submitted).toLocaleString()}
          />
          <TableItem
            label="Ended"
            value={new Date(resdata.ended).toLocaleString()}
          />
          <Divider />
          <TableItem label="Title" value={injson.jobTitle} />
          {injson.alignTwoOrMoreSequences ? null : (
            <TableItem label="Database" value={injson.database} />
          )}
          <TableItem label="Task" value={injson.task} />

          <TableItem
            label="Max target sequences"
            value={injson.maxTargetSequences}
          />
          <TableItem
            label="Expected threshold"
            value={injson.expectedThreshold}
          />
          <TableItem label="Word size" value={injson.wordSize} />
          <TableItem
            label="Max matches in a query range"
            value={injson.maxMatches}
          />
          <TableItem label="Match/Mismatch scores" value={injson.matchScore} />
          <TableItem label="Gap costs" value={injson.gapCosts} />
          <TableItem
            label="Filter Low complexity regions"
            value={injson.filterLowComplexityRegions ? "Yes" : "No"}
          />
          <TableItem
            label="Mask for lookup table only"
            value={injson.maskForLookupTableOnly ? "Yes" : "No"}
          />
          <TableItem
            label="Mask lower case Letters"
            value={injson.maskLowerCaseLetters ? "Yes" : "No"}
          />
          {injson.task == "dc-megablast" ? (
            <div>
              <TableItem
                label="Template length"
                value={injson.templateLength}
              />
              <TableItem label="Template type" value={injson.templateType} />
            </div>
          ) : null}

          {/* 追加の項目と値をここに追加 */}
        </>
      )}
    </Box>
  );
};

export default Jobresult;
