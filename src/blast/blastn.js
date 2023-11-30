import "../App.css";
import React, { useState, useRef } from "react";
import { Button, Box } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App.js";
import { getNuclDatabaseList } from "./getDatabaseList.js";
import {
  AlignmentToolForm,
  ProgramSelection,
  EnterQuerySequence,
} from "./blastSearchForms";

function Blastn() {
  const alignmentTool = "blastn";
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

  const [database, setDatabase] = useState("");
  const handleDatabase = (e) => {
    setDatabase(e.target.value);
  };
  const [databaseList, setDatabaseList] = useState([]);
  getNuclDatabaseList().then((res) => {
    setDatabaseList(res);
    setDatabase(res[0]);
  });

  const defaultValues = {
    megablast: { ws: 28, ms: "[1,-2]", gc: "Linear" },
    "dc-megablast": { ws: 11, ms: "[2,-3]", gc: "[5,2]" },
    blastn: { ws: 18, ms: "[2,-3]", gc: "[5,2]" },
  };
  const [task, setTask] = useState("megablast");
  const handleTaskChange = (e) => {
    setTask(e.target.value);
    setWordSize(defaultValues[e.target.value].ws);
    setMatchScore(defaultValues[e.target.value].ms);
    setGapCosts(defaultValues[e.target.value].gc);
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

  const [matchScore, setMatchScore] = useState(defaultValues[task].ms);
  const handleMatchScoreChange = (e) => {
    setMatchScore(e.target.value);
  };
  const [gapCosts, setGapCosts] = useState(defaultValues[task].gc);
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
  const [templateType, setTemplateType] = useState("coding");
  const handleTemplateType = (e) => {
    setTemplateType(e.target.value);
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
      penalty: JSON.parse(matchScore)[1],
      reward: JSON.parse(matchScore)[0],
      dust: filterLowComplexityRegions ? "yes" : "no",
      soft_masking: maskForLookupTableOnly,
      //      lcase_masking: maskLowerCaseLetters,
    };
    if (!alignTwoOrMoreSequences) {
      params.db = database;
    }
    //https://www.ncbi.nlm.nih.gov/books/NBK279684/#_appendices_BLASTN_rewardpenalty_values_
    if (gapCosts != "Linear") {
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
      params.template_length = templateLength;
      params.template_type = templateType;
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
        //        headers: { "Content-Type": "multipart/form-data" },
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
          databaseList={databaseList}
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
