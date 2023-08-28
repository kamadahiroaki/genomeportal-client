import "../App.css";
import React, { useState, useRef, useEffect } from "react";
import { Container } from "@chakra-ui/react";
import { Select, Input, Textarea, Button, Center, Box } from "@chakra-ui/react";
import axios from "axios";
import { ulid } from "ulid";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App.js";
import {
  AlignmentToolForm,
  ProgramSelection,
  EnterQuerySequence,
} from "./blastSearchForms";

function Blastp() {
  const alignmentTool = "blastp";
  const [querySequence, setQuerySequence] = useState("");
  const inputQuerySequence = useRef(querySequence);
  const [queryFrom, setQueryFrom] = useState(0);
  const handleQueryFromChange = (e) => {
    setQueryFrom(parseInt(e, 10) || 0);
  };
  const [queryTo, setQueryTo] = useState(0);
  const handleQueryToChange = (e) => {
    setQueryTo(parseInt(e, 10) || 0);
  };

  const [queryFile, setQueryFile] = useState();
  const [isQueryFilePicked, setIsQueryFilePicked] = useState(false);
  const handleQueryFile = (e) => {
    setQueryFile(e.target.files[0]);
    if (e.target.files[0] === undefined) {
      setIsQueryFilePicked(false);
    } else {
      setIsQueryFilePicked(true);
    }
  };

  const [jobTitle, setJobTitle] = useState("");
  const inputJobTitle = useRef(jobTitle);

  const [alignTwoOrMoreSequences, setAlignTwoOrMoreSequences] = useState(false);
  const handleAlignTwoOrMoreSequences = (e) => {
    setAlignTwoOrMoreSequences(e.target.checked);
  };

  const [subjectSequence, setSubjectSequence] = useState();
  const inputSubjectSequence = useRef();
  const [subjectFrom, setSubjectFrom] = useState(0);
  const handleSubjectFromChange = (e) => {
    setSubjectFrom(parseInt(e, 10) || 0);
  };
  const [subjectTo, setSubjectTo] = useState(0);
  const handleSubjectToChange = (e) => {
    setSubjectTo(parseInt(e, 10) || 0);
  };

  const [subjectFile, setSubjectFile] = useState();
  const [isSubjectFilePicked, setIsSubjectFilePicked] = useState(false);
  const handleSubjectFile = (e) => {
    setSubjectFile(e.target.files[0]);
    if (e.target.files[0] === undefined) {
      setIsSubjectFilePicked(false);
    } else {
      setIsSubjectFilePicked(true);
    }
  };

  const [database, setDatabase] = useState("human");
  const handleDatabase = (e) => {
    setDatabase(e.target.value);
  };

  const defaultValues = {
    blastp: { ws: 3, gc: "[11,1]", ma: "BLOSUM62", ca: "2" },
    "blastp-short": { ws: 2, gc: "[9,1]", ma: "PAM30", ca: "0" },
    "blastp-fast": { ws: 6, gc: "[11,1]", ma: "BLOSUM62", ca: "2" },
  };
  const [task, setTask] = useState("blastp");
  const handleTaskChange = (e) => {
    setTask(e.target.value);
    setWordSize(defaultValues[e.target.value].ws);
    setMatrix(defaultValues[e.target.value].ma);
    setGapCosts(defaultValues[e.target.value].gc);
    setCompositionalAdjustments(defaultValues[e.target.value].ca);
  };

  const [maxTargetSequences, setMaxTargetSequences] = useState(100);
  const handleMaxTargetSequencesChange = (e) => {
    setMaxTargetSequences(e.target.value);
  };
  const [expectedThreshold, setExpectedThreshold] = useState(0.05);
  const handleExpectedThresholdChange = (e) => {
    setExpectedThreshold(e);
  };
  const [wordSize, setWordSize] = useState(defaultValues[task].ws);
  const handleWordSizeChange = (e) => {
    setWordSize(e.target.value);
  };
  const [maxMatches, setMaxMatches] = useState(0);
  const handleMaxMatchesChange = (e) => {
    setMaxMatches(e);
  };
  const inputMaxMatches = useRef(maxMatches);

  const [gapCosts, setGapCosts] = useState(defaultValues[task].gc);
  const handleGapCostsChange = (e) => {
    setGapCosts(e.target.value);
  };

  const [matrix, setMatrix] = useState(defaultValues[task].ma);
  const handleMatrixChange = (e) => {
    setMatrix(e.target.value);
  };
  const [compositionalAdjustments, setCompositionalAdjustments] = useState(
    defaultValues[task].ca
  );
  const handleCompositionalAdjustmentsChange = (e) => {
    setCompositionalAdjustments(e.target.value);
  };

  const [filterLowComplexityRegions, setFilterLowComplexityRegions] =
    useState(false);
  const handleFilterLowComplexityRegions = (e) => {
    setFilterLowComplexityRegions(e.target.checked);
  };
  const [maskForLookupTableOnly, setMaskForLookupTableOnly] = useState(false);
  const handleMaskForLookupTableOnly = (e) => {
    setMaskForLookupTableOnly(e.target.checked);
  };
  const [maskLowerCaseLetters, setMaskLowerCaseLetters] = useState(false);
  const handleMaskLowerCaseLetters = (e) => {
    setMaskLowerCaseLetters(e.target.checked);
  };

  const navigate = useNavigate();

  const handleSubmit = () => {
    setQuerySequence(inputQuerySequence.current.value);
    //    setExpectedThreshold(inputExpectedThreshold.current.value);
    if (!isQueryFilePicked && !inputQuerySequence.current.value) {
      alert("Please enter a query sequence or upload a query file.");
      return;
    }
    if (
      alignTwoOrMoreSequences &&
      !isSubjectFilePicked &&
      !inputSubjectSequence.current.value
    ) {
      alert("Please enter a subject sequence or upload a subject file.");
      return;
    }

    const params = {
      alignmentTool: alignmentTool,
      jobTitle: inputJobTitle.current.value,
      alignTwoOrMoreSequences: alignTwoOrMoreSequences,
      task: task,
      evalue: expectedThreshold,
      word_size: wordSize,
      max_target_seqs: maxTargetSequences,
      culling_limit: maxMatches,
      matrix: matrix,
      gapopen: JSON.parse(gapCosts)[0],
      gapextend: JSON.parse(gapCosts)[1],
      comp_based_stats: compositionalAdjustments,
      dust: filterLowComplexityRegions ? "yes" : "no",
      soft_masking: maskForLookupTableOnly,
    };
    if (!alignTwoOrMoreSequences) {
      params.db = database;
    }
    console.log("gapCosts: " + gapCosts);
    if (queryFrom >= 1 && queryTo >= queryFrom) {
      params.query_loc = queryFrom + "-" + queryTo;
    }
    if (subjectFrom >= 1 && subjectTo >= subjectFrom) {
      params.subject_loc = subjectFrom + "-" + subjectTo;
    }
    if (maskLowerCaseLetters) {
      params.lcase_masking = "";
    }

    const formData = new FormData();
    if (isQueryFilePicked) {
      formData.append("files", queryFile);
    } else if (!isQueryFilePicked && inputQuerySequence.current.value) {
      const blob = new Blob([inputQuerySequence.current.value], {
        type: "text/plain",
      });
      formData.append("files", blob, "query.txt");
    }
    if (isSubjectFilePicked) {
      formData.append("files", subjectFile);
    } else if (
      alignTwoOrMoreSequences &&
      !isSubjectFilePicked &&
      inputSubjectSequence.current.value
    ) {
      const blob = new Blob([inputSubjectSequence.current.value], {
        type: "text/plain",
      });
      formData.append("files", blob, "subject.txt");
    }
    formData.append("params", JSON.stringify(params));

    const postData = async (newData) => {
      //      navigate("/searching", { state: { params: params } });
      const response = await axios.post(serverUrl + "/jobSubmit", newData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      return response;
    };

    postData(formData)
      .then((response) => {
        console.log("response: ", response);

        const jobUrl = "/blast/jobresult?jobid=" + response.data.jobid;
        navigate(jobUrl, {
          state: { data: response.data },
        });
      })
      .catch((error) => {
        console.log("Submit error: ", error);
        navigate("/blast/blastn");
      });
  };

  return (
    <>
      <Box mt="2" ml="2">
        <AlignmentToolForm alignmentTool={alignmentTool} />
      </Box>
      <Box
        margin="2"
        padding="2"
        pt="6"
        bgColor="blue.50"
        borderWidth="1px"
        borderColor="blue.500"
        borderRadius="lg"
        minW="fit-content"
      >
        <EnterQuerySequence
          alignmentTool={alignmentTool}
          queryRef={inputQuerySequence}
          queryFrom={queryFrom}
          queryTo={queryTo}
          handleQueryFromChange={handleQueryFromChange}
          handleQueryToChange={handleQueryToChange}
          handleQueryFile={handleQueryFile}
          jobTitleRef={inputJobTitle}
          alignTwoOrMoreSequences={alignTwoOrMoreSequences}
          handleAlignTwoOrMoreSequences={handleAlignTwoOrMoreSequences}
          subjectRef={inputSubjectSequence}
          subjectFrom={subjectFrom}
          subjectTo={subjectTo}
          handleSubjectFromChange={handleSubjectFromChange}
          handleSubjectToChange={handleSubjectToChange}
          handleSubjectFile={handleSubjectFile}
          handleDatabase={handleDatabase}
        />
        <ProgramSelection
          alignmentTool={alignmentTool}
          task={task}
          handleTaskChange={handleTaskChange}
          handleSubmit={handleSubmit}
          setTask={setTask}
          maxTargetSequences={maxTargetSequences}
          setMaxTargetSequences={setMaxTargetSequences}
          handleMaxTargetSequencesChange={handleMaxTargetSequencesChange}
          expectedThreshold={expectedThreshold}
          handleExpectedThresholdChange={handleExpectedThresholdChange}
          wordSize={wordSize}
          setWordSize={setWordSize}
          handleWordSizeChange={handleWordSizeChange}
          maxMatches={maxMatches}
          handleMaxMatchesChange={handleMaxMatchesChange}
          matrix={matrix}
          handleMatrixChange={handleMatrixChange}
          compositionalAdjustments={compositionalAdjustments}
          handleCompositionalAdjustmentsChange={
            handleCompositionalAdjustmentsChange
          }
          gapCosts={gapCosts}
          setGapCosts={setGapCosts}
          handleGapCostsChange={handleGapCostsChange}
          handleFilterLowComplexityRegions={handleFilterLowComplexityRegions}
          handleMaskForLookupTableOnly={handleMaskForLookupTableOnly}
          handleMaskLowerCaseLetters={handleMaskLowerCaseLetters}
        />
        <Button onClick={handleSubmit} colorScheme="blue" mt="-4">
          SUBMIT
        </Button>
      </Box>
    </>
  );
}

export default Blastp;
