import "../App.css";
import React, { useState, useRef, useEffect } from "react";
import { Container } from "@chakra-ui/react";
import { Select, Input, Textarea, Button, Center, Box } from "@chakra-ui/react";
import axios from "axios";
import { ulid } from "ulid";
import { useNavigate } from "react-router-dom";
import { Searching } from "../searching";
import { serverUrl } from "../App.js";

const QuerySequenceForm = ({ inputRefObject, handleFile }) => {
  return (
    <>
      <div>
        <label>
          Enter query sequence(s):
          <Textarea
            ref={inputRefObject}
            bgColor="white"
            mb="2"
            borderColor="Gray.400"
          />
          <div>
            <label>Or, upload file: </label>
            <input type="file" name="file" onChange={handleFile} />
          </div>
        </label>
      </div>
    </>
  );
};

const AlgorithmParametersForm = ({
  expectedThreshold,
  inputRefObject,
  maxTS,
  handleMaxTSChange,
  wordSize,
  handleWordSizeChange,
}) => {
  const maxTargetOptions = [
    { id: 1, value: "10", label: "10" },
    { id: 2, value: "50", label: "50" },
    { id: 3, value: "100", label: "100" },
    { id: 4, value: "250", label: "250" },
    { id: 5, value: "500", label: "500" },
    { id: 6, value: "1000", label: "1000" },
    { id: 7, value: "5000", label: "5000" },
  ];
  const wordSizeOptions = [
    { id: 1, value: 16, label: 16 },
    { id: 2, value: 20, label: 20 },
    { id: 3, value: 24, label: 24 },
    { id: 4, value: 28, label: 28 },
    { id: 5, value: 32, label: 32 },
    { id: 6, value: 48, label: 48 },
    { id: 7, value: 64, label: 64 },
    { id: 8, value: 128, label: 128 },
    { id: 9, value: 256, label: 256 },
  ];
  return (
    <>
      <label>
        Max target sequences:
        <Select
          defaultValue={maxTS}
          onChange={handleMaxTSChange}
          bgColor="white"
          mb="4"
          borderColor="gray.400"
        >
          {maxTargetOptions.map((option) => (
            <option value={option.value} key={option.id}>
              {option.label}
            </option>
          ))}
        </Select>
      </label>
      <label>
        Expected threshold:
        <Input
          defaultValue={expectedThreshold}
          ref={inputRefObject}
          bgColor="white"
          mb="4"
          borderColor="Gray.400"
        />
      </label>
      <label>
        Word size:
        <Select
          defaultValue={wordSize}
          onChange={handleWordSizeChange}
          bgColor="white"
          mb="4"
          borderColor="gray.400"
        >
          {wordSizeOptions.map((option) => (
            <option value={option.value} key={option.id}>
              {option.label}
            </option>
          ))}
        </Select>
      </label>
    </>
  );
};

function Blastmain() {
  const [maxTS, setMaxTS] = useState(100);
  const handleMaxTSChange = (e) => {
    setMaxTS(e.target.value);
  };
  const [wordSize, setWordSize] = useState(28);
  const handleWordSizeChange = (e) => {
    setWordSize(e.target.value);
  };

  const inputRefObject = useRef(null);
  const [gene, setGene] = useState();
  const [querySequence, setQuerySequence] = useState();
  const inputQuerySequence = useRef(null);
  const [expectedThreshold, setExpectedThreshold] = useState(0.05);
  const inputExpectedThreshold = useRef(expectedThreshold);
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const handleFile = (e) => {
    setSelectedFile(e.target.value);
    setIsFilePicked(true);
  };

  const navigate = useNavigate();

  const handleSubmit = () => {
    setQuerySequence(inputQuerySequence.current.value);
    console.log(
      "expected threshold current in submit:\t",
      inputExpectedThreshold.current.value
    );
    setExpectedThreshold(inputExpectedThreshold.current.value);

    console.log("expected threshold in submit:\t", expectedThreshold);

    const params = {
      file: selectedFile,
      //      querySequence: querySequence,
      querySequence: inputQuerySequence.current.value,
      maxTS: maxTS,
      //      expectedThreshold: expectedThreshold,
      expectedThreshold: inputExpectedThreshold.current.value,
      wordSize: wordSize,
    };
    const postData = async (newData) => {
      navigate("/searching", { state: { params: params } });
      const response = await axios.post(serverUrl, newData);
      return response;
    };

    postData(params)
      .then((response) => {
        console.log("response: ", response);

        const jobUrl = "/blast/jobresult?jobid=" + response.data.jobid;
        navigate(jobUrl, {
          state: { data: response.data },
        });
      })
      .catch((error) => {
        console.log("Submit error: ", error);
        navigate("/blast/main");
      });
  };

  console.log("file:", selectedFile);

  console.log("word size:\t", wordSize);
  console.log("max target sequences:\t", maxTS);
  console.log("query sequence(s):\t", querySequence);
  console.log("expected threshold:\t", expectedThreshold);
  console.log("expected threshold2:\t", inputExpectedThreshold.current);
  console.log("expected threshold3:\t", inputExpectedThreshold.current.value);

  return (
    //    <Container bgColor={"blue.50"}>
    <Box >
      <QuerySequenceForm
        inputRefObject={inputQuerySequence}
        handleFile={handleFile}
      />
      <AlgorithmParametersForm
        maxTS={maxTS}
        setMaxTS={setMaxTS}
        handleMaxTSChange={handleMaxTSChange}
        wordSize={wordSize}
        setWordSize={setWordSize}
        handleWordSizeChange={handleWordSizeChange}
        expectedThreshold={expectedThreshold}
        inputRefObject={inputExpectedThreshold}
      />
      <Button onClick={handleSubmit} colorScheme="blue">
        SUBMIT
      </Button>
      <Center>
        <Button
          onClick={() => {
            navigate("/");
          }}
          colorScheme="orange"
        >
          TOP
        </Button>
      </Center>
    </Box>
    //    </Container>
  );
}

export default Blastmain;
