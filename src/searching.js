import React, { useState,useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useRoute } from "@react-navigation/native";
import { Button } from "@chakra-ui/react";

const Searching = () => {
  const location = useLocation();
  console.log("location: ",location);
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
  };

  return (
    <div>
      <p>Searching...</p>
      <p>{JSON.stringify(location.state.params)}</p>
      <Button onClick={handleClick} colorScheme="blue">
        TOP
      </Button>
    </div>
  );
};
export default Searching;
