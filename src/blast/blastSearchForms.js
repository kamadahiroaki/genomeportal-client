import "../App.css";
import React, { useEffect } from "react";
import { Box, Flex, Text, Divider, Radio, RadioGroup } from "@chakra-ui/react";
import {
  Select,
  Input,
  Textarea,
  Button,
  Stack,
  Checkbox,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

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
              navigate("/blast/" + p);
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
  alignmentTool,
  geneticCode,
  handleGeneticCodeChange,
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
  databaseList,
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
        {alignmentTool == "blastx" || alignmentTool == "tblastx" ? (
          <GeneticCode
            geneticCode={geneticCode}
            handleGeneticCodeChange={handleGeneticCodeChange}
          />
        ) : (
          <div />
        )}
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
        <ChooseSearchSet
          handleDatabase={handleDatabase}
          databaseList={databaseList}
        />
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
              w="150px"
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
              w="150px"
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

//https://www.ncbi.nlm.nih.gov/Taxonomy/taxonomyhome.html/index.cgi?chapter=cgencodes
const GeneticCode = ({ geneticCode, handleGeneticCodeChange }) => {
  const geneticCodeOptions = [
    { id: 1, value: "1", label: "Standard (1)" },
    { id: 2, value: "2", label: "Vertebrate Mitochondrial (2)" },
    { id: 3, value: "3", label: "Yeast Mitochondrial (3)" },
    {
      id: 4,
      value: "4",
      label: "Mold Mitochondrial; ... (4)",
    },
    { id: 5, value: "5", label: "Invertebrate Mitochondrial (5)" },
    {
      id: 6,
      value: "6",
      label: "Ciliate Nuclear; ... (6)",
    },
    {
      id: 9,
      value: "9",
      label: "Echinoderm and Flatworm Mitochondrial (9)",
    },
    { id: 10, value: "10", label: "Euplotid Nuclear (10)" },
    { id: 11, value: "11", label: "Bacterial and Archea (11)" },
    { id: 12, value: "12", label: "Alternative Yeast Nuclear (12)" },
    { id: 13, value: "13", label: "Ascidian Mitochondrial (13)" },
    { id: 14, value: "14", label: "Flatworm Mitochondrial (14)" },
    { id: 15, value: "15", label: "Blepharisma Macronuclear (15)" },
    { id: 16, value: "16", label: "Chlorophycean Mitochondrial (16)" },
    { id: 21, value: "21", label: "Trematode Mitochondrial (21)" },
    { id: 22, value: "22", label: "Scenedesmus obliquus Mitochondrial (22)" },
    { id: 23, value: "23", label: "Thraustochytrium Mitochondrial (23)" },
    { id: 24, value: "24", label: "Pterobranchia Mitochondrial (24)" },
    {
      id: 25,
      value: "25",
      label: "Candidate Division SR1 and Gracilibacteria (25)",
    },
    { id: 26, value: "26", label: "Pachysolen tannophilus Nuclear (26)" },
    { id: 27, value: "27", label: "Karyorelict Nuclear (27)" },
    { id: 28, value: "28", label: "Condylostoma Nuclear (28)" },
    { id: 29, value: "29", label: "Mesodinium Nuclear (29)" },
    { id: 30, value: "30", label: "Peritrich Nuclear (30)" },
    { id: 31, value: "31", label: "Blastocrithidia Nuclear (31)" },
    { id: 33, value: "33", label: "Cephalodiscidae Mitochondrial (33)" },
  ];

  return (
    <Flex mb="2">
      <Text w="150px" lineHeight="1">
        Genetic code
      </Text>
      <Divider orientation="vertical" borderColor="gray.600" h="40px" mr="4" />
      <Select
        value={geneticCode}
        onChange={handleGeneticCodeChange}
        bgColor="white"
        borderColor="gray.400"
        w="400px"
      >
        {geneticCodeOptions.map((option) => (
          <option value={option.value} key={option.id}>
            {option.label}
          </option>
        ))}
      </Select>
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
        w="550px"
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

const ChooseSearchSet = ({ handleDatabase, databaseList }) => {
  //  const database = [{ id: 1, value: "human", label: "human" }];
  const options = databaseList.map((item, index) => ({
    id: index,
    value: item,
    label: item,
  }));

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
          onChange={handleDatabase}
          bgColor="white"
          borderColor="gray.400"
          w="250px"
        >
          {options.map((option) => (
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
  handleTaskChange,
  handleSubmit,
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
  matrix,
  handleMatrixChange,
  compositionalAdjustments,
  handleCompositionalAdjustmentsChange,
  handleFilterLowComplexityRegions,
  handleMaskForLookupTableOnly,
  handleMaskLowerCaseLetters,
}) => {
  return (
    <>
      {alignmentTool == "blastn" || alignmentTool == "blastp" ? (
        <Box
          p="2"
          mb="8"
          bgColor="gray.100"
          borderWidth="1px"
          borderColor="gray.400"
          borderRadius="lg"
        >
          <Title title="Program Selection" />
          {alignmentTool == "blastn" ? (
            <OptimizeFor
              alignmentTool={alignmentTool}
              task={task}
              handleTaskChange={handleTaskChange}
            />
          ) : (
            <Algorithm
              alignmentTool={alignmentTool}
              task={task}
              handleTaskChange={handleTaskChange}
            />
          )}
        </Box>
      ) : (
        <></>
      )}
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
      {alignmentTool == "blastn" ? (
        <ScoringParameters
          alignmentTool={alignmentTool}
          task={task}
          matchScore={matchScore}
          handleMatchScoreChange={handleMatchScoreChange}
          gapCosts={gapCosts}
          setGapCosts={setGapCosts}
          handleGapCostsChange={handleGapCostsChange}
        />
      ) : (
        <ScoringParameters2
          alignmentTool={alignmentTool}
          task={task}
          matrix={matrix}
          handleMatrixChange={handleMatrixChange}
          compositionalAdjustments={compositionalAdjustments}
          handleCompositionalAdjustmentsChange={
            handleCompositionalAdjustmentsChange
          }
          gapCosts={gapCosts}
          setGapCosts={setGapCosts}
          handleGapCostsChange={handleGapCostsChange}
        />
      )}
      <FiltersAndMasking
        alignmentTool={alignmentTool}
        handleFilterLowComplexityRegions={handleFilterLowComplexityRegions}
        handleMaskForLookupTableOnly={handleMaskForLookupTableOnly}
        handleMaskLowerCaseLetters={handleMaskLowerCaseLetters}
      />
      {alignmentTool == "blastn" && task == "dc-megablast" ? (
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
      <RadioGroup defaultValue="megablast">
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
      <RadioGroup defaultValue="blastp">
        <Stack>
          <Radio
            value="blastp"
            bg="white"
            borderColor="blackAlpha.600"
            onChange={handleTaskChange}
          >
            blastp (for standard protein-protein comparisons)
          </Radio>
          <Radio
            value="blastp-short"
            bg="white"
            borderColor="blackAlpha.600"
            onChange={handleTaskChange}
          >
            blastp-short (optimized for query sequences shorter than 30
            residues)
          </Radio>
          <Radio
            value="blastp-fast"
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
    { id: 1, value: "[1,-2]", label: "1,-2" },
    { id: 2, value: "[1,-3]", label: "1,-3" },
    { id: 3, value: "[1,-4]", label: "1,-4" },
    { id: 4, value: "[2,-3]", label: "2,-3" },
    { id: 5, value: "[4,-5]", label: "4,-5" },
    { id: 6, value: "[1,-1]", label: "1,-1" },
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
  alignmentTool,
  task,
  matchScore,
  gapCosts,
  setGapCosts,
  handleGapCostsChange,
}) => {
  const temp1 = [
    { id: 1, value: "[5,2]", label: "Existence:5 Extension:2" },
    { id: 2, value: "[2,2]", label: "Existence:2 Extension:2" },
    { id: 3, value: "[1,2]", label: "Existence:1 Extension:2" },
    { id: 4, value: "[0,2]", label: "Existence:0 Extension:2" },
    { id: 5, value: "[3,1]", label: "Existence:3 Extension:1" },
    { id: 6, value: "[2,1]", label: "Existence:2 Extension:1" },
    { id: 7, value: "[1,1]", label: "Existence:1 Extension:1" },
  ];
  const temp2 = [
    { id: 1, value: "[5,2]", label: "Existence:5 Extension:2" },
    { id: 2, value: "[2,2]", label: "Existence:2 Extension:2" },
    { id: 3, value: "[1,2]", label: "Existence:1 Extension:2" },
    { id: 4, value: "[0,2]", label: "Existence:0 Extension:2" },
    { id: 5, value: "[2,1]", label: "Existence:2 Extension:1" },
    { id: 6, value: "[1,1]", label: "Existence:1 Extension:1" },
  ];
  const temp3 = [
    { id: 1, value: "[5,2]", label: "Existence:5 Extension:2" },
    { id: 2, value: "[1,2]", label: "Existence:1 Extension:2" },
    { id: 3, value: "[0,2]", label: "Existence:0 Extension:2" },
    { id: 4, value: "[2,1]", label: "Existence:2 Extension:1" },
    { id: 5, value: "[1,1]", label: "Existence:1 Extension:1" },
  ];
  const temp4 = [
    { id: 1, value: "[4,4]", label: "Existence:4 Extension:4" },
    { id: 2, value: "[2,4]", label: "Existence:2 Extension:4" },
    { id: 3, value: "[0,4]", label: "Existence:0 Extension:4" },
    { id: 4, value: "[3,3]", label: "Existence:3 Extension:3" },
    { id: 5, value: "[6,2]", label: "Existence:6 Extension:2" },
    { id: 6, value: "[5,2]", label: "Existence:5 Extension:2" },
    { id: 7, value: "[4,2]", label: "Existence:4 Extension:2" },
    { id: 8, value: "[2,2]", label: "Existence:2 Extension:2" },
  ];
  const temp5 = [
    { id: 1, value: "[12,8]", label: "Existence:12 Extension:8" },
    { id: 2, value: "[6,5]", label: "Existence:6 Extension:5" },
    { id: 3, value: "[5,5]", label: "Existence:5 Extension:5" },
    { id: 4, value: "[4,5]", label: "Existence:4 Extension:5" },
    { id: 5, value: "[3,5]", label: "Existence:3 Extension:5" },
  ];
  const temp6 = [
    { id: 1, value: "[5,2]", label: "Existence:5 Extension:2" },
    { id: 2, value: "[3,2]", label: "Existence:3 Extension:2" },
    { id: 3, value: "[2,2]", label: "Existence:2 Extension:2" },
    { id: 4, value: "[1,2]", label: "Existence:1 Extension:2" },
    { id: 5, value: "[0,2]", label: "Existence:0 Extension:2" },
    { id: 6, value: "[4,1]", label: "Existence:4 Extension:1" },
    { id: 7, value: "[3,1]", label: "Existence:3 Extension:1" },
    { id: 8, value: "[2,1]", label: "Existence:2 Extension:1" },
  ];

  const matchScore2gapCosts = {
    "[1,-2]": temp1,
    "[1,-3]": temp2,
    "[1,-4]": temp3,
    "[2,-3]": temp4,
    "[4,-5]": temp5,
    "[1,-1]": temp6,
  };

  let gapCostsOptions = matchScore2gapCosts[matchScore];
  if (task == "megablast" && matchScore != "[1,-1]") {
    gapCostsOptions.unshift({ id: 0, value: "Linear", label: "Linear" });
  }

  useEffect(() => {
    if (task == "megablast" && matchScore != "[1,-1]") {
      setGapCosts("Linear");
    } else if (matchScore === "[4,-5]") {
      setGapCosts("[12,8]");
    } else {
      setGapCosts("[5,2]");
    }
  }, [matchScore, task]);

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

const ScoringParameters2 = ({
  alignmentTool,
  task,
  matrix,
  handleMatrixChange,
  compositionalAdjustments,
  handleCompositionalAdjustmentsChange,
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
      <Matrix matrix={matrix} handleMatrixChange={handleMatrixChange} />
      {alignmentTool == "tblastx" ? (
        <></>
      ) : (
        <>
          <GapCosts2
            alignmentTool={alignmentTool}
            task={task}
            matrix={matrix}
            gapCosts={gapCosts}
            setGapCosts={setGapCosts}
            handleGapCostsChange={handleGapCostsChange}
          />
          <CompositionalAdjustments
            compositionalAdjustments={compositionalAdjustments}
            handleCompositionalAdjustmentsChange={
              handleCompositionalAdjustmentsChange
            }
          />
        </>
      )}
    </Box>
  );
};

const Matrix = ({ matrix, handleMatrixChange }) => {
  const matrixOptions = [
    { id: 1, value: "PAM30", label: "PAM30" },
    { id: 2, value: "PAM70", label: "PAM70" },
    { id: 3, value: "PAM250", label: "PAM250" },
    { id: 4, value: "BLOSUM80", label: "BLOSUM80" },
    { id: 5, value: "BLOSUM62", label: "BLOSUM62" },
    { id: 6, value: "BLOSUM45", label: "BLOSUM45" },
    { id: 7, value: "BLOSUM50", label: "BLOSUM50" },
    { id: 8, value: "BLOSUM90", label: "BLOSUM90" },
  ];

  return (
    <Flex mb="2">
      <Text w="150px" lineHeight="1">
        Matrix
      </Text>
      <Divider orientation="vertical" borderColor="gray.600" h="40px" mr="4" />
      <Select
        value={matrix}
        onChange={handleMatrixChange}
        bgColor="white"
        borderColor="gray.400"
        w="150px"
      >
        {matrixOptions.map((option) => (
          <option value={option.value} key={option.id}>
            {option.label}
          </option>
        ))}
      </Select>
    </Flex>
  );
};

const GapCosts2 = ({
  alignmentTool,
  task,
  matrix,
  gapCosts,
  setGapCosts,
  handleGapCostsChange,
}) => {
  const temp1 = [
    { id: 1, value: "[7,2]", label: "Existence:7 Extension:2" },
    { id: 2, value: "[6,2]", label: "Existence:6 Extension:2" },
    { id: 3, value: "[5,2]", label: "Existence:5 Extension:2" },
    { id: 4, value: "[10,1]", label: "Existence:10 Extension:1" },
    { id: 5, value: "[9,1]", label: "Existence:9 Extension:1" },
    { id: 6, value: "[8,1]", label: "Existence:8 Extension:1" },
    { id: 7, value: "[13,3]", label: "Existence:13 Extension:3" },
    { id: 8, value: "[15,3]", label: "Existence:15 Extension:3" },
    { id: 9, value: "[14,1]", label: "Existence:14 Extension:1" },
    { id: 10, value: "[14,2]", label: "Existence:14 Extension:2" },
  ];
  const temp2 = [
    { id: 1, value: "[8,2]", label: "Existence:8 Extension:2" },
    { id: 2, value: "[7,2]", label: "Existence:7 Extension:2" },
    { id: 3, value: "[6,2]", label: "Existence:6 Extension:2" },
    { id: 4, value: "[11,1]", label: "Existence:11 Extension:1" },
    { id: 5, value: "[10,1]", label: "Existence:10 Extension:1" },
    { id: 6, value: "[9,1]", label: "Existence:9 Extension:1" },
    { id: 7, value: "[12,3]", label: "Existence:12 Extension:3" },
    { id: 8, value: "[11,2]", label: "Existence:11 Extension:2" },
  ];
  const temp3 = [
    { id: 1, value: "[15,3]", label: "Existence:15 Extension:3" },
    { id: 2, value: "[14,3]", label: "Existence:14 Extension:3" },
    { id: 3, value: "[13,3]", label: "Existence:13 Extension:3" },
    { id: 4, value: "[12,3]", label: "Existence:12 Extension:3" },
    { id: 5, value: "[11,3]", label: "Existence:11 Extension:3" },
    { id: 6, value: "[17,2]", label: "Existence:17 Extension:2" },
    { id: 7, value: "[16,2]", label: "Existence:16 Extension:2" },
    { id: 8, value: "[15,2]", label: "Existence:15 Extension:2" },
    { id: 9, value: "[14,2]", label: "Existence:14 Extension:2" },
    { id: 10, value: "[13,2]", label: "Existence:13 Extension:2" },
    { id: 11, value: "[21,1]", label: "Existence:21 Extension:1" },
    { id: 12, value: "[20,1]", label: "Existence:20 Extension:1" },
    { id: 13, value: "[19,1]", label: "Existence:19 Extension:1" },
    { id: 14, value: "[18,1]", label: "Existence:18 Extension:1" },
    { id: 15, value: "[17,1]", label: "Existence:17 Extension:1" },
  ];
  const temp4 = [
    { id: 1, value: "[8,2]", label: "Existence:8 Extension:2" },
    { id: 2, value: "[7,2]", label: "Existence:7 Extension:2" },
    { id: 3, value: "[6,2]", label: "Existence:6 Extension:2" },
    { id: 4, value: "[11,1]", label: "Existence:11 Extension:1" },
    { id: 5, value: "[10,1]", label: "Existence:10 Extension:1" },
    { id: 6, value: "[9,1]", label: "Existence:9 Extension:1" },
  ];
  const temp5 = [
    { id: 1, value: "[11,2]", label: "Existence:11 Extension:2" },
    { id: 2, value: "[10,2]", label: "Existence:10 Extension:2" },
    { id: 3, value: "[9,2]", label: "Existence:9 Extension:2" },
    { id: 4, value: "[8,2]", label: "Existence:8 Extension:2" },
    { id: 5, value: "[7,2]", label: "Existence:7 Extension:2" },
    { id: 6, value: "[6,2]", label: "Existence:6 Extension:2" },
    { id: 7, value: "[13,1]", label: "Existence:13 Extension:1" },
    { id: 8, value: "[12,1]", label: "Existence:12 Extension:1" },
    { id: 9, value: "[11,1]", label: "Existence:11 Extension:1" },
    { id: 10, value: "[10,1]", label: "Existence:10 Extension:1" },
    { id: 11, value: "[9,1]", label: "Existence:9 Extension:1" },
  ];
  const temp6 = [
    { id: 1, value: "[13,3]", label: "Existence:13 Extension:3" },
    { id: 2, value: "[12,3]", label: "Existence:12 Extension:3" },
    { id: 3, value: "[11,3]", label: "Existence:11 Extension:3" },
    { id: 4, value: "[10,3]", label: "Existence:10 Extension:3" },
    { id: 5, value: "[15,2]", label: "Existence:15 Extension:2" },
    { id: 6, value: "[14,2]", label: "Existence:14 Extension:2" },
    { id: 7, value: "[13,2]", label: "Existence:13 Extension:2" },
    { id: 8, value: "[12,2]", label: "Existence:12 Extension:2" },
    { id: 9, value: "[19,1]", label: "Existence:19 Extension:1" },
    { id: 10, value: "[18,1]", label: "Existence:18 Extension:1" },
    { id: 11, value: "[17,1]", label: "Existence:17 Extension:1" },
    { id: 12, value: "[16,1]", label: "Existence:16 Extension:1" },
  ];
  const temp7 = [
    { id: 1, value: "[13,3]", label: "Existence:13 Extension:3" },
    { id: 2, value: "[12,3]", label: "Existence:12 Extension:3" },
    { id: 3, value: "[11,3]", label: "Existence:11 Extension:3" },
    { id: 4, value: "[10,3]", label: "Existence:10 Extension:3" },
    { id: 5, value: "[9,3]", label: "Existence:9 Extension:3" },
    { id: 6, value: "[16,2]", label: "Existence:16 Extension:2" },
    { id: 7, value: "[15,2]", label: "Existence:15 Extension:2" },
    { id: 8, value: "[14,2]", label: "Existence:14 Extension:2" },
    { id: 9, value: "[13,2]", label: "Existence:13 Extension:2" },
    { id: 10, value: "[12,2]", label: "Existence:12 Extension:2" },
    { id: 11, value: "[19,1]", label: "Existence:19 Extension:1" },
    { id: 12, value: "[18,1]", label: "Existence:18 Extension:1" },
    { id: 13, value: "[17,1]", label: "Existence:17 Extension:1" },
    { id: 14, value: "[16,1]", label: "Existence:16 Extension:1" },
    { id: 15, value: "[15,1]", label: "Existence:15 Extension:1" },
  ];
  const temp8 = [
    { id: 1, value: "[9,2]", label: "Existence:9 Extension:2" },
    { id: 2, value: "[8,2]", label: "Existence:8 Extension:2" },
    { id: 3, value: "[7,2]", label: "Existence:7 Extension:2" },
    { id: 4, value: "[6,2]", label: "Existence:6 Extension:2" },
    { id: 5, value: "[11,1]", label: "Existence:11 Extension:1" },
    { id: 6, value: "[10,1]", label: "Existence:10 Extension:1" },
    { id: 7, value: "[9,1]", label: "Existence:9 Extension:1" },
  ];

  const matrix2gapCosts = {
    PAM30: temp1,
    PAM70: temp2,
    PAM250: temp3,
    BLOSUM80: temp4,
    BLOSUM62: temp5,
    BLOSUM45: temp6,
    BLOSUM50: temp7,
    BLOSUM90: temp8,
  };

  let gapCostsOptions = matrix2gapCosts[matrix];

  useEffect(() => {
    if (task == "blastp-short" && matrix == "BLOSUM62") {
      setGapCosts("[9,1]");
    } else if (matrix == "BLOSUM62") {
      setGapCosts("[11,1]");
    } else if (matrix == "PAM30") {
      setGapCosts("[9,1]");
    } else if (matrix == "PAM70") {
      setGapCosts("[10,1]");
    } else if (matrix == "PAM250") {
      setGapCosts("[14,2]");
    } else if (matrix == "BLOSUM80") {
      setGapCosts("[10,1]");
    } else if (matrix == "BLOSUM45") {
      setGapCosts("[15,2]");
    } else if (matrix == "BLOSUM50") {
      setGapCosts("[13,2]");
    } else if (matrix == "BLOSUM90") {
      setGapCosts("[10,1]");
    }
  }, [matrix, task]);

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

const CompositionalAdjustments = ({
  compositionalAdjustments,
  handleCompositionalAdjustmentsChange,
}) => {
  const options = [
    { id: 1, value: "0", label: "No Adjustment" },
    { id: 2, value: "1", label: "Composition-based statistics" },
    {
      id: 3,
      value: "2",
      label: "Conditional compositional score matrix adjustment",
    },
    {
      id: 4,
      value: "3",
      label: "Universal compositional score matrix adjustment",
    },
  ];

  return (
    <Flex mb="2">
      <Text w="150px" lineHeight="1">
        Compositional Adjustments
      </Text>
      <Divider orientation="vertical" borderColor="gray.600" h="40px" mr="4" />
      <Select
        value={compositionalAdjustments}
        onChange={handleCompositionalAdjustmentsChange}
        bgColor="white"
        borderColor="gray.400"
        w="450px"
      >
        {options.map((option) => (
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
