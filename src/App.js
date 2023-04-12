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

const Blast = ({ handleClick }) => {
  return (
    <>
      <div>
        <label>
          <Button onClick={handleClick} colorScheme="blue" size="lg">
            BLAST
          </Button>
        </label>
      </div>
    </>
  );
};

function App() {
  const navigate = useNavigate();

  return (
    <>
      <Blast handleClick={() => navigate("/blast/blastn")} />
    </>
  );
}

export { App, serverUrl };
