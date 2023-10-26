import React, { useEffect } from "react";
import blasterjs from "biojs-vis-blasterjs";
//import html2canvas from "html2canvas";
import html2canvas from "./html2canvas.js";
//import blasterjs from "./blaster.js";
//import "./bootstrap.css";
import blastinput from "./blast.out.js";

const Test = () => {
  useEffect(() => {
    //    var alignments = "blast.out";
    var alignments = blastinput;
    const instance = new blasterjs({
      //      input: "blastinput",
      string: alignments,
      multipleAlignments: "blast-multiple-alignments",
      alignmentsTable: "blast-alignments-table",
      singleAlignment: "blast-single-alignment",
      html2canvas: html2canvas,
    });
  }, []);
  return (
    <div>
      <input type="file" id="blastinput" />
      <div id="blast-multiple-alignments"></div>
      <div id="blast-alignments-table"></div>
      <div id="blast-single-alignment"></div>
    </div>
  );
};

export default Test;
