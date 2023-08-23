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

const AlignmentToolForm = ({ alignmentTool }) => {
  const navigate = useNavigate();
  const op = ["blastn", "blastp", "blastx", "tblastn", "tblastx"];
  return (
    <Box>
      <Stack direction="row" spacing={1} align="center">
        {op.map((p) => (
          <Button
            colorScheme={p == alignmentTool ? "blue" : "gray"}
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
  alignmentTool,
  task,
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
        {alignmentTool == "blastn" ? (
          <>
            <Title title="Program Selection" />
            <OptimizeFor
              alignmentTool={alignmentTool}
              task={task}
              handleTaskChange={handleTaskChange}
            />
          </>
        ) : (
          <></>
        )}
        {alignmentTool == "blastp" ? (
          <>
            <Title title="Program Selection" />
            <Algorithm
              alignmentTool={alignmentTool}
              task={task}
              handleTaskChange={handleTaskChange}
            />
          </>
        ) : (
          <></>
        )}
      </Box>
      <Button onClick={handleSubmit} colorScheme="blue" mt="-4" mb="8">
        SUBMIT
      </Button>

      <GeneralParameters
        alignmentTool={alignmentTool}
        task={task}
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
        alignmentTool={alignmentTool}
        task={task}
        matchScore={matchScore}
        handleMatchScoreChange={handleMatchScoreChange}
        gapCosts={gapCosts}
        setGapCosts={setGapCosts}
        handleGapCostsChange={handleGapCostsChange}
      />
      <FiltersAndMasking
        alignmentTool={alignmentTool}
        handleFilterLowComplexityRegions={handleFilterLowComplexityRegions}
        handleMaskForLookupTableOnly={handleMaskForLookupTableOnly}
        handleMaskLowerCaseLetters={handleMaskLowerCaseLetters}
      />
      {alignmentTool == "blastn" && optimize == 1 ? (
        <DiscontiguousWordOptions />
      ) : (
        <div />
      )}
    </>
  );
};

const OptimizeFor = ({ task, handleTaskChange }) => {
  return (
    <Flex mb="2">
      <Text w="150px">Optimize for </Text>
      <Divider orientation="vertical" h="90px" borderColor="gray.600" mr="4" />
      <RadioGroup defaultValue="0">
        <Stack>
          <Radio
            value="megablast"
            bg="white"
            borderColor="blackAlpha.600"
            onChange={handleTaskChange}
          >
            Highly similar sequences (megablast)
          </Radio>
          <Radio
            value="dc-megablast"
            bg="white"
            borderColor="blackAlpha.600"
            onChange={handleTaskChange}
          >
            More dissimilar sequences (discontiguous megablast)
          </Radio>
          <Radio
            value="blastn"
            bg="white"
            borderColor="blackAlpha.600"
            onChange={handleTaskChange}
          >
            Somewhat similar sequences (blastn)
          </Radio>
        </Stack>
      </RadioGroup>
    </Flex>
  );
};

const Algorithm = ({ task, handleTaskChange }) => {
  return (
    <Flex mb="2">
      <Text w="150px">Algorithm </Text>
      <Divider orientation="vertical" h="90px" borderColor="gray.600" mr="4" />
      <RadioGroup defaultValue="1">
        <Stack>
          <Radio
            value="0"
            bg="white"
            borderColor="blackAlpha.600"
            onChange={handleTaskChange}
          >
            blastp (for standard protein-protein comparisons)
          </Radio>
          <Radio
            value="1"
            bg="white"
            borderColor="blackAlpha.600"
            onChange={handleTaskChange}
          >
            blastp-short (optimized for query sequences shorter than 30
            residues)
          </Radio>
          <Radio
            value="2"
            bg="white"
            borderColor="blackAlpha.600"
            onChange={handleTaskChange}
          >
            blastp-fast (a faster version that uses a larger word size)
          </Radio>
        </Stack>
      </RadioGroup>
    </Flex>
  );
};

const AlgorithmWeb = ({ task, handleTaskChange }) => {
  return (
    <Flex mb="2">
      <Text w="150px">Algorithm </Text>
      <Divider orientation="vertical" h="90px" borderColor="gray.600" mr="4" />
      <RadioGroup defaultValue="1">
        <Stack>
          <Radio
            value="0"
            bg="white"
            borderColor="blackAlpha.600"
            onChange={handleTaskChange}
          >
            Quick BLASTP (Accelerated protein-protein BLAST)
          </Radio>
          <Radio
            value="1"
            bg="white"
            borderColor="blackAlpha.600"
            onChange={handleTaskChange}
          >
            blastp (protein-protein BLAST)
          </Radio>
          <Radio
            value="2"
            bg="white"
            borderColor="blackAlpha.600"
            onChange={handleTaskChange}
          >
            PSI-BLAST (Position-Specific Iterated BLAST)
          </Radio>
          <Radio
            value="3"
            bg="white"
            borderColor="blackAlpha.600"
            onChange={handleTaskChange}
          >
            PHI-BLAST (Pattern Hit Initiated BLAST)
          </Radio>
          <Radio
            value="4"
            bg="white"
            borderColor="blackAlpha.600"
            onChange={handleTaskChange}
          >
            DELTA-BLAST (Domain Enhanced Lookup Time Accelerated BLAST)
          </Radio>
        </Stack>
      </RadioGroup>
    </Flex>
  );
};

const GeneralParameters = ({
  alignmentTool,
  task,
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
        alignmentTool={alignmentTool}
        task={task}
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

const WordSize = ({ alignmentTool, task, wordSize, handleWordSizeChange }) => {
  const wordSizeOptions = {
    blastn: {
      megablast: [
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
      "dc-megablast": [
        { id: 1, value: 11, label: 11 },
        { id: 2, value: 12, label: 12 },
      ],
      blastn: [
        { id: 1, value: 7, label: 7 },
        { id: 2, value: 11, label: 11 },
        { id: 3, value: 15, label: 15 },
      ],
    },
    blastp: {
      blastp: [
        { id: 1, value: 2, label: 2 },
        { id: 2, value: 3, label: 3 },
        { id: 3, value: 5, label: 5 },
        { id: 4, value: 6, label: 6 },
      ],
      "blastp-short": [
        { id: 1, value: 2, label: 2 },
        { id: 2, value: 3, label: 3 },
        { id: 3, value: 5, label: 5 },
        { id: 4, value: 6, label: 6 },
      ],
      "blastp-fast": [
        { id: 1, value: 5, label: 5 },
        { id: 2, value: 6, label: 6 },
        { id: 3, value: 7, label: 7 },
        { id: 4, value: 8, label: 8 },
      ],
    },
    blastx: {
      blastx: [
        { id: 1, value: 2, label: 2 },
        { id: 2, value: 3, label: 3 },
        { id: 3, value: 5, label: 5 },
        { id: 4, value: 6, label: 6 },
      ],
    },
    tblastn: {
      tblastn: [
        { id: 1, value: 2, label: 2 },
        { id: 2, value: 3, label: 3 },
        { id: 3, value: 5, label: 5 },
        { id: 4, value: 6, label: 6 },
      ],
    },
    tblastx: {
      tblastx: [
        { id: 1, value: 2, label: 2 },
        { id: 2, value: 3, label: 3 },
      ],
    },
  };

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
        {wordSizeOptions[alignmentTool][task].map((option) => (
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
  alignmentTool,
  task,
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
        alignmentTool={alignmentTool}
        task={task}
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
  if (optimize == 0 && matchScore != "[1, -1]") {
    gapCostsOptions.unshift({ id: 0, value: "Linear", label: "Linear" });
  }

  useEffect(() => {
    if (optimize == 0 && matchScore != "[1, -1]") {
      setGapCosts("Linear");
    } else if (matchScore === "[4, -5]") {
      setGapCosts("[12,8]");
    } else {
      setGapCosts("[5, 2]");
    }
  }, [matchScore, optimize]);

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
  alignmentTool,
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
        alignmentTool={alignmentTool}
        handleFilterLowComplexityRegions={handleFilterLowComplexityRegions}
      />
      <Mask
        alignmentTool={alignmentTool}
        handleMaskForLookupTableOnly={handleMaskForLookupTableOnly}
        handleMaskLowerCaseLetters={handleMaskLowerCaseLetters}
      />
    </Box>
  );
};

const Filter = ({ alignmentTool, handleFilterLowComplexityRegions }) => {
  return (
    <Flex mb="2">
      <Text w="150px" lineHeight="1">
        Filter
      </Text>
      <Divider orientation="vertical" borderColor="gray.600" h="40px" mr="4" />

      {alignmentTool == "blastp" ? (
        <Checkbox
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
      ) : (
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
      )}
    </Flex>
  );
};

const Mask = ({
  alignmentTool,
  handleMaskForLookupTableOnly,
  handleMaskLowerCaseLetters,
}) => {
  return (
    <Flex mb="2">
      <Text w="150px" lineHeight="1">
        Mask
      </Text>
      <Divider orientation="vertical" borderColor="gray.600" h="50px" mr="4" />
      <Box>
        <Box>
          {alignmentTool == "blastn" ? (
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
          ) : (
            <Checkbox
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
          )}
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
    //    { id: 1, value: "None", label: "None" },
    { id: 1, value: "16", label: "16" },
    { id: 2, value: "18", label: "18" },
    { id: 3, value: "21", label: "21" },
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
    { id: 1, value: "coding", label: "Coding" },
    { id: 2, value: "coding_and_optimal", label: "Coding and Optimal" },
    { id: 3, value: "optimal", label: "Optimal" },
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
  AlignmentToolForm,
  EnterQuerySequence,
  ChooseSearchSet,
  ProgramSelection,
  GeneralParameters,
  ScoringParameters,
  FiltersAndMasking,
};
