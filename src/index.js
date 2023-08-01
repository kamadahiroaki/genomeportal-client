import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { LoginForm } from "./login";
import { Header, Footer } from "./layout";
import { Mypage } from "./mypage";
import Jobresult from "./blast/jobresult";
import Blastn from "./blast/blastn";
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
          <Route exact path="/blast/jobresult" element={<Jobresult />} />
          <Route exact path="/blast/blastn" element={<Blastn />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
