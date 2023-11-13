import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Flex, Box, Text, Divider } from "@chakra-ui/react";
import { serverUrl } from "../App.js";
import axios from "axios";
import { VisualizeBlastXml } from "./visualizeBlastXml.js";

const Jobresult = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const jobid = searchParams.get("jobid");
  const [text, setText] = useState("connecting...");
  const [resdata, setResdata] = useState("");
  //  const [htmlContent, setHtmlContent] = useState("");
  const [xmlData, setXmlData] = useState("");
  const [txtData, setTxtData] = useState("");
  const [errData, setErrData] = useState("");

  useEffect(() => {
    if (jobid == null) {
      setText("no such job");
      console.log("no such job");
    } else {
      const jobUrl = "/jobResult?jobid=" + jobid;
      const url = serverUrl + jobUrl;

      const timeout = 3600 * 24;
      const fetchResultInterval = async (sec) => {
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
                  .get(serverUrl + "/resultFile?fileName=" + jobid + ".xml")
                  .then((res) => {
                    if (res.status == 200) setXmlData(res.data);
                  })
                  .catch((err) => {
                    console.log("err:", err);
                  });
                // axios
                //   .get(serverUrl + "/resultFile?fileName=" + jobid + ".txt")
                //   .then((res) => {
                //     if (res.status == 200) setTxtData(res.data);
                //   })
                //   .catch((err) => {
                //     console.log("err:", err);
                //   });
                axios
                  .get(serverUrl + "/resultFile?fileName=" + jobid + ".err")
                  .then((res) => {
                    if (res.status == 200) {
                      setErrData(res.data);
                    }
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
  }, []);

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
  };

  const [viewBlaster, setViewBlaster] = useState(true);
  const handleViewBlaster = () => {
    setViewBlaster(!viewBlaster);
  };

  return (
    <div>
      {/* {xmlData && txtData ? ( */}
      {xmlData ? (
        <div>
          {<DownloadFileButton fileName={jobid + ".xml"} fileData={xmlData} />}
          {/* <DownloadFileButton fileName={jobid + ".txt"} fileData={txtData} /> */}
          <DataTable {...resdata} />
          {/* <Button m="1" border="1px" size="sm" onClick={handleViewBlaster}>
            {viewBlaster ? "Switch to Text View" : "Switch to Blaster View"}
          </Button> */}
          {/* <pre>{txtData}</pre> */}
          <VisualizeBlastXml xmlData={xmlData} />
        </div>
      ) : (
        // ) : errData ? (
        //   <div>
        //     <DataTable {...resdata} />
        //     <pre>{errData}</pre>
        //   </div>
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

const DownloadFileButton = ({ fileName, fileData }) => {
  const handleClick = () => {
    const blob = new Blob([fileData], { type: "text/plain" });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };
  return (
    <Button onClick={handleClick} m="1" border="1px" size="sm">
      Download {fileName.slice(-3)}
    </Button>
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

  const cbs = [
    "No Adjustment",
    "Composition-based statistics",
    "Conditional compositional score matrix adjustment",
    "Universal compositional score matrix adjustment",
  ];

  return (
    <Box p="1">
      <Button onClick={toggleTableVisibility} border="1px" size="sm">
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
          <TableItem label="Program" value={injson.alignmentTool} />
          <TableItem label="Title" value={injson.jobTitle} />
          {injson.query_gencode ? (
            <TableItem label="Gencode" value={injson.query_gencode} />
          ) : null}
          {injson.alignTwoOrMoreSequences ? null : (
            <TableItem label="Database" value={injson.db} />
          )}
          {injson.alignmentTool == "blastn" ||
          injson.alignmentTool == "blastp" ? (
            <TableItem label="Task" value={injson.task} />
          ) : null}

          <TableItem
            label="Max target sequences"
            value={injson.max_target_seqs}
          />
          <TableItem label="Expected threshold" value={injson.evalue} />
          <TableItem label="Word size" value={injson.word_size} />
          <TableItem
            label="Max matches in a query range"
            value={injson.culling_limit}
          />
          {injson.reward ? (
            <TableItem
              label="Match/Mismatch scores"
              value={"[" + injson.reward + "," + injson.penalty + "]"}
            />
          ) : null}
          {injson.matrix ? (
            <TableItem label="Matrix" value={injson.matrix} />
          ) : null}
          {injson.gapopen ? (
            <TableItem
              label="Gap costs"
              value={
                injson.gapopen
                  ? "[" + injson.gapopen + "," + injson.gapextend + "]"
                  : "Linear"
              }
            />
          ) : null}
          {injson.comp_based_stats ? (
            <TableItem
              label="Composition statistics"
              value={cbs[injson.comp_based_stats]}
            />
          ) : null}
          <TableItem
            label="Filter Low complexity regions"
            value={injson.dust === "yes" ? "Yes" : "No"}
          />
          <TableItem
            label="Mask for lookup table only"
            value={injson.soft_masking ? "Yes" : "No"}
          />
          <TableItem
            label="Mask lower case Letters"
            value={injson.lcase_masking ? "Yes" : "No"}
          />
          {injson.task == "dc-megablast" ? (
            <div>
              <TableItem
                label="Template length"
                value={injson.template_length}
              />
              <TableItem label="Template type" value={injson.template_type} />
            </div>
          ) : null}

          {/* 追加の項目と値をここに追加 */}
        </>
      )}
    </Box>
  );
};

export default Jobresult;
