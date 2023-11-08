import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Divider,
  Text,
  Select,
  InputGroup,
  InputLeftAddon,
  Table,
  TableContainer,
  TableCaption,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { serverUrl } from "../App.js";
import { XMLParser, XMLValidator } from "fast-xml-parser";

const VisualizeBlastXml = ({ xmlData }) => {
  const parser = new XMLParser();
  //  if (XMLValidator.validate(xml)) {
  const jsonObj = parser.parse(xmlData);
  let iteration = jsonObj.BlastOutput.BlastOutput_iterations.Iteration;
  if (!Array.isArray(iteration)) iteration = [iteration];
  const [queryIndex, setQueryIndex] = useState(0);
  const [hitIndex, setHitIndex] = useState(0);
  const handleQueryIndexChange = (e) => {
    setQueryIndex(e.target.value);
    setHitIndex(0);
  };

  return (
    <Box>
      <SelectQuery
        queryIndex={queryIndex}
        handleQueryIndexChange={handleQueryIndexChange}
        iteration={iteration}
      />
      <GraphicSummary data={jsonObj} />
      <Descriptions
        hitIndex={hitIndex}
        setHitIndex={setHitIndex}
        hits={
          iteration[queryIndex].Iteration_hits.Hit == undefined
            ? []
            : Array.isArray(iteration[queryIndex].Iteration_hits.Hit)
            ? iteration[queryIndex].Iteration_hits.Hit
            : [iteration[queryIndex].Iteration_hits.Hit]
        }
        queryLen={iteration[queryIndex]["Iteration_query-len"]}
      />
      <Alignments
        hit={
          iteration[queryIndex].Iteration_hits.Hit == undefined
            ? undefined
            : iteration[queryIndex].Iteration_hits.Hit[hitIndex]
            ? iteration[queryIndex].Iteration_hits.Hit[hitIndex]
            : iteration[queryIndex].Iteration_hits.Hit
        }
      />
    </Box>
  );
};

const SelectQuery = ({ queryIndex, handleQueryIndexChange, iteration }) => {
  const options = iteration.map((item, index) => ({
    id: index,
    value: index,
    label:
      item["Iteration_query-def"] == "No definition line"
        ? item["Iteration_query-ID"]
        : item["Iteration_query-ID"] + " " + item["Iteration_query-def"],
  }));
  return (
    <InputGroup>
      <InputLeftAddon children="Query : " />
      <Select
        onChange={handleQueryIndexChange}
        borderColor="gray.400"
        w="fit-content"
      >
        {options.map((option) => (
          <option value={option.value} key={option.id}>
            {option.label}
          </option>
        ))}
      </Select>
    </InputGroup>
  );
};

const GraphicSummary = ({ data }) => {
  return <>Graphic Summary</>;
};

const Descriptions = ({ hitIndex, setHitIndex, hits, queryLen }) => {
  const maxDescLen = 60;
  const options = [];
  for (let i = 0; i < hits.length; i++) {
    const item = hits[i];
    const hsps = Array.isArray(item["Hit_hsps"]["Hsp"])
      ? item["Hit_hsps"]["Hsp"]
      : [item["Hit_hsps"]["Hsp"]];
    const key = i;
    //    const description = item["Hit_def"];
    const description =
      item["Hit_def"].length > maxDescLen
        ? item["Hit_def"].slice(0, maxDescLen) + "..."
        : item["Hit_def"];
    const maxScore = hsps[0]["Hsp_score"];
    const totalScore = hsps.reduce((a, b) => a + b["Hsp_score"], 0);
    const queryFrom = parseInt(hsps[0]["Hsp_query-from"]);
    const queryTo = parseInt(hsps[0]["Hsp_query-to"]);
    const queryCover = Math.round(
      (100.0 * Math.abs(queryTo - queryFrom + 1)) / queryLen
    );
    const eValue = hsps[0]["Hsp_evalue"];
    const identity = Math.round(
      (100.0 * parseInt(hsps[0]["Hsp_identity"])) /
        parseInt(hsps[0]["Hsp_align-len"])
    );
    options.push({
      key,
      description,
      maxScore,
      totalScore,
      queryCover,
      eValue,
      identity,
    });
  }

  return (
    <>
      <Box
        margin="1"
        borderWidth="1px"
        borderColor="gray.200"
        borderRadius="lg"
        minW="fit-content"
      >
        <TableContainer>
          <Table variant="simple" size="sm">
            <TableCaption placement="top">Descriptions</TableCaption>
            <Thead>
              <Tr>
                <Th>Description</Th>
                <Th>
                  Max
                  <br />
                  Score
                </Th>
                <Th>
                  Total
                  <br />
                  Score
                </Th>
                <Th>
                  Query
                  <br />
                  Cover
                </Th>
                <Th>E value</Th>
                <Th>Identity</Th>
                {/* Add more headers as needed */}
              </Tr>
            </Thead>
            <Tbody>
              {options.map((item) => (
                <Tr key={item.key}>
                  <Td>
                    <a
                      className="link"
                      href="#alignments"
                      onClick={() => setHitIndex(item.key)}
                    >
                      {item.description}
                    </a>
                  </Td>
                  <Td>{item.maxScore}</Td>
                  <Td>{item.totalScore}</Td>
                  <Td>{item.queryCover}%</Td>
                  <Td>{item.eValue}</Td>
                  <Td>{item.identity}%</Td>
                  {/* Add more cells with corresponding data properties as needed */}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

const Alignments = ({ hit }) => {
  if (hit == undefined) return null;
  const hsps = Array.isArray(hit["Hit_hsps"]["Hsp"])
    ? hit["Hit_hsps"]["Hsp"]
    : [hit["Hit_hsps"]["Hsp"]];

  const nucPerLine = 60;
  return (
    <Box id="alignments" m="2">
      {hit == undefined ? (
        <Text>No alignments</Text>
      ) : (
        <Text mb="4">
          {hit["Hit_def"]} ({hit["Hit_len"]} bp)
        </Text>
      )}
      {hsps.map((hsp, index) => {
        const queryStart = parseInt(hsp["Hsp_query-from"]);
        const queryEnd = parseInt(hsp["Hsp_query-to"]);
        const hitStart = parseInt(hsp["Hsp_hit-from"]);
        const hitEnd = parseInt(hsp["Hsp_hit-to"]);
        const querySeq = hsp["Hsp_qseq"];
        const hitSeq = hsp["Hsp_hseq"];
        const midline = hsp["Hsp_midline"];
        const querySeqLines = [];
        const hitSeqLines = [];
        const midlineLines = [];
        for (let i = 0; i < querySeq.length; i += nucPerLine) {
          querySeqLines.push(querySeq.slice(i, i + nucPerLine));
          hitSeqLines.push(hitSeq.slice(i, i + nucPerLine));
          midlineLines.push(midline.slice(i, i + nucPerLine));
        }
        const maxpos = Math.max(queryEnd, hitEnd, queryStart, hitStart);
        const maxposLen = maxpos.toString().length;
        return (
          <Box mb="8">
            <Text>
              Range {index + 1} : {hsp["Hsp_hit-from"]}-{hsp["Hsp_hit-to"]}
            </Text>
            <Divider borderColor="gray" w="450px" />
            <Flex>
              <Text w="150px">Score</Text>
              <Text w="150px">Expect</Text>
              <Text w="150px">Identities</Text>
            </Flex>
            <Flex>
              <Text w="150px">{hsp["Hsp_score"]}</Text>
              <Text w="150px">{hsp["Hsp_evalue"]}</Text>
              <Text w="150px">
                {Math.round(
                  (100 * parseInt(hsp["Hsp_identity"])) /
                    parseInt(hsp["Hsp_align-len"])
                )}
                %
              </Text>
            </Flex>
            <Divider borderColor="gray" w="450px" />
            {querySeqLines.map((item, index) => (
              <>
                <Flex mb="-2">
                  <Text fontFamily="Consolas, monospace" w="60px" mr="4">
                    Query
                  </Text>
                  <Text
                    fontFamily="Consolas, monospace"
                    w={`${maxposLen * 10}px`}
                    mr="4"
                  >
                    {queryStart + index * nucPerLine}
                  </Text>
                  <Text fontFamily="Consolas, monospace" mr="4">
                    {item}
                  </Text>
                  <Text
                    fontFamily="Consolas, monospace"
                    w={`${maxposLen * 10}px`}
                    mr="4"
                  >
                    {Math.min(
                      queryStart + index * nucPerLine + nucPerLine - 1,
                      queryEnd
                    )}
                  </Text>
                </Flex>
                <Flex mb="-2">
                  <Text fontFamily="Consolas, monospace" w="60px" mr="4"></Text>
                  <Text
                    fontFamily="Consolas, monospace"
                    w={`${maxposLen * 10}px`}
                    mr="4"
                  ></Text>
                  <Text fontFamily="Consolas, monospace" mr="4">
                    {midlineLines[index]}
                  </Text>
                </Flex>
                <Flex mb="2">
                  <Text fontFamily="Consolas, monospace" w="60px" mr="4">
                    Sbjct
                  </Text>
                  <Text
                    fontFamily="Consolas, monospace"
                    w={`${maxposLen * 10}px`}
                    mr="4"
                  >
                    {hitStart + index * nucPerLine}
                  </Text>
                  <Text fontFamily="Consolas, monospace" mr="4">
                    {hitSeqLines[index]}
                  </Text>
                  <Text
                    fontFamily="Consolas, monospace"
                    w={`${maxposLen * 10}px`}
                    mr="4"
                  >
                    {Math.min(
                      hitStart + index * nucPerLine + nucPerLine - 1,
                      hitEnd
                    )}
                  </Text>
                </Flex>
              </>
            ))}
          </Box>
        );
      })}
    </Box>
  );
};

export {
  VisualizeBlastXml,
  SelectQuery,
  GraphicSummary,
  Descriptions,
  Alignments,
};
