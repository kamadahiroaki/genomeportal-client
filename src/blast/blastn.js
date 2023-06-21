import "../App.css";
import React, { useState, useRef, useEffect } from "react";
import { Container } from "@chakra-ui/react";
import { Select, Input, Textarea, Button, Center, Box } from "@chakra-ui/react";
import axios from "axios";
import { ulid } from "ulid";
import { useNavigate } from "react-router-dom";
import { Searching } from "../searching";
import { serverUrl } from "../App.js";
import {
  ProgramForm,
  QuerySequenceForm,
  QuerySequenceFormN,
  AlgorithmParametersForm,
  ProgramSelection,
  GeneralParameters,
  ScoringParameters,
  EnterQuerySequence,
  ChooseSearchSet,
  FiltersAndMasking,
} from "./blastSearchForms";

function Blastn() {
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

  const [database, setDatabase] = useState("");
  const handleDatabase = (e) => {
    setDatabase(e.target.value);
  };

  const [task, setTask] = useState("megablast");
  const handleTaskChange = (e) => {
    setTask(e);
  };

  const [maxTargetSequences, setMaxTargetSequences] = useState(100);
  const handleMaxTargetSequencesChange = (e) => {
    setMaxTargetSequences(e.target.value);
  };
  const [expectedThreshold, setExpectedThreshold] = useState(0.05);
  const handleExpectedThresholdChange = (e) => {
    setExpectedThreshold(e);
  };
  const [wordSize, setWordSize] = useState(28);
  const handleWordSizeChange = (e) => {
    setWordSize(e.target.value);
  };
  const [maxMatches, setMaxMatches] = useState(0);
  const handleMaxMatchesChange = (e) => {
    setMaxMatches(e);
  };
  const inputMaxMatches = useRef(maxMatches);

  const [matchScore, setMatchScore] = useState("[1, -2]");
  const handleMatchScoreChange = (e) => {
    setMatchScore(e.target.value);
  };
  const [gapCosts, setGapCosts] = useState("Linear");
  const handleGapCostsChange = (e) => {
    setGapCosts(e.target.value);
  };

  const [filterLowComplexityRegions, setFilterLowComplexityRegions] =
    useState(true);
  const handleFilterLowComplexityRegions = (e) => {
    setFilterLowComplexityRegions(e.target.checked);
  };
  const [maskForLookupTableOnly, setMaskForLookupTableOnly] = useState(true);
  const handleMaskForLookupTableOnly = (e) => {
    setMaskForLookupTableOnly(e.target.checked);
  };
  const [maskLowerCaseLetters, setMaskLowerCaseLetters] = useState(false);
  const handleMaskLowerCaseLetters = (e) => {
    setMaskLowerCaseLetters(e.target.checked);
  };

  const [templateLength, setTemplateLength] = useState(18);
  const handleTemplateLength = (e) => {
    setTemplateLength(e.target.value);
  };
  const [templateType, setTemplateType] = useState("Coding");
  const handleTemplateType = (e) => {
    setTemplateType(e.target.value);
  };

  console.log("et:", expectedThreshold);
  console.log("query:", querySequence);
  console.log("queryv:", inputQuerySequence.current.value);

  const navigate = useNavigate();

  const handleSubmit = () => {
    setQuerySequence(inputQuerySequence.current.value);
    //    setExpectedThreshold(inputExpectedThreshold.current.value);

    const params = {
      queryFile: queryFile,
      isQueryFilePicked: isQueryFilePicked,
      querySequence: inputQuerySequence.current.value,
      queryFrom: queryFrom,
      queryTo: queryTo,

      alignTwoOrMoreSequences: alignTwoOrMoreSequences,

      subjectFile: subjectFile,
      subjectFrom: subjectFrom,
      subjectTo: subjectTo,

      database: database,

      task: task,
      maxTargetSequences: maxTargetSequences,
      expectedThreshold: expectedThreshold,
      wordSize: wordSize,
      maxMatches: maxMatches,

      matchScore: matchScore,
      gapCosts: gapCosts,

      filterLowComplexityRegions: filterLowComplexityRegions,
      maskForLookupTableOnly: maskForLookupTableOnly,
      maskLowerCaseLetters: maskLowerCaseLetters,

      db: database,
      evalue: expectedThreshold,
      word_size: wordSize,
      max_target_seqs: maxTargetSequences,
      culling_limit: maxMatches,
      penalty: JSON.parse(matchScore)[1],
      reward: JSON.parse(matchScore)[0],
      dust: filterLowComplexityRegions ? "yes" : "no",
      soft_masking: maskForLookupTableOnly,
      //      lcase_masking: maskLowerCaseLetters,
    };
    if (gapCosts == "Linear") {
      params.gapopen = params.gapextend = params.penalty;
    } else {
      params.gapopen = JSON.parse(gapCosts)[0];
      params.gapextend = JSON.parse(gapCosts)[1];
    }
    if (queryFrom >= 1 && queryTo >= queryFrom) {
      params.query_loc = queryFrom + "-" + queryTo;
    }
    if (subjectFrom >= 1 && subjectTo >= subjectFrom) {
      params.subject_loc = subjectFrom + "-" + subjectTo;
    }
    if (task == "dc-megablast") {
      params.templateLength = templateLength;
      params.templateType = templateType;
    }
    if (maskLowerCaseLetters) {
      params.lcase_masking = "";
    }

    const formData = new FormData();
    formData.append("files", queryFile);
    formData.append("files", subjectFile);
    formData.append("params", JSON.stringify(params));

    const postData = async (newData) => {
      //      navigate("/searching", { state: { params: params } });
      const response = await axios.post(serverUrl + "/jobSubmit", newData, {
        headers: { "Content-Type": "multipart/form-data" },
        auth: { username: "admin", password: "admin" },
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
        <ProgramForm program={"blastn"} />
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
          queryRef={inputQuerySequence}
          queryFrom={queryFrom}
          queryTo={queryTo}
          handleQueryFromChange={handleQueryFromChange}
          handleQueryToChange={handleQueryToChange}
          handleQueryFile={handleQueryFile}
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
          matchScore={matchScore}
          setMatchScore={setMatchScore}
          handleMatchScoreChange={handleMatchScoreChange}
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

export default Blastn;
