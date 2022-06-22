import logo from "./logo.svg";
import "./App.css";
import React, { useState, useRef, useEffect } from "react";
import { Container } from "@chakra-ui/react";
import { Select, Textarea, Button } from "@chakra-ui/react";
import axios from "axios";
import { ulid } from "ulid";

const serverUrl = "http://localhost:8080";

const GenomeForm = ({ handleGenomeChange }) => {
  const options = [
    { value: "GRCh38", label: "GRCh38" },
    { value: "GRCh37", label: "GRCh37" },
  ];
  return (
    <>
      <label>
        genome:
        <Select
          onChange={handleGenomeChange}
          bgColor="white"
          mb="4"
          borderColor="gray.400"
        >
          {options.map((option, index) => (
            <option value={option.value} key={index}>
              {option.label}
            </option>
          ))}
        </Select>
      </label>
    </>
  );
};

const PamForm = ({ handlePamChange }) => {
  const options = [
    { value: "NGG", label: "20bp-NGG-Cas9" },
    { value: "NNG", label: "20bp-NNG-Cas9" },
    { value: "NGN", label: "20bp-NGN-Cas9" },
  ];
  return (
    <>
      <label>
        PAM:
        <Select
          onChange={handlePamChange}
          bgColor="white"
          mb="4"
          borderColor="gray.400"
        >
          {options.map((option, index) => (
            <option value={option.value} key={index}>
              {option.label}
            </option>
          ))}
        </Select>
      </label>
    </>
  );
};

const GeneForm = ({ inputRefObject, handleFile, handleSubmit }) => {
  return (
    <>
      <div>
        <label>
          Gene:
          <div>
            <input type="file" name="file" onChange={handleFile} />
          </div>
          <Textarea
            ref={inputRefObject}
            bgColor="white"
            mb="4"
            borderColor="Gray.400"
          />
          <Button onClick={handleSubmit} colorScheme="blue">
            SUBMIT
          </Button>
        </label>
      </div>
    </>
  );
};

function App() {
  const [genome, setGenome] = useState("GRCh38");
  const handleGenomeChange = (e) => {
    setGenome(e.target.value);
  };
  const [pam, setPam] = useState("NGG");
  const handlePamChange = (e) => {
    setPam(e.target.value);
  };
  const inputRefObject = useRef(null);
  const [gene, setGene] = useState();
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const handleFile = (e) => {
    setSelectedFile(e.target.value);
    setIsFilePicked(true);
  };

  const handleSubmit = () => {
    setGene(inputRefObject.current.value);

    const param =
      "{genome:" +
      genome +
      ",PAM:" +
      pam +
      ",gene:" +
      inputRefObject.current.value +
      ",file:" +
      selectedFile +
      "}";
    console.log(param);
    const postData = async (newData) => {
      const response = await axios.post(serverUrl, newData);
      return response;
    };
    const response = postData({ id: ulid(), content: param, done:false });
    //    const response=async()=>{await axios.post(serverUrl,JSON.parse(param));}
    const getData=async()=>{
      const response=await axios.get(serverUrl);
      return response;
    };
    const res = getData();

    console.log("response.data: ", response.data);
    console.log("res: ",res);
    console.log("res.data: ", res.data);
  };

  console.log("genome:", genome);
  console.log("PAM:", pam);
  console.log("gene:", gene);
  console.log("file:", selectedFile);

  return (
    <>
      <GenomeForm
        setGenome={setGenome}
        handleGenomeChange={handleGenomeChange}
      />
      <PamForm setPam={setPam} handlePamChange={handlePamChange} />
      <GeneForm
        inputRefObject={inputRefObject}
        handleFile={handleFile}
        handleSubmit={handleSubmit}
      />
    </>
  );
}

export default App;
