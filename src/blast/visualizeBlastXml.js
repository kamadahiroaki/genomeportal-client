import { useState, useEffect } from "react";
import {
  Button,
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
import { use } from "passport";

const VisualizeBlastXml = ({ xmlData }) => {
  const parser = new XMLParser();
  //  if (XMLValidator.validate(xml)) {
  const jsonObj = parser.parse(xmlData);
  const iteration = Array.isArray(
    jsonObj.BlastOutput.BlastOutput_iterations.Iteration
  )
    ? jsonObj.BlastOutput.BlastOutput_iterations.Iteration
    : [jsonObj.BlastOutput.BlastOutput_iterations.Iteration];
  for (let i = 0; i < iteration.length; i++) {
    if (!iteration[i].Iteration_hits) {
      iteration[i].Iteration_hits = { Hit: [] };
    } else {
      if (!Array.isArray(iteration[i].Iteration_hits.Hit)) {
        iteration[i].Iteration_hits.Hit = [iteration[i].Iteration_hits.Hit];
      }
    }
    for (let j = 0; j < iteration[i].Iteration_hits.Hit.length; j++) {
      if (!iteration[i].Iteration_hits.Hit[j].Hit_hsps) {
        iteration[i].Iteration_hits.Hit[j].Hit_hsps = { Hsp: [] };
      } else {
        if (!Array.isArray(iteration[i].Iteration_hits.Hit[j].Hit_hsps.Hsp)) {
          iteration[i].Iteration_hits.Hit[j].Hit_hsps.Hsp = [
            iteration[i].Iteration_hits.Hit[j].Hit_hsps.Hsp,
          ];
        }
      }
    }
  }

  const [queryIndex, setQueryIndex] = useState(0);
  const [hitIndex, setHitIndex] = useState(-1);
  const [hitsPerPage, setHitsPerPage] = useState(100);
  const [hitStart, setHitStart] = useState(0);
  const [hspsPerPage, setHspsPerPage] = useState(100);
  const [hspStart, setHspStart] = useState(0);

  const handleHitIndexChange = (x) => {
    setHitIndex(x);
    setHspStart(0);
  };
  const handleQueryIndexChange = (e) => {
    setQueryIndex(e.target.value);
    setHitIndex(-1);
    setHitStart(0);
    setHspStart(0);
  };

  const handleHitStartChange = (x) => {
    setHitStart(x);
    setHitIndex(-1);
  };
  const handleHspStartChange = (x) => {
    setHspStart(x);
  };

  return (
    <Box m="2">
      <SelectQuery
        queryIndex={queryIndex}
        handleQueryIndexChange={handleQueryIndexChange}
        iteration={iteration}
      />
      <GraphicSummary data={jsonObj} />
      <Descriptions
        hitIndex={hitIndex}
        handleHitIndexChange={handleHitIndexChange}
        hits={iteration[queryIndex].Iteration_hits.Hit}
        queryLen={iteration[queryIndex]["Iteration_query-len"]}
        hitsPerPage={hitsPerPage}
        setHitsPerPage={setHitsPerPage}
        hitStart={hitStart}
        // setHitStart={setHitStart}
        handleHitStartChange={handleHitStartChange}
      />
      {iteration[queryIndex].Iteration_hits.Hit.length > 0 ? (
        <Alignments
          hit={iteration[queryIndex].Iteration_hits.Hit[hitIndex]}
          hspsPerPage={hspsPerPage}
          setHspsPerPage={setHspsPerPage}
          hspStart={hspStart}
          // setHspStart={setHspStart}
          handleHspStartChange={handleHspStartChange}
        />
      ) : null}
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

const SelectItemsPerPage = ({ itemsPerPage, setItemsPerPage }) => {
  const options = [10, 50, 100, 500, 1000];
  return (
    <Select
      value={itemsPerPage}
      onChange={(e) => setItemsPerPage(parseInt(e.target.value, 10))}
      borderColor="gray.400"
      w="fit-content"
      m="2"
    >
      {options.map((option, index) => (
        <option value={option} key={index}>
          {option}
        </option>
      ))}
    </Select>
  );
};

const MovePage = ({
  start,
  handleStartChange,
  itemsPerPage,
  length,
  typeOfItems,
}) => {
  return (
    <Flex m="2">
      <Text mr="4">
        {start + 1} - {Math.min(start + itemsPerPage, length)} of {length}{" "}
        {typeOfItems}
      </Text>
      <Button
        onClick={() => {
          if (start > 0) handleStartChange(0);
        }}
        disabled={start == 0}
      >
        {"<<"}
      </Button>
      <Button
        onClick={() => {
          if (start - itemsPerPage >= 0)
            handleStartChange(start - itemsPerPage);
        }}
        disabled={start == 0}
      >
        {"<"}
      </Button>
      <Button
        onClick={() => {
          if (start + itemsPerPage < length)
            handleStartChange(start + itemsPerPage);
        }}
        disabled={start + itemsPerPage >= length}
      >
        {">"}
      </Button>
      <Button
        onClick={() => {
          if (start + itemsPerPage < length)
            handleStartChange(length - 1 - ((length - 1) % itemsPerPage));
        }}
        disabled={start + itemsPerPage >= length}
      >
        {">>"}
      </Button>
    </Flex>
  );
};

const Descriptions = ({
  hitIndex,
  handleHitIndexChange,
  hits,
  queryLen,
  hitsPerPage,
  setHitsPerPage,
  hitStart,
  //  setHitStart,
  handleHitStartChange,
}) => {
  if (!hits || hits.length == 0) {
    return <Text>No Hits Found</Text>;
  }

  const maxDescLen = 80;
  const options = [];
  options.length = 0;
  for (
    let i = hitStart;
    i < Math.min(hitStart + hitsPerPage, hits.length);
    i++
  ) {
    const item = hits[i];
    const hsps = hits[i].Hit_hsps.Hsp;
    const key = i;
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
    <Box>
      <Flex>
        <SelectItemsPerPage
          itemsPerPage={hitsPerPage}
          setItemsPerPage={setHitsPerPage}
        />
        <Divider orientation="vertical" />
        <MovePage
          start={hitStart}
          // setStart={setHitStart}
          handleStartChange={handleHitStartChange}
          itemsPerPage={hitsPerPage}
          length={hits.length}
          typeOfItems="Hits"
        />
      </Flex>
      <Box>
        <TableContainer
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="lg"
        >
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
                      onClick={() => handleHitIndexChange(item.key)}
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
    </Box>
  );
};

const Alignments = ({
  hit,
  hspsPerPage,
  setHspsPerPage,
  hspStart,
  // setHspStart,
  handleHspStartChange,
}) => {
  const nucPerLine = 60;
  return (
    <Box id="alignments">
      {/* {!hit || hit.length == 0 ? ( */}
      {/* <Text>No alignments</Text> */}
      {!hit ? (
        <Text>To see the alignment, please click one of the above hits</Text>
      ) : (
        <Box>
          <Flex>
            <SelectItemsPerPage
              itemsPerPage={hspsPerPage}
              setItemsPerPage={setHspsPerPage}
            />
            <Divider orientation="vertical" />
            <MovePage
              start={hspStart}
              // setStart={setHspStart}
              handleStartChange={handleHspStartChange}
              itemsPerPage={hspsPerPage}
              length={hit.Hit_hsps.Hsp.length}
              typeOfItems="Hsps"
            />
          </Flex>

          <Text mb="4">
            {hit["Hit_def"]} ({hit["Hit_len"]} bp)
          </Text>
        </Box>
      )}
      {hit &&
        hit.Hit_hsps.Hsp.slice(hspStart, hspStart + hspsPerPage).map(
          (hsp, index) => {
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
                  Range {index + 1 + hspStart} : {hsp["Hsp_hit-from"]}-
                  {hsp["Hsp_hit-to"]}
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
                      <Text
                        fontFamily="Consolas, monospace"
                        w="60px"
                        mr="4"
                      ></Text>
                      <Text
                        fontFamily="Consolas, monospace"
                        w={`${maxposLen * 10}px`}
                        mr="4"
                      ></Text>
                      <Text fontFamily="Consolas, monospace" mr="4">
                        <pre>{midlineLines[index]}</pre>
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
          }
        )}
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
