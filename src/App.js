import logo from "./logo.svg";
import "./App.css";
import React, { useState, useRef, useEffect } from "react";
import { Container } from "@chakra-ui/react";
import { Select, Textarea, Button } from "@chakra-ui/react";
import axios from "axios";
import { ulid } from "ulid";
import { useNavigate } from "react-router-dom";
import { Searching } from "./searching";

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

  const navigate = useNavigate();

  const handleSubmit = () => {
    setGene(inputRefObject.current.value);

    const params = {
      genome: genome,
      pam: pam,
      gene: inputRefObject.current.value,
      file: selectedFile,
    };
    const postData = async (newData) => {
      navigate("/searching", { state: { params: params } });
      const response = await axios.post(serverUrl, newData);
      console.log("response: ",response);
      return response;
    };

    const response = postData(params);
    console.log("response: ",response);
    response
      .then((res)=>{
        console.log("res: ", res);
        navigate("/result", {
          state: { params: params, data: res.data },
        });
      })
      .catch(()=>{
        console.log("server doesn't return response");
        alert("server doesn't return response");
        navigate("/");
      })
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
