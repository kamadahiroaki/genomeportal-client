import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { LoginForm } from "./login";
import { Header, Footer } from "./layout";
import { Mypage } from "./mypage";
import { MasterPage } from "./masterPage";
import Jobresult from "./blast/jobresult";
import Blastn from "./blast/blastn";
import Blastp from "./blast/blastp";
import Blastx from "./blast/blastx";
import Tblastn from "./blast/tblastn";
import Tblastx from "./blast/tblastx";
import reportWebVitals from "./reportWebVitals";
import theme from "./theme/theme";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <header>
          <Header />
        </header>
        <Routes>
          <Route exact path="/" element={<App />} />
          <Route exact path="/App" element={<App />} />
          <Route exact path="/login" element={<LoginForm />} />
          <Route exact path="/mypage" element={<Mypage />} />
          <Route exact path="/masterPage" element={<MasterPage />} />
          <Route exact path="/blast/jobresult" element={<Jobresult />} />
          <Route exact path="/blast/blastn" element={<Blastn />} />
          <Route exact path="/blast/blastp" element={<Blastp />} />
          <Route exact path="/blast/blastx" element={<Blastx />} />
          <Route exact path="/blast/tblastn" element={<Tblastn />} />
          <Route exact path="/blast/tblastx" element={<Tblastx />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
