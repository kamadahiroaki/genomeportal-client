import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Searching from "./searching"
import Result from "./result";
import reportWebVitals from "./reportWebVitals";
import theme from "./theme/theme";
import { ChakraProvider } from "@chakra-ui/react";
import {BrowserRouter,Routes,Route} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<App />} />
        <Route exact path="/App" element={<App />} />
        <Route exact path="/searching" element={<Searching />} />
        <Route exact path="/result" element={<Result />} />
      </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
