import "../App.css";
import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  Box,
  Flex,
  Spacer,
  Text,
  Divider,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import {
  Select,
  Input,
  Textarea,
  Button,
  Center,
  Stack,
  Checkbox,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { match } from "assert";

const Title = ({ title }) => {
  return (
    <Box
      mt="-6"
      mb="2"
      pl="1"
      pr="1"
      w="fit-content"
      bgColor="gray.200"
      borderWidth="2px"
      borderColor="gray.400"
      textAlign="center"
    >
      <Text color="blue.600" fontWeight="semibold">
        {title}
      </Text>
    </Box>
  );
};

const ProgramForm = ({ program }) => {
  const navigate = useNavigate();
  const op = ["blastn", "blastp", "blastx", "tblastn", "tblastx"];
  return (
    <Box>
      <Stack direction="row" spacing={1} align="center">
        {op.map((p) => (
          <Button
            colorScheme={p == program ? "blue" : "gray"}
            onClick={() => {
              navigate("blast/" + { p });
            }}
            key={p}
          >
            {p}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};

const EnterQuerySequence = ({
  queryRef,
  handleQueryFile,
  jobTitleRef,
  queryFrom,
  queryTo,
  handleQueryFromChange,
  handleQueryToChange,
  alignTwoOrMoreSequences,
  handleAlignTwoOrMoreSequences,
  subjectRef,
  handleSubjectFile,
  subjectFrom,
  subjectTo,
  handleSubjectFromChange,
  handleSubjectToChange,
  handleDatabase,
}) => {
  return (
    <>
      <Box
        padding="2"
        mb="8"
        bgColor="gray.100"
        borderWidth="1px"
        borderColor="gray.400"
        borderRadius="lg"
      >
        <Title title="Enter Query Sequence" />
        <Query
          queryRef={queryRef}
          queryFrom={queryFrom}
          queryTo={queryTo}
          handleSubrangeFromChange={handleQueryFromChange}
          handleSubrangeToChange={handleQueryToChange}
          queryOrSubject="Query"
        />
        <File handleFile={handleQueryFile} />
        <JobTitle jobTitleRef={jobTitleRef} />
        <Align23
          handleAlignTwoOrMoreSequences={handleAlignTwoOrMoreSequences}
        />
      </Box>
      {alignTwoOrMoreSequences ? (
        <EnterSubjectSequence
          queryRef={subjectRef}
          handleFile={handleSubjectFile}
          queryFrom={subjectFrom}
          queryTo={subjectTo}
          handleSubrangeFromChange={handleSubjectFromChange}
          handleSubrangeToChange={handleSubjectToChange}
        />
      ) : (
        <ChooseSearchSet handleDatabase={handleDatabase} />
      )}
    </>
  );
};

const Query = ({
  queryRef,
  subrangeFrom,
  handleSubrangeFromChange,
  subrangeTo,
  handleSubrangeToChange,
  queryOrSubject,
}) => {
  return (
    <Flex mb="2">
      <Box>
        <Text>Enter FASTA sequence(s)</Text>
        <Textarea
          ref={queryRef}
          bgColor="white"
          borderColor="gray.400"
          w="500px"
        />
      </Box>
      <Box ml="4">
        <Text textAlign="center">{queryOrSubject} subrange</Text>
        <Box mb="2">
          <Flex>
            <Text w="50px" textAlign="right" pr="1">
              From
            </Text>
            <NumberInput
              min={1}
              onChange={handleSubrangeFromChange}
              bgColor="white"
              borderColor="gray.400"
              w="100px"
            >
              <NumberInputField></NumberInputField>
            </NumberInput>
          </Flex>
        </Box>
        <Box>
          <Flex>
            <Text w="50px" textAlign="right" pr="1">
              To
            </Text>
            <NumberInput
              min={1}
              onChange={handleSubrangeToChange}
              bgColor="white"
              borderColor="gray.400"
              w="100px"
            >
              <NumberInputField></NumberInputField>
            </NumberInput>
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
};

const File = ({ handleFile }) => {
  return (
    <Flex mb="2">
      <Text w="150px">Or, upload file </Text>
      <Divider orientation="vertical" h="30px" borderColor="gray.600" mr="4" />
      <input type="file" name="file" onChange={handleFile} />
    </Flex>
  );
};

const JobTitle = ({ jobTitleRef }) => {
  return (
    <Flex>
      <Text w="150px">Job Title</Text>
      <Divider orientation="vertical" h="40px" borderColor="gray.600" mr="4" />
      <Input
        ref={jobTitleRef}
        bgColor="white"
        mb="2"
        borderColor="gray.400"
        w="600px"
      />
    </Flex>
  );
};

const Align23 = ({ handleAlignTwoOrMoreSequences }) => {
  return (
    <Checkbox
      onChange={handleAlignTwoOrMoreSequences}
      borderColor="blackAlpha.600"
      sx={{
        ".chakra-checkbox__control": {
          bg: "white",
        },
      }}
    >
      Align two or more sequences
    </Checkbox>
  );
};

const ChooseSearchSet = ({ handleDatabase }) => {
  const database = [{ id: 1, value: "human", label: "human" }];
  return (
    <Box
      padding="2"
      mb="8"
      bgColor="gray.100"
      borderWidth="1px"
      borderColor="gray.400"
      borderRadius="lg"
    >
      <Title title="Choose Search Set" />
      <Flex>
        <Text w="150px" lineHeight="1">
          Database
        </Text>
        <Divider
          orientation="vertical"
          borderColor="gray.600"
          h="40px"
          mr="4"
        />
        <Select
          //              value={gapCosts}
          onChange={handleDatabase}
          bgColor="white"
          borderColor="gray.400"
          w="250px"
        >
          {database.map((option) => (
            <option value={option.value} key={option.id}>
              {option.label}
            </option>
          ))}
        </Select>
      </Flex>
    </Box>
  );
};

const EnterSubjectSequence = ({ queryRef, handleFile, fromRef, toRef }) => {
  return (
    <>
      <Box
        padding="2"
        mb="8"
        bgColor="gray.100"
        borderWidth="1px"
        borderColor="gray.400"
        borderRadius="lg"
      >
        <Title title="Enter Subject Sequence" />
        <Query
          queryRef={queryRef}
          fromRef={fromRef}
          toRef={toRef}
          queryOrSubject="Subject"
        />
        <File handleFile={handleFile} />
      </Box>
    </>
  );
};

const ProgramSelection = ({
  handleSubmit,
  setTask,
  maxTargetSequences,
  setMaxTargetSequences,
  handleMaxTargetSequencesChange,
  expectedThreshold,
  handleExpectedThresholdChange,
  wordSize,
  setWordSize,
  handleWordSizeChange,
  maxMatches,
  handleMaxMatchesChange,
  matchScore,
  setMatchScore,
  handleMatchScoreChange,
  gapCosts,
  setGapCosts,
  handleGapCostsChange,
  handleFilterLowComplexityRegions,
  handleMaskForLookupTableOnly,
  handleMaskLowerCaseLetters,
}) => {
  const tasks = ["megablast", "dc-megablast", "blastn"];
  const defaultValues = [
    { ws: 28, ms: "[1, -2]", gc: "Linear" },
    { ws: 11, ms: "[2, -3]", gc: "[5, 2]" },
    { ws: 11, ms: "[2, -3]", gc: "[5, 2]" },
  ];
  const [optimize, setOptimize] = useState(0);
  const handleOptimizeChange = (e) => {
    setTask(tasks[e.target.value]);
    setOptimize(e.target.value);
    setWordSize(defaultValues[e.target.value].ws);
    setGapCosts(defaultValues[e.target.value].gc);
    setMatchScore(defaultValues[e.target.value].ms);
  };

  return (
    <>
      <Box
        p="2"
        mb="8"
        bgColor="gray.100"
        borderWidth="1px"
        borderColor="gray.400"
        borderRadius="lg"
      >
        <Title title="Program Selection" />
        <OptimizeFor
          optimize={optimize}
          handleOptimizeChange={handleOptimizeChange}
          maxTargetSequences={maxTargetSequences}
          setMaxTargetSequences={setMaxTargetSequences}
          handleMaxTargetSequencesChange={handleMaxTargetSequencesChange}
          wordSize={wordSize}
          handleWordSizeChange={handleWordSizeChange}
          expectedThreshold={expectedThreshold}
        />
      </Box>
      <Button onClick={handleSubmit} colorScheme="blue" mt="-4" mb="8">
        SUBMIT
      </Button>

      <GeneralParameters
        optimize={optimize}
        maxTargetSequences={maxTargetSequences}
        setMaxTargetSequences={setMaxTargetSequences}
        handleMaxTargetSequencesChange={handleMaxTargetSequencesChange}
        expectedThreshold={expectedThreshold}
        handleExpectedThresholdChange={handleExpectedThresholdChange}
        wordSize={wordSize}
        handleWordSizeChange={handleWordSizeChange}
        maxMatches={maxMatches}
        handleMaxMatchesChange={handleMaxMatchesChange}
      />
      <ScoringParameters
        optimize={optimize}
        matchScore={matchScore}
        handleMatchScoreChange={handleMatchScoreChange}
        gapCosts={gapCosts}
        setGapCosts={setGapCosts}
        handleGapCostsChange={handleGapCostsChange}
      />
      <FiltersAndMasking
        handleFilterLowComplexityRegions={handleFilterLowComplexityRegions}
        handleMaskForLookupTableOnly={handleMaskForLookupTableOnly}
        handleMaskLowerCaseLetters={handleMaskLowerCaseLetters}
      />
      {optimize == 1 ? <DiscontiguousWordOptions /> : <div />}
    </>
  );
};

const OptimizeFor = ({ optimize, handleOptimizeChange }) => {
  return (
    <Flex mb="2">
      <Text w="150px">Optimize for </Text>
      <Divider orientation="vertical" h="90px" borderColor="gray.600" mr="4" />
      <RadioGroup defaultValue="0">
        <Stack>
          <Radio
            value="0"
            bg="white"
            borderColor="blackAlpha.600"
            onChange={handleOptimizeChange}
          >
            Highly similar sequences (megablast)
          </Radio>
          <Radio
            value="1"
            bg="white"
            borderColor="blackAlpha.600"
            onChange={handleOptimizeChange}
          >
            More dissimilar sequences (discontiguous megablast)
          </Radio>
          <Radio
            value="2"
            bg="white"
            borderColor="blackAlpha.600"
            onChange={handleOptimizeChange}
          >
            Somewhat similar sequences (blastn)
          </Radio>
        </Stack>
      </RadioGroup>
    </Flex>
  );
};

const GeneralParameters = ({
  optimize,
  maxTargetSequences,
  handleMaxTargetSequencesChange,
  expectedThreshold,
  handleExpectedThresholdChange,
  wordSize,
  handleWordSizeChange,
  maxMatches,
  handleMaxMatchesChange,
}) => {
  return (
    <Box
      p="2"
      mb="8"
      bgColor="gray.100"
      borderWidth="1px"
      borderColor="gray.400"
      borderRadius="lg"
    >
      <Title title="General Parameters" />
      <MaxTargetSequences
        maxTargetSequences={maxTargetSequences}
        handleMaxTargetSequencesChange={handleMaxTargetSequencesChange}
      />
      <ExpectedThreshold
        expectedThreshold={expectedThreshold}
        handleExpectedThresholdChange={handleExpectedThresholdChange}
      />
      <WordSize
        optimize={optimize}
        wordSize={wordSize}
        handleWordSizeChange={handleWordSizeChange}
      />
      <MaxMatches
        maxMatches={maxMatches}
        handleMaxMatchesChange={handleMaxMatchesChange}
      />
    </Box>
  );
};

const MaxTargetSequences = ({
  maxTargetSequences,
  handleMaxTargetSequencesChange,
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

  return (
    <Flex mb="2">
      <Text w="150px" lineHeight="1">
        Max target sequences
      </Text>
      <Divider orientation="vertical" borderColor="gray.600" h="40px" mr="4" />
      <Select
        value={maxTargetSequences}
        onChange={handleMaxTargetSequencesChange}
        bgColor="white"
        borderColor="gray.400"
        w="100px"
      >
        {maxTargetOptions.map((option) => (
          <option value={option.value} key={option.id}>
            {option.label}
          </option>
        ))}
      </Select>
    </Flex>
  );
};

const ExpectedThreshold = ({
  expectedThreshold,
  handleExpectedThresholdChange,
}) => {
  return (
    <Flex mb="2">
      <Text w="150px" lineHeight="1">
        Expected threshold
      </Text>
      <Divider orientation="vertical" borderColor="gray.600" h="40px" mr="4" />
      <NumberInput
        defaultValue={expectedThreshold}
        min={0}
        onChange={handleExpectedThresholdChange}
        bgColor="white"
        borderColor="gray.400"
        w="100px"
      >
        <NumberInputField></NumberInputField>
      </NumberInput>
    </Flex>
  );
};

const WordSize = ({ optimize, wordSize, handleWordSizeChange }) => {
  const wordSizeOptions = [
    [
      { id: 1, value: 16, label: 16 },
      { id: 2, value: 20, label: 20 },
      { id: 3, value: 24, label: 24 },
      { id: 4, value: 28, label: 28 },
      { id: 5, value: 32, label: 32 },
      { id: 6, value: 48, label: 48 },
      { id: 7, value: 64, label: 64 },
      { id: 8, value: 128, label: 128 },
      { id: 9, value: 256, label: 256 },
    ],
    [
      { id: 1, value: 11, label: 11 },
      { id: 2, value: 12, label: 12 },
    ],
    [
      { id: 1, value: 7, label: 7 },
      { id: 2, value: 11, label: 11 },
      { id: 3, value: 15, label: 15 },
    ],
  ];

  return (
    <Flex mb="2">
      <Text w="150px">Word size</Text>
      <Divider orientation="vertical" borderColor="gray.600" h="40px" mr="4" />

      <Select
        value={wordSize}
        onChange={handleWordSizeChange}
        bgColor="white"
        borderColor="gray.400"
        w="100px"
      >
        {wordSizeOptions[optimize].map((option) => (
          <option value={option.value} key={option.id}>
            {option.label}
          </option>
        ))}
      </Select>
    </Flex>
  );
};

const MaxMatches = ({ maxMatches, handleMaxMatchesChange }) => {
  return (
    <Flex mb="2">
      <Text w="150px" lineHeight="1">
        Max matches in a query range
      </Text>
      <Divider orientation="vertical" borderColor="gray.600" h="40px" mr="4" />
      <NumberInput
        defaultValue={maxMatches}
        onChange={handleMaxMatchesChange}
        bgColor="white"
        borderColor="gray.400"
        w="100px"
      >
        <NumberInputField></NumberInputField>
      </NumberInput>
    </Flex>
  );
};

const ScoringParameters = ({
  optimize,
  matchScore,
  handleMatchScoreChange,
  gapCosts,
  setGapCosts,
  handleGapCostsChange,
}) => {
  return (
    <Box
      p="2"
      mb="8"
      bgColor="gray.100"
      borderWidth="1px"
      borderColor="gray.400"
      borderRadius="lg"
    >
      <Title title="Scoring Parameters" />
      <MatchScores
        matchScore={matchScore}
        handleMatchScoreChange={handleMatchScoreChange}
      />
      <GapCosts
        optimize={optimize}
        matchScore={matchScore}
        gapCosts={gapCosts}
        setGapCosts={setGapCosts}
        handleGapCostsChange={handleGapCostsChange}
      />
    </Box>
  );
};

const MatchScores = ({ matchScore, handleMatchScoreChange }) => {
  const matchScoresOptions = [
    { id: 1, value: "[1, -2]", label: "1,-2" },
    { id: 2, value: "[1, -3]", label: "1,-3" },
    { id: 3, value: "[1, -4]", label: "1,-4" },
    { id: 4, value: "[2, -3]", label: "2,-3" },
    { id: 5, value: "[4, -5]", label: "4,-5" },
    { id: 6, value: "[1, -1]", label: "1,-1" },
  ];

  return (
    <Flex mb="2">
      <Text w="150px" lineHeight="1">
        Match/Mismatch Scores
      </Text>
      <Divider orientation="vertical" borderColor="gray.600" h="40px" mr="4" />
      <Select
        value={matchScore}
        onChange={handleMatchScoreChange}
        bgColor="white"
        borderColor="gray.400"
        w="100px"
      >
        {matchScoresOptions.map((option) => (
          <option value={option.value} key={option.id}>
            {option.label}
          </option>
        ))}
      </Select>
    </Flex>
  );
};

const GapCosts = ({
  optimize,
  matchScore,
  gapCosts,
  setGapCosts,
  handleGapCostsChange,
}) => {
  const temp1 = [
    { id: 1, value: "[5, 2]", label: "Existence:5 Extension:2" },
    { id: 2, value: "[2, 2]", label: "Existence:2 Extension:2" },
    { id: 3, value: "[1, 2]", label: "Existence:1 Extension:2" },
    { id: 4, value: "[0, 2]", label: "Existence:0 Extension:2" },
    { id: 5, value: "[3, 1]", label: "Existence:3 Extension:1" },
    { id: 6, value: "[2, 1]", label: "Existence:2 Extension:1" },
    { id: 7, value: "[1, 1]", label: "Existence:1 Extension:1" },
  ];
  const temp2 = [
    { id: 1, value: "[5, 2]", label: "Existence:5 Extension:2" },
    { id: 2, value: "[2, 2]", label: "Existence:2 Extension:2" },
    { id: 3, value: "[1, 2]", label: "Existence:1 Extension:2" },
    { id: 4, value: "[0, 2]", label: "Existence:0 Extension:2" },
    { id: 5, value: "[2, 1]", label: "Existence:2 Extension:1" },
    { id: 6, value: "[1, 1]", label: "Existence:1 Extension:1" },
  ];
  const temp3 = [
    { id: 1, value: "[5, 2]", label: "Existence:5 Extension:2" },
    { id: 2, value: "[1, 2]", label: "Existence:1 Extension:2" },
    { id: 3, value: "[0, 2]", label: "Existence:0 Extension:2" },
    { id: 4, value: "[2, 1]", label: "Existence:2 Extension:1" },
    { id: 5, value: "[1, 1]", label: "Existence:1 Extension:1" },
  ];
  const temp4 = [
    { id: 1, value: "[4, 4]", label: "Existence:4 Extension:4" },
    { id: 2, value: "[2, 4]", label: "Existence:2 Extension:4" },
    { id: 3, value: "[0, 4]", label: "Existence:0 Extension:4" },
    { id: 4, value: "[3, 3]", label: "Existence:3 Extension:3" },
    { id: 5, value: "[6, 2]", label: "Existence:6 Extension:2" },
    { id: 6, value: "[5, 2]", label: "Existence:5 Extension:2" },
    { id: 7, value: "[4, 2]", label: "Existence:4 Extension:2" },
    { id: 8, value: "[2, 2]", label: "Existence:2 Extension:2" },
  ];
  const temp5 = [
    { id: 1, value: "[12,8]", label: "Existence:12 Extension:8" },
    { id: 2, value: "[6,5]", label: "Existence:6 Extension:5" },
    { id: 3, value: "[5,5]", label: "Existence:5 Extension:5" },
    { id: 4, value: "[4,5]", label: "Existence:4 Extension:5" },
    { id: 5, value: "[3,5]", label: "Existence:3 Extension:5" },
  ];
  const temp6 = [
    { id: 1, value: "[5, 2]", label: "Existence:5 Extension:2" },
    { id: 2, value: "[3, 2]", label: "Existence:3 Extension:2" },
    { id: 3, value: "[2, 2]", label: "Existence:2 Extension:2" },
    { id: 4, value: "[1, 2]", label: "Existence:1 Extension:2" },
    { id: 5, value: "[0, 2]", label: "Existence:0 Extension:2" },
    { id: 6, value: "[4, 1]", label: "Existence:4 Extension:1" },
    { id: 7, value: "[3, 1]", label: "Existence:3 Extension:1" },
    { id: 8, value: "[2, 1]", label: "Existence:2 Extension:1" },
  ];

  const matchScore2gapCosts = {
    "[1, -2]": temp1,
    "[1, -3]": temp2,
    "[1, -4]": temp3,
    "[2, -3]": temp4,
    "[4, -5]": temp5,
    "[1, -1]": temp6,
  };
  let gapCostsOptions = matchScore2gapCosts[matchScore];
  if (optimize === 0 && matchScore != "[1, -1]") {
    gapCostsOptions.unshift({ id: 0, value: "Linear", label: "Linear" });
  }

  if (optimize === 0 && matchScore != "[1, -1]") {
    setGapCosts("Linear");
  } else if (matchScore === "[4, -5]") {
    setGapCosts("[12,8]");
  } else {
    setGapCosts("[5, 2]");
  }

  return (
    <Flex mb="2">
      <Text w="150px" lineHeight="1">
        Gap Costs
      </Text>
      <Divider orientation="vertical" borderColor="gray.600" h="40px" mr="4" />
      <Select
        value={gapCosts}
        onChange={handleGapCostsChange}
        bgColor="white"
        borderColor="gray.400"
        w="250px"
      >
        {gapCostsOptions.map((option) => (
          <option value={option.value} key={option.id}>
            {option.label}
          </option>
        ))}
      </Select>
    </Flex>
  );
};

const FiltersAndMasking = ({
  handleFilterLowComplexityRegions,
  handleMaskForLookupTableOnly,
  handleMaskLowerCaseLetters,
}) => {
  return (
    <Box
      p="2"
      mb="8"
      bgColor="gray.100"
      borderWidth="1px"
      borderColor="gray.400"
      borderRadius="lg"
    >
      <Title title="Filters and Masking" />
      <Filter
        handleFilterLowComplexityRegions={handleFilterLowComplexityRegions}
      />
      <Mask
        handleMaskForLookupTableOnly={handleMaskForLookupTableOnly}
        handleMaskLowerCaseLetters={handleMaskLowerCaseLetters}
      />
    </Box>
  );
};

const Filter = ({ handleFilterLowComplexityRegions }) => {
  return (
    <Flex mb="2">
      <Text w="150px" lineHeight="1">
        Filter
      </Text>
      <Divider orientation="vertical" borderColor="gray.600" h="40px" mr="4" />

      <Checkbox
        defaultChecked
        onChange={handleFilterLowComplexityRegions}
        borderColor="blackAlpha.600"
        sx={{
          ".chakra-checkbox__control": {
            bg: "white",
          },
        }}
      >
        Low complexity regions
      </Checkbox>
    </Flex>
  );
};

const Mask = ({ handleMaskForLookupTableOnly, handleMaskLowerCaseLetters }) => {
  return (
    <Flex mb="2">
      <Text w="150px" lineHeight="1">
        Mask
      </Text>
      <Divider orientation="vertical" borderColor="gray.600" h="50px" mr="4" />
      <Box>
        <Box>
          <Checkbox
            defaultChecked
            onChange={handleMaskForLookupTableOnly}
            borderColor="blackAlpha.600"
            sx={{
              ".chakra-checkbox__control": {
                bg: "white",
              },
            }}
          >
            Mask for lookup table only
          </Checkbox>
        </Box>
        <Box>
          <Checkbox
            onChange={handleMaskLowerCaseLetters}
            borderColor="blackAlpha.600"
            sx={{
              ".chakra-checkbox__control": {
                bg: "white",
              },
            }}
          >
            Mask lower case letters
          </Checkbox>
        </Box>
      </Box>
    </Flex>
  );
};

const DiscontiguousWordOptions = ({}) => {
  return (
    <Box
      p="2"
      mb="8"
      bgColor="gray.100"
      borderWidth="1px"
      borderColor="gray.400"
      borderRadius="lg"
    >
      <Title title="Discontiguous Word Options" />
      <TemplateLength />
      <TemplateType />
    </Box>
  );
};

const TemplateLength = ({}) => {
  const templatelengthoptions = [
    { id: 1, value: "None", label: "None" },
    { id: 2, value: "16", label: "16" },
    { id: 3, value: "18", label: "18" },
    { id: 4, value: "21", label: "21" },
  ];

  return (
    <Flex mb="2">
      <Text w="150px" lineHeight="1">
        Template length
      </Text>
      <Divider orientation="vertical" borderColor="gray.600" h="40px" mr="4" />
      <Select
        defaultValue={"18"}
        //        onChange={handleGapCostsChange}
        bgColor="white"
        borderColor="gray.400"
        w="250px"
      >
        {templatelengthoptions.map((option) => (
          <option value={option.value} key={option.id}>
            {option.label}
          </option>
        ))}
      </Select>
    </Flex>
  );
};

const TemplateType = ({}) => {
  const templateTypeOptions = [
    { id: 1, value: "Coding", label: "Coding" },
    { id: 2, value: "Maximal", label: "Maximal" },
    { id: 3, value: "Two templates", label: "Two templates" },
  ];

  return (
    <Flex>
      <Text w="150px" lineHeight="1">
        Template type
      </Text>
      <Divider orientation="vertical" borderColor="gray.600" h="40px" mr="4" />
      <Select
        defaultValue={"16"}
        //        onChange={handleGapCostsChange}
        bgColor="white"
        borderColor="gray.400"
        w="250px"
      >
        {templateTypeOptions.map((option) => (
          <option value={option.value} key={option.id}>
            {option.label}
          </option>
        ))}
      </Select>
    </Flex>
  );
};

export {
  ProgramForm,
  EnterQuerySequence,
  ChooseSearchSet,
  ProgramSelection,
  GeneralParameters,
  ScoringParameters,
  FiltersAndMasking,
};
